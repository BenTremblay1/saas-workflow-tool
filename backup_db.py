#!/usr/bin/env python3
"""
Database Backup Script

This script creates a timestamped backup of your workflow.db database.
Run this regularly to ensure your data is safe.

Usage:
    python backup_db.py
"""

import shutil
import os
from datetime import datetime

def backup_database():
    """Create a timestamped backup of workflow.db"""
    db_path = 'workflow.db'
    backup_dir = 'backups'
    
    # Create backups directory if it doesn't exist
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"Created backup directory: {backup_dir}")
    
    # Check if database exists
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found. Nothing to backup.")
        return False
    
    # Create timestamped backup filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f'workflow_backup_{timestamp}.db'
    backup_path = os.path.join(backup_dir, backup_filename)
    
    try:
        # Copy database file
        shutil.copy2(db_path, backup_path)
        
        # Get file sizes
        original_size = os.path.getsize(db_path)
        backup_size = os.path.getsize(backup_path)
        
        print(f"✓ Backup created successfully!")
        print(f"  Original: {db_path} ({original_size:,} bytes)")
        print(f"  Backup: {backup_path} ({backup_size:,} bytes)")
        
        # List all backups
        backups = [f for f in os.listdir(backup_dir) if f.startswith('workflow_backup_')]
        backups.sort(reverse=True)
        
        print(f"\nTotal backups: {len(backups)}")
        if len(backups) > 0:
            print(f"Latest backup: {backups[0]}")
        
        return True
        
    except Exception as e:
        print(f"Error creating backup: {e}")
        return False

if __name__ == '__main__':
    backup_database()

