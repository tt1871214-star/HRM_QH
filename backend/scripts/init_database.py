#!/usr/bin/env python
"""
Script để create hoặc update Employee table schema
"""

import sys
sys.path.insert(0, '/'.join(__file__.split('/')[:-2]))

from app import app, db
from models.employee import Employee, Department, Position
from sqlalchemy import text, inspect

def init_database():
    """Initialize database tables"""
    with app.app_context():
        try:
            db_uri = app.config['SQLALCHEMY_DATABASE_URI']
            print(f"Database: {db_uri.split('/')[-1]}")
            
            # Kiểm tra xem các table có tồn tại không
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            
            print(f"Existing tables: {existing_tables}")
            
            # Create all tables if they don't exist
            print("\nCreating tables...")
            db.create_all()
            print("✓ Tables created successfully")
            
            # Verify tables were created
            inspector = inspect(db.engine)
            existing_tables = inspector.get_table_names()
            print(f"Tables after creation: {existing_tables}")
            
        except Exception as e:
            print(f"Error: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    return True

if __name__ == "__main__":
    init_database()
