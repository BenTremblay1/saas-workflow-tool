"""
Vercel serverless function entry point for Flask app
"""
from app import app

# Vercel Python runtime expects the app to be exposed
# The Flask app will handle all routes
handler = app
