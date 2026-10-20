#!/usr/bin/env python
"""Add missing columns to SQL Server Employees table"""

from app import app
from sqlalchemy import text

with app.app_context():
    try:
        with app.config['SQLALCHEMY_BINDS']['mssql'].connect() as conn:
            # Add Gender column
            try:
                conn.execute(text("ALTER TABLE Employees ADD Gender NVARCHAR(20) NULL"))
                conn.commit()
                print("✓ Added Gender column")
            except Exception as e:
                if "already exists" in str(e):
                    print("✓ Gender column already exists")
                else:
                    print(f"Gender column: {e}")
            
            # Add Avatar column  
            try:
                conn.execute(text("ALTER TABLE Employees ADD Avatar NVARCHAR(500) NULL"))
                conn.commit()
                print("✓ Added Avatar column")
            except Exception as e:
                if "already exists" in str(e):
                    print("✓ Avatar column already exists")
                else:
                    print(f"Avatar column: {e}")
                
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
