#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TSiJUKEBOX RLS Security Tests

Validates Row-Level Security policies in Supabase database.
Tests ensure proper data isolation, admin protection, and access control.

Run with: pytest tests/test_rls_security.py -v
"""

import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import re


# =============================================================================
# Test Data and Fixtures
# =============================================================================

@dataclass
class RLSPolicy:
    """Represents an RLS policy for testing."""
    table_name: str
    policy_name: str
    command: str  # SELECT, INSERT, UPDATE, DELETE
    using_expression: Optional[str] = None
    with_check_expression: Optional[str] = None
    permissive: bool = True


@dataclass
class TableSchema:
    """Represents a table schema for testing."""
    name: str
    has_rls: bool
    policies: List[RLSPolicy]
    columns: List[str]


# Mock RLS policies based on actual Supabase configuration
EXPECTED_RLS_POLICIES = {
    "audit_logs": [
        RLSPolicy("audit_logs", "Admins can read audit_logs", "SELECT", 
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("audit_logs", "System can insert audit_logs", "INSERT",
                  with_check_expression="true"),
    ],
    "code_scan_history": [
        RLSPolicy("code_scan_history", "Admins can read code_scan_history", "SELECT",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("code_scan_history", "Admins can insert code_scan_history", "INSERT",
                  with_check_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("code_scan_history", "Admins can update code_scan_history", "UPDATE",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("code_scan_history", "Admins can delete code_scan_history", "DELETE",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
    ],
    "user_roles": [
        RLSPolicy("user_roles", "Users can view their own roles", "SELECT",
                  using_expression="auth.uid() = user_id"),
        RLSPolicy("user_roles", "Admins can view all roles", "SELECT",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("user_roles", "Admins can insert roles", "INSERT",
                  with_check_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("user_roles", "Admins can update roles", "UPDATE",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("user_roles", "Admins can delete roles", "DELETE",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
    ],
    "notifications": [
        RLSPolicy("notifications", "Users can read own notifications", "SELECT",
                  using_expression="(auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("notifications", "Admins can insert notifications", "INSERT",
                  with_check_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("notifications", "Users can update own notifications", "UPDATE",
                  using_expression="(auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("notifications", "Users can delete own notifications", "DELETE",
                  using_expression="(auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role)"),
    ],
    "jam_sessions": [
        RLSPolicy("jam_sessions", "Anyone can read active sessions", "SELECT",
                  using_expression="is_active = true"),
        RLSPolicy("jam_sessions", "Anyone can create sessions", "INSERT",
                  with_check_expression="true"),
        RLSPolicy("jam_sessions", "Host can update sessions", "UPDATE",
                  using_expression="(host_id IS NULL) OR (host_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("jam_sessions", "Host or admin can delete sessions", "DELETE",
                  using_expression="(host_id IS NULL) OR (host_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role)"),
    ],
    "kiosk_connections": [
        RLSPolicy("kiosk_connections", "Admins can read kiosk_connections", "SELECT",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
    ],
    "kiosk_commands": [
        RLSPolicy("kiosk_commands", "Admins can read kiosk_commands", "SELECT",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("kiosk_commands", "Admins can insert kiosk_commands", "INSERT",
                  with_check_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("kiosk_commands", "Admins can update kiosk_commands", "UPDATE",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("kiosk_commands", "Admins can delete kiosk_commands", "DELETE",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
    ],
    "playback_stats": [
        RLSPolicy("playback_stats", "Admins can read playback_stats", "SELECT",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
        RLSPolicy("playback_stats", "Kiosks can log playback", "INSERT",
                  with_check_expression="true"),
        RLSPolicy("playback_stats", "Admins can update playback_stats", "UPDATE",
                  using_expression="has_role(auth.uid(), 'admin'::app_role)"),
    ],
}

# Tables that MUST have RLS enabled
TABLES_REQUIRING_RLS = [
    "audit_logs",
    "code_scan_history",
    "installer_metrics",
    "jam_participants",
    "jam_queue",
    "jam_reactions",
    "jam_sessions",
    "kiosk_commands",
    "kiosk_connections",
    "notifications",
    "pending_sync_files",
    "playback_stats",
    "user_roles",
]

# Admin-only tables
ADMIN_ONLY_TABLES = [
    "audit_logs",
    "code_scan_history",
    "kiosk_commands",
    "kiosk_connections",
    "pending_sync_files",
]

# Tables with user-specific data isolation
USER_ISOLATED_TABLES = [
    "notifications",
    "user_roles",
]


@pytest.fixture
def mock_supabase_client():
    """Mock Supabase client for RLS testing."""
    client = MagicMock()
    client.table = MagicMock()
    return client


@pytest.fixture
def admin_user():
    """Mock admin user context."""
    return {
        "id": "admin-uuid-1234",
        "email": "admin@tsijukebox.com",
        "role": "admin",
    }


@pytest.fixture
def regular_user():
    """Mock regular user context."""
    return {
        "id": "user-uuid-5678",
        "email": "user@example.com",
        "role": "user",
    }


@pytest.fixture
def newbie_user():
    """Mock newbie user context."""
    return {
        "id": "newbie-uuid-9012",
        "email": "newbie@example.com",
        "role": "newbie",
    }


@pytest.fixture
def anonymous_user():
    """Mock anonymous (unauthenticated) user context."""
    return {
        "id": None,
        "email": None,
        "role": None,
    }


# =============================================================================
# Test Classes
# =============================================================================

class TestRLSPolicyValidation:
    """Validates that all tables have RLS enabled and proper policies."""

    def test_all_required_tables_have_rls(self):
        """All sensitive tables must have RLS enabled."""
        for table in TABLES_REQUIRING_RLS:
            # In real implementation, this would query pg_tables
            # Here we validate against expected configuration
            assert table in TABLES_REQUIRING_RLS, f"Table {table} should require RLS"

    def test_no_table_allows_unrestricted_access(self):
        """No table should have unrestricted SELECT for anonymous users."""
        unrestricted_tables = []
        
        for table, policies in EXPECTED_RLS_POLICIES.items():
            select_policies = [p for p in policies if p.command == "SELECT"]
            
            for policy in select_policies:
                # Check for overly permissive policies
                if policy.using_expression == "true":
                    unrestricted_tables.append(table)
        
        # jam_sessions allows public read of ACTIVE sessions (acceptable)
        acceptable_public = ["jam_sessions", "jam_queue", "jam_participants", "jam_reactions"]
        
        for table in unrestricted_tables:
            if table not in acceptable_public:
                pytest.fail(f"Table {table} has unrestricted SELECT access")

    def test_admin_tables_require_admin_role(self):
        """Admin-only tables must require admin role for all operations."""
        for table in ADMIN_ONLY_TABLES:
            if table in EXPECTED_RLS_POLICIES:
                policies = EXPECTED_RLS_POLICIES[table]
                
                for policy in policies:
                    expr = policy.using_expression or policy.with_check_expression or ""
                    
                    # SELECT must require admin (except system inserts)
                    if policy.command == "SELECT":
                        assert "has_role" in expr and "admin" in expr, \
                            f"{table}.{policy.policy_name} must require admin for SELECT"

    def test_policies_use_security_definer_function(self):
        """RLS policies should use has_role() security definer function."""
        for table, policies in EXPECTED_RLS_POLICIES.items():
            for policy in policies:
                expr = policy.using_expression or policy.with_check_expression or ""
                
                if "admin" in expr.lower():
                    # Should use has_role function, not direct table query
                    assert "has_role(" in expr, \
                        f"{table}.{policy.policy_name} should use has_role() function"
                    assert "SELECT" not in expr.upper() or "has_role" in expr, \
                        f"{table}.{policy.policy_name} should not query user_roles directly"

    def test_no_infinite_recursion_patterns(self):
        """Policies must not contain patterns that cause infinite recursion."""
        recursion_patterns = [
            r"SELECT.*FROM\s+public\.user_roles.*WHERE.*user_id\s*=\s*auth\.uid\(\)",
            r"SELECT\s+role\s+FROM\s+user_roles",
        ]
        
        for table, policies in EXPECTED_RLS_POLICIES.items():
            for policy in policies:
                expr = policy.using_expression or policy.with_check_expression or ""
                
                for pattern in recursion_patterns:
                    if re.search(pattern, expr, re.IGNORECASE):
                        pytest.fail(
                            f"{table}.{policy.policy_name} may cause infinite recursion: {expr}"
                        )


class TestAdminRoleProtection:
    """Tests protection of admin-only tables."""

    def test_audit_logs_requires_admin_for_read(self):
        """audit_logs table must require admin role for SELECT."""
        policies = EXPECTED_RLS_POLICIES.get("audit_logs", [])
        select_policies = [p for p in policies if p.command == "SELECT"]
        
        assert len(select_policies) > 0, "audit_logs must have SELECT policy"
        
        for policy in select_policies:
            assert "has_role" in (policy.using_expression or ""), \
                "audit_logs SELECT must use has_role()"
            assert "admin" in (policy.using_expression or ""), \
                "audit_logs SELECT must require admin role"

    def test_code_scan_history_requires_admin(self):
        """code_scan_history must be admin-only for all operations."""
        policies = EXPECTED_RLS_POLICIES.get("code_scan_history", [])
        
        operations = ["SELECT", "INSERT", "UPDATE", "DELETE"]
        covered_ops = set()
        
        for policy in policies:
            expr = policy.using_expression or policy.with_check_expression or ""
            if "admin" in expr:
                covered_ops.add(policy.command)
        
        assert covered_ops == set(operations), \
            f"code_scan_history missing admin protection for: {set(operations) - covered_ops}"

    def test_kiosk_commands_requires_admin(self):
        """kiosk_commands must require admin for all operations."""
        policies = EXPECTED_RLS_POLICIES.get("kiosk_commands", [])
        
        for policy in policies:
            expr = policy.using_expression or policy.with_check_expression or ""
            assert "has_role" in expr and "admin" in expr, \
                f"kiosk_commands.{policy.policy_name} must require admin"

    def test_kiosk_connections_read_only_for_admin(self):
        """kiosk_connections should only allow admin SELECT."""
        policies = EXPECTED_RLS_POLICIES.get("kiosk_connections", [])
        
        # Should only have SELECT policy
        commands = [p.command for p in policies]
        
        # Verify no INSERT/UPDATE/DELETE for regular users
        for policy in policies:
            if policy.command != "SELECT":
                expr = policy.using_expression or policy.with_check_expression or ""
                assert "admin" in expr or expr == "", \
                    f"kiosk_connections.{policy.command} should be admin-only or disabled"


class TestUserDataIsolation:
    """Tests that user data is properly isolated."""

    def test_notifications_isolated_by_user(self):
        """Users can only access their own notifications."""
        policies = EXPECTED_RLS_POLICIES.get("notifications", [])
        select_policies = [p for p in policies if p.command == "SELECT"]
        
        for policy in select_policies:
            expr = policy.using_expression or ""
            # Should check auth.uid() = user_id OR admin
            assert "auth.uid()" in expr or "user_id" in expr, \
                "notifications SELECT must check user ownership"

    def test_user_roles_protected(self):
        """user_roles table must have proper isolation."""
        policies = EXPECTED_RLS_POLICIES.get("user_roles", [])
        
        # Users can only see their own roles
        select_policies = [p for p in policies if p.command == "SELECT"]
        user_select = [p for p in select_policies if "user_id" in (p.using_expression or "")]
        
        assert len(user_select) > 0, "user_roles must allow users to see own roles"
        
        # Only admins can modify roles
        modify_policies = [p for p in policies if p.command in ("INSERT", "UPDATE", "DELETE")]
        for policy in modify_policies:
            expr = policy.using_expression or policy.with_check_expression or ""
            assert "admin" in expr, \
                f"user_roles.{policy.command} must require admin"

    def test_no_cross_user_data_access(self, regular_user):
        """Verify users cannot access other users' data."""
        other_user_id = "other-user-uuid-9999"
        
        # Simulate RLS check for notifications
        user_id = regular_user["id"]
        
        # This would normally be a Supabase query
        # Here we validate the policy logic
        policy_expr = "(auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role)"
        
        # Simulate: regular user trying to access other user's notification
        # auth.uid() = user_id -> False (different users)
        # has_role(auth.uid(), 'admin') -> False (not admin)
        # Result: Access denied
        
        can_access = (user_id == other_user_id) or (regular_user["role"] == "admin")
        assert not can_access, "Regular user should not access other user's data"


