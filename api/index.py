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

# Vercel Python runtime - Flask app is WSGI-compatible
# Expose directly as handler
handler = app
