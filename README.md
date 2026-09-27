# 🚀 Learn2Invest v2 — Fixed Edition

## ✅ What's Fixed

| Feature | Status |
|---|---|
| Onboarding — full-screen sliding pages | ✅ Fixed |
| Font — Times New Roman everywhere | ✅ Fixed |
| Intermediate — ALL modules clickable | ✅ Fixed |
| Progress — capped at 100% | ✅ Fixed |
| Videos — dynamic loading from folder | ✅ Fixed |
| Quiz — loads from JSON, 10 questions | ✅ Fixed |
| Key Takeaways after each video | ✅ Fixed |
| Login/Logout — localStorage + Logout button | ✅ Fixed |

---

## 🏃 How to Run

```bash
npm install
npm run dev
```
Then open: http://localhost:5173

---

## 📁 Add Your Videos

Place MP4 files in:
```
public/content/beginner/videos/
  video1.mp4
  video2.mp4
  video3.mp4
  video4.mp4
  video5.mp4
```

---

## 📝 Edit Quizzes

Edit the quiz file at:
```
public/content/beginner/quizzes/quiz1.json
```

Each question format:
```json
{
  "id": "q1",
  "question": "Your question here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": 0,
  "hint": "A helpful hint",
  "explanation": "Explanation after answering",
  "emoji": "📊"
}
```

---

## 🎨 Customise Content

- **Videos**: Drop MP4 files into `public/content/beginner/videos/`
- **Quizzes**: Edit `public/content/beginner/quizzes/quiz1.json`
- **Key Takeaways**: Edit `src/screens/BeginnerLevel.jsx` → `VIDEO_FILES` array

---

## 🔑 Login System

- Register → choose level → login
- Data stored in localStorage
- Logout button top-right of navbar
- Auto-login on revisit
