# 🎓 Skillify - Full Stack Learning Management System

Skillify is a robust, full-stack **Learning Management System (LMS)** designed to empower learners, instructors, and admins with a seamless digital education platform. It features secure authentication, real-time interactions, and a powerful dashboard-driven admin panel.

> 🚀 Built with scalable architecture, real-time updates, and AI-assisted tools.

---

## 🧩 Key Features

### 👩‍🎓 Students

- Browse & explore available courses
- Secure course enrollment & **Razorpay** payment integration
- Leave course reviews & ratings
- Track personal course progress in real-time
- Participate in quizzes & live sessions

### 👨‍🏫 Instructors

- Create, edit, and manage courses with **video (AWS S3)** and **image (Cloudinary)** support
- Host live sessions & interact via real-time messaging (**Socket.IO**)
- Create quizzes, offer discount coupons
- Track earnings and student engagement metrics

### 🛡 Admin

- Full-featured **Admin Dashboard** with:
  - User analytics
  - Revenue reports
  - Course management & moderation

---

## 🔐 Authentication & Security

- Role-Based Access Control (**RBAC**) – Separate routes & permissions for Students, Instructors, Admin
- Email verification during signup
- **Google OAuth 2.0** for instant login/signup
- JWT-based secure sessions

---

## 🛠 Tech Stack

| Layer      | Tech Used                            |
| ---------- | ------------------------------------ |
| Frontend   | React.js, Tailwind CSS, Redux        |
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB + Mongoose                   |
| Real-time  | Socket.IO                            |
| Auth       | JWT, Google OAuth, Email Verify      |
| Payments   | Razorpay                             |
| Media      | AWS S3 (videos), Cloudinary (images) |
| AI Bot     | Gemini (Google AI Integration)       |
| Deployment | Vercel (frontend), Render (backend)  |

---

## 🔴 Live Features

- ✅ Real-time progress tracking
- ✅ Real-time messaging/chat between students & instructors
- ✅ Admin can ban/unban users & moderate content
- ✅ AI-powered chatbot using **Gemini API**

---

## 📈 Future Enhancements

- ✅ Push notifications
- ✅ AI-generated quiz content
- ✅ Leaderboards & gamification
- ✅ Public API for third-party integration
- 🔐 Crypto payment gateway integration (e.g. USDT, Ethereum)
- 🧠 Real-time AI-based exam proctoring system with face detection & cheating prevention

## 📂 Folder Structure

```bash
skillify/
├── frontend/      # React app with routing & views
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── admin/
│       ├── instructor/
│       └── student/
├── backend/       # Express server, routes & controllers
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middlewares/
```