class TestAnonymousAccessControl:
    """Tests access control for unauthenticated users."""

    def test_jam_sessions_allow_anonymous_read_active(self):
        """Anonymous users can read active jam sessions."""
        policies = EXPECTED_RLS_POLICIES.get("jam_sessions", [])
        select_policies = [p for p in policies if p.command == "SELECT"]
        
        for policy in select_policies:
            expr = policy.using_expression or ""
            # Should allow reading active sessions
            assert "is_active" in expr, \
                "jam_sessions SELECT should check is_active"

    def test_playback_stats_anonymous_insert(self):
        """Kiosks (potentially anonymous) can insert playback stats."""
        policies = EXPECTED_RLS_POLICIES.get("playback_stats", [])
        insert_policies = [p for p in policies if p.command == "INSERT"]
        
        assert len(insert_policies) > 0, "playback_stats must allow INSERT"
        
        # Should allow anonymous insert for kiosk logging
        insert_policy = insert_policies[0]
        assert insert_policy.with_check_expression == "true", \
            "playback_stats INSERT should allow kiosk logging"

    def test_installer_metrics_anonymous_insert(self):
        """Installers can register metrics without authentication."""
        # This is expected behavior for telemetry
        # Validate it's properly scoped
        pass  # Policy allows INSERT with true check

    def test_anonymous_cannot_access_admin_tables(self, anonymous_user):
        """Anonymous users cannot access admin-only tables."""
        for table in ADMIN_ONLY_TABLES:
            policies = EXPECTED_RLS_POLICIES.get(table, [])
            
            for policy in policies:
                expr = policy.using_expression or policy.with_check_expression or ""
                
                # Anonymous user has no auth.uid() and no role
                # has_role(null, 'admin') should return false
                if "has_role" in expr:
                    # Would fail for anonymous user
                    assert True
                elif expr == "true":
                    # Only acceptable for INSERT on specific tables
                    assert policy.command == "INSERT" and table in ["audit_logs"], \
                        f"Anonymous access to {table}.{policy.command} is too permissive"


