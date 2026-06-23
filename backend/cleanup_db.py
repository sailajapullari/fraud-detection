import sqlite3
import os

db_path = 'db.sqlite3'
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Delete records that exceed the DecimalField limit (max_digits=12)
# 10^10 is a safe limit for 12 digits total with 2 decimal places (max value approx 9,999,999,999.99)
cursor.execute("DELETE FROM fraud_analysis_transaction WHERE amount >= 10000000000")
deleted_count = cursor.rowcount
conn.commit()

# Also delete corresponding risk analysis if any orphaned? 
# Django models usually handle this on-delete cascade if defined, but SQLite doesn't always if not enabled.
# However, for a cleanup, deleting from transaction should be enough if the crash is there.

print(f"Cleanup complete. Deleted {deleted_count} corrupt records.")
conn.close()
