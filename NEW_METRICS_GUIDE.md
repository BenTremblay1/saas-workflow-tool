# New Dashboard Metrics Guide

## Overview

Four new KPI cards have been added to your Dashboard, displayed between the "Dashboard" title and the existing KPI cards (Total Ideas, Active Projects, Live Apps, Total MRR).

## New Metrics

### 1. Consistency Score
- **Display**: Percentage value (e.g., "15.3%")
- **Sub-text**: "X / 365 days" (Days Active / Days in Year)
- **Calculation**: (Unique days with activity in 2026) / (Total days in 2026) × 100
- **Icon**: Chart line (purple)

### 2. Current Streak
- **Display**: Number of consecutive days
- **Sub-text**: "consecutive days"
- **Calculation**: Number of consecutive days (including today) with at least one tracked action
- **Icon**: Fire (orange)

### 3. Stage Velocity
- **Display**: Average number of days
- **Sub-text**: "avg days in Smoke Test"
- **Calculation**: Average number of days projects stay in the "Smoke Test" stage
- **Icon**: Tachometer (teal)

### 4. Validation Activity
- **Display**: Count of actions
- **Sub-text**: "actions this week"
- **Calculation**: Number of "Outreach" or "Smoke Test" actions taken this week (Monday to today)
- **Icon**: Bullseye (pink)

## Automatic Activity Tracking

The system automatically tracks actions when you:

1. **Create a new idea** → Tracks `idea_created`
2. **Promote an idea to a project** → Tracks `smoke_test` (entering Smoke Test phase)
3. **Complete "Deep Competitive Recon" step** → Tracks `outreach`
4. **Complete "Build Facade Landing Page" step** → Tracks `smoke_test`

## Database

All activity is stored in the `user_activity` table:
- **action_type**: Type of action (e.g., 'idea_created', 'outreach', 'smoke_test')
- **action_date**: Date the action occurred
- **project_id**: Associated project (if applicable)
- **idea_id**: Associated idea (if applicable)
- **notes**: Optional notes about the action

## How It Works

1. **Activity Tracking**: When you perform key actions (create ideas, promote projects, complete steps), the system automatically records them
2. **Daily Deduplication**: Only one action of each type is recorded per day (prevents double-counting)
3. **Real-time Calculation**: Metrics are calculated on-demand when you view the Dashboard
4. **Historical Data**: All activity is stored permanently, so metrics improve over time

## Viewing Your Metrics

Simply visit the Dashboard page at `http://localhost:5001` and the 4 new KPI cards will appear at the top, showing your current metrics.

## Notes

- Metrics start at 0 until you perform actions
- Consistency Score and Current Streak will build up as you use the app daily
- Stage Velocity requires projects in the "Smoke Test" stage to calculate
- Validation Activity resets weekly (Monday to Sunday)

