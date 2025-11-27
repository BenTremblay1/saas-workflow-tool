from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///workflow.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db = SQLAlchemy(app)

# Database Models
class AppIdea(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    mrr_range = db.Column(db.String(50))  # e.g., "$10k-30k"
    source_url = db.Column(db.String(500))
    difficulty = db.Column(db.String(50))  # Easy, Medium, Hard
    tech_stack = db.Column(db.String(200))
    market_size = db.Column(db.String(100))
    competition_level = db.Column(db.String(50))
    notes = db.Column(db.Text)
    status = db.Column(db.String(50), default='Researching')  # Researching, Validated, Rejected, Planning
    
    # Idea Funnel Fields
    problem_to_solve = db.Column(db.Text)  # Problem this idea solves
    competitor_url = db.Column(db.String(500))  # URL of competitor
    competitor_mrr = db.Column(db.Float)  # Competitor's MRR
    validation_notes = db.Column(db.Text)  # Research notes: How does it get traffic? SEO? Ads?
    my_angle = db.Column(db.Text)  # Your 1% better idea: Cheaper? Better UI? Niched down?
    
    # Revenue Verification
    estimated_mrr = db.Column(db.Float)  # Estimated MRR in dollars
    revenue_verification_source = db.Column(db.String(200))  # e.g., "Indie Hackers", "Twitter", "Product Hunt"
    revenue_proof_url = db.Column(db.String(500))  # Link to proof of revenue
    revenue_confidence = db.Column(db.String(50))  # High, Medium, Low
    pricing_model = db.Column(db.String(200))  # e.g., "$29/month", "Freemium", "One-time"
    
    # Problem Analysis
    problem_statement = db.Column(db.Text)  # What problem does it solve?
    target_audience = db.Column(db.String(200))  # Who has this problem?
    problem_severity = db.Column(db.String(50))  # Critical, High, Medium, Low
    
    # Value Proposition
    value_proposition = db.Column(db.Text)  # Why do people pay for it?
    key_benefits = db.Column(db.Text)  # Main benefits users get
    unique_selling_point = db.Column(db.Text)  # What makes it special?
    
    # Feature Breakdown (for copying)
    core_features = db.Column(db.Text)  # Must-have features
    nice_to_have_features = db.Column(db.Text)  # Optional features
    technical_requirements = db.Column(db.Text)  # Technical needs
    third_party_integrations = db.Column(db.Text)  # APIs, services needed
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    app_idea_id = db.Column(db.Integer, db.ForeignKey('app_idea.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    current_stage = db.Column(db.String(50), default='discovery')  # discovery, planning, building, testing, launching, live
    progress = db.Column(db.Integer, default=0)  # 0-100
    target_launch_date = db.Column(db.Date)
    actual_launch_date = db.Column(db.Date)
    current_mrr = db.Column(db.Float, default=0.0)
    target_mrr = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    app_idea = db.relationship('AppIdea', backref=db.backref('projects', lazy=True))

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    stage = db.Column(db.String(50))  # discovery, planning, building, testing, launching
    status = db.Column(db.String(50), default='todo')  # todo, in_progress, completed, blocked
    priority = db.Column(db.String(50), default='medium')  # low, medium, high
    due_date = db.Column(db.Date)
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    project = db.relationship('Project', backref=db.backref('tasks', lazy=True))

class GamePlanStep(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    step_number = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))  # research, design, development, marketing, launch
    estimated_hours = db.Column(db.Integer)
    status = db.Column(db.String(50), default='pending')  # pending, in_progress, completed
    completed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    project = db.relationship('Project', backref=db.backref('game_plan_steps', lazy=True, order_by='GamePlanStep.step_number'))

# Initialize database
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    return jsonify({'status': 'ok', 'message': 'Flask is working!'})

# App Ideas API
@app.route('/api/app-ideas', methods=['GET'])
def get_app_ideas():
    search = request.args.get('search', '')
    status = request.args.get('status', '')
    mrr_range = request.args.get('mrr_range', '')
    
    query = AppIdea.query
    
    if search:
        query = query.filter(
            db.or_(
                AppIdea.name.contains(search),
                AppIdea.description.contains(search)
            )
        )
    if status:
        query = query.filter(AppIdea.status == status)
    if mrr_range:
        query = query.filter(AppIdea.mrr_range == mrr_range)
    
    ideas = query.order_by(AppIdea.created_at.desc()).all()
    return jsonify([{
        'id': idea.id,
        'name': idea.name,
        'description': idea.description,
        'mrr_range': idea.mrr_range,
        'source_url': idea.source_url,
        'difficulty': idea.difficulty,
        'tech_stack': idea.tech_stack,
        'market_size': idea.market_size,
        'competition_level': idea.competition_level,
        'notes': idea.notes,
        'status': idea.status,
        'estimated_mrr': idea.estimated_mrr,
        'revenue_verification_source': idea.revenue_verification_source,
        'revenue_proof_url': idea.revenue_proof_url,
        'revenue_confidence': idea.revenue_confidence,
        'pricing_model': idea.pricing_model,
        'problem_statement': idea.problem_statement,
        'target_audience': idea.target_audience,
        'problem_severity': idea.problem_severity,
        'value_proposition': idea.value_proposition,
        'key_benefits': idea.key_benefits,
        'unique_selling_point': idea.unique_selling_point,
        'core_features': idea.core_features,
        'nice_to_have_features': idea.nice_to_have_features,
        'technical_requirements': idea.technical_requirements,
        'third_party_integrations': idea.third_party_integrations,
        'problem_to_solve': idea.problem_to_solve,
        'competitor_url': idea.competitor_url,
        'competitor_mrr': idea.competitor_mrr,
        'validation_notes': idea.validation_notes,
        'my_angle': idea.my_angle,
        'created_at': idea.created_at.isoformat() if idea.created_at else None
    } for idea in ideas])

@app.route('/api/app-ideas', methods=['POST'])
def create_app_idea():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Idea name is required'}), 400
        
        # Helper function to convert empty strings to None
        def clean_value(value):
            return value if value and str(value).strip() else None
        
        idea = AppIdea(
            name=data.get('name'),
            description=clean_value(data.get('description')),
            mrr_range=data.get('mrr_range', '$10k-30k'),
            source_url=clean_value(data.get('source_url')),
            difficulty=clean_value(data.get('difficulty')),
            tech_stack=clean_value(data.get('tech_stack')),
            market_size=clean_value(data.get('market_size')),
            competition_level=clean_value(data.get('competition_level')),
            notes=clean_value(data.get('notes')),
            estimated_mrr=data.get('estimated_mrr') if data.get('estimated_mrr') else None,
            revenue_verification_source=clean_value(data.get('revenue_verification_source')),
            revenue_proof_url=clean_value(data.get('revenue_proof_url')),
            revenue_confidence=clean_value(data.get('revenue_confidence')),
            pricing_model=clean_value(data.get('pricing_model')),
            problem_statement=clean_value(data.get('problem_statement')),
            target_audience=clean_value(data.get('target_audience')),
            problem_severity=clean_value(data.get('problem_severity')),
            value_proposition=clean_value(data.get('value_proposition')),
            key_benefits=clean_value(data.get('key_benefits')),
            unique_selling_point=clean_value(data.get('unique_selling_point')),
            core_features=clean_value(data.get('core_features')),
            nice_to_have_features=clean_value(data.get('nice_to_have_features')),
            technical_requirements=clean_value(data.get('technical_requirements')),
            third_party_integrations=clean_value(data.get('third_party_integrations')),
            problem_to_solve=clean_value(data.get('problem_to_solve')),
            competitor_url=clean_value(data.get('competitor_url')),
            competitor_mrr=data.get('competitor_mrr') if data.get('competitor_mrr') else None,
            validation_notes=clean_value(data.get('validation_notes')),
            my_angle=clean_value(data.get('my_angle')),
            status=data.get('status', 'Researching')
        )
        db.session.add(idea)
        db.session.commit()
        return jsonify({'id': idea.id, 'message': 'App idea created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/app-ideas/<int:id>', methods=['PUT'])
def update_app_idea(id):
    idea = AppIdea.query.get_or_404(id)
    data = request.json
    
    for key, value in data.items():
        if hasattr(idea, key):
            setattr(idea, key, value)
    
    idea.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'App idea updated successfully'})

@app.route('/api/app-ideas/<int:id>', methods=['DELETE'])
def delete_app_idea(id):
    idea = AppIdea.query.get_or_404(id)
    db.session.delete(idea)
    db.session.commit()
    return jsonify({'message': 'App idea deleted successfully'})

# Projects API
@app.route('/api/projects', methods=['GET'])
def get_projects():
    projects = Project.query.order_by(Project.created_at.desc()).all()
    return jsonify([{
        'id': project.id,
        'app_idea_id': project.app_idea_id,
        'name': project.name,
        'current_stage': project.current_stage,
        'progress': project.progress,
        'target_launch_date': project.target_launch_date.isoformat() if project.target_launch_date else None,
        'actual_launch_date': project.actual_launch_date.isoformat() if project.actual_launch_date else None,
        'current_mrr': project.current_mrr,
        'target_mrr': project.target_mrr,
        'created_at': project.created_at.isoformat() if project.created_at else None
    } for project in projects])

@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    project = Project(
        app_idea_id=data.get('app_idea_id'),
        name=data.get('name'),
        current_stage=data.get('current_stage', 'discovery'),
        target_launch_date=datetime.strptime(data['target_launch_date'], '%Y-%m-%d').date() if data.get('target_launch_date') else None,
        target_mrr=data.get('target_mrr')
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({'id': project.id, 'message': 'Project created successfully'}), 201

@app.route('/api/projects/<int:id>', methods=['PUT'])
def update_project(id):
    project = Project.query.get_or_404(id)
    data = request.json
    
    for key, value in data.items():
        if hasattr(project, key) and key != 'id':
            if key in ['target_launch_date', 'actual_launch_date'] and value:
                setattr(project, key, datetime.strptime(value, '%Y-%m-%d').date())
            else:
                setattr(project, key, value)
    
    project.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Project updated successfully'})

# Tasks API
@app.route('/api/projects/<int:project_id>/tasks', methods=['GET'])
def get_tasks(project_id):
    tasks = Task.query.filter_by(project_id=project_id).order_by(Task.created_at.desc()).all()
    return jsonify([{
        'id': task.id,
        'project_id': task.project_id,
        'title': task.title,
        'description': task.description,
        'stage': task.stage,
        'status': task.status,
        'priority': task.priority,
        'due_date': task.due_date.isoformat() if task.due_date else None,
        'completed_at': task.completed_at.isoformat() if task.completed_at else None,
        'created_at': task.created_at.isoformat() if task.created_at else None
    } for task in tasks])

@app.route('/api/projects/<int:project_id>/tasks', methods=['POST'])
def create_task(project_id):
    data = request.json
    task = Task(
        project_id=project_id,
        title=data.get('title'),
        description=data.get('description'),
        stage=data.get('stage'),
        status=data.get('status', 'todo'),
        priority=data.get('priority', 'medium'),
        due_date=datetime.strptime(data['due_date'], '%Y-%m-%d').date() if data.get('due_date') else None
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({'id': task.id, 'message': 'Task created successfully'}), 201

@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get_or_404(id)
    data = request.json
    
    for key, value in data.items():
        if hasattr(task, key) and key != 'id':
            if key == 'due_date' and value:
                setattr(task, key, datetime.strptime(value, '%Y-%m-%d').date())
            elif key == 'status' and value == 'completed' and not task.completed_at:
                setattr(task, 'completed_at', datetime.utcnow())
            elif key == 'status' and value != 'completed':
                setattr(task, 'completed_at', None)
            else:
                setattr(task, key, value)
    
    db.session.commit()
    return jsonify({'message': 'Task updated successfully'})

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'})

# Game Plan API
@app.route('/api/projects/<int:project_id>/game-plan', methods=['GET'])
def get_game_plan(project_id):
    steps = GamePlanStep.query.filter_by(project_id=project_id).order_by(GamePlanStep.step_number).all()
    return jsonify([{
        'id': step.id,
        'project_id': step.project_id,
        'step_number': step.step_number,
        'title': step.title,
        'description': step.description,
        'category': step.category,
        'estimated_hours': step.estimated_hours,
        'status': step.status,
        'completed_at': step.completed_at.isoformat() if step.completed_at else None,
        'created_at': step.created_at.isoformat() if step.created_at else None
    } for step in steps])

@app.route('/api/projects/<int:project_id>/game-plan', methods=['POST'])
def create_game_plan_step(project_id):
    data = request.json
    step = GamePlanStep(
        project_id=project_id,
        step_number=data.get('step_number'),
        title=data.get('title'),
        description=data.get('description'),
        category=data.get('category'),
        estimated_hours=data.get('estimated_hours'),
        status=data.get('status', 'pending')
    )
    db.session.add(step)
    db.session.commit()
    return jsonify({'id': step.id, 'message': 'Game plan step created successfully'}), 201

@app.route('/api/game-plan/<int:id>', methods=['PUT'])
def update_game_plan_step(id):
    step = GamePlanStep.query.get_or_404(id)
    data = request.json
    
    for key, value in data.items():
        if hasattr(step, key) and key != 'id':
            if key == 'status' and value == 'completed' and not step.completed_at:
                setattr(step, 'completed_at', datetime.utcnow())
            elif key == 'status' and value != 'completed':
                setattr(step, 'completed_at', None)
            else:
                setattr(step, key, value)
    
    db.session.commit()
    return jsonify({'message': 'Game plan step updated successfully'})

@app.route('/api/game-plan/<int:id>', methods=['DELETE'])
def delete_game_plan_step(id):
    step = GamePlanStep.query.get_or_404(id)
    db.session.delete(step)
    db.session.commit()
    return jsonify({'message': 'Game plan step deleted successfully'})

@app.route('/api/projects/<int:project_id>/generate-game-plan', methods=['POST'])
def generate_game_plan(project_id):
    """Generate Lean AI-Solo Blueprint game plan"""
    project = Project.query.get_or_404(project_id)
    app_idea = AppIdea.query.get_or_404(project.app_idea_id)
    
    # Delete existing game plan steps
    GamePlanStep.query.filter_by(project_id=project_id).delete()
    
    # Lean AI-Solo Blueprint Steps
    # Phase 1: The Smoke Test (Commercial Validation)
    # Gate: 10+ email signups or 1 pre-sale
    default_steps = [
        # Phase 1: Smoke Test
        {'step_number': 1, 'title': '🔍 Deep Competitive Recon', 
         'description': 'Use AI (Gemini/ChatGPT) to analyze competitor 1-2 star reviews. Find top 3 recurring pain points users are angry about. Define your "Wedge" - the ONE pain point you will solve better.', 
         'category': 'phase1_smoketest', 'estimated_hours': 3},
        
        {'step_number': 2, 'title': '📄 Build Facade Landing Page', 
         'description': 'Use AI to write 5 headline variations. Build a one-page site (Carrd/Framer/Webflow). Add CTA: "Join Waitlist" or "Pre-order Lifetime Access ($49)".', 
         'category': 'phase1_smoketest', 'estimated_hours': 4},
        
        {'step_number': 3, 'title': '🚀 Traffic Injection', 
         'description': 'Post problem/solution on subreddits, IndieHackers, LinkedIn. Optional: Run $50-100 in Google/Facebook ads targeting competitor keywords.', 
         'category': 'phase1_smoketest', 'estimated_hours': 4},
        
        {'step_number': 4, 'title': '🚦 GATE CHECK: Validate Demand', 
         'description': '⚠️ STOP! Did you get 10+ email signups OR 1 pre-sale? If NO → Kill/Pivot idea. If YES → Proceed to Phase 2.', 
         'category': 'phase1_smoketest', 'estimated_hours': 1},
        
        # Phase 2: Factory Setup (Standardization)
        # Gate: Hello World app live with login screen
        {'step_number': 5, 'title': '🏭 Acquire the Chassis (Boilerplate)', 
         'description': 'Purchase/fork a SaaS boilerplate (ShipFast, Shipfa.st, Next.js starter). Ensure stack: Next.js + Supabase + Tailwind + Stripe. Deploy empty boilerplate to Vercel.', 
         'category': 'phase2_setup', 'estimated_hours': 2},
        
        {'step_number': 6, 'title': '⚙️ Config Sprint', 
         'description': 'Set up environment variables (Stripe keys, Supabase URL). Update logo, colors, name to match your branding. Test Login and Subscribe buttons work.', 
         'category': 'phase2_setup', 'estimated_hours': 3},
        
        {'step_number': 7, 'title': '🚦 GATE CHECK: Foundation Ready', 
         'description': '⚠️ STOP! Is the "Hello World" app live on internet with working login screen? If NO → Fix before proceeding. If YES → Proceed to Phase 3.', 
         'category': 'phase2_setup', 'estimated_hours': 1},
        
        # Phase 3: The Build (AI-Assisted Development)
        # Gate: User can log in, perform core function, get result
        {'step_number': 8, 'title': '🎨 Frontend-First "Vibes" Coding', 
         'description': 'Open Cursor, use Composer mode. Prompt UI into existence with hardcoded data. Iterate design in code - no Figma needed. Build dashboard, sidebar, main components.', 
         'category': 'phase3_build', 'estimated_hours': 8},
        
        {'step_number': 9, 'title': '🔌 Wire the Logic', 
         'description': 'Ask Cursor to write Supabase SQL schema. Connect Frontend to Backend with server actions. Build the core input mechanism (form/upload/tool that solves the problem).', 
         'category': 'phase3_build', 'estimated_hours': 12},
        
        {'step_number': 10, 'title': '🧪 Internal QA (Mom Test)', 
         'description': 'Run through entire flow yourself: Sign up → Pay (Test Mode) → Use Feature. Paste errors into Cursor and fix instantly.', 
         'category': 'phase3_build', 'estimated_hours': 4},
        
        {'step_number': 11, 'title': '🚦 GATE CHECK: Core Function Works', 
         'description': '⚠️ STOP! Can a user log in, perform the core function, and get a result? If NO → Fix before proceeding. If YES → Proceed to Phase 4.', 
         'category': 'phase3_build', 'estimated_hours': 1},
        
        # Phase 4: Launch & Operations
        # Gate: Retaining customers
        {'step_number': 12, 'title': '📧 Soft Launch', 
         'description': 'Email your Phase 1 waitlist: "We are live. Here is your link." Manually onboard first 10 users. Talk to them - if confused, fix UI immediately.', 
         'category': 'phase4_launch', 'estimated_hours': 4},
        
        {'step_number': 13, 'title': '📈 Programmatic Marketing', 
         'description': 'Create "Sidecar" free tools (calculators, generators) for SEO traffic. Scale cold outreach or paid ads based on what worked in Phase 1.', 
         'category': 'phase4_launch', 'estimated_hours': 8},
        
        {'step_number': 14, 'title': '🔄 Feature Expansion (Only If Asked)', 
         'description': 'ONLY build new features if 3+ customers ask for them. Repeat Phase 3 process for new features. Focus on retention over new features.', 
         'category': 'phase4_launch', 'estimated_hours': 0},
        
        {'step_number': 15, 'title': '🚦 GATE CHECK: Customer Retention', 
         'description': '⚠️ Are customers retaining? Track churn. If high churn → Talk to users, fix issues. If retaining → Scale marketing and repeat for next app!', 
         'category': 'phase4_launch', 'estimated_hours': 0},
    ]
    
    for step_data in default_steps:
        step = GamePlanStep(
            project_id=project_id,
            **step_data
        )
        db.session.add(step)
    
    db.session.commit()
    return jsonify({'message': 'Lean AI-Solo Blueprint game plan generated successfully'}), 201

# Promote Idea to Project
@app.route('/api/app-ideas/<int:id>/promote', methods=['POST'])
def promote_idea_to_project(id):
    idea = AppIdea.query.get_or_404(id)
    
    # Check if a project already exists for this idea
    existing_project = Project.query.filter_by(app_idea_id=idea.id).first()
    if existing_project:
        return jsonify({
            'error': 'A project already exists for this idea',
            'project_id': existing_project.id,
            'project_name': existing_project.name
        }), 400
    
    # Update idea status to Planning
    idea.status = 'Planning'
    
    # Create a new project from this idea - starts at Smoke Test phase
    project = Project(
        app_idea_id=idea.id,
        name=idea.name,
        current_stage='smoketest',  # Lean AI-Solo Blueprint Phase 1
        target_mrr=idea.competitor_mrr or idea.estimated_mrr or 20000
    )
    db.session.add(project)
    db.session.commit()
    
    return jsonify({
        'message': 'Idea promoted to project successfully',
        'project_id': project.id
    }), 201

# Kill Project (mark as dead - validation failed)
@app.route('/api/projects/<int:id>/kill', methods=['POST'])
def kill_project(id):
    project = Project.query.get_or_404(id)
    project.current_stage = 'killed'
    
    # Also update the linked idea status
    if project.app_idea_id:
        idea = AppIdea.query.get(project.app_idea_id)
        if idea:
            idea.status = 'Rejected'
    
    db.session.commit()
    return jsonify({'message': 'Project marked as killed. Idea status updated to Rejected.'})

# Revive Project (bring back from killed)
@app.route('/api/projects/<int:id>/revive', methods=['POST'])
def revive_project(id):
    project = Project.query.get_or_404(id)
    project.current_stage = 'smoketest'  # Start over from validation
    
    # Update linked idea status
    if project.app_idea_id:
        idea = AppIdea.query.get(project.app_idea_id)
        if idea:
            idea.status = 'Researching'
    
    db.session.commit()
    return jsonify({'message': 'Project revived. Starting from Smoke Test phase.'})

# Delete Project
@app.route('/api/projects/<int:id>', methods=['DELETE'])
def delete_project(id):
    project = Project.query.get_or_404(id)
    
    # Delete associated game plan steps
    GamePlanStep.query.filter_by(project_id=id).delete()
    
    # Delete associated tasks
    Task.query.filter_by(project_id=id).delete()
    
    # Update linked idea status back to Researching
    if project.app_idea_id:
        idea = AppIdea.query.get(project.app_idea_id)
        if idea:
            idea.status = 'Researching'
    
    db.session.delete(project)
    db.session.commit()
    return jsonify({'message': 'Project deleted successfully. Idea can be promoted again.'})

# Dashboard Stats
@app.route('/api/dashboard/stats')
def get_dashboard_stats():
    total_ideas = AppIdea.query.count()
    # Exclude killed projects from active count
    active_projects = Project.query.filter(
        Project.current_stage.notin_(['live', 'killed'])
    ).count()
    live_projects = Project.query.filter_by(current_stage='live').count()
    killed_projects = Project.query.filter_by(current_stage='killed').count()
    total_mrr = db.session.query(db.func.sum(Project.current_mrr)).scalar() or 0
    
    return jsonify({
        'total_ideas': total_ideas,
        'active_projects': active_projects,
        'live_projects': live_projects,
        'killed_projects': killed_projects,
        'total_mrr': round(total_mrr, 2)
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
