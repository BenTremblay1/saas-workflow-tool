#!/usr/bin/env python3
"""
Database Setup Script

This script initializes the database and creates all necessary tables.
Run this if you need to ensure the database is properly set up.

Usage:
    python setup_database.py
"""

from app import app, db
import os

def setup_database():
    """Initialize the database and create all tables"""
    db_path = 'workflow.db'
    
    print("Setting up database...")
    print(f"Database location: {os.path.abspath(db_path)}")
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Verify tables were created
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        
        print(f"\n✓ Database initialized successfully!")
        print(f"✓ Created {len(tables)} tables:")
        for table in tables:
            print(f"   - {table}")
        
        # Check if database file exists and show size
        if os.path.exists(db_path):
            size = os.path.getsize(db_path)
            print(f"\nDatabase file size: {size:,} bytes")
        
        print("\nYour database is ready to use!")
        print("You can now save ideas and projects through the web interface.")

if __name__ == '__main__':
    setup_database()

