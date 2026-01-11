#!/usr/bin/env python3
"""
Migrate SQLite database to Supabase PostgreSQL

This script will:
1. Read all data from the local SQLite database
2. Create tables in Supabase (if they don't exist)
3. Migrate all data to Supabase
4. Optionally update user_id fields if you provide a Supabase user ID

Usage:
    # Set environment variables first
    export SUPABASE_URL="https://your-project.supabase.co"
    export SUPABASE_KEY="your-anon-key"
    export SUPABASE_SERVICE_KEY="your-service-role-key"
    export DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
    
    # Run migration
    python migrate_to_supabase.py
"""

import os
import sys
from app import app, db, AppIdea, Project, Task, GamePlanStep, GamePlanStepData, UserActivity
from sqlalchemy import text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_environment():
    """Check if required environment variables are set"""
    required_vars = ['SUPABASE_URL', 'SUPABASE_KEY', 'DATABASE_URL']
    missing = [var for var in required_vars if not os.environ.get(var)]
    
    if missing:
        print("❌ Missing required environment variables:")
        for var in missing:
            print(f"   - {var}")
        print("\nPlease set these in your .env file or environment:")
        print("   SUPABASE_URL=https://your-project.supabase.co")
        print("   SUPABASE_KEY=your-anon-key")
        print("   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres")
        return False
    
    return True

