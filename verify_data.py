#!/usr/bin/env python3
"""
Data Verification Script

This script shows you all the data currently saved in your database.
Run this to verify your ideas and projects are being saved correctly.

Usage:
    python verify_data.py
"""

from app import app, db
from app import AppIdea, Project, Task, GamePlanStep, GamePlanStepData
import os
from datetime import datetime

def verify_data():
    """Display all data in the database"""
    db_path = 'workflow.db'
    
    if not os.path.exists(db_path):
        print(f"Error: {db_path} not found.")
        print("The database will be created when you first save an idea.")
        return
    
    file_size = os.path.getsize(db_path)
    print(f"Database file: {os.path.abspath(db_path)} ({file_size:,} bytes)")
    print("=" * 60)
    
    try:
        with app.app_context():
            # Check App Ideas
            idea_count = AppIdea.query.count()
            print(f"\n📝 APP IDEAS: {idea_count} total")
            
            if idea_count > 0:
                ideas = AppIdea.query.order_by(AppIdea.created_at.desc()).all()
                for idea in ideas:
                    print(f"   • ID {idea.id}: {idea.name}")
                    print(f"     Status: {idea.status}, MRR: ${idea.competitor_mrr or 'N/A'}")
                    print(f"     Created: {idea.created_at}")
                    print()
            else:
                print("   No ideas saved yet.")
            
            # Check Projects
            project_count = Project.query.count()
            print(f"🚀 PROJECTS: {project_count} total")
            
            if project_count > 0:
                projects = Project.query.order_by(Project.created_at.desc()).all()
                for proj in projects:
                    print(f"   • ID {proj.id}: {proj.name}")
                    print(f"     Stage: {proj.current_stage}, Progress: {proj.progress}%")
                    print(f"     Created: {proj.created_at}")
                    print()
            else:
                print("   No projects created yet.")
            
            # Check Game Plan Steps
            step_count = GamePlanStep.query.count()
            print(f"📋 GAME PLAN STEPS: {step_count} total")
            
            # Check Game Plan Step Data
            data_count = GamePlanStepData.query.count()
            print(f"💾 STEP DATA ENTRIES: {data_count} total")
        
        print("=" * 60)
        print("✓ Data verification complete!")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    verify_data()

