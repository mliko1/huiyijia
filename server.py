import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder='.', static_url_path='')

SMTP_SERVER = 'smtp.163.com'
SMTP_PORT = 465
SMTP_USER = os.environ.get('SMTP_USER', 'sxljb2000@163.com')
SMTP_PASS = os.environ.get('SMTP_PASS', '')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get('name', '')
    email = data.get('email', '')
    subject = data.get('subject', '')
    message = data.get('message', '')

    if not name or not email or not message:
        return jsonify({'ok': False, 'msg': '请填写必填项'})

    body = f"""
公司网站收到新咨询：

姓名：{name}
邮箱：{email}
主题：{subject}
内容：{message}
"""

    msg = MIMEMultipart()
    msg['From'] = SMTP_USER
    msg['To'] = SMTP_USER
    msg['Subject'] = f'网站咨询 - {subject} - {name}'
    msg.attach(MIMEText(body, 'plain', 'utf-8'))

    try:
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(SMTP_USER, SMTP_USER, msg.as_string())
        server.quit()
        return jsonify({'ok': True, 'msg': '发送成功！'})
    except Exception as e:
        return jsonify({'ok': False, 'msg': f'发送失败：{str(e)}'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)
