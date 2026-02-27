import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import GMAIL_USER, GMAIL_APP_PASSWORD, ADMIN_EMAIL

def send_email(to_email, subject, html_body):
    """Core function to send an email via Gmail SMTP"""
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"ClearPath System <{GMAIL_USER}>"
        msg["To"]      = to_email

        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_USER, to_email, msg.as_string())

        print(f"✅ Email sent to {to_email}: {subject}")
        return True

    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
        return False


# ─── EMAIL TEMPLATES ─────────────────────────────────────────────────────────

def send_new_request_email(student_name, student_id, program, reason, req_id):
    """Sent to ADMIN when a student submits a new clearance request"""
    subject = f"📋 New Clearance Request — {req_id}"
    body = f"""
    <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;background:#f9f9f9;padding:24px;border-radius:10px;">
      <div style="background:#1a1a2e;padding:20px 24px;border-radius:8px;margin-bottom:20px;">
        <h2 style="color:#5b8df5;margin:0;">ClearPath</h2>
        <p style="color:#aaa;margin:4px 0 0;font-size:13px;">University Clearance System</p>
      </div>

      <h3 style="color:#333;">New Clearance Request Submitted</h3>
      <p style="color:#555;">A student has submitted a new clearance request that requires your attention.</p>

      <table style="width:100%;border-collapse:collapse;margin:16px 0;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
        <tr style="background:#f0f4ff;">
          <td style="padding:10px 14px;font-weight:bold;color:#555;width:40%;">Request ID</td>
          <td style="padding:10px 14px;color:#333;font-family:monospace;">{req_id}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold;color:#555;">Student Name</td>
          <td style="padding:10px 14px;color:#333;">{student_name}</td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:10px 14px;font-weight:bold;color:#555;">Student ID</td>
          <td style="padding:10px 14px;color:#333;font-family:monospace;">{student_id}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:bold;color:#555;">Program</td>
          <td style="padding:10px 14px;color:#333;">{program}</td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:10px 14px;font-weight:bold;color:#555;">Reason</td>
          <td style="padding:10px 14px;color:#333;">{reason}</td>
        </tr>
      </table>

      <p style="color:#555;">Please log in to the ClearPath system to review and process this request.</p>

      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;color:#999;font-size:12px;">
        This is an automated notification from ClearPath University Clearance System.
      </div>
    </div>
    """
    send_email(ADMIN_EMAIL, subject, body)


def send_department_action_email(student_email, student_name, dept_name, action, req_id, actor):
    """Sent to STUDENT when a department approves or rejects their request"""
    color   = "#4caf7d" if action == "approved" else "#e05c5c"
    icon    = "✅" if action == "approved" else "❌"
    subject = f"{icon} {dept_name} {action.capitalize()} Your Clearance — {req_id}"

    body = f"""
    <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;background:#f9f9f9;padding:24px;border-radius:10px;">
      <div style="background:#1a1a2e;padding:20px 24px;border-radius:8px;margin-bottom:20px;">
        <h2 style="color:#5b8df5;margin:0;">ClearPath</h2>
        <p style="color:#aaa;margin:4px 0 0;font-size:13px;">University Clearance System</p>
      </div>

      <h3 style="color:#333;">Clearance Update for {req_id}</h3>
      <p style="color:#555;">Dear <strong>{student_name}</strong>,</p>
      <p style="color:#555;">Your clearance request has been updated by <strong>{dept_name}</strong>.</p>

      <div style="background:{color}22;border:1px solid {color}55;border-radius:8px;padding:14px 18px;margin:16px 0;">
        <p style="margin:0;color:{color};font-weight:bold;font-size:15px;">
          {icon} {dept_name} has <strong>{action}</strong> your clearance
        </p>
        <p style="margin:6px 0 0;color:#555;font-size:13px;">Processed by: {actor}</p>
      </div>

      <p style="color:#555;">Log in to ClearPath to check your full clearance progress and the status of remaining departments.</p>

      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;color:#999;font-size:12px;">
        This is an automated notification from ClearPath University Clearance System.
      </div>
    </div>
    """
    send_email(student_email, subject, body)


def send_cleared_email(student_email, student_name, req_id):
    """Sent to STUDENT when ALL departments have approved — fully cleared"""
    subject = f"🎉 You Are Fully Cleared! — {req_id}"
    body = f"""
    <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;background:#f9f9f9;padding:24px;border-radius:10px;">
      <div style="background:#1a1a2e;padding:20px 24px;border-radius:8px;margin-bottom:20px;">
        <h2 style="color:#5b8df5;margin:0;">ClearPath</h2>
        <p style="color:#aaa;margin:4px 0 0;font-size:13px;">University Clearance System</p>
      </div>

      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:48px;margin-bottom:12px;">🎓</div>
        <h2 style="color:#4caf7d;margin:0;">Congratulations, {student_name}!</h2>
        <p style="color:#555;margin-top:8px;">Your clearance request <strong style="font-family:monospace;">{req_id}</strong> has been <strong>fully approved</strong> by all departments.</p>
      </div>

      <div style="background:#4caf7d22;border:1px solid #4caf7d55;border-radius:8px;padding:14px 18px;margin:16px 0;">
        <p style="margin:0;color:#4caf7d;font-weight:bold;">✅ All departments have cleared you</p>
        <p style="margin:6px 0 0;color:#555;font-size:13px;">You may now log in to download your official clearance certificate.</p>
      </div>

      <p style="color:#555;">Please log in to ClearPath and go to your clearance request to download your certificate.</p>

      <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e0e0e0;color:#999;font-size:12px;">
        This is an automated notification from ClearPath University Clearance System.
      </div>
    </div>
    """
    send_email(student_email, subject, body)