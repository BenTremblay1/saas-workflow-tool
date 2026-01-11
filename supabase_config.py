"""
Supabase Configuration Helper

This module provides utilities for connecting to Supabase and handling authentication.
Make sure to set these environment variables:
- SUPABASE_URL: Your Supabase project URL
- SUPABASE_KEY: Your Supabase anon/public key
- SUPABASE_SERVICE_KEY: Your Supabase service_role key (for admin operations)
"""

import os
from supabase import create_client, Client

def get_supabase_client() -> Client:
    """Get Supabase client for frontend operations"""
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_KEY')
    
    if not supabase_url or not supabase_key:
        raise ValueError(
            "Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_KEY environment variables.\n"
            "You can find these in your Supabase project settings under API."
        )
    
    return create_client(supabase_url, supabase_key)

def get_supabase_admin_client() -> Client:
    """Get Supabase admin client for backend operations (uses service_role key)"""
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_service_key = os.environ.get('SUPABASE_SERVICE_KEY')
    
    if not supabase_url or not supabase_service_key:
        raise ValueError(
            "Supabase admin credentials not found. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.\n"
            "You can find the service_role key in your Supabase project settings under API."
        )
    
    return create_client(supabase_url, supabase_service_key)

def verify_supabase_connection():
    """Verify that Supabase connection is working"""
    try:
        client = get_supabase_client()
        # Try a simple query to verify connection
        result = client.table('app_idea').select('id').limit(1).execute()
        return True, "Connection successful"
    except Exception as e:
        return False, str(e)
