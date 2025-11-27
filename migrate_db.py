#!/usr/bin/env python3
"""
Database Migration Script

This script helps migrate from old database schema to new schema.
If you have an existing workflow.db file, run this script to ensure
all new columns are added.

Note: This is a simple migration. For production, use Alembic.
"""

import sqlite3
import os

def migrate_database():
    """Add missing columns to existing database"""
    db_path = 'workflow.db'
    
    if not os.path.exists(db_path):
        print("No existing database found. It will be created on first run.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get existing columns
    cursor.execute("PRAGMA table_info(app_idea)")
    existing_columns = [row[1] for row in cursor.fetchall()]
    
    # New columns to add
    new_columns = [
        ('estimated_mrr', 'REAL'),
        ('revenue_verification_source', 'VARCHAR(200)'),
        ('revenue_proof_url', 'VARCHAR(500)'),
        ('revenue_confidence', 'VARCHAR(50)'),
        ('pricing_model', 'VARCHAR(200)'),
        ('problem_statement', 'TEXT'),
        ('target_audience', 'VARCHAR(200)'),
        ('problem_severity', 'VARCHAR(50)'),
        ('value_proposition', 'TEXT'),
        ('key_benefits', 'TEXT'),
        ('unique_selling_point', 'TEXT'),
        ('core_features', 'TEXT'),
        ('nice_to_have_features', 'TEXT'),
        ('technical_requirements', 'TEXT'),
        ('third_party_integrations', 'TEXT'),
    ]
    
    added_count = 0
    for column_name, column_type in new_columns:
        if column_name not in existing_columns:
            try:
                cursor.execute(f"ALTER TABLE app_idea ADD COLUMN {column_name} {column_type}")
                print(f"✓ Added column: {column_name}")
                added_count += 1
            except sqlite3.OperationalError as e:
                print(f"✗ Error adding {column_name}: {e}")
    
    # Check for game_plan_step table
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='game_plan_step'")
    if not cursor.fetchone():
        print("\nCreating game_plan_step table...")
        cursor.execute("""
            CREATE TABLE game_plan_step (
                id INTEGER PRIMARY KEY,
                project_id INTEGER NOT NULL,
                step_number INTEGER NOT NULL,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                category VARCHAR(50),
                estimated_hours INTEGER,
                status VARCHAR(50) DEFAULT 'pending',
                completed_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES project (id)
            )
        """)
        print("✓ Created game_plan_step table")
    
    conn.commit()
    conn.close()
    
    if added_count == 0:
        print("\n✓ Database is up to date. No migrations needed.")
    else:
        print(f"\n✓ Migration complete! Added {added_count} new columns.")

if __name__ == '__main__':
    print("Starting database migration...")
    migrate_database()
    print("\nDone!")

