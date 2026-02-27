from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_db
from emails import send_new_request_email, send_department_action_email, send_cleared_email
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow React frontend to talk to this backend

init_db()  # Create tables on startup

# ─── AUTH ────────────────────────────────────────────────────────────────────

@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    db = get_db()
    user = db.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        (data["email"], data["password"])
    ).fetchone()
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
    return jsonify(dict(user))


@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    db = get_db()
    existing = db.execute("SELECT id FROM users WHERE email = ?", (data["email"],)).fetchone()
    if existing:
        return jsonify({"error": "Email already registered"}), 400
    db.execute(
        "INSERT INTO users (email, password, role, name, studentId, program, year) VALUES (?,?,?,?,?,?,?)",
        (data["email"], data["password"], "student", data["name"], data["studentId"], data.get("program",""), data.get("year","1"))
    )
    db.commit()
    user = db.execute("SELECT * FROM users WHERE email = ?", (data["email"],)).fetchone()
    return jsonify(dict(user)), 201


# ─── REQUESTS ────────────────────────────────────────────────────────────────

@app.route("/api/requests", methods=["GET"])
def get_requests():
    db = get_db()
    rows = db.execute("SELECT * FROM requests ORDER BY submitted DESC").fetchall()
    result = []
    for row in rows:
        r = dict(row)
        r["depts"] = json.loads(r["depts"])
        result.append(r)
    return jsonify(result)


@app.route("/api/requests", methods=["POST"])
def create_request():
    data = request.json
    db = get_db()

    # Count existing requests to generate ID
    count = db.execute("SELECT COUNT(*) as c FROM requests").fetchone()["c"]
    req_id = f"CLR-{datetime.now().year}-{str(count + 1).zfill(3)}"

    depts = json.dumps({
        "library": "pending",
        "finance": "pending",
        "hostel": "pending",
        "academic": "pending",
        "ict": "pending"
    })

    today = datetime.now().strftime("%Y-%m-%d")

    db.execute(
        """INSERT INTO requests (id, studentId, student, program, year, session, reason, notes, status, submitted, depts)
           VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
        (req_id, data["studentId"], data["student"], data["program"],
         data["year"], data["session"], data["reason"], data.get("notes",""),
         "pending", today, depts)
    )
    db.commit()

    # Send real email to admin
    send_new_request_email(
        student_name=data["student"],
        student_id=data["studentId"],
        program=data["program"],
        reason=data["reason"],
        req_id=req_id
    )

    return jsonify({"id": req_id, "message": "Request submitted and admin notified"}), 201


@app.route("/api/requests/<req_id>/action", methods=["POST"])
def dept_action(req_id):
    """Department approves or rejects their part of a clearance"""
    data = request.json
    dept  = data["dept"]     # e.g. "library"
    action = data["action"]  # "approved" or "rejected"
    actor  = data.get("actor", "Department Officer")

    db = get_db()
    row = db.execute("SELECT * FROM requests WHERE id = ?", (req_id,)).fetchone()
    if not row:
        return jsonify({"error": "Request not found"}), 404

    req = dict(row)
    depts = json.loads(req["depts"])
    depts[dept] = action

    # Recompute overall status
    values = list(depts.values())
    if all(v == "approved" for v in values):
        new_status = "cleared"
    elif any(v == "rejected" for v in values):
        new_status = "rejected"
    elif any(v == "approved" for v in values):
        new_status = "inprogress"
    else:
        new_status = "pending"

    db.execute(
        "UPDATE requests SET depts = ?, status = ? WHERE id = ?",
        (json.dumps(depts), new_status, req_id)
    )
    db.commit()

    # Send email to student about the department action
    student = db.execute("SELECT * FROM users WHERE studentId = ?", (req["studentId"],)).fetchone()
    if student:
        send_department_action_email(
            student_email=student["email"],
            student_name=student["name"],
            dept_name=dept.capitalize(),
            action=action,
            req_id=req_id,
            actor=actor
        )
        # If fully cleared, send certificate-ready email
        if new_status == "cleared":
            send_cleared_email(
                student_email=student["email"],
                student_name=student["name"],
                req_id=req_id
            )

    return jsonify({"status": new_status, "depts": depts})


@app.route("/api/requests/reset", methods=["POST"])
def reset_data():
    """Admin only — reset all requests to seed data"""
    db = get_db()
    db.execute("DELETE FROM requests")
    db.commit()
    seed_requests(db)
    return jsonify({"message": "Data reset to defaults"})


# ─── HELPERS ─────────────────────────────────────────────────────────────────

def seed_requests(db):
    seed = [
        ("CLR-2025-001","STU/2021/0042","John Amara","BSc Computer Science","4","2024/2025","Graduation","","inprogress","2025-05-10",'{"library":"approved","finance":"approved","hostel":"pending","academic":"pending","ict":"pending"}'),
        ("CLR-2025-002","STU/2021/0067","Ama Owusu","BSc Accounting","4","2024/2025","Graduation","","pending","2025-05-12",'{"library":"pending","finance":"pending","hostel":"pending","academic":"pending","ict":"pending"}'),
        ("CLR-2025-003","STU/2020/0011","Kofi Asante","BA Economics","5","2024/2025","Transcript Request","Needed for NYSC.","cleared","2025-04-28",'{"library":"approved","finance":"approved","hostel":"approved","academic":"approved","ict":"approved"}'),
        ("CLR-2025-004","STU/2022/0093","Efua Mensah","BSc Engineering","3","2024/2025","Transfer","Transfer to KNUST.","rejected","2025-05-08",'{"library":"approved","finance":"rejected","hostel":"pending","academic":"pending","ict":"pending"}'),
        ("CLR-2025-005","STU/2021/0088","Samuel Darko","BSc IT","4","2024/2025","Graduation","","inprogress","2025-05-14",'{"library":"approved","finance":"pending","hostel":"approved","academic":"pending","ict":"approved"}'),
    ]
    for s in seed:
        db.execute("INSERT OR IGNORE INTO requests (id,studentId,student,program,year,session,reason,notes,status,submitted,depts) VALUES (?,?,?,?,?,?,?,?,?,?,?)", s)
    db.commit()


if __name__ == "__main__":
    print("🚀 ClearPath backend running at http://localhost:5000")
    app.run(debug=True, port=5000)