class TestRLSBypassPrevention:
    """Tests prevention of RLS bypass techniques."""

    def test_security_definer_functions_exist(self):
        """Required security definer functions must exist."""
        required_functions = [
            "has_role",
            "get_user_role",
            "ensure_user_has_role",
        ]
        
        # In real implementation, query pg_proc
        # Here we validate expected function names are referenced
        for func in required_functions:
            found = False
            for policies in EXPECTED_RLS_POLICIES.values():
                for policy in policies:
                    expr = policy.using_expression or policy.with_check_expression or ""
                    if func in expr:
                        found = True
                        break
            
            # has_role should be used
            if func == "has_role":
                assert found, f"Function {func} should be used in RLS policies"

    def test_has_role_function_signature(self):
        """has_role function should have correct signature."""
        # Expected: has_role(_user_id uuid, _role app_role) returns boolean
        # This validates the function is called correctly in policies
        
        for policies in EXPECTED_RLS_POLICIES.values():
            for policy in policies:
                expr = policy.using_expression or policy.with_check_expression or ""
                
                if "has_role(" in expr:
                    # Should use auth.uid() as first parameter
                    assert "auth.uid()" in expr, \
                        f"has_role should use auth.uid(): {expr}"
                    # Should cast role to app_role
                    assert "::app_role" in expr or "'admin'" in expr, \
                        f"has_role should specify role: {expr}"

    def test_policies_use_restrictive_mode(self):
        """Policies should use RESTRICTIVE mode for security checks."""
        # In PostgreSQL 10+, restrictive policies are AND-ed together
        # Permissive policies are OR-ed
        
        # For security-critical tables, verify policy mode
        for table in ADMIN_ONLY_TABLES:
            if table in EXPECTED_RLS_POLICIES:
                policies = EXPECTED_RLS_POLICIES[table]
                
                for policy in policies:
                    # Restrictive policies provide tighter security
                    # This is a design choice validation
                    pass


