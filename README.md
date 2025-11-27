# SaaS Workflow Tool

A comprehensive workflow management tool for identifying, analyzing, and building $10k-30k MRR SaaS applications. This tool helps you discover successful apps, verify their revenue, understand what makes them valuable, and create actionable game plans to build your own versions.

## Features

### 🎯 App Discovery & Analysis
- **Discover Apps**: Find apps/services generating $10k-30k MRR
- **Revenue Verification**: Track estimated MRR, verification sources, and proof links
- **Problem Analysis**: Identify what problem the app solves, target audience, and problem severity
- **Value Proposition**: Understand why people pay for it, key benefits, and unique selling points
- **Feature Breakdown**: Document core features, nice-to-haves, technical requirements, and integrations needed for copying
- **Comprehensive Details**: View all analysis in organized detail pages

### 📊 Project Management
- Create projects from analyzed app ideas
- Track progress through workflow stages:
  - **Discovery**: Research and validation
  - **Planning**: Architecture and design
  - **Building**: Development phase
  - **Testing**: QA and refinement
  - **Launching**: Go-to-market preparation
- Monitor MRR (Monthly Recurring Revenue) targets and actuals
- Set launch dates and track milestones

### 🎮 Game Plan Builder
- **Auto-Generate Game Plans**: Create a complete step-by-step plan to copy an app
- **Customizable Steps**: Add, edit, and track game plan steps
- **Category Organization**: Steps organized by research, design, development, marketing, launch
- **Progress Tracking**: Mark steps as pending, in progress, or completed
- **Time Estimates**: Track estimated hours for each step

### ✅ Task Management
- Create tasks for each project stage
- Set priorities (low, medium, high)
- Track task completion
- Organize by workflow stage

### 📈 Dashboard
- Overview of total ideas, active projects, and live apps
- Total MRR tracking across all projects
- Visual workflow progress indicators

## Tech Stack

- **Backend**: Python Flask with SQLAlchemy
- **Frontend**: React (via CDN)
- **Styling**: Tailwind CSS
- **Database**: SQLite (for development)

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Initialize Database

The database will be automatically created on first run. A `workflow.db` file will be created in your project directory.

**Note**: If you have an existing `workflow.db` file from an older version, you have two options:

**Option 1 (Recommended for fresh start)**: Delete the old `workflow.db` file to allow the new schema to be created with all the enhanced fields.

**Option 2 (Preserve existing data)**: Run the migration script to add new columns to your existing database:
```bash
python migrate_db.py
```
This will add all new columns while preserving your existing data.

### 3. Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

## Usage Workflow

### Step 1: Discover & Analyze App Ideas

1. Navigate to the "Discover Ideas" tab
2. Click "Add New Idea" to add apps you find with $10k-30k MRR
3. Fill in comprehensive details across multiple tabs:

   **Basic Tab:**
   - App name and description
   - MRR range ($10k-30k, $5k-10k, $30k-50k, $50k+)
   - Source URL (where you found it)
   - Difficulty level
   - Tech stack requirements
   - Notes and research

   **Revenue Tab:**
   - Estimated MRR (in dollars)
   - Revenue verification source (Indie Hackers, Twitter, Product Hunt, etc.)
   - Revenue proof URL (link to proof)
   - Revenue confidence level (High, Medium, Low)
   - Pricing model

   **Problem Tab:**
   - Problem statement (what problem does it solve?)
   - Target audience (who has this problem?)
   - Problem severity (Critical, High, Medium, Low)

   **Value Tab:**
   - Value proposition (why do people pay for it?)
   - Key benefits (main benefits users get)
   - Unique selling point (what makes it special?)

   **Features Tab:**
   - Core features (must-have features for MVP)
   - Nice-to-have features (optional features)
   - Technical requirements
   - Third-party integrations needed

4. Click "View Details" on any idea to see a comprehensive analysis view

### Step 2: Start a Project

1. From an app idea detail page, click "Start Project"
2. The project will be created with the app idea linked
3. Navigate to the "Projects" tab to see your project

### Step 3: Generate Game Plan

1. Open your project from the Projects tab
2. Click on the "Game Plan" tab
3. Click "Generate Game Plan" to create a default step-by-step plan
4. The game plan includes:
   - Research & validation steps
   - MVP feature definition
   - Design and development phases
   - Testing and launch preparation
   - Marketing and launch steps
