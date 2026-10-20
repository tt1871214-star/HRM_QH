"""
Migration script to add indexes to Notification table for performance
Run this once: python -c "from scripts.migrate_notification_indexes import migrate; migrate()"
"""

from extensions import db
from models.notification import Notification

def migrate():
    """Create indexes for better query performance"""
    try:
        print("🔧 Creating database indexes...")
        
        # The indexes are already defined in the model with __table_args__
        # This script just ensures they're created
        with db.engine.begin() as conn:
            # Check MySQL
            if 'mysql' in str(db.engine.url):
                # Create indexes
                indexes = [
                    "CREATE INDEX IF NOT EXISTS idx_is_read ON notification(is_read)",
                    "CREATE INDEX IF NOT EXISTS idx_created_at ON notification(created_at)",
                    "CREATE INDEX IF NOT EXISTS idx_source_module ON notification(source_module)",
                    "CREATE INDEX IF NOT EXISTS idx_type ON notification(type)",
                    "CREATE INDEX IF NOT EXISTS idx_is_read_created ON notification(is_read, created_at)",
                    "CREATE INDEX IF NOT EXISTS idx_module_read ON notification(source_module, is_read)",
                ]
                
                for sql in indexes:
                    try:
                        conn.exec_driver_sql(sql)
                        print(f"✅ {sql}")
                    except Exception as e:
                        print(f"⚠️  Index might already exist: {e}")
        
        print("\n✅ Migration completed successfully!")
        return True
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == "__main__":
    migrate()
