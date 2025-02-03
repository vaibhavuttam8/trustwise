import time
import MySQLdb
import os
from dotenv import load_dotenv

load_dotenv()

def wait_for_db():
    while True:
        try:
            MySQLdb.connect(
                host=os.getenv("MYSQL_HOST"),
                user=os.getenv("MYSQL_USER"),
                passwd=os.getenv("MYSQL_PASSWORD"),
                db=os.getenv("MYSQL_DATABASE"),
                port=int(os.getenv("MYSQL_PORT", 3306))
            )
            print("Database is ready!")
            break
        except MySQLdb.Error:
            print("Database is not ready. Waiting...")
            time.sleep(1)

if __name__ == "__main__":
    wait_for_db() 