def migrate_data():
    """Migrate all data from SQLite to Supabase"""
    print("🚀 Starting migration to Supabase...")
    print("-" * 50)
    
    # Check environment
    if not check_environment():
        sys.exit(1)
    
    # Verify Supabase connection
    database_url = os.environ.get('DATABASE_URL')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    
    # Temporarily switch to Supabase database
    original_db_uri = app.config['SQLALCHEMY_DATABASE_URI']
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    
    try:
        with app.app_context():
            # Create all tables in Supabase
            print("📦 Creating tables in Supabase...")
            db.create_all()
            print("✅ Tables created successfully")
            
            # Switch back to SQLite to read data
            app.config['SQLALCHEMY_DATABASE_URI'] = original_db_uri
            
            # Read data from SQLite
            print("\n📖 Reading data from SQLite...")
            ideas = AppIdea.query.all()
            projects = Project.query.all()
            tasks = Task.query.all()
            game_plan_steps = GamePlanStep.query.all()
            step_data = GamePlanStepData.query.all()
            activities = UserActivity.query.all()
            
            print(f"   Found {len(ideas)} app ideas")
            print(f"   Found {len(projects)} projects")
            print(f"   Found {len(tasks)} tasks")
            print(f"   Found {len(game_plan_steps)} game plan steps")
            print(f"   Found {len(step_data)} step data entries")
            print(f"   Found {len(activities)} user activities")
            
            # Switch back to Supabase to write data
            app.config['SQLALCHEMY_DATABASE_URI'] = database_url
            
            # Migrate data
            print("\n📤 Migrating data to Supabase...")
            
            # Migrate App Ideas
            if ideas:
                print(f"   Migrating {len(ideas)} app ideas...")
                for idea in ideas:
                    # Check if already exists
                    existing = db.session.query(AppIdea).filter_by(id=idea.id).first()
                    if not existing:
                        db.session.add(AppIdea(
                            id=idea.id,
                            user_id=idea.user_id,
                            name=idea.name,
                            description=idea.description,
                            mrr_range=idea.mrr_range,
                            source_url=idea.source_url,
                            difficulty=idea.difficulty,
                            tech_stack=idea.tech_stack,
                            market_size=idea.market_size,
                            competition_level=idea.competition_level,
                            notes=idea.notes,
                            status=idea.status,
                            problem_to_solve=idea.problem_to_solve,
                            competitor_url=idea.competitor_url,
                            competitor_mrr=idea.competitor_mrr,
                            validation_notes=idea.validation_notes,
                            my_angle=idea.my_angle,
                            estimated_mrr=idea.estimated_mrr,
                            revenue_verification_source=idea.revenue_verification_source,
                            revenue_proof_url=idea.revenue_proof_url,
                            revenue_confidence=idea.revenue_confidence,
                            pricing_model=idea.pricing_model,
                            problem_statement=idea.problem_statement,
                            target_audience=idea.target_audience,
                            problem_severity=idea.problem_severity,
                            value_proposition=idea.value_proposition,
                            key_benefits=idea.key_benefits,
                            unique_selling_point=idea.unique_selling_point,
                            core_features=idea.core_features,
                            nice_to_have_features=idea.nice_to_have_features,
                            technical_requirements=idea.technical_requirements,
                            third_party_integrations=idea.third_party_integrations,
                            created_at=idea.created_at,
                            updated_at=idea.updated_at
                        ))
                db.session.commit()
                print("   ✅ App ideas migrated")
            
            # Migrate Projects
            if projects:
                print(f"   Migrating {len(projects)} projects...")
                for project in projects:
                    existing = db.session.query(Project).filter_by(id=project.id).first()
                    if not existing:
                        db.session.add(Project(
                            id=project.id,
                            user_id=project.user_id,
                            app_idea_id=project.app_idea_id,
                            name=project.name,
                            current_stage=project.current_stage,
                            progress=project.progress,
                            target_launch_date=project.target_launch_date,
                            actual_launch_date=project.actual_launch_date,
                            current_mrr=project.current_mrr,
                            target_mrr=project.target_mrr,
                            created_at=project.created_at,
                            updated_at=project.updated_at
                        ))
                db.session.commit()
                print("   ✅ Projects migrated")
            
            # Migrate Tasks
            if tasks:
                print(f"   Migrating {len(tasks)} tasks...")
                for task in tasks:
                    existing = db.session.query(Task).filter_by(id=task.id).first()
                    if not existing:
                        db.session.add(Task(
                            id=task.id,
                            project_id=task.project_id,
                            title=task.title,
                            description=task.description,
                            stage=task.stage,
                            status=task.status,
                            priority=task.priority,
                            due_date=task.due_date,
                            completed_at=task.completed_at,
                            created_at=task.created_at
                        ))
                db.session.commit()
                print("   ✅ Tasks migrated")
            
            # Migrate Game Plan Steps
            if game_plan_steps:
                print(f"   Migrating {len(game_plan_steps)} game plan steps...")
                for step in game_plan_steps:
                    existing = db.session.query(GamePlanStep).filter_by(id=step.id).first()
                    if not existing:
                        db.session.add(GamePlanStep(
                            id=step.id,
                            project_id=step.project_id,
                            step_number=step.step_number,
                            title=step.title,
                            description=step.description,
                            category=step.category,
                            estimated_hours=step.estimated_hours,
                            status=step.status,
                            completed_at=step.completed_at,
                            created_at=step.created_at
                        ))
                db.session.commit()
                print("   ✅ Game plan steps migrated")
            
            # Migrate Step Data
            if step_data:
                print(f"   Migrating {len(step_data)} step data entries...")
                for data in step_data:
                    existing = db.session.query(GamePlanStepData).filter_by(id=data.id).first()
                    if not existing:
                        db.session.add(GamePlanStepData(
                            id=data.id,
                            step_id=data.step_id,
                            competitors_looked_at=data.competitors_looked_at,
                            where_got_reviews=data.where_got_reviews,
                            pain_point_1=data.pain_point_1,
                            pain_point_2=data.pain_point_2,
                            pain_point_3=data.pain_point_3,
                            my_wedge=data.my_wedge,
                            how_solve_10x_better=data.how_solve_10x_better,
                            confidence_check=data.confidence_check,
                            go_no_go=data.go_no_go,
                            final_headline_chosen=data.final_headline_chosen,
                            headline_variations=data.headline_variations,
                            subheadline=data.subheadline,
                            wedge_statement=data.wedge_statement,
                            cta_button_text=data.cta_button_text,
                            price_shown=data.price_shown,
                            landing_page_url=data.landing_page_url,
                            visual_proof_url=data.visual_proof_url,
                            launched_status=data.launched_status,
                            launch_note=data.launch_note,
                            updated_at=data.updated_at
                        ))
                db.session.commit()
                print("   ✅ Step data migrated")
            
            # Migrate User Activities
            if activities:
                print(f"   Migrating {len(activities)} user activities...")
                for activity in activities:
                    existing = db.session.query(UserActivity).filter_by(
                        id=activity.id
                    ).first()
                    if not existing:
                        db.session.add(UserActivity(
                            id=activity.id,
                            action_type=activity.action_type,
                            action_date=activity.action_date,
                            project_id=activity.project_id,
                            idea_id=activity.idea_id,
                            notes=activity.notes,
                            created_at=activity.created_at
                        ))
                db.session.commit()
                print("   ✅ User activities migrated")
            
            print("\n" + "=" * 50)
            print("✅ Migration completed successfully!")
            print("=" * 50)
            print("\nYour data is now in Supabase!")
            print("You can now use the Supabase database by setting DATABASE_URL in your environment.")
            
    except Exception as e:
        print(f"\n❌ Error during migration: {e}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        sys.exit(1)
    finally:
        # Restore original database URI
        app.config['SQLALCHEMY_DATABASE_URI'] = original_db_uri

if __name__ == '__main__':
    migrate_data()