5. Track progress by updating step status (pending → in progress → completed)

### Step 4: Work Through Stages

1. **Discovery**: Research the market, validate the idea
2. **Planning**: Design architecture, create wireframes
3. **Building**: Develop the application
4. **Testing**: Test functionality, fix bugs
5. **Launching**: Deploy, market, and acquire first customers

### Step 5: Track Progress

- Follow the game plan steps
- Add custom tasks for each stage
- Mark tasks as complete
- Update project progress percentage
- Track actual MRR as you gain customers

## API Endpoints

### App Ideas
- `GET /api/app-ideas` - List all ideas (supports ?search=, ?status=, ?mrr_range=)
- `POST /api/app-ideas` - Create new idea
- `PUT /api/app-ideas/<id>` - Update idea
- `DELETE /api/app-ideas/<id>` - Delete idea

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/<id>` - Update project

### Tasks
- `GET /api/projects/<project_id>/tasks` - List tasks for a project
- `POST /api/projects/<project_id>/tasks` - Create new task
- `PUT /api/tasks/<id>` - Update task
- `DELETE /api/tasks/<id>` - Delete task

### Game Plan
- `GET /api/projects/<project_id>/game-plan` - Get game plan steps
- `POST /api/projects/<project_id>/game-plan` - Create game plan step
- `PUT /api/game-plan/<id>` - Update game plan step
- `DELETE /api/game-plan/<id>` - Delete game plan step
- `POST /api/projects/<project_id>/generate-game-plan` - Generate default game plan

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

### AppIdea
- Basic info (name, description, source URL)
- MRR range, estimated MRR
- Difficulty, tech stack
- Market size, competition level
- Status tracking
- **Revenue Verification**: estimated_mrr, revenue_verification_source, revenue_proof_url, revenue_confidence, pricing_model
- **Problem Analysis**: problem_statement, target_audience, problem_severity
- **Value Proposition**: value_proposition, key_benefits, unique_selling_point
- **Feature Breakdown**: core_features, nice_to_have_features, technical_requirements, third_party_integrations

### Project
- Links to AppIdea
- Current stage and progress
- Launch dates
- MRR tracking (current and target)

### Task
- Links to Project
- Title, description
- Stage, status, priority
- Due dates and completion tracking

### GamePlanStep
- Links to Project
- Step number, title, description
- Category (research, design, development, marketing, launch)
- Estimated hours
- Status (pending, in_progress, completed)
- Completion tracking

## Key Features Explained

### Revenue Verification
Track how you verified an app's revenue:
- Estimated MRR in actual dollars
- Source of verification (Indie Hackers, Twitter, etc.)
- Link to proof (screenshot, article, etc.)
- Confidence level in the revenue estimate
- Pricing model used

### Problem Analysis
Understand the market need:
- Clear problem statement
- Who experiences this problem (target audience)
- How severe/urgent the problem is

### Value Proposition
Understand why people pay:
- Core value proposition
- Key benefits users receive
- What makes it unique or special

### Feature Breakdown
Plan what to build:
- Core features (must-have for MVP)
- Nice-to-have features (future versions)
- Technical requirements
- Third-party integrations needed

### Game Plan
Step-by-step execution plan:
- Auto-generated default plan
- Customizable steps
- Progress tracking
- Time estimates

## Customization

### Adding New Workflow Stages
1. Update the `stages` array in `static/js/app.js`
2. Add stage options to the Project model in `app.py`
3. Update the UI components to reflect new stages

### Modifying MRR Ranges
Edit the MRR range options in the IdeaModal component in `static/js/app.js`

### Customizing Game Plan Steps
Modify the `default_steps` array in the `generate_game_plan` function in `app.py`

### Adding New Fields
1. Add columns to the database models in `app.py`
2. Update the API endpoints to handle new fields
3. Update the React components to display/edit new fields

## Production Considerations

- Replace SQLite with PostgreSQL or MySQL for production
- Add user authentication and multi-user support
- Implement proper error handling and validation
- Add data export/import functionality
- Set up automated backups
- Add email notifications for milestones
- Implement analytics and reporting
- Add image uploads for revenue proof screenshots

## License

This project is open source and available under the MIT License.
