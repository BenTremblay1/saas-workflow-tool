#!/usr/bin/env python3
"""
Test Supabase database connection
Run this to verify your DATABASE_URL is correct
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_connection():
    """Test database connection"""
    print("🔍 Testing Supabase Database Connection...\n")
    
    # Check if DATABASE_URL is set
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ ERROR: DATABASE_URL not found in .env file")
        print("   Make sure you have a .env file with DATABASE_URL set")
        return False
    
    # Check if password placeholder exists
    if '[YOUR-PASSWORD]' in database_url or '[YOUR-PASSWORD]' in database_url:
        print("❌ ERROR: DATABASE_URL still has [YOUR-PASSWORD] placeholder")
        print("   You need to replace it with your actual database password")
        print("   See STEP_BY_STEP_FIX.md for instructions")
        return False
    
    # Check format
    if not database_url.startswith('postgresql://'):
        print("❌ ERROR: DATABASE_URL should start with 'postgresql://'")
        print(f"   Current: {database_url[:50]}...")
        return False
    
    print("✅ DATABASE_URL format looks correct")
    print(f"   Format: {database_url[:50]}...")
    
    # Clean connection string - remove pgbouncer query parameters
    # Supabase pooling URLs include ?pgbouncer=true which psycopg2 doesn't understand
    if '?' in database_url:
        database_url = database_url.split('?')[0]
        print("   ⚠️  Removed query parameters from connection string")
    
    # Try to connect
    try:
        from sqlalchemy import create_engine, text
        
        print("\n🔌 Attempting to connect...")
        engine = create_engine(database_url, connect_args={"sslmode": "require"})
        
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            result.fetchone()
        
        print("✅ Connection successful!")
        print("   Your database is reachable and working")
        return True
        
    except Exception as e:
        print(f"\n❌ Connection failed: {str(e)}")
        print("\n🔧 Troubleshooting:")
        
        error_str = str(e).lower()
        if 'password' in error_str or 'authentication' in error_str:
            print("   - Check that your database password is correct")
            print("   - You can reset it in Supabase: Settings → Database")
        elif 'could not translate host name' in error_str or 'nodename' in error_str:
            print("   - Supabase project might be PAUSED")
            print("   - Go to Supabase dashboard and click 'Restore' if paused")
            print("   - Or try using Direct Connection URL (port 5432) instead of Pooling")
        elif 'pgbouncer' in error_str or 'invalid connection option' in error_str:
            print("   - Connection pooling URL has unsupported parameters")
            print("   - Try using Direct Connection URL instead:")
            print("     Supabase → Settings → Database → Connection string → URI tab")
            print("     (Use port 5432, not 6543)")
        elif 'timeout' in error_str or 'connection refused' in error_str:
            print("   - Check your internet connection")
            print("   - Verify Supabase project is active")
        
        return False

if __name__ == '__main__':
    success = test_connection()
    sys.exit(0 if success else 1)
