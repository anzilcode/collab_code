import sys
from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QSplitter, QFrame, QTextEdit, QPlainTextEdit, QToolButton, QLineEdit,
    QGroupBox
)
from PyQt5.QtGui import QFont, QIcon, QSyntaxHighlighter, QTextCharFormat
from PyQt5.QtCore import Qt, QRegularExpression

class PythonHighlighter(QSyntaxHighlighter):
    def __init__(self, document):
        super().__init__(document)
        self.rules = []
        def fmt(weight=None, italic=False):
            f = QTextCharFormat()
            if weight: f.setFontWeight(weight)
            if italic: f.setFontItalic(True)
            return f
        kw = fmt()
        kw.setForeground(Qt.cyan)
        keywords = [
            'and','as','assert','break','class','continue','def','del','elif','else','except','False','finally',
            'for','from','global','if','import','in','is','lambda','None','nonlocal','not','or','pass','raise',
            'return','True','try','while','with','yield'
        ]
        for w in keywords:
            self.rules.append((QRegularExpression(fr"\\b{w}\\b"), kw))
        string_fmt = fmt()
        string_fmt.setForeground(Qt.green)
        self.rules.append((QRegularExpression(r"'[^'\\n]*'"), string_fmt))
        self.rules.append((QRegularExpression(r'"[^"\\n]*"'), string_fmt))
        num_fmt = fmt()
        num_fmt.setForeground(Qt.magenta)
        self.rules.append((QRegularExpression(r"\\b[0-9]+(\\.[0-9]+)?\\b"), num_fmt))
        comment_fmt = fmt(italic=True)
        comment_fmt.setForeground(Qt.gray)
        self.rules.append((QRegularExpression(r"#.*$"), comment_fmt))
    def highlightBlock(self, text):
        for rx, fmt in self.rules:
            it = rx.globalMatch(text)
            while it.hasNext():
                m = it.next()
                self.setFormat(m.capturedStart(), m.capturedLength(), fmt)

class CodeEditor(QPlainTextEdit):
    def __init__(self):
        super().__init__()
        self.setFont(QFont('JetBrains Mono', 11))
        self.setStyleSheet("background:#141422;color:#e7e7ff;border:1px solid #2f2f4a;border-radius:10px;padding:8px;")
        PythonHighlighter(self.document())
        self.setPlaceholderText("# Start coding here...\n# The interviewer sees this live.")

class VideoPanel(QFrame):
    def __init__(self):
        super().__init__()
        self.setStyleSheet("QFrame{background:#10101a;border:1px solid #2f2f4a;border-radius:12px}")
        lay = QVBoxLayout(self)
        title = QLabel("Video Feed")
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("color:#9aa4ff;font-weight:600")
        video = QLabel("\n\n📹  Video Stream Placeholder\n\n")
        video.setAlignment(Qt.AlignCenter)
        video.setStyleSheet("color:#bcbcdc")
        ctrls = QHBoxLayout()
        for text, icon in [("Call", "call"),("Video", "camera-video"),("Mute", "audio-volume-muted"),("End", "process-stop")]:
            b = QToolButton()
            b.setText(text)
            b.setIcon(QIcon.fromTheme(icon))
            b.setToolButtonStyle(Qt.ToolButtonTextUnderIcon)
            b.setStyleSheet("QToolButton{background:#1b1b2e;border:1px solid #2f2f4a;border-radius:8px;padding:6px;color:white}QToolButton:hover{background:#242444}")
            ctrls.addWidget(b)
        lay.addWidget(title)
        lay.addWidget(video,1)
        lay.addLayout(ctrls)

class ChatPanel(QFrame):
    def __init__(self):
        super().__init__()
        self.setStyleSheet("QFrame{background:#10101a;border:1px solid #2f2f4a;border-radius:12px}")
        v = QVBoxLayout(self)
        head = QLabel("Call & Chat")
        head.setStyleSheet("color:#9aa4ff;font-weight:600")
        self.history = QTextEdit()
        self.history.setReadOnly(True)
        self.history.setStyleSheet("background:#141422;color:#e7e7ff;border:1px solid #2f2f4a;border-radius:8px")
        row = QHBoxLayout()
        self.entry = QLineEdit()
        self.entry.setPlaceholderText("Type message…")
        self.entry.setStyleSheet("background:#1b1b2e;color:#e7e7ff;border:1px solid #2f2f4a;border-radius:8px;padding:6px")
        send = QPushButton("Send")
        send.setStyleSheet("QPushButton{background:#4f46e5;color:white;border:none;border-radius:8px;padding:8px 14px}QPushButton:hover{background:#6366f1}")
        send.clicked.connect(self._send)
        row.addWidget(self.entry,1)
        row.addWidget(send)
        v.addWidget(head)
        v.addWidget(self.history,1)
        v.addLayout(row)
    def _send(self):
        text = self.entry.text().strip()
        if not text: return
        self.history.append(f"<b>You:</b> {text}")
        self.entry.clear()

class RIMWindow(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("RIM — Interview Manager")
        self.resize(1200, 700)
        self.setStyleSheet("background:#0c0c14;color:white")
        root = QVBoxLayout(self)
        top = QHBoxLayout()
        title = QLabel("RIM • Live Interview Suite")
        title.setStyleSheet("color:#00c8ff;font-size:20px;font-weight:700")
        top.addWidget(title)
        top.addStretch(1)
        actions = QHBoxLayout()
        for name in ["New Room","Invite","Settings"]:
            btn = QPushButton(name)
            btn.setStyleSheet("QPushButton{background:#1b1b2e;color:white;border:1px solid #2f2f4a;border-radius:8px;padding:8px 12px}QPushButton:hover{background:#242444}")
            actions.addWidget(btn)
        top.addLayout(actions)
        root.addLayout(top)
        split_h = QSplitter()
        split_h.setStyleSheet("QSplitter::handle{background:#0f0f1b}")
        left = QSplitter(Qt.Vertical)
        left_top = VideoPanel()
        left_bottom = ChatPanel()
        left.addWidget(left_top)
        left.addWidget(left_bottom)
        left.setSizes([500,200])
        editor_box = QGroupBox("Code Area )")
        editor_box.setStyleSheet("QGroupBox{border:1px solid #2f2f4a;border-radius:12px;margin-top:12px;padding-top:16px}QGroupBox:title{color:#9aa4ff;subcontrol-origin:margin;subcontrol-position:top left;padding:0 6px}")
        vbox = QVBoxLayout(editor_box)
        self.editor = CodeEditor()
        vbox.addWidget(self.editor)
        split_h.addWidget(left)
        split_h.addWidget(editor_box)
        split_h.setSizes([450, 750])
        root.addWidget(split_h,1)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    w = RIMWindow()
    w.show()
    sys.exit(app.exec_())
