#!/usr/bin/env python3
"""
Migrate existing data to a specific Supabase user

This script will:
1. Find all data without a user_id (legacy data)
2. Assign it to your authenticated Supabase user
3. Preserve all existing data

Usage:
    python migrate_data_to_user.py YOUR_SUPABASE_USER_ID

To get your user ID:
1. Sign in to your app
2. Open browser console (F12)
3. Check the user object, or
4. Check Supabase dashboard: Authentication > Users
"""

import os
import sys
from app import app, db, AppIdea, Project, Task, GamePlanStep, GamePlanStepData, UserActivity
from dotenv import load_dotenv

# Load environment variables (ignore permission errors)
try:
    load_dotenv()
except Exception as e:
    print(f"⚠️  Could not load .env file: {e}")
    print("   Continuing with environment variables from system...")

def migrate_data_to_user(user_id):
    """Migrate all legacy data (without user_id) to the specified user"""
    
    if not user_id:
        print("❌ Error: User ID is required")
        print("\nUsage: python migrate_data_to_user.py YOUR_USER_ID")
        print("\nTo get your user ID:")
        print("1. Sign in to your app at http://localhost:5001")
        print("2. Open browser console (F12)")
        print("3. Run: localStorage.getItem('sb-...-auth-token')")
        print("4. Or check Supabase dashboard: Authentication > Users")
        sys.exit(1)
    
    print(f"🔄 Migrating data to user: {user_id}")
    print("-" * 50)
    
    with app.app_context():
        try:
            # Migrate App Ideas
            ideas = AppIdea.query.filter(AppIdea.user_id.is_(None)).all()
            if ideas:
                print(f"📝 Found {len(ideas)} app ideas without user_id")
                for idea in ideas:
                    idea.user_id = user_id
                db.session.commit()
                print(f"✅ Migrated {len(ideas)} app ideas")
            else:
                print("ℹ️  No app ideas to migrate")
            
            # Migrate Projects
            projects = Project.query.filter(Project.user_id.is_(None)).all()
            if projects:
                print(f"📁 Found {len(projects)} projects without user_id")
                for project in projects:
                    project.user_id = user_id
                db.session.commit()
                print(f"✅ Migrated {len(projects)} projects")
            else:
                print("ℹ️  No projects to migrate")
            
            # Tasks are linked to projects, so they'll be accessible through projects
            # But we can verify they exist
            tasks = Task.query.join(Project).filter(Project.user_id == user_id).all()
            print(f"✅ {len(tasks)} tasks are now accessible through migrated projects")
            
            # Game Plan Steps are linked to projects
            steps = GamePlanStep.query.join(Project).filter(Project.user_id == user_id).all()
            print(f"✅ {len(steps)} game plan steps are now accessible through migrated projects")
            
            # Step Data is linked to steps
            step_data = GamePlanStepData.query.join(GamePlanStep).join(Project).filter(Project.user_id == user_id).all()
            print(f"✅ {len(step_data)} step data entries are now accessible")
            
            # User Activities - these don't have user_id, but we can optionally migrate them
            # For now, we'll leave them as-is since they're just metrics
            
            print("\n" + "=" * 50)
            print("✅ Migration completed successfully!")
            print("=" * 50)
            print(f"\nYour data is now associated with user: {user_id}")
            print("Refresh your app to see all your historical data!")
            
        except Exception as e:
            print(f"\n❌ Error during migration: {e}")
            import traceback
            traceback.print_exc()
            db.session.rollback()
            sys.exit(1)

def get_user_id_from_supabase():
    """Try to get user ID from Supabase if available"""
    try:
        from supabase_config import get_supabase_admin_client
        supabase = get_supabase_admin_client()
        
        # Get the first user (you can modify this to get by email)
        response = supabase.auth.admin.list_users()
        if response and len(response.users) > 0:
            print("\n📋 Found users in Supabase:")
            for i, user in enumerate(response.users):
                print(f"   {i+1}. {user.email} (ID: {user.id})")
            return response.users[0].id
    except Exception as e:
        print(f"Could not auto-detect user: {e}")
    return None

if __name__ == '__main__':
    if len(sys.argv) > 1:
        user_id = sys.argv[1]
    else:
        print("🔍 Attempting to auto-detect user ID...")
        user_id = get_user_id_from_supabase()
        
        if not user_id:
            print("\n❌ Could not auto-detect user ID")
            print("\nPlease provide your user ID:")
            print("   python migrate_data_to_user.py YOUR_USER_ID")
            print("\nTo find your user ID:")
            print("1. Go to: https://app.supabase.com/project/gtxlwrrxejaotkjjlasf/auth/users")
            print("2. Find your user (by email)")
            print("3. Copy the User UID")
            sys.exit(1)
    
    migrate_data_to_user(user_id)
