import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "clearpath.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # lets us access columns by name like dict
    return conn

def init_db():
    db = get_db()

    # Users table
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            email     TEXT UNIQUE NOT NULL,
            password  TEXT NOT NULL,
            role      TEXT NOT NULL DEFAULT 'student',
            name      TEXT NOT NULL,
            studentId TEXT,
            staffId   TEXT,
            program   TEXT,
            year      TEXT,
            dept      TEXT
        )
    """)

    # Requests table
    db.execute("""
        CREATE TABLE IF NOT EXISTS requests (
            id         TEXT PRIMARY KEY,
            studentId  TEXT NOT NULL,
            student    TEXT NOT NULL,
            program    TEXT,
            year       TEXT,
            session    TEXT,
            reason     TEXT,
            notes      TEXT,
            status     TEXT DEFAULT 'pending',
            submitted  TEXT,
            depts      TEXT  -- stored as JSON string
        )
    """)

    db.commit()

    # Seed users if table is empty
    count = db.execute("SELECT COUNT(*) as c FROM users").fetchone()["c"]
    if count == 0:
        seed_users(db)

    db.close()


def seed_users(db):
    users = [
        ("john@uni.edu",    "student123", "student",    "John Amara",     "STU/2021/0042", None,      "BSc Computer Science", "4", None),
        ("ama@uni.edu",     "student123", "student",    "Ama Owusu",      "STU/2021/0067", None,      "BSc Accounting",       "4", None),
        ("kofi@uni.edu",    "student123", "student",    "Kofi Asante",    "STU/2020/0011", None,      "BA Economics",         "5", None),
        ("efua@uni.edu",    "student123", "student",    "Efua Mensah",    "STU/2022/0093", None,      "BSc Engineering",      "3", None),
        ("samuel@uni.edu",  "student123", "student",    "Samuel Darko",   "STU/2021/0088", None,      "BSc IT",               "4", None),
        ("admin@uni.edu",   "admin123",   "admin",      "Dr. F. Osei",    None,            "ADM/001", None,                   None, None),
        ("library@uni.edu", "library123", "department", "Mrs. A. Mensah", None,            "DEP/LIB", None,                   None, "library"),
        ("finance@uni.edu", "finance123", "finance",    "Mr. K. Boateng", None,            "FIN/003", None,                   None, "finance"),
        ("hostel@uni.edu",  "hostel123",  "department", "Mr. T. Annan",   None,            "DEP/HOS", None,                   None, "hostel"),
        ("academic@uni.edu","academic123","department", "Dr. A. Kumi",    None,            "DEP/ACA", None,                   None, "academic"),
        ("ict@uni.edu",     "ict123",     "department", "Ms. B. Asare",   None,            "DEP/ICT", None,                   None, "ict"),
    ]
    db.executemany(
        "INSERT OR IGNORE INTO users (email,password,role,name,studentId,staffId,program,year,dept) VALUES (?,?,?,?,?,?,?,?,?)",
        users
    )
    db.commit()