#!/usr/bin/env python3
"""
Simple startup script for the Analytics Tool Landing Page
"""

import os
import sys
from app import app

if __name__ == '__main__':
    print("🚀 Starting Analytics Tool Landing Page...")
    print("📍 Server will be available at: http://localhost:5000")
    print("📱 Open your browser to view the landing page")
    print("⏹️  Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        app.run(debug=True, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("\n👋 Server stopped. Goodbye!")
        sys.exit(0)
