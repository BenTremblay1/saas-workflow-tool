# Install psycopg2-binary

You need to install `psycopg2-binary` to connect to PostgreSQL/Supabase.

## Option 1: Install with pip (Recommended)

Run this in your terminal:

```bash
pip3 install psycopg2-binary
```

If you get permission errors, try:

```bash
pip3 install --user psycopg2-binary
```

## Option 2: Install all requirements

Or install everything from requirements.txt:

```bash
pip3 install -r requirements.txt
```

Or with user flag:

```bash
pip3 install --user -r requirements.txt
```

## Option 3: Use a Virtual Environment (Best Practice)

If you continue having permission issues, use a virtual environment:

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Run app
python app.py
```

## After Installing

Once `psycopg2-binary` is installed, restart your server:

```bash
python3 app.py
```

The server should start successfully and connect to Supabase!
