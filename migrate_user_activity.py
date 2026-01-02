#!/usr/bin/env python3
"""
Database Migration Script for UserActivity Table

This script adds the UserActivity table to track user actions for metrics.
Run this to add the new table to your existing database.

Usage:
    python migrate_user_activity.py
"""

import sqlite3
import os

def migrate_user_activity():
    """Add UserActivity table to existing database"""
    db_path = 'workflow.db'
    
    if not os.path.exists(db_path):
        print("No existing database found. It will be created on first run.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if table already exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='user_activity'")
    if cursor.fetchone():
        print("UserActivity table already exists. Skipping migration.")
        conn.close()
        return
    
    # Create UserActivity table
    print("Creating UserActivity table...")
    cursor.execute("""
        CREATE TABLE user_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action_type VARCHAR(100) NOT NULL,
            action_date DATE NOT NULL DEFAULT (date('now')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            project_id INTEGER,
            idea_id INTEGER,
            notes TEXT,
            FOREIGN KEY (project_id) REFERENCES project (id),
            FOREIGN KEY (idea_id) REFERENCES app_idea (id),
            UNIQUE (action_type, action_date)
        )
    """)
    
    # Create index for faster queries
    cursor.execute("CREATE INDEX idx_user_activity_date ON user_activity(action_date)")
    cursor.execute("CREATE INDEX idx_user_activity_type ON user_activity(action_type)")
    
    conn.commit()
    conn.close()
    
    print("✓ UserActivity table created successfully!")
    print("✓ Indexes created for performance")

if __name__ == '__main__':
    migrate_user_activity()

