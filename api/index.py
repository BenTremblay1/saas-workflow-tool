"""
Vercel serverless function entry point for Flask app
"""
import sys
import os

# Add parent directory to path so we can import app
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Import the Flask app
from app import app

# Vercel Python runtime expects a function handler
# Flask apps are WSGI-compatible, but Vercel's detection fails with direct assignment
# Solution: Wrap in a function that Vercel can properly recognize
def handler(request):
    """
    Vercel serverless function handler
    
    Vercel passes a request object with:
    - request.environ: WSGI environment dictionary
    - request.start_response: WSGI start_response callable
    
    We delegate to Flask's WSGI interface.
    """
    return app(request.environ, request.start_response)
