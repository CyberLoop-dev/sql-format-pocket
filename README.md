<p align="center"><img src="https://capsule-render.vercel.app/api?type=waving&color=0:111827,100:92400e&height=180&section=header&text=SQL%20Format%20Pocket&fontSize=38&fontColor=ffffff" width="100%" alt="SQL Format Pocket banner"></p>
<p align="center"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=19&pause=1000&color=FBBF24&center=true&vCenter=true&width=620&lines=Readable+SQL+from+your+terminal;Quoted+strings+and+comments+stay+intact" alt="Animated tagline"></p>
<p align="center"><img src="assets/mark.svg" width="100" alt="SQL formatter icon"></p>
<p align="center"><img src="https://img.shields.io/github/license/CyberLoop-dev/sql-format-pocket?style=flat-square" alt="License"><img src="https://img.shields.io/github/languages/top/CyberLoop-dev/sql-format-pocket?style=flat-square" alt="Language"><img src="https://img.shields.io/github/stars/CyberLoop-dev/sql-format-pocket?style=flat-square" alt="Stars"><img src="https://img.shields.io/github/last-commit/CyberLoop-dev/sql-format-pocket?style=flat-square" alt="Last commit"></p>

## 🧭 Overview
SQL Format Pocket is a small command-line formatter for common SQL statements. It tokenizes quoted strings and comments before formatting, so punctuation inside them is not treated as SQL syntax.

## ✨ Features
- 🧱 Format common SELECT, INSERT, UPDATE, and DELETE clauses.
- 🧵 Preserve single-quoted, double-quoted, and backtick-quoted text.
- 💬 Keep line and block comments intact.
- 🔍 Check whether a file is already formatted.
- 📝 Write a separate `.formatted.sql` file instead of overwriting the source.

## 🎬 Demo
No hosted demo is published. Try the included sample query from the terminal.

## 🚀 Quick Start
Requires Node.js 18 or newer.
```bash
npm start -- examples/query.sql
```
Pipe SQL through stdin:
```bash
cat examples/query.sql | npm start
```
Use `--write` to create a sibling formatted file, or `--check` to return a non-zero exit code when formatting changes are needed.

## 🧰 Tech Stack
- Node.js built-in modules
- JavaScript tokenizer and formatter
- No runtime dependencies

## 🗂️ Folder Structure
```text
sql-format-pocket/
├── assets/mark.svg
├── examples/query.sql
├── .gitignore
├── LICENSE
├── package.json
├── README.md
└── main.js
```

## 🗺️ Roadmap
- [ ] Add configurable keyword casing.
- [ ] Add dialect-specific formatting profiles.
- [ ] Add a compact output option.

## 🤝 Contributing
Contributions are welcome. Add examples for edge cases and keep quoted content unchanged.

## 📄 License
Released under the [MIT License](LICENSE).

<p align="center"><img src="https://capsule-render.vercel.app/api?type=waving&color=0:92400e,100:111827&height=100&section=footer" width="100%" alt="Footer wave"></p>