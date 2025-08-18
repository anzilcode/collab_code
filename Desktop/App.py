import sys
import subprocess
from PyQt5.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout, QMessageBox, QFormLayout, QFrame
from PyQt5.QtGui import QFont, QIcon
from PyQt5.QtCore import Qt
from RIM import RIMWindow

PASTEBIN_URL = "https://pastebin.com/raw/ZUVSE3sG"

def fetch_data():
    try:
        result = subprocess.check_output(["curl", "-s", PASTEBIN_URL], text=True)
        lines = result.strip().split("\n")
        data = []
        for line in lines:
            if not line.startswith("#"):
                parts = line.split(",")
                if len(parts) == 4:
                    data.append({
                        "licence_key": parts[0],
                        "activation_status": parts[1],
                        "email": parts[2],
                        "password": parts[3]
                    })
        return data
    except Exception:
        return []

class AuthApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("🔐 User Authentication")
        self.setGeometry(500, 200, 450, 320)
        self.setStyleSheet("background-color: #1e1e2f; color: white;")
        self.setWindowIcon(QIcon.fromTheme("dialog-password"))
        title_font = QFont("Segoe UI", 18, QFont.Bold)
        label_font = QFont("Segoe UI", 11)
        layout = QVBoxLayout()
        title = QLabel("Project - Authentication")
        title.setFont(title_font)
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("color: #00c8ff;")
        layout.addWidget(title)
        line = QFrame()
        line.setFrameShape(QFrame.HLine)
        line.setFrameShadow(QFrame.Sunken)
        line.setStyleSheet("color: #444;")
        layout.addWidget(line)
        form_layout = QFormLayout()
        self.licence_entry = QLineEdit()
        self.licence_entry.setPlaceholderText("Enter Licence Key")
        self.licence_entry.setFont(label_font)
        self.licence_entry.setStyleSheet("padding: 6px; border: 1px solid #555; border-radius: 6px; background: #2a2a40; color: white;")
        form_layout.addRow("🔑 Licence Key:", self.licence_entry)
        self.email_entry = QLineEdit()
        self.email_entry.setPlaceholderText("Enter Email")
        self.email_entry.setFont(label_font)
        self.email_entry.setStyleSheet("padding: 6px; border: 1px solid #555; border-radius: 6px; background: #2a2a40; color: white;")
        form_layout.addRow("📧 Email:", self.email_entry)
        self.pass_entry = QLineEdit()
        self.pass_entry.setPlaceholderText("Enter Password")
        self.pass_entry.setEchoMode(QLineEdit.Password)
        self.pass_entry.setFont(label_font)
        self.pass_entry.setStyleSheet("padding: 6px; border: 1px solid #555; border-radius: 6px; background: #2a2a40; color: white;")
        form_layout.addRow("🔒 Password:", self.pass_entry)
        layout.addLayout(form_layout)
        login_btn = QPushButton("Login")
        login_btn.setFont(QFont("Segoe UI", 12, QFont.Bold))
        login_btn.setStyleSheet("""
            QPushButton {background-color: #00c853; color: white; padding: 10px; border-radius: 8px;}
            QPushButton:hover {background-color: #00e676;}
            QPushButton:pressed {background-color: #00a152;}
        """)
        login_btn.clicked.connect(self.validate)
        layout.addWidget(login_btn, alignment=Qt.AlignCenter)
        self.setLayout(layout)
    def validate(self):
        user_email = self.email_entry.text().strip()
        user_pass = self.pass_entry.text().strip()
        licence = self.licence_entry.text().strip()
        records = fetch_data()
        for rec in records:
            if rec["email"] == user_email and rec["password"] == user_pass and rec["licence_key"] == licence:
                if rec["activation_status"] == "1":
                    QMessageBox.information(self, "Success", "✅ Authentication Successful!")
                    self.rim = RIMWindow()
                    self.rim.show()
                    self.hide()

                    return
                else:
                    QMessageBox.warning(self, "Inactive", "⚠ Licence not activated.")
                    return
        QMessageBox.critical(self, "Failed", "❌ Invalid credentials.")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = AuthApp()
    window.show()
    sys.exit(app.exec_())
