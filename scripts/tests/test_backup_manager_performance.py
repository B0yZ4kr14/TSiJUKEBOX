#!/usr/bin/env python3
"""
TSiJUKEBOX Installer - BackupManager Performance Tests
=======================================================
Performance benchmarks for backup/restore operations.

Run performance tests:
    pytest tests/test_backup_manager_performance.py -v --benchmark-only
    
Run with detailed report:
    pytest tests/test_backup_manager_performance.py --benchmark-autosave --benchmark-json=benchmark.json

Skip slow tests (1GB+):
    pytest tests/ -m "benchmark and not slow"

Markers:
    @pytest.mark.benchmark - Performance benchmark tests
    @pytest.mark.slow - Tests with 1GB+ data (skipped by default)
    @pytest.mark.docker - Tests requiring Docker daemon
"""

import os
import subprocess
from pathlib import Path
from typing import Generator
from unittest.mock import patch, MagicMock

import pytest

# Import BackupManager from conftest or create mock for standalone testing
try:
    from conftest import BackupManager
except ImportError:
    # Fallback: create a minimal mock for documentation/linting purposes
    BackupManager = MagicMock


# ============================================
# Configuration Constants
# ============================================

SIZES = {
    "small": 10 * 1024 * 1024,      # 10 MB
    "medium": 100 * 1024 * 1024,    # 100 MB
    "large": 1024 * 1024 * 1024,    # 1 GB
}

CHUNK_SIZE = 1024 * 1024  # 1 MB chunks for file creation


# ============================================
# Helper Functions
# ============================================