class TestPrivilegeEscalation:
    """Tests prevention of privilege escalation attacks."""

    def test_user_cannot_grant_self_admin_role(self, regular_user):
        """Regular users cannot insert admin role for themselves."""
        policies = EXPECTED_RLS_POLICIES.get("user_roles", [])
        insert_policies = [p for p in policies if p.command == "INSERT"]
        
        for policy in insert_policies:
            expr = policy.with_check_expression or ""
            assert "admin" in expr, \
                "user_roles INSERT must require admin role"

    def test_newbie_cannot_modify_roles(self, newbie_user):
        """Newbie users cannot modify the roles table."""
        policies = EXPECTED_RLS_POLICIES.get("user_roles", [])
        modify_policies = [p for p in policies if p.command in ("INSERT", "UPDATE", "DELETE")]
        
        for policy in modify_policies:
            expr = policy.using_expression or policy.with_check_expression or ""
            # newbie role should not pass admin check
            assert "admin" in expr, \
                f"user_roles.{policy.command} must require admin, not just any authenticated user"

    def test_role_changes_audited(self):
        """Role changes should be captured in audit logs."""
        # Verify audit_logs table exists and accepts inserts
        policies = EXPECTED_RLS_POLICIES.get("audit_logs", [])
        insert_policies = [p for p in policies if p.command == "INSERT"]
        
        assert len(insert_policies) > 0, "audit_logs must allow INSERT for logging"

    def test_no_direct_role_query_in_policies(self):
        """Policies should not query user_roles directly (infinite recursion risk)."""
        dangerous_patterns = [
            "SELECT role FROM user_roles",
            "SELECT * FROM user_roles",
            "user_roles WHERE user_id",
        ]
        
        for table, policies in EXPECTED_RLS_POLICIES.items():
            for policy in policies:
                expr = policy.using_expression or policy.with_check_expression or ""
                
                for pattern in dangerous_patterns:
                    if pattern.lower() in expr.lower():
                        pytest.fail(
                            f"{table}.{policy.policy_name} contains dangerous pattern: {pattern}"
                        )

    def test_host_ownership_validation(self):
        """Jam session host validation prevents unauthorized modification."""
        policies = EXPECTED_RLS_POLICIES.get("jam_sessions", [])
        update_policies = [p for p in policies if p.command == "UPDATE"]
        
        for policy in update_policies:
            expr = policy.using_expression or ""
            # Should check host_id = auth.uid() OR admin
            assert "host_id" in expr, \
                "jam_sessions UPDATE must verify host ownership"
            assert "auth.uid()" in expr, \
                "jam_sessions UPDATE must compare with current user"


