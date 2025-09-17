# 🗺️ AI Trip Planner

AI Trip Planner is a web application built with **React (Vite)** and **Firebase** that helps users plan their trips intelligently with AI assistance.  
It provides a smooth, responsive interface and uses Firebase for authentication, database, and hosting.  

---

## 🚀 Features
- 🔐 **Authentication** with Firebase (Google login support)
- 🤖 **AI-powered trip planning** for personalized itineraries
- 💾 **Cloud storage & database** with Firebase
- ⚡ **Fast development** powered by Vite + React
- 📱 **Responsive UI** for mobile and desktop
- ☁️ **Firebase hosting** for easy deployment

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TailwindCSS
- **Backend/Services:** Firebase (Auth, Firestore, Hosting, Storage)
- **AI Integration:** OpenAI / API-based trip recommendations
- **Tooling:** ESLint, Prettier

---

## 📂 Project Structure
```bash
AI-Trip-Planner/
├── public/ # Static assets
├── src/ # Main application code
│ ├── components/ # Reusable UI components
│ ├── pages/ # App pages (Home, Planner, etc.)
│ ├── services/ # Firebase & API services
│ ├── App.jsx # Root component
│ └── main.jsx # App entry point
├── .env # Environment variables (not committed)
├── .gitignore
├── package.json
└── vite.config.js
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/14anshuman/AI-Trip-Planner.git
   cd AI-Trip-Planner
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Setup Firebase and Google Maps Environment Variables**
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_GOOGLE_MAP_API_KEY=your_api_key
   ```
5. **Run the development server**
  ```bash
     npm run dev
  ```
5. **Build for production**
  ```bash
     npm run build
  ```
5. **Deploy to Firebase Hosting**
  ```bash
     firebase deploy
  ```

## 🤝 Contributing
  Contributions, issues, and feature requests are welcome!
  Feel free to fork this repo and submit a PR.