def create_test_file(path: Path, size_bytes: int) -> Path:
    """
    Create a test file with specified size using random data.
    
    Args:
        path: Target file path
        size_bytes: Size of the file in bytes
        
    Returns:
        Path to created file
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(path, 'wb') as f:
        remaining = size_bytes
        while remaining > 0:
            to_write = min(CHUNK_SIZE, remaining)
            f.write(os.urandom(to_write))
            remaining -= to_write
    
    return path


def get_file_size_mb(size_bytes: int) -> str:
    """Convert bytes to human-readable MB/GB string."""
    if size_bytes >= 1024 * 1024 * 1024:
        return f"{size_bytes / (1024 * 1024 * 1024):.1f}GB"
    return f"{size_bytes / (1024 * 1024):.0f}MB"


# ============================================
# Fixtures
# ============================================

@pytest.fixture
def benchmark_manager(temp_dir: Path) -> Generator[BackupManager, None, None]:
    """Create a BackupManager configured for benchmarking."""
    manager = BackupManager()
    manager.backup_dir = temp_dir / "backups"
    manager.compose_dir = temp_dir / "docker"
    manager.data_dir = temp_dir / "data"
    
    # Create directories
    manager.backup_dir.mkdir(parents=True)
    manager.compose_dir.mkdir(parents=True)
    manager.data_dir.mkdir(parents=True)
    
    yield manager


@pytest.fixture
def docker_available() -> bool:
    """Check if Docker is available."""
    try:
        result = subprocess.run(
            ["docker", "info"],
            capture_output=True,
            timeout=10,
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False


# ============================================
# Config Backup Performance Tests
# ============================================

@pytest.mark.benchmark
class TestBackupPerformanceConfigs:
    """Benchmark tests for config file backup operations."""

    def test_backup_small_configs_10mb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark backup of small config files (10MB total)."""
        # Setup: create multiple small config files totaling 10MB
        create_test_file(
            benchmark_manager.compose_dir / "docker-compose.yml",
            2 * 1024 * 1024  # 2 MB
        )
        create_test_file(
            benchmark_manager.compose_dir / "config.json",
            3 * 1024 * 1024  # 3 MB
        )
        create_test_file(
            benchmark_manager.compose_dir / "data.db",
            5 * 1024 * 1024  # 5 MB
        )
        
        with patch.object(benchmark_manager, "_get_docker_volumes", return_value=[]):
            result = benchmark(
                benchmark_manager.create_backup,
                include_volumes=False
            )
        
        assert result is not None
        assert result.exists()

    def test_backup_medium_configs_100mb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark backup of medium config files (100MB total)."""
        # Setup: create 10 files of 10MB each
        for i in range(10):
            create_test_file(
                benchmark_manager.compose_dir / f"config_{i:02d}.dat",
                10 * 1024 * 1024  # 10 MB each
            )
        
        with patch.object(benchmark_manager, "_get_docker_volumes", return_value=[]):
            result = benchmark.pedantic(
                benchmark_manager.create_backup,
                kwargs={"include_volumes": False},
                rounds=3,
                iterations=1,
                warmup_rounds=0
            )
        
        assert result is not None
        assert result.exists()

    @pytest.mark.slow
    def test_backup_large_configs_1gb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """
        Benchmark backup of large config files (1GB total).
        
        WARNING: This test creates 1GB of test data and may take several minutes.
        Only runs when explicitly requested with: pytest -m "slow"
        """
        # Setup: create 1GB file
        create_test_file(
            benchmark_manager.compose_dir / "large_database.dat",
            SIZES["large"]
        )
        
        with patch.object(benchmark_manager, "_get_docker_volumes", return_value=[]):
            result = benchmark.pedantic(
                benchmark_manager.create_backup,
                kwargs={"include_volumes": False},
                rounds=1,
                iterations=1,
                warmup_rounds=0
            )
        
        assert result is not None
        assert result.exists()


# ============================================
# Config Restore Performance Tests
# ============================================

@pytest.mark.benchmark
class TestRestorePerformanceConfigs:
    """Benchmark tests for config file restore operations."""

    def test_restore_small_configs_10mb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark restore of small config backup (10MB)."""
        # Setup: create and backup files
        create_test_file(
            benchmark_manager.compose_dir / "docker-compose.yml",
            5 * 1024 * 1024
        )
        create_test_file(
            benchmark_manager.compose_dir / "config.json",
            5 * 1024 * 1024
        )
        
        with patch.object(benchmark_manager, "_get_docker_volumes", return_value=[]):
            backup_path = benchmark_manager.create_backup(include_volumes=False)
        
        # Benchmark restore
        result = benchmark(benchmark_manager.restore_backup, backup_path)
        assert result is True

    def test_restore_medium_configs_100mb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark restore of medium config backup (100MB)."""
        # Setup: create and backup files
        for i in range(10):
            create_test_file(
                benchmark_manager.compose_dir / f"config_{i:02d}.dat",
                10 * 1024 * 1024
            )
        
        with patch.object(benchmark_manager, "_get_docker_volumes", return_value=[]):
            backup_path = benchmark_manager.create_backup(include_volumes=False)
        
        # Benchmark restore
        result = benchmark.pedantic(
            benchmark_manager.restore_backup,
            args=(backup_path,),
            rounds=3,
            iterations=1,
            warmup_rounds=0
        )
        assert result is True

    @pytest.mark.slow
    def test_restore_large_configs_1gb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark restore of large config backup (1GB)."""
        # Setup: create and backup 1GB file
        create_test_file(
            benchmark_manager.compose_dir / "large_database.dat",
            SIZES["large"]
        )
        
        with patch.object(benchmark_manager, "_get_docker_volumes", return_value=[]):
            backup_path = benchmark_manager.create_backup(include_volumes=False)
        
        # Benchmark restore
        result = benchmark.pedantic(
            benchmark_manager.restore_backup,
            args=(backup_path,),
            rounds=1,
            iterations=1,
            warmup_rounds=0
        )
        assert result is True


# ============================================
# Docker Volume Performance Tests
# ============================================