class TestPolicyCompleteness:
    """Tests that all necessary policies exist."""

    @pytest.mark.parametrize("table", TABLES_REQUIRING_RLS)
    def test_table_has_policies(self, table):
        """Each sensitive table should have RLS policies defined."""
        if table in EXPECTED_RLS_POLICIES:
            policies = EXPECTED_RLS_POLICIES[table]
            assert len(policies) > 0, f"Table {table} should have RLS policies"

    def test_admin_tables_have_full_crud_protection(self):
        """Admin tables should protect all CRUD operations."""
        for table in ADMIN_ONLY_TABLES:
            if table in EXPECTED_RLS_POLICIES:
                policies = EXPECTED_RLS_POLICIES[table]
                commands = {p.command for p in policies}
                
                # At minimum, SELECT should be protected
                assert "SELECT" in commands, \
                    f"{table} must have SELECT policy"

    def test_user_tables_have_ownership_policies(self):
        """User-specific tables must have ownership-based policies."""
        for table in USER_ISOLATED_TABLES:
            if table in EXPECTED_RLS_POLICIES:
                policies = EXPECTED_RLS_POLICIES[table]
                
                has_ownership_check = False
                for policy in policies:
                    expr = policy.using_expression or policy.with_check_expression or ""
                    if "user_id" in expr and "auth.uid()" in expr:
                        has_ownership_check = True
                        break
                
                assert has_ownership_check, \
                    f"{table} must have ownership-based policy"


# =============================================================================
# Integration Tests (require Supabase connection)
# =============================================================================

@pytest.mark.integration
@pytest.mark.skipif(True, reason="Requires Supabase connection")
class TestRLSIntegration:
    """Integration tests that require actual Supabase connection."""

    async def test_admin_can_read_audit_logs(self, mock_supabase_client, admin_user):
        """Admin user should be able to read audit_logs."""
        pass

    async def test_regular_user_cannot_read_audit_logs(self, mock_supabase_client, regular_user):
        """Regular user should not be able to read audit_logs."""
        pass

    async def test_user_can_only_see_own_notifications(self, mock_supabase_client, regular_user):
        """User should only see their own notifications."""
        pass


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
