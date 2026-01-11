#!/bin/bash
# Setup script for Supabase environment variables

echo "🔧 Setting up .env file with your Supabase credentials..."
echo ""

# Create .env file
cat > .env << EOF
# Supabase Configuration
SUPABASE_URL=https://gtxlwrrxejaotkjjlasf.supabase.co
SUPABASE_KEY=sb_publishable_w5w6meq3DpS_YJb2QD9uVg_TwvYeFf4

# TODO: Add these from Supabase Dashboard:
# 1. Service Role Key: Settings > API > service_role key
# 2. Database URL: Settings > Database > Connection string > URI (replace [YOUR-PASSWORD])
SUPABASE_SERVICE_KEY=your-service-role-key-here
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.gtxlwrrxejaotkjjlasf.supabase.co:5432/postgres

# Flask secret key
SECRET_KEY=dev-secret-key-$(date +%s)
EOF

echo "✅ Created .env file!"
echo ""
echo "📝 Next steps:"
echo "1. Open .env file and add your SERVICE_ROLE_KEY"
echo "2. Add your DATABASE_URL (replace [YOUR-PASSWORD] with your actual password)"
echo "3. See GET_REMAINING_CREDENTIALS.md for detailed instructions"
echo ""