@pytest.mark.benchmark
@pytest.mark.docker
class TestBackupPerformanceDockerVolumes:
    """Benchmark tests for Docker volume backup/restore operations."""

    @pytest.fixture(autouse=True)
    def check_docker_available(self, docker_available: bool):
        """Skip tests if Docker is not available."""
        if not docker_available:
            pytest.skip("Docker daemon not available")

    @staticmethod
    def _create_volume_with_data(volume_name: str, size_bytes: int) -> None:
        """Create Docker volume and populate with random data."""
        # Remove any existing volume
        subprocess.run(
            ["docker", "volume", "rm", "-f", volume_name],
            capture_output=True
        )
        
        # Create new volume
        subprocess.run(
            ["docker", "volume", "create", volume_name],
            check=True,
            capture_output=True
        )
        
        # Fill with random data using dd
        size_mb = max(1, size_bytes // (1024 * 1024))
        subprocess.run(
            [
                "docker", "run", "--rm",
                "-v", f"{volume_name}:/data",
                "alpine",
                "sh", "-c", 
                f"dd if=/dev/urandom of=/data/testfile bs=1M count={size_mb} 2>/dev/null"
            ],
            check=True,
            capture_output=True
        )

    @staticmethod
    def _cleanup_volume(volume_name: str) -> None:
        """Remove Docker volume."""
        subprocess.run(
            ["docker", "volume", "rm", "-f", volume_name],
            capture_output=True
        )

    def test_backup_small_volume_10mb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark backup of small Docker volume (10MB)."""
        volume_name = "perf_test_small_volume"
        self._create_volume_with_data(volume_name, SIZES["small"])
        
        try:
            backup_path = benchmark_manager.backup_dir / "perf_backup"
            backup_path.mkdir(parents=True, exist_ok=True)
            
            with patch.object(
                benchmark_manager, 
                "_get_docker_volumes", 
                return_value=[volume_name]
            ):
                result = benchmark(
                    benchmark_manager.backup_docker_volumes, 
                    backup_path
                )
            
            assert result is True
        finally:
            self._cleanup_volume(volume_name)

    def test_backup_medium_volume_100mb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark backup of medium Docker volume (100MB)."""
        volume_name = "perf_test_medium_volume"
        self._create_volume_with_data(volume_name, SIZES["medium"])
        
        try:
            backup_path = benchmark_manager.backup_dir / "perf_backup"
            backup_path.mkdir(parents=True, exist_ok=True)
            
            with patch.object(
                benchmark_manager, 
                "_get_docker_volumes", 
                return_value=[volume_name]
            ):
                result = benchmark.pedantic(
                    benchmark_manager.backup_docker_volumes,
                    args=(backup_path,),
                    rounds=3,
                    iterations=1,
                    warmup_rounds=0
                )
            
            assert result is True
        finally:
            self._cleanup_volume(volume_name)

    @pytest.mark.slow
    def test_backup_large_volume_1gb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """
        Benchmark backup of large Docker volume (1GB).
        
        WARNING: Creates 1GB of data in Docker volume.
        Only runs with: pytest -m "slow"
        """
        volume_name = "perf_test_large_volume"
        self._create_volume_with_data(volume_name, SIZES["large"])
        
        try:
            backup_path = benchmark_manager.backup_dir / "perf_backup"
            backup_path.mkdir(parents=True, exist_ok=True)
            
            with patch.object(
                benchmark_manager, 
                "_get_docker_volumes", 
                return_value=[volume_name]
            ):
                result = benchmark.pedantic(
                    benchmark_manager.backup_docker_volumes,
                    args=(backup_path,),
                    rounds=1,
                    iterations=1,
                    warmup_rounds=0
                )
            
            assert result is True
        finally:
            self._cleanup_volume(volume_name)

    def test_restore_small_volume_10mb(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark restore of small Docker volume (10MB)."""
        volume_name = "perf_test_restore_small"
        self._create_volume_with_data(volume_name, SIZES["small"])
        
        try:
            # Create backup first
            backup_path = benchmark_manager.backup_dir / "perf_backup"
            backup_path.mkdir(parents=True, exist_ok=True)
            
            with patch.object(
                benchmark_manager, 
                "_get_docker_volumes", 
                return_value=[volume_name]
            ):
                benchmark_manager.backup_docker_volumes(backup_path)
            
            # Clear volume
            self._cleanup_volume(volume_name)
            subprocess.run(
                ["docker", "volume", "create", volume_name],
                check=True,
                capture_output=True
            )
            
            # Benchmark restore
            with patch.object(
                benchmark_manager, 
                "_get_docker_volumes", 
                return_value=[volume_name]
            ):
                result = benchmark(
                    benchmark_manager.restore_docker_volumes, 
                    backup_path
                )
            
            assert result is True
        finally:
            self._cleanup_volume(volume_name)


# ============================================
# Operational Performance Tests
# ============================================

@pytest.mark.benchmark
class TestBackupOperationsPerformance:
    """Benchmark tests for backup management operations."""

    def test_list_backups_many_entries(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark listing many backup entries (50 backups)."""
        # Create 50 backup directories with metadata
        for i in range(50):
            backup = benchmark_manager.backup_dir / f"tsijukebox_backup_202401{i:02d}_120000"
            backup.mkdir(parents=True)
            (backup / "metadata.json").write_text(
                f'{{"created_at": "2024-01-{(i % 28) + 1:02d}T12:00:00", '
                f'"version": "1.0.{i}", "include_volumes": false}}'
            )
        
        result = benchmark(benchmark_manager.list_backups)
        assert len(result) == 50

    def test_list_backups_with_subdirs(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark listing backups with nested subdirectories."""
        # Create 30 backups with config subdirectories
        for i in range(30):
            backup = benchmark_manager.backup_dir / f"tsijukebox_backup_202401{i:02d}_120000"
            config_dir = backup / "config"
            volumes_dir = backup / "volumes"
            
            config_dir.mkdir(parents=True)
            volumes_dir.mkdir(parents=True)
            
            (backup / "metadata.json").write_text(
                f'{{"created_at": "2024-01-{(i % 28) + 1:02d}T12:00:00"}}'
            )
            (config_dir / "docker-compose.yml").write_text("version: '3.9'")
            (config_dir / ".env").write_text("PORT=8080")
        
        result = benchmark(benchmark_manager.list_backups)
        assert len(result) == 30

    def test_cleanup_old_backups_performance(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark cleanup of old backups (keep 5, delete 15)."""
        # Create 20 backup directories with files
        for i in range(20):
            backup = benchmark_manager.backup_dir / f"tsijukebox_backup_202401{i:02d}_120000"
            config_dir = backup / "config"
            config_dir.mkdir(parents=True)
            
            (backup / "metadata.json").write_text(
                f'{{"created_at": "2024-01-{(i % 28) + 1:02d}T12:00:00"}}'
            )
            (config_dir / "docker-compose.yml").write_text("version: '3.9'\n" * 100)
            
            # Add some additional files
            for j in range(5):
                (config_dir / f"config_{j}.txt").write_text(f"Config {j}\n" * 50)
        
        result = benchmark(benchmark_manager.cleanup_old_backups, 5)
        assert result == 15  # Should have removed 15 backups

    def test_get_backup_size_calculation(
        self, 
        benchmark, 
        benchmark_manager: BackupManager
    ):
        """Benchmark calculating total backup size."""
        # Create backup with various file sizes
        backup = benchmark_manager.backup_dir / "tsijukebox_backup_20240101_120000"
        config_dir = backup / "config"
        config_dir.mkdir(parents=True)
        
        (backup / "metadata.json").write_text('{"created_at": "2024-01-01T12:00:00"}')
        
        # Create files of various sizes
        create_test_file(config_dir / "small.txt", 1024)  # 1 KB
        create_test_file(config_dir / "medium.dat", 1024 * 1024)  # 1 MB
        create_test_file(config_dir / "large.db", 10 * 1024 * 1024)  # 10 MB
        
        def calculate_size():
            total = 0
            for f in backup.rglob("*"):
                if f.is_file():
                    total += f.stat().st_size
            return total
        
        result = benchmark(calculate_size)
        assert result > 10 * 1024 * 1024  # At least 10 MB


# ============================================
# Comparison Benchmarks
# ============================================

@pytest.mark.benchmark
class TestBackupComparisonBenchmarks:
    """Comparative benchmarks for different backup scenarios."""

    def test_single_large_vs_many_small_files_backup(
        self, 
        benchmark, 
        benchmark_manager: BackupManager,
        request
    ):
        """
        Compare backup performance: single 50MB file vs 50x1MB files.
        
        This test helps understand I/O patterns and optimization opportunities.
        """
        scenario = request.node.callspec.params.get("scenario", "single")
        
        if scenario == "single":
            # Single 50MB file
            create_test_file(
                benchmark_manager.compose_dir / "single_large.dat",
                50 * 1024 * 1024
            )
        else:
            # 50 x 1MB files
            for i in range(50):
                create_test_file(
                    benchmark_manager.compose_dir / f"small_{i:02d}.dat",
                    1024 * 1024
                )
        
        with patch.object(benchmark_manager, "_get_docker_volumes", return_value=[]):
            result = benchmark(
                benchmark_manager.create_backup,
                include_volumes=False
            )
        
        assert result is not None

    @pytest.fixture(params=["single", "many"])
    def scenario(self, request):
        """Parameterize single vs many files scenario."""
        return request.param
