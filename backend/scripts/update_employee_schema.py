#!/usr/bin/env python
"""
Script để update Employee table schema
Thêm các cột: gender, avatar
"""

import sys
sys.path.insert(0, '/'.join(__file__.split('/')[:-2]))

from app import app, db
from sqlalchemy import text

def update_employee_schema():
    """Update Employee table schema"""
    with app.app_context():
        try:
            # Kiểm tra DB type
            db_uri = app.config['SQLALCHEMY_DATABASE_URI']
            
            if 'mysql' in db_uri:
                print("Updating MySQL Employee table...")
                with db.engine.connect() as conn:
                    # Add gender column
                    try:
                        conn.execute(text("""
                            ALTER TABLE employees 
                            ADD COLUMN gender VARCHAR(20) NULL
                        """))
                        conn.commit()
                        print("✓ Added gender column")
                    except Exception as e:
                        print(f"✗ gender column error: {e}")
                    
                    # Add avatar column
                    try:
                        conn.execute(text("""
                            ALTER TABLE employees 
                            ADD COLUMN avatar VARCHAR(500) NULL
                        """))
                        conn.commit()
                        print("✓ Added avatar column")
                    except Exception as e:
                        print(f"✗ avatar column error: {e}")
            
            elif 'mssql' in db_uri:
                print("Updating SQL Server Employee table...")
                with db.engine.connect() as conn:
                    # Add gender column
                    try:
                        conn.execute(text("""
                            ALTER TABLE Employees 
                            ADD Gender NVARCHAR(20) NULL
                        """))
                        conn.commit()
                        print("✓ Added Gender column")
                    except Exception as e:
                        print(f"✗ Gender column error: {e}")
                    
                    # Add avatar column
                    try:
                        conn.execute(text("""
                            ALTER TABLE Employees 
                            ADD Avatar NVARCHAR(500) NULL
                        """))
                        conn.commit()
                        print("✓ Added Avatar column")
                    except Exception as e:
                        print(f"✗ Avatar column error: {e}")
            
            print("\n✓ Schema update completed!")
            
        except Exception as e:
            print(f"Error: {e}")
            return False
    
    return True

if __name__ == "__main__":
    update_employee_schema()
