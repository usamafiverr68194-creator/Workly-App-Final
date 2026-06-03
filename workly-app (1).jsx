import { useState, useEffect, useRef } from "react";

// ─── DATA STORE (in-memory, simulates a backend) ───────────────────────────
const DB = {
  users: [
    { id: 1, name: "Admin User", email: "admin@workly.com", phone: "+1-555-0001", role: "super_admin", password: "admin123", status: "active", avatar: "AU", joined: "2024-01-01", address: "HQ, New York" },
    { id: 2, name: "Sarah Johnson", email: "sarah@workly.com", phone: "+1-555-0101", role: "team_lead", password: "pass123", status: "active", avatar: "SJ", joined: "2024-02-15", address: "Brooklyn, NY", rating: 4.8, totalJobs: 24, totalHours: 192, totalIncome: 4800 },
    { id: 3, name: "Marcus Rivera", email: "marcus@workly.com", phone: "+1-555-0102", role: "worker", password: "pass123", status: "active", avatar: "MR", joined: "2024-03-10", address: "Queens, NY", rating: 4.5, totalJobs: 18, totalHours: 144, totalIncome: 3600, teamLead: 2 },
    { id: 4, name: "Aisha Patel", email: "aisha@workly.com", phone: "+1-555-0103", role: "worker", password: "pass123", status: "active", avatar: "AP", joined: "2024-03-20", address: "Bronx, NY", rating: 4.9, totalJobs: 31, totalHours: 248, totalIncome: 6200, teamLead: 2 },
    { id: 5, name: "Tom Chen", email: "tom@workly.com", phone: "+1-555-0104", role: "worker", password: "pass123", status: "suspended", avatar: "TC", joined: "2024-04-01", address: "Manhattan, NY", rating: 3.2, totalJobs: 8, totalHours: 64, totalIncome: 1600 },
  ],
  jobs: [
    { id: 1, title: "Warehouse Inventory Count", category: "Logistics", address: "123 Commerce St, Brooklyn", wage: 22, type: "Hourly", status: "active", description: "Count and verify warehouse inventory across 3 floors. Safety equipment provided.", duration: "8 hours", created: "2025-06-01", due: "2025-06-10", image: "📦", assignedTo: [3, 4], applicants: [3, 4, 5], views: 45 },
    { id: 2, title: "Event Setup & Breakdown", category: "Events", address: "Madison Square Garden, NY", wage: 25, type: "Hourly", status: "active", description: "Setup and breakdown of corporate event. Heavy lifting required.", duration: "6 hours", created: "2025-06-02", due: "2025-06-08", image: "🎪", assignedTo: [3], applicants: [3], views: 32 },
    { id: 3, title: "Office Cleaning Crew", category: "Cleaning", address: "456 5th Ave, Manhattan", wage: 18, type: "Hourly", status: "completed", description: "Deep clean of 10-floor office building.", duration: "10 hours", created: "2025-05-20", due: "2025-05-25", image: "🧹", assignedTo: [4, 5], applicants: [4, 5], views: 28 },
    { id: 4, title: "Food Delivery Driver", category: "Delivery", address: "Various Locations, Queens", wage: 20, type: "Hourly", status: "active", description: "Food delivery across Queens district. Own vehicle preferred.", duration: "8 hours", created: "2025-06-03", due: "2025-06-15", image: "🚗", assignedTo: [], applicants: [5], views: 67 },
    { id: 5, title: "Security Guard - Night Shift", category: "Security", address: "78 Industrial Blvd, Bronx", wage: 28, type: "Full-Time", status: "draft", description: "Overnight security for industrial facility. Certification required.", duration: "12 hours", created: "2025-06-03", due: "2025-06-30", image: "🔒", assignedTo: [], applicants: [], views: 0 },
  ],
  tasks: [
    { id: 1, jobId: 1, title: "Floor 1 Count", workerId: 3, status: "in_progress", timeLeft: "3h 20m", pinned: true, checkpoint: 60 },
    { id: 2, jobId: 1, title: "Floor 2 Count", workerId: 4, status: "completed", timeLeft: "Done", pinned: false, checkpoint: 100 },
    { id: 3, jobId: 2, title: "Stage Setup", workerId: 3, status: "pending", timeLeft: "6h 00m", pinned: false, checkpoint: 0 },
  ],
  messages: [
    { id: 1, from: 3, to: 1, text: "Hi, I have a question about the warehouse job.", time: "10:30 AM", type: "text", read: false },
    { id: 2, from: 1, to: 3, text: "Sure Marcus! What would you like to know?", time: "10:32 AM", type: "text", read: true },
    { id: 3, from: 3, to: 1, text: "What safety equipment is provided?", time: "10:35 AM", type: "text", read: false },
    { id: 4, from: 4, to: 1, text: "Job completed! All 248 items counted.", time: "2:15 PM", type: "text", read: false },
  ],
  guides: [
    { id: 1, type: "article", title: "Safety Manual 2025", category: "Safety", views: 124, content: "Always wear PPE. Follow all safety protocols..." },
    { id: 2, type: "article", title: "Work Instructions Guide", category: "Operations", views: 89, content: "Report to supervisor on arrival. Sign in using the app..." },
    { id: 3, type: "video", title: "Onboarding Video", category: "Training", views: 203, url: "https://youtube.com/embed/dQw4w9WgXcQ" },
    { id: 4, type: "article", title: "Health & Safety FAQ", category: "Safety", views: 67, content: "Q: What do I do in an emergency? A: Call 911 then notify admin..." },
  ],
  activityLogs: [
    { id: 1, userId: 3, action: "Applied for job: Warehouse Inventory", module: "Jobs", time: "2025-06-03 09:15" },
    { id: 2, userId: 4, action: "Completed task: Floor 2 Count", module: "Tasks", time: "2025-06-03 11:30" },
    { id: 3, userId: 2, action: "Assigned job to Marcus Rivera", module: "Management", time: "2025-06-03 08:00" },
    { id: 4, userId: 1, action: "Created job: Security Guard Night Shift", module: "Jobs", time: "2025-06-03 07:45" },
  ],
  profileRequests: [],
  locationLogs: [],
  workSessions: [],
  guestIssues: [],
  earnings: [
    { id: 1, workerId: 3, jobId: 1, taskTitle: "Floor 1 Count — Warehouse Inventory", amount: 176, hours: 8, date: "2025-05-28", approvedBy: null, status: "pending", payoutStatus: "pending", approvedAt: null },
    { id: 2, workerId: 3, jobId: 2, taskTitle: "Stage Setup — Event Breakdown", amount: 150, hours: 6, date: "2025-05-20", approvedBy: 1, status: "approved", payoutStatus: "received", approvedAt: "2025-05-22 10:00", paidAt: "2025-05-24" },
    { id: 3, workerId: 3, jobId: 4, taskTitle: "Food Delivery Driver — Queens", amount: 160, hours: 8, date: "2025-06-01", approvedBy: 1, status: "approved", payoutStatus: "pending", approvedAt: "2025-06-02 09:30", paidAt: null },
    { id: 4, workerId: 4, jobId: 1, taskTitle: "Floor 2 Count — Warehouse Inventory", amount: 176, hours: 8, date: "2025-05-28", approvedBy: 1, status: "approved", payoutStatus: "received", approvedAt: "2025-05-29 11:00", paidAt: "2025-05-31" },
    { id: 5, workerId: 4, jobId: 3, taskTitle: "Office Cleaning Crew", amount: 180, hours: 10, date: "2025-05-25", approvedBy: null, status: "pending", payoutStatus: "pending", approvedAt: null },
    { id: 6, workerId: 5, jobId: 3, taskTitle: "Office Cleaning — Floor 3", amount: 180, hours: 10, date: "2025-05-25", approvedBy: null, status: "rejected", payoutStatus: "pending", approvedAt: null },
  ],
  marquees: [
    { id: 1, text: "🚨 URGENT: All workers must submit timesheets by 5PM today!", active: true, priority: "urgent", createdBy: 1, createdAt: "2025-06-03 08:00", speed: 40 },
  ],
  bulkMessages: [],
  passwordRequests: [],
};

// ─── STYLES ────────────────────────────────────────────────────────────────
const S = {
  // Colors
  primary: "#1a1a2e",
  accent: "#e94560",
  accentLight: "#ff6b81",
  success: "#00b894",
  warning: "#fdcb6e",
  danger: "#e17055",
  info: "#0984e3",
  bg: "#f8f9fd",
  cardBg: "#ffffff",
  sidebarBg: "#1a1a2e",
  sidebarText: "#a8b2d8",
  sidebarActive: "#e94560",
  border: "#e8eaf0",
  text: "#1a1a2e",
  textMuted: "#8892b0",
};

const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body, #root { font-family: 'DM Sans', sans-serif; background: #f8f9fd; color: #1a1a2e; min-height: 100vh; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
  input, select, textarea { outline: none; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  .fade-in { animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .slide-in { animation: slideIn 0.25s ease; }
  @keyframes slideIn { from { transform: translateX(-10px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  .marquee-track { display: flex; width: max-content; animation: marqueeScroll linear infinite; }
  @keyframes marqueeScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .marquee-urgent { background: linear-gradient(90deg, #c0392b, #e74c3c, #c0392b); }
  .marquee-info    { background: linear-gradient(90deg, #0984e3, #74b9ff, #0984e3); }
  .marquee-normal  { background: linear-gradient(90deg, #1a1a2e, #2d3561, #1a1a2e); }
`;

// ─── HELPER COMPONENTS ─────────────────────────────────────────────────────
const Avatar = ({ initials, size = 36, color = S.accent }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: color + "22", border: `2px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: size * 0.35, color, flexShrink: 0 }}>
    {initials}
  </div>
);

const Badge = ({ label, color = S.accent }) => (
  <span style={{ background: color + "18", color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, letterSpacing: 0.3 }}>{label}</span>
);

const StatusBadge = ({ status }) => {
  const map = { active: [S.success, "Active"], completed: [S.info, "Completed"], cancelled: [S.danger, "Cancelled"], draft: [S.textMuted, "Draft"], suspended: [S.warning, "Suspended"], pending: [S.warning, "Pending"], in_progress: [S.info, "In Progress"] };
  const [color, label] = map[status] || [S.textMuted, status];
  return <Badge label={label} color={color} />;
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} className="fade-in" style={{ background: S.cardBg, borderRadius: 16, border: `1px solid ${S.border}`, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", cursor: onClick ? "pointer" : "default", transition: "box-shadow 0.2s, transform 0.2s", ...style }}
    onMouseEnter={e => onClick && (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)")}
    onMouseLeave={e => onClick && (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)")}>
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", style = {}, disabled = false }) => {
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "10px 20px", fontSize: 14 }, lg: { padding: "13px 28px", fontSize: 15 } };
  const variants = {
    primary: { background: S.accent, color: "#fff", border: "none" },
    outline: { background: "transparent", color: S.accent, border: `1.5px solid ${S.accent}` },
    ghost: { background: "transparent", color: S.textMuted, border: `1.5px solid ${S.border}` },
    danger: { background: S.danger, color: "#fff", border: "none" },
    success: { background: S.success, color: "#fff", border: "none" },
  };
  return (
    <button disabled={disabled} onClick={onClick} style={{ ...variants[variant], ...sizes[size], borderRadius: 10, fontWeight: 600, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.2s, transform 0.15s", opacity: disabled ? 0.5 : 1, ...style }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.opacity = "0.85")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, required, icon }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ fontSize: 13, fontWeight: 600, color: S.textMuted, display: "block", marginBottom: 6, letterSpacing: 0.3 }}>{label}{required && <span style={{ color: S.accent }}>*</span>}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>{icon}</span>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: icon ? "11px 14px 11px 36px" : "11px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: S.text, background: S.bg, transition: "border 0.2s" }}
        onFocus={e => e.target.style.border = `1.5px solid ${S.accent}`}
        onBlur={e => e.target.style.border = `1.5px solid ${S.border}`} />
    </div>
  </div>
);

const Modal = ({ title, children, onClose, width = 520 }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
    <div className="fade-in" style={{ background: S.cardBg, borderRadius: 20, padding: 32, width: "100%", maxWidth: width, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: S.text }}>{title}</h2>
        <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: S.bg, fontSize: 16, color: S.textMuted }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({ msg, type = "success" }) => (
  <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: type === "success" ? S.success : type === "error" ? S.danger : S.info, color: "#fff", padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }} className="fade-in">
    {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"} {msg}
  </div>
);

const StatCard = ({ label, value, icon, color = S.accent, trend }) => (
  <Card style={{ padding: "20px 24px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: S.textMuted, letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 700, color: S.text, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
        {trend && <p style={{ fontSize: 12, color: S.success, marginTop: 4 }}>↑ {trend}</p>}
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{icon}</div>
    </div>
  </Card>
);

// ─── AUTH SCREENS ──────────────────────────────────────────────────────────
// ─── TRANSLATIONS ──────────────────────────────────────────────────────────
const LANGS = {
  en: {
    code: "en", label: "English", flag: "🇬🇧", dir: "ltr",
    t: {
      welcome: "Welcome back", signIn: "Sign in to your account",
      emailPhone: "Email or Phone", enterEmail: "Enter your email",
      password: "Password", enterPassword: "Enter your password",
      forgotPass: "Forgot password?", signInBtn: "Sign In",
      signingIn: "Signing in...", biometric: "Login with Biometric",
      demoAccounts: "DEMO ACCOUNTS", suspended: "Account suspended. Contact admin.",
      invalidCreds: "Invalid credentials. Try again.",
      contactAdmin: "Contact Admin", needHelp: "Need help signing in?",
      platform1: "Job Posting & Assignment", platform2: "Team & Worker Management",
      platform3: "Real-Time Analytics", platform4: "Integrated Communications",
      platformDesc: "Your complete workforce management platform. Manage jobs, tasks, and teams — all in one place.",
      chooseLanguage: "Choose Language",
      // worker UI
      home: "Home", applyJobs: "Apply Jobs", chatAdmin: "Chat with Admin",
      watchGuides: "Watch Guides", myProfile: "My Profile", ratingsPortfolio: "Ratings & Portfolio",
      activeJobs: "Active Jobs", activeWorkers: "Active Workers", completedJobs: "Completed Jobs",
      unreadMessages: "Unread Messages", recentJobs: "Recent Jobs", topWorkers: "Top Workers",
      onWork: "ON WORK — TIME RUNNING", clockOut: "Clock Out", justBrowsing: "Just Browsing",
      imWorking: "I'm Working", timerStarts: "Timer starts now", noTimer: "No timer",
      allowLocation: "Allow Location Access", gettingLocation: "Getting location...",
      locationInfo: "WORKLY would like to access your location to verify your work sessions.",
      skipBrowsing: "Skip — just browsing", whatDoing: "What are you doing right now?",
      available: "Available", online: "Online",
      sendRequest: "Request →", pendingApproval: "Your request is sent to admin — changes will apply once approved.",
      profileInfo: "Profile Information", exportData: "Export My Data",
      profileNotice: "Your profile details can only be updated by an administrator. Submit a change request and admin will review and approve it.",
      myChangeRequests: "My Change Requests", submitted: "Pending", approved: "Approved", rejected: "Rejected",
      fullName: "Full Name", emailAddress: "Email Address", phoneNumber: "Phone Number", homeAddress: "Home Address",
      myEarnings: "My Earnings", guestHelp: "Need help?", guestCallAdmin: "Call Admin Support", guestWriteProblem: "Describe your problem",
      guestSend: "Send to Admin", guestSent: "Message sent! Admin will contact you shortly.",
      guestName: "Your Name", guestPhone: "Your Phone Number", guestProblem: "Describe the issue you're facing...",
    }
  },
  pl: {
    code: "pl", label: "Polski", flag: "🇵🇱", dir: "ltr",
    t: {
      welcome: "Witaj ponownie", signIn: "Zaloguj się na swoje konto",
      emailPhone: "Email lub telefon", enterEmail: "Wprowadź swój email",
      password: "Hasło", enterPassword: "Wprowadź swoje hasło",
      forgotPass: "Zapomniałeś hasła?", signInBtn: "Zaloguj się",
      signingIn: "Logowanie...", biometric: "Zaloguj się biometrycznie",
      demoAccounts: "KONTA DEMO", suspended: "Konto zawieszone. Skontaktuj się z adminem.",
      invalidCreds: "Nieprawidłowe dane. Spróbuj ponownie.",
      contactAdmin: "Kontakt z adminem", needHelp: "Potrzebujesz pomocy przy logowaniu?",
      platform1: "Publikowanie i przydzielanie zleceń", platform2: "Zarządzanie zespołem i pracownikami",
      platform3: "Analityka w czasie rzeczywistym", platform4: "Zintegrowana komunikacja",
      platformDesc: "Kompleksowa platforma do zarządzania pracownikami. Zarządzaj zleceniami, zadaniami i zespołami — w jednym miejscu.",
      chooseLanguage: "Wybierz język",
      home: "Strona główna", applyJobs: "Aplikuj na zlecenia", chatAdmin: "Czat z adminem",
      watchGuides: "Poradniki", myProfile: "Mój profil", ratingsPortfolio: "Oceny i portfolio",
      activeJobs: "Aktywne zlecenia", activeWorkers: "Aktywni pracownicy", completedJobs: "Ukończone zlecenia",
      unreadMessages: "Nieprzeczytane wiadomości", recentJobs: "Ostatnie zlecenia", topWorkers: "Najlepsi pracownicy",
      onWork: "PRACA — CZAS BIEGNIE", clockOut: "Zakończ zmianę", justBrowsing: "Tylko przeglądam",
      imWorking: "Pracuję", timerStarts: "Timer startuje teraz", noTimer: "Bez timera",
      allowLocation: "Zezwól na lokalizację", gettingLocation: "Pobieranie lokalizacji...",
      locationInfo: "WORKLY chce uzyskać dostęp do Twojej lokalizacji, aby zweryfikować sesje pracy.",
      skipBrowsing: "Pomiń — tylko przeglądam", whatDoing: "Co teraz robisz?",
      available: "Dostępny", online: "Online",
      sendRequest: "Wyślij →", pendingApproval: "Twoje żądanie zostało wysłane do admina — zmiany zostaną zastosowane po zatwierdzeniu.",
      profileInfo: "Informacje profilowe", exportData: "Eksportuj dane",
      profileNotice: "Dane profilu mogą być aktualizowane tylko przez administratora. Wyślij prośbę o zmianę, a admin ją zatwierdzi.",
      myChangeRequests: "Moje prośby o zmianę", submitted: "Oczekuje", approved: "Zatwierdzone", rejected: "Odrzucone",
      fullName: "Imię i nazwisko", emailAddress: "Adres email", phoneNumber: "Numer telefonu", homeAddress: "Adres domowy",
      myEarnings: "Moje zarobki", guestHelp: "Potrzebujesz pomocy?", guestCallAdmin: "Zadzwoń do admina", guestWriteProblem: "Opisz swój problem",
      guestSend: "Wyślij do admina", guestSent: "Wiadomość wysłana! Admin skontaktuje się z Tobą.",
      guestName: "Twoje imię", guestPhone: "Twój numer telefonu", guestProblem: "Opisz napotkany problem...",
    }
  },
  ar: {
    code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl",
    t: {
      welcome: "مرحباً بعودتك", signIn: "تسجيل الدخول إلى حسابك",
      emailPhone: "البريد الإلكتروني أو الهاتف", enterEmail: "أدخل بريدك الإلكتروني",
      password: "كلمة المرور", enterPassword: "أدخل كلمة مرورك",
      forgotPass: "نسيت كلمة المرور؟", signInBtn: "تسجيل الدخول",
      signingIn: "جارٍ تسجيل الدخول...", biometric: "تسجيل الدخول بالبصمة",
      demoAccounts: "حسابات تجريبية", suspended: "الحساب موقوف. تواصل مع المشرف.",
      invalidCreds: "بيانات غير صحيحة. حاول مجدداً.",
      contactAdmin: "تواصل مع المشرف", needHelp: "هل تحتاج مساعدة في تسجيل الدخول؟",
      platform1: "نشر وتعيين الوظائف", platform2: "إدارة الفريق والعمال",
      platform3: "تحليلات في الوقت الفعلي", platform4: "تواصل متكامل",
      platformDesc: "منصتك الكاملة لإدارة القوى العاملة. أدر الوظائف والمهام والفرق — في مكان واحد.",
      chooseLanguage: "اختر اللغة",
      home: "الرئيسية", applyJobs: "التقدم للوظائف", chatAdmin: "محادثة المشرف",
      watchGuides: "مشاهدة الأدلة", myProfile: "ملفي الشخصي", ratingsPortfolio: "التقييمات والمحفظة",
      activeJobs: "الوظائف النشطة", activeWorkers: "العمال النشطون", completedJobs: "الوظائف المنجزة",
      unreadMessages: "رسائل غير مقروءة", recentJobs: "الوظائف الأخيرة", topWorkers: "أفضل العمال",
      onWork: "في العمل — الوقت يمر", clockOut: "إنهاء الدوام", justBrowsing: "أتصفح فقط",
      imWorking: "أنا أعمل", timerStarts: "يبدأ المؤقت الآن", noTimer: "بدون مؤقت",
      allowLocation: "السماح بالوصول للموقع", gettingLocation: "جارٍ تحديد الموقع...",
      locationInfo: "يريد WORKLY الوصول إلى موقعك للتحقق من جلسات العمل.",
      skipBrowsing: "تخطي — أتصفح فقط", whatDoing: "ماذا تفعل الآن؟",
      available: "متاح", online: "متصل",
      sendRequest: "← إرسال طلب", pendingApproval: "تم إرسال طلبك إلى المشرف — ستُطبَّق التغييرات بعد الموافقة.",
      profileInfo: "معلومات الملف الشخصي", exportData: "تصدير بياناتي",
      profileNotice: "يمكن تحديث بيانات ملفك الشخصي فقط من قِبل المسؤول. أرسل طلب تغيير وسيراجعه المسؤول.",
      myChangeRequests: "طلبات التغيير الخاصة بي", submitted: "قيد الانتظار", approved: "موافق عليه", rejected: "مرفوض",
      fullName: "الاسم الكامل", emailAddress: "البريد الإلكتروني", phoneNumber: "رقم الهاتف", homeAddress: "العنوان المنزلي",
      myEarnings: "أرباحي", guestHelp: "تحتاج مساعدة؟", guestCallAdmin: "الاتصال بدعم المشرف", guestWriteProblem: "صف مشكلتك",
      guestSend: "إرسال للمشرف", guestSent: "تم الإرسال! سيتواصل معك المشرف قريباً.",
      guestName: "اسمك", guestPhone: "رقم هاتفك", guestProblem: "صف المشكلة التي تواجهها...",
    }
  },
  uk: {
    code: "uk", label: "Українська", flag: "🇺🇦", dir: "ltr",
    t: {
      welcome: "З поверненням", signIn: "Увійдіть до свого облікового запису",
      emailPhone: "Email або телефон", enterEmail: "Введіть ваш email",
      password: "Пароль", enterPassword: "Введіть ваш пароль",
      forgotPass: "Забули пароль?", signInBtn: "Увійти",
      signingIn: "Вхід...", biometric: "Вхід за біометрією",
      demoAccounts: "ДЕМО АКАУНТИ", suspended: "Акаунт заблоковано. Зверніться до адміна.",
      invalidCreds: "Невірні дані. Спробуйте ще раз.",
      contactAdmin: "Зв'язатись з адміном", needHelp: "Потрібна допомога з входом?",
      platform1: "Публікація та призначення завдань", platform2: "Управління командою та працівниками",
      platform3: "Аналітика в реальному часі", platform4: "Інтегровані комунікації",
      platformDesc: "Ваша повна платформа для управління персоналом. Керуйте завданнями, роботами та командами — в одному місці.",
      chooseLanguage: "Оберіть мову",
      home: "Головна", applyJobs: "Подати заявку", chatAdmin: "Чат з адміном",
      watchGuides: "Переглянути гіди", myProfile: "Мій профіль", ratingsPortfolio: "Рейтинги та портфоліо",
      activeJobs: "Активні завдання", activeWorkers: "Активні працівники", completedJobs: "Виконані завдання",
      unreadMessages: "Непрочитані повідомлення", recentJobs: "Останні завдання", topWorkers: "Кращі працівники",
      onWork: "НА РОБОТІ — ЧАС ІДЕ", clockOut: "Завершити зміну", justBrowsing: "Просто переглядаю",
      imWorking: "Я працюю", timerStarts: "Таймер починається", noTimer: "Без таймера",
      allowLocation: "Дозволити доступ до місцезнаходження", gettingLocation: "Визначення місця...",
      locationInfo: "WORKLY хоче отримати доступ до вашого місцезнаходження для перевірки робочих сесій.",
      skipBrowsing: "Пропустити — просто переглядаю", whatDoing: "Що ви зараз робите?",
      available: "Доступний", online: "Онлайн",
      sendRequest: "Запит →", pendingApproval: "Ваш запит надіслано адміну — зміни застосуються після підтвердження.",
      profileInfo: "Інформація профілю", exportData: "Експортувати дані",
      profileNotice: "Дані профілю можуть оновлюватися тільки адміністратором. Надішліть запит на зміну, і адмін його розгляне.",
      myChangeRequests: "Мої запити на зміни", submitted: "Очікує", approved: "Схвалено", rejected: "Відхилено",
      fullName: "Повне ім'я", emailAddress: "Email адреса", phoneNumber: "Номер телефону", homeAddress: "Домашня адреса",
      myEarnings: "Мої заробітки", guestHelp: "Потрібна допомога?", guestCallAdmin: "Зателефонувати адміну", guestWriteProblem: "Опишіть вашу проблему",
      guestSend: "Надіслати адміну", guestSent: "Повідомлення надіслано! Адмін зв'яжеться з вами.",
      guestName: "Ваше ім'я", guestPhone: "Ваш номер телефону", guestProblem: "Опишіть проблему, з якою ви зіткнулися...",
    }
  },
};

// ─── LANGUAGE CONTEXT ──────────────────────────────────────────────────────
import { createContext, useContext } from "react";
const LangCtx = createContext({ lang: LANGS.en, setLang: () => {} });
const useLang = () => useContext(LangCtx);
const useT = () => useContext(LangCtx).lang.t;

// ─── GUEST CONTACT BUTTON (login page) ─────────────────────────────────────
const GuestContactBtn = ({ db, setDb }) => {
  const t = useT();
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  // Keep form state stable with useRef so inputs never lose value on re-render
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [problem, setProblem] = useState("");

  const submit = () => {
    if (!name.trim() || !problem.trim()) return;
    setDb(d => ({ ...d, guestIssues: [...(d.guestIssues || []), { id: Date.now(), name, phone, problem, time: new Date().toLocaleString(), status: "new" }] }));
    setSent(true);
    setTimeout(() => { setSent(false); setOpen(false); setName(""); setPhone(""); setProblem(""); }, 3500);
  };

  const closeModal = () => { setOpen(false); };

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => setOpen(true)}
        style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)", color: "#fff", padding: "10px 18px", borderRadius: 24, fontSize: 13, fontWeight: 700, cursor: "pointer", backdropFilter: "blur(10px)", transition: "all 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
        💬 {t.contactAdmin}
      </button>

      {/* Modal — rendered at fixed position, stops all propagation so parent state never changes on input */}
      {open && (
        <div
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div
            className="fade-in"
            dir={lang.dir}
            onMouseDown={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            style={{ background: "#ffffff", borderRadius: 24, padding: "28px 28px 24px", width: "100%", maxWidth: 420, boxShadow: "0 32px 100px rgba(0,0,0,0.5)", position: "relative" }}>

            {sent ? (
              <div style={{ textAlign: "center", padding: "28px 0" }}>
                <div style={{ fontSize: 64, marginBottom: 14 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: S.text, marginBottom: 8 }}>{t.guestSent}</h3>
                <p style={{ fontSize: 14, color: S.textMuted }}>Admin will get back to you shortly.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 22 }}>💬</span>
                  <button onClick={closeModal}
                    style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${S.border}`, background: S.bg, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: S.textMuted }}>
                    ✕
                  </button>
                </div>

                {/* Call CTA */}
                <a href="tel:+15559675591"
                  style={{ display: "flex", alignItems: "center", gap: 14, background: "#e8faf4", border: "1.5px solid #a8e6cf", borderRadius: 14, padding: "14px 16px", marginBottom: 20, textDecoration: "none" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: S.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📞</div>
                  <div>
                    <p style={{ fontWeight: 800, color: S.success, fontSize: 15 }}>{t.guestCallAdmin}</p>
                    <p style={{ fontSize: 13, color: "#636e72" }}>+1 (555) WORKLY — 24/7</p>
                  </div>
                </a>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ flex: 1, height: 1, background: S.border }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: S.textMuted }}>— {t.guestWriteProblem} —</span>
                  <div style={{ flex: 1, height: 1, background: S.border }} />
                </div>

                {/* Name field */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#636e72", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    {t.guestName}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={t.guestName}
                    autoComplete="name"
                    style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e8eaf0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1a1a2e", background: "#f8f9fd", boxSizing: "border-box", outline: "none" }}
                    onFocus={e => { e.target.style.border = "1.5px solid #e94560"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.border = "1.5px solid #e8eaf0"; e.target.style.background = "#f8f9fd"; }}
                  />
                </div>

                {/* Phone field */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#636e72", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    {t.guestPhone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1-555-0000"
                    autoComplete="tel"
                    style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e8eaf0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1a1a2e", background: "#f8f9fd", boxSizing: "border-box", outline: "none" }}
                    onFocus={e => { e.target.style.border = "1.5px solid #e94560"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.border = "1.5px solid #e8eaf0"; e.target.style.background = "#f8f9fd"; }}
                  />
                </div>

                {/* Problem field */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#636e72", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    {t.guestWriteProblem}
                  </label>
                  <textarea
                    value={problem}
                    onChange={e => setProblem(e.target.value)}
                    placeholder={t.guestProblem}
                    rows={4}
                    style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #e8eaf0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1a1a2e", background: "#f8f9fd", resize: "none", boxSizing: "border-box", outline: "none" }}
                    onFocus={e => { e.target.style.border = "1.5px solid #e94560"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.border = "1.5px solid #e8eaf0"; e.target.style.background = "#f8f9fd"; }}
                  />
                </div>

                {/* Validation hint */}
                {(!name.trim() || !problem.trim()) && (name || problem) && (
                  <p style={{ fontSize: 12, color: S.danger, marginBottom: 10 }}>⚠ Name and problem description are required.</p>
                )}

                {/* Submit */}
                <button
                  onClick={submit}
                  disabled={!name.trim() || !problem.trim()}
                  style={{ width: "100%", padding: "14px", borderRadius: 12, background: (!name.trim() || !problem.trim()) ? "#ccc" : S.accent, color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: (!name.trim() || !problem.trim()) ? "not-allowed" : "pointer", transition: "background 0.2s", letterSpacing: 0.3 }}>
                  {t.guestSend}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// ─── LOGIN SCREEN ──────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin, db, setDb }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { lang, setLang } = useLang();
  const t = lang.t;

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const user = DB.users.find(u => (u.email === email) && u.password === password);
      if (user) {
        if (user.status === "suspended") { setError(t.suspended); setLoading(false); return; }
        onLogin(user);
      } else {
        setError(t.invalidCreds);
      }
      setLoading(false);
    }, 800);
  };

  const langList = Object.values(LANGS);

  return (
    <>
    <div dir={lang.dir} style={{ minHeight: "100vh", display: "flex", background: `linear-gradient(135deg, ${S.primary} 0%, #16213e 50%, #0f3460 100%)` }}>
      {/* Left panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
        {/* Language selector — top of left panel */}
        <div style={{ marginBottom: 40, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {langList.map(l => (
            <button key={l.code} onClick={() => setLang(l)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${lang.code === l.code ? "#fff" : "rgba(255,255,255,0.2)"}`, background: lang.code === l.code ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)", color: "#fff", fontSize: 13, fontWeight: lang.code === l.code ? 700 : 400, cursor: "pointer", transition: "all 0.2s" }}>
              <span style={{ fontSize: 18 }}>{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>

        <div style={{ color: "#fff", maxWidth: 400, width: "100%" }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>⚡</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1, marginBottom: 16 }}>WORKLY</h1>
          <p style={{ fontSize: 16, color: S.sidebarText, lineHeight: 1.7 }}>{t.platformDesc}</p>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 12 }}>
            {[t.platform1, t.platform2, t.platform3, t.platform4].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{["📦", "👥", "📊", "💬"][i]}</span>
                <span style={{ fontSize: 14, color: "#c8d6e5" }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <GuestContactBtn db={db} setDb={setDb} />
          </div>
        </div>
      </div>

      {/* Right panel — login card */}
      <div style={{ width: 480, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}>
        <div className="fade-in" style={{ width: "100%", maxWidth: 380 }}>
          <div style={{ background: S.cardBg, borderRadius: 24, padding: 40, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ textAlign: lang.dir === "rtl" ? "right" : "center", marginBottom: 28 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>⚡</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: S.text }}>{t.welcome}</h2>
              <p style={{ fontSize: 14, color: S.textMuted, marginTop: 4 }}>{t.signIn}</p>
            </div>

            {/* Email field */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: S.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>{t.emailPhone}</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", [lang.dir === "rtl" ? "right" : "left"]: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>✉</span>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder={t.enterEmail}
                  style={{ width: "100%", padding: lang.dir === "rtl" ? "11px 36px 11px 14px" : "11px 14px 11px 36px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: S.text, background: S.bg, direction: "ltr" }} />
              </div>
            </div>

            {/* Password field */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 0.4 }}>{t.password}</label>
                <button onClick={() => setShowForgot(true)} style={{ fontSize: 12, color: S.accent, fontWeight: 600, textDecoration: "underline" }}>{t.forgotPass}</button>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder={t.enterPassword}
                  style={{ width: "100%", padding: "11px 40px 11px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: S.text, background: S.bg, direction: "ltr" }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>{showPass ? "🙈" : "👁"}</button>
              </div>
            </div>

            {error && <p style={{ color: S.danger, fontSize: 13, marginBottom: 16, background: S.danger + "12", padding: "8px 12px", borderRadius: 8 }}>⚠ {error}</p>}

            <button onClick={handleLogin} disabled={loading}
              style={{ width: "100%", padding: "13px 20px", borderRadius: 12, background: S.accent, color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: loading ? "default" : "pointer", opacity: loading ? 0.7 : 1, marginBottom: 14 }}>
              {loading ? t.signingIn : `${t.signInBtn} →`}
            </button>

            <button style={{ width: "100%", padding: "11px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontWeight: 600, color: S.text, background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
              🔐 {t.biometric}
            </button>

            {/* Demo accounts */}
            <div style={{ marginTop: 18, background: S.bg, borderRadius: 12, padding: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: S.textMuted, marginBottom: 8, letterSpacing: 0.5 }}>{t.demoAccounts}</p>
              {[["admin@workly.com", "admin123", "Super Admin"], ["sarah@workly.com", "pass123", "Team Lead"], ["marcus@workly.com", "pass123", "Worker"]].map(([e, p, r]) => (
                <button key={e} onClick={() => { setEmail(e); setPassword(p); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "5px 0", fontSize: 12, color: S.info }}>
                  {r}: <span style={{ color: S.textMuted }}>{e}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* ── FORGOT PASSWORD MODAL ── */}
    {showForgot && <ForgotPasswordModal db={db} setDb={setDb} onClose={() => setShowForgot(false)} lang={lang} t={t} />}
    </>
  );
};

// ─── FORGOT PASSWORD MODAL ─────────────────────────────────────────────────
const ForgotPasswordModal = ({ db, setDb, onClose, lang, t }) => {
  const [step, setStep] = useState("enter");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [err, setErr] = useState("");

  const inputStyle = {
    width: "100%", padding: "12px 14px", border: "1.5px solid #e8eaf0",
    borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1a1a2e",
    background: "#f8f9fd", boxSizing: "border-box", outline: "none",
  };
  const labelStyle = {
    fontSize: 12, fontWeight: 700, color: "#8892b0", display: "block",
    marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4,
  };
  const onFocus = e => { e.target.style.border = "1.5px solid #e94560"; e.target.style.background = "#fff"; };
  const onBlur  = e => { e.target.style.border = "1.5px solid #e8eaf0"; e.target.style.background = "#f8f9fd"; };

  const canSubmit = firstName.trim() && lastName.trim() && emailInput.trim();

  const submit = () => {
    setErr("");
    const fullName = (firstName.trim() + " " + lastName.trim()).toLowerCase();
    const email    = emailInput.trim().toLowerCase();

    // Find user matching email
    const found = db.users.find(u => u.email.toLowerCase() === email);
    if (!found) { setErr("No account found with this email address."); return; }

    // Verify first + last name match
    const nameParts = found.name.toLowerCase().split(" ");
    const firstMatch = nameParts[0] === firstName.trim().toLowerCase();
    const lastMatch  = nameParts.slice(1).join(" ") === lastName.trim().toLowerCase() || nameParts[nameParts.length - 1] === lastName.trim().toLowerCase();
    if (!firstMatch || !lastMatch) {
      setErr("Name does not match our records for this email. Please check and try again.");
      return;
    }
    if (found.role === "super_admin" || found.role === "admin") {
      setErr("Admin accounts cannot use this reset flow. Contact system support.");
      return;
    }

    const req = {
      id: Date.now(),
      userId:      found.id,
      userName:    found.name,
      userEmail:   found.email,
      userAvatar:  found.avatar,
      status:      "pending",
      requestedAt: new Date().toLocaleString(),
      newPassword: null,
      emailSent:   false,
    };
    setDb(d => ({ ...d, passwordRequests: [...(d.passwordRequests || []), req] }));
    setStep("sent");
  };

  return (
    <div
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
      <div
        className="fade-in"
        dir={lang.dir}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 24, padding: "32px 32px 28px", width: "100%", maxWidth: 420, boxShadow: "0 32px 100px rgba(0,0,0,0.5)" }}>

        {step === "enter" ? (
          <>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "#e94560" + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 12 }}>🔐</div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e" }}>Forgot Password</h2>
                <p style={{ fontSize: 13, color: "#8892b0", marginTop: 4, lineHeight: 1.5 }}>
                  Verify your identity — admin will reset your password
                </p>
              </div>
              <button onClick={onClose}
                style={{ width: 34, height: 34, borderRadius: 9, border: "1.5px solid #e8eaf0", background: "#f8f9fd", fontSize: 16, cursor: "pointer", color: "#8892b0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 12 }}>
                ✕
              </button>
            </div>

            {/* Info notice */}
            <div style={{ background: "#fff8e1", border: "1.5px solid #fdcb6e50", borderRadius: 12, padding: "11px 14px", marginBottom: 22, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>ℹ</span>
              <p style={{ fontSize: 13, color: "#b7860b", lineHeight: 1.55 }}>
                Enter your registered name and email. Admin will verify and send a new password to your email.
              </p>
            </div>

            {/* First Name + Last Name side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => { setFirstName(e.target.value); setErr(""); }}
                  placeholder="e.g. Marcus"
                  autoComplete="given-name"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => { setLastName(e.target.value); setErr(""); }}
                  placeholder="e.g. Rivera"
                  autoComplete="family-name"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15, pointerEvents: "none" }}>✉</span>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => { setEmailInput(e.target.value); setErr(""); }}
                  placeholder="Your registered email"
                  autoComplete="email"
                  onKeyDown={e => e.key === "Enter" && canSubmit && submit()}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* Error */}
            {err && (
              <div style={{ background: "#fdf0ed", border: "1.5px solid #e1705530", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>⚠</span>
                <p style={{ fontSize: 13, color: "#e17055", lineHeight: 1.5 }}>{err}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={submit}
              disabled={!canSubmit}
              style={{ width: "100%", padding: "14px", borderRadius: 12, background: canSubmit ? "#e94560" : "#e8eaf0", color: canSubmit ? "#fff" : "#b2bec3", fontSize: 15, fontWeight: 800, border: "none", cursor: canSubmit ? "pointer" : "not-allowed", marginBottom: 10, transition: "all 0.2s", letterSpacing: 0.2 }}>
              Send Reset Request →
            </button>
            <button onClick={onClose}
              style={{ width: "100%", padding: "12px", borderRadius: 12, background: "transparent", border: "1.5px solid #e8eaf0", fontSize: 14, fontWeight: 600, color: "#8892b0", cursor: "pointer" }}>
              Cancel
            </button>
          </>
        ) : (
          /* ── SUCCESS STATE ── */
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#eafaf1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 20px" }}>📨</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1a1a2e", marginBottom: 8 }}>Request Sent!</h2>
            <p style={{ fontSize: 14, color: "#8892b0", lineHeight: 1.6, marginBottom: 16 }}>
              Your password reset request has been sent to the admin.
            </p>

            {/* Summary box */}
            <div style={{ background: "#f8f9fd", border: "1.5px solid #e8eaf0", borderRadius: 14, padding: "16px 18px", marginBottom: 16, textAlign: "left" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>👤</span>
                <div>
                  <p style={{ fontSize: 11, color: "#8892b0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Name</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{firstName} {lastName}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 14 }}>📧</span>
                <div>
                  <p style={{ fontSize: 11, color: "#8892b0", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>New password will be sent to</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#e94560" }}>{emailInput}</p>
                </div>
              </div>
            </div>

            <div style={{ background: "#eafaf1", border: "1.5px solid #a8e6cf", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: "#1e8449", lineHeight: 1.5 }}>
                ✓ Admin will review your request and set a new password within 24 hours.
              </p>
            </div>

            <button onClick={onClose}
              style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#e94560", color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer" }}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SIDEBAR ───────────────────────────────────────────────────────────────

// ─── TOPBAR ────────────────────────────────────────────────────────────────
const TopBar = ({ title, user, onProfileClick, notifications }) => (
  <div style={{ height: 64, background: S.cardBg, borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", position: "sticky", top: 0, zIndex: 50 }}>
    <h1 style={{ fontSize: 20, fontWeight: 700, color: S.text }}>{title}</h1>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <button style={{ position: "relative", width: 40, height: 40, borderRadius: 12, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
        🔔
        {notifications > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: S.accent }} />}
      </button>
      <button onClick={onProfileClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", borderRadius: 12, border: `1px solid ${S.border}`, background: S.bg }}>
        <Avatar initials={user.avatar} size={30} color={S.accent} />
        <span style={{ fontSize: 14, fontWeight: 600, color: S.text }}>{user.name.split(" ")[0]}</span>
      </button>
    </div>
  </div>
);

// ─── ADMIN: DASHBOARD ──────────────────────────────────────────────────────
const AdminDashboard = ({ db, currentUser }) => {
  const activeJobs = db.jobs.filter(j => j.status === "active").length;
  const activeWorkers = db.users.filter(u => u.role === "worker" && u.status === "active").length;
  const completedJobs = db.jobs.filter(j => j.status === "completed").length;
  const unreadMsgs = db.messages.filter(m => !m.read && m.to === currentUser.id).length;

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Active Jobs" value={activeJobs} icon="📋" color={S.info} trend="2 new today" />
        <StatCard label="Active Workers" value={activeWorkers} icon="👷" color={S.success} />
        <StatCard label="Completed Jobs" value={completedJobs} icon="✅" color={S.accent} trend="1 this week" />
        <StatCard label="Unread Messages" value={unreadMsgs} icon="💬" color={S.warning} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recent Jobs</h3>
          {db.jobs.slice(0, 4).map(job => (
            <div key={job.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: `1px solid ${S.border}` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{job.image}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14 }}>{job.title}</p>
                <p style={{ fontSize: 12, color: S.textMuted }}>📍 {job.address} · ${job.wage}/hr</p>
              </div>
              <StatusBadge status={job.status} />
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🏆 Top Workers</h3>
            {db.users.filter(u => u.role === "worker").slice(0, 3).map((w, i) => (
              <div key={w.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{["🥇", "🥈", "🥉"][i]}</span>
                <Avatar initials={w.avatar} size={32} color={S.accent} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{w.name}</p>
                  <p style={{ fontSize: 11, color: S.textMuted }}>★ {w.rating}</p>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Categories</h3>
            {["Logistics", "Events", "Cleaning", "Delivery", "Security"].map((cat, i) => (
              <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                <span style={{ fontSize: 13 }}>{cat}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 60, height: 6, borderRadius: 3, background: S.border, overflow: "hidden" }}>
                    <div style={{ width: `${[80, 60, 40, 70, 30][i]}%`, height: "100%", background: S.accent, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 12, color: S.textMuted, minWidth: 16 }}>{[4, 3, 2, 4, 1][i]}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN: USER MANAGEMENT ────────────────────────────────────────────────
const UserManagement = ({ db, setDb, showToast }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "worker", password: "" });

  const filtered = db.users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filter === "all" || u.role === filter;
    return matchSearch && matchRole;
  });

  const createUser = () => {
    const newUser = { ...form, id: Date.now(), status: "active", avatar: form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2), joined: new Date().toISOString().split("T")[0], rating: 5.0, totalJobs: 0, totalHours: 0, totalIncome: 0 };
    setDb(d => ({ ...d, users: [...d.users, newUser] }));
    setShowCreate(false);
    setForm({ name: "", email: "", phone: "", role: "worker", password: "" });
    showToast("User created successfully");
  };

  const toggleStatus = (userId) => {
    setDb(d => ({ ...d, users: d.users.map(u => u.id === userId ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u) }));
    showToast("User status updated");
  };

  const deleteUser = (userId) => {
    setDb(d => ({ ...d, users: d.users.filter(u => u.id !== userId) }));
    setSelected(null);
    showToast("User removed");
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search users..." style={{ flex: 1, padding: "10px 16px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.cardBg }} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "10px 16px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.cardBg }}>
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="team_lead">Team Lead</option>
          <option value="worker">Worker</option>
        </select>
        <Btn onClick={() => setShowCreate(true)}>➕ Add User</Btn>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: S.bg }}>
              {["Worker", "Contact", "Role", "Status", "Jobs Done", "Rating", "Actions"].map(h => (
                <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, fontWeight: 700, color: S.textMuted, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} style={{ borderTop: `1px solid ${S.border}` }}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={user.avatar} size={36} color={S.accent} />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</p>
                      <p style={{ fontSize: 12, color: S.textMuted }}>ID: {user.id.toString().padStart(4, "0")}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <p style={{ fontSize: 13 }}>{user.email}</p>
                  <p style={{ fontSize: 12, color: S.textMuted }}>{user.phone}</p>
                </td>
                <td style={{ padding: "14px 20px" }}><Badge label={user.role.replace("_", " ")} color={S.info} /></td>
                <td style={{ padding: "14px 20px" }}><StatusBadge status={user.status} /></td>
                <td style={{ padding: "14px 20px", fontWeight: 600 }}>{user.totalJobs || 0}</td>
                <td style={{ padding: "14px 20px" }}>{user.rating ? `★ ${user.rating}` : "—"}</td>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm" variant="ghost" onClick={() => setSelected(user)}>View</Btn>
                    <Btn size="sm" variant={user.status === "active" ? "outline" : "success"} onClick={() => toggleStatus(user.id)}>
                      {user.status === "active" ? "Suspend" : "Activate"}
                    </Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {showCreate && (
        <Modal title="Create New User" onClose={() => setShowCreate(false)}>
          <Input label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="John Doe" required />
          <Input label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="john@example.com" required />
          <Input label="Phone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+1-555-0000" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: S.textMuted, display: "block", marginBottom: 6 }}>Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.bg }}>
              <option value="worker">Worker</option>
              <option value="team_lead">Team Lead</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Input label="Temporary Password" type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} required />
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <Btn onClick={createUser} style={{ flex: 1, justifyContent: "center" }}>Create User</Btn>
            <Btn variant="ghost" onClick={() => setShowCreate(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {selected && (
        <Modal title="User Profile" onClose={() => setSelected(null)}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Avatar initials={selected.avatar} size={72} color={S.accent} />
            <h2 style={{ marginTop: 12, fontSize: 20, fontWeight: 700 }}>{selected.name}</h2>
            <StatusBadge status={selected.status} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[["📧", "Email", selected.email], ["📱", "Phone", selected.phone], ["📍", "Address", selected.address], ["📅", "Joined", selected.joined], ["💼", "Total Jobs", selected.totalJobs || 0], ["⭐", "Rating", selected.rating ? `★ ${selected.rating}` : "N/A"]].map(([icon, label, val]) => (
              <div key={label} style={{ background: S.bg, borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: S.textMuted, marginBottom: 4 }}>{icon} {label}</p>
                <p style={{ fontSize: 14, fontWeight: 600 }}>{val}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="danger" onClick={() => deleteUser(selected.id)} style={{ flex: 1, justifyContent: "center" }}>🗑 Remove User</Btn>
            <Btn variant={selected.status === "active" ? "outline" : "success"} onClick={() => { toggleStatus(selected.id); setSelected(null); }} style={{ flex: 1, justifyContent: "center" }}>
              {selected.status === "active" ? "Suspend" : "Activate"}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ADMIN: JOBS & TASKS ───────────────────────────────────────────────────
const JobManagement = ({ db, setDb, showToast }) => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({ title: "", category: "Logistics", address: "", wage: "", type: "Hourly", description: "", duration: "", due: "" });

  const filtered = db.jobs.filter(j => filter === "all" || j.status === filter);

  const createJob = () => {
    const job = { ...form, id: Date.now(), status: "active", created: new Date().toISOString().split("T")[0], image: "💼", assignedTo: [], applicants: [], views: 0, wage: Number(form.wage) };
    setDb(d => ({ ...d, jobs: [...d.jobs, job] }));
    setShowCreate(false);
    setForm({ title: "", category: "Logistics", address: "", wage: "", type: "Hourly", description: "", duration: "", due: "" });
    showToast("Job posted successfully!");
  };

  const updateJobStatus = (jobId, status) => {
    setDb(d => ({ ...d, jobs: d.jobs.map(j => j.id === jobId ? { ...j, status } : j) }));
    showToast("Job status updated");
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: S.bg, borderRadius: 12, padding: 4, width: "fit-content" }}>
        {["jobs", "tasks"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, background: activeTab === tab ? S.cardBg : "transparent", color: activeTab === tab ? S.accent : S.textMuted, boxShadow: activeTab === tab ? "0 2px 8px rgba(0,0,0,0.08)" : "none", textTransform: "capitalize" }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "jobs" && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {["all", "active", "completed", "draft", "cancelled"].map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: filter === s ? S.accent : S.bg, color: filter === s ? "#fff" : S.textMuted, textTransform: "capitalize" }}>{s}</button>
            ))}
            <Btn onClick={() => setShowCreate(true)} style={{ marginLeft: "auto" }}>➕ Post Job</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {filtered.map(job => (
              <Card key={job.id} onClick={() => setSelectedJob(job)}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{job.image}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{job.title}</h3>
                      <StatusBadge status={job.status} />
                    </div>
                    <p style={{ fontSize: 12, color: S.textMuted, marginBottom: 8 }}>📍 {job.address}</p>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: S.success }}>${job.wage}/hr</span>
                      <Badge label={job.category} color={S.info} />
                      <Badge label={job.type} color={S.textMuted} />
                    </div>
                    <p style={{ fontSize: 12, color: S.textMuted, marginTop: 8 }}>👥 {job.assignedTo.length} assigned · 📝 {job.applicants.length} applied · 👁 {job.views} views</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === "tasks" && (
        <div>
          {db.tasks.map(task => {
            const job = db.jobs.find(j => j.id === task.jobId);
            const worker = db.users.find(u => u.id === task.workerId);
            return (
              <Card key={task.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {task.pinned && <span title="Pinned">📌</span>}
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{task.title}</p>
                      <p style={{ fontSize: 12, color: S.textMuted }}>Job: {job?.title} · Worker: {worker?.name}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 11, color: S.textMuted }}>Progress</p>
                      <div style={{ width: 80, height: 8, background: S.border, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: `${task.checkpoint}%`, height: "100%", background: S.success, borderRadius: 4 }} />
                      </div>
                      <p style={{ fontSize: 11, color: S.textMuted }}>{task.checkpoint}%</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: S.textMuted }}>Time left</p>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{task.timeLeft}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showCreate && (
        <Modal title="Post New Job" onClose={() => setShowCreate(false)} width={560}>
          <Input label="Job Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Warehouse Assistant" required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: S.textMuted, display: "block", marginBottom: 6 }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.bg }}>
                {["Logistics", "Events", "Cleaning", "Delivery", "Security", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: S.textMuted, display: "block", marginBottom: 6 }}>Job Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.bg }}>
                <option>Hourly</option>
                <option>Full-Time</option>
              </select>
            </div>
          </div>
          <Input label="Address" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} placeholder="123 Street, City, State" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Wage ($/hr)" type="number" value={form.wage} onChange={v => setForm(f => ({ ...f, wage: v }))} placeholder="20" />
            <Input label="Duration" value={form.duration} onChange={v => setForm(f => ({ ...f, duration: v }))} placeholder="e.g. 8 hours" />
          </div>
          <Input label="Due Date" type="date" value={form.due} onChange={v => setForm(f => ({ ...f, due: v }))} />
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: S.textMuted, display: "block", marginBottom: 6 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Job description..." rows={3}
              style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.bg, resize: "vertical", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={createJob} style={{ flex: 1, justifyContent: "center" }}>Post Job</Btn>
            <Btn variant="ghost" onClick={() => setShowCreate(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {selectedJob && (
        <Modal title={selectedJob.title} onClose={() => setSelectedJob(null)} width={580}>
          <div style={{ background: S.bg, borderRadius: 14, padding: 16, marginBottom: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["💰", "Wage", `$${selectedJob.wage}/hr`], ["⏱", "Duration", selectedJob.duration], ["📍", "Address", selectedJob.address], ["📅", "Due", selectedJob.due], ["👁", "Views", selectedJob.views], ["📝", "Applicants", selectedJob.applicants.length]].map(([ic, lbl, val]) => (
                <div key={lbl}><p style={{ fontSize: 11, color: S.textMuted }}>{ic} {lbl}</p><p style={{ fontWeight: 600, fontSize: 14 }}>{val}</p></div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 14, color: S.textMuted, lineHeight: 1.6, marginBottom: 20 }}>{selectedJob.description}</p>
          <h4 style={{ marginBottom: 10 }}>Applicants</h4>
          {selectedJob.applicants.map(aId => {
            const worker = db.users.find(u => u.id === aId);
            return worker ? (
              <div key={aId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: `1px solid ${S.border}` }}>
                <Avatar initials={worker.avatar} size={36} color={S.accent} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{worker.name}</p>
                  <p style={{ fontSize: 12, color: S.textMuted }}>★ {worker.rating} · {worker.totalJobs} jobs done</p>
                </div>
                {!selectedJob.assignedTo.includes(aId) ? (
                  <Btn size="sm" variant="success" onClick={() => { setDb(d => ({ ...d, jobs: d.jobs.map(j => j.id === selectedJob.id ? { ...j, assignedTo: [...j.assignedTo, aId] } : j) })); showToast("Worker assigned!"); setSelectedJob(null); }}>Assign</Btn>
                ) : <Badge label="Assigned" color={S.success} />}
              </div>
            ) : null;
          })}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            {selectedJob.status === "active" && <Btn variant="success" onClick={() => { updateJobStatus(selectedJob.id, "completed"); setSelectedJob(null); }} style={{ flex: 1, justifyContent: "center" }}>Mark Completed</Btn>}
            {selectedJob.status !== "cancelled" && <Btn variant="danger" onClick={() => { updateJobStatus(selectedJob.id, "cancelled"); setSelectedJob(null); }} style={{ flex: 1, justifyContent: "center" }}>Cancel Job</Btn>}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ADMIN: REPORTS ────────────────────────────────────────────────────────
const Reports = ({ db }) => {
  const workers = db.users.filter(u => u.role === "worker");
  const totalIncome = workers.reduce((sum, w) => sum + (w.totalIncome || 0), 0);
  const totalHours = workers.reduce((sum, w) => sum + (w.totalHours || 0), 0);
  const totalJobs = db.jobs.length;

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Revenue" value={`$${totalIncome.toLocaleString()}`} icon="💵" color={S.success} />
        <StatCard label="Total Hours" value={totalHours} icon="⏱" color={S.info} />
        <StatCard label="Total Jobs" value={totalJobs} icon="📋" color={S.accent} />
        <StatCard label="Avg Rating" value="4.5★" icon="⭐" color={S.warning} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Worker Performance</h3>
          {workers.map(w => (
            <div key={w.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{w.name}</span>
                <span style={{ fontSize: 13, color: S.textMuted }}>★ {w.rating}</span>
              </div>
              <div style={{ height: 6, background: S.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${(w.rating / 5) * 100}%`, height: "100%", background: w.rating >= 4.5 ? S.success : w.rating >= 3.5 ? S.warning : S.danger, borderRadius: 3 }} />
              </div>
              <p style={{ fontSize: 11, color: S.textMuted, marginTop: 2 }}>{w.totalJobs} jobs · {w.totalHours}h · ${w.totalIncome?.toLocaleString()}</p>
            </div>
          ))}
        </Card>

        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Activity Log</h3>
          {db.activityLogs.map(log => {
            const user = db.users.find(u => u.id === log.userId);
            return (
              <div key={log.id} style={{ padding: "10px 0", borderBottom: `1px solid ${S.border}` }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{user?.name}</p>
                <p style={{ fontSize: 12, color: S.textMuted }}>{log.action}</p>
                <p style={{ fontSize: 11, color: S.textMuted }}>{log.time} · {log.module}</p>
              </div>
            );
          })}
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Job Completion Report</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn size="sm" variant="ghost">📊 Export CSV</Btn>
            <Btn size="sm" variant="ghost">📄 Export PDF</Btn>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: S.bg }}>
              {["Job Title", "Category", "Status", "Workers", "Wage", "Views"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: S.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {db.jobs.map(job => (
              <tr key={job.id} style={{ borderTop: `1px solid ${S.border}` }}>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>{job.title}</td>
                <td style={{ padding: "12px 16px" }}><Badge label={job.category} color={S.info} /></td>
                <td style={{ padding: "12px 16px" }}><StatusBadge status={job.status} /></td>
                <td style={{ padding: "12px 16px" }}>{job.assignedTo.length}</td>
                <td style={{ padding: "12px 16px", fontWeight: 600, color: S.success }}>${job.wage}/hr</td>
                <td style={{ padding: "12px 16px" }}>{job.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ─── ADMIN: COMMUNICATIONS ─────────────────────────────────────────────────
const Communications = ({ db, setDb, currentUser, showToast }) => {
  const [activeThread, setActiveThread] = useState(null);
  const [msg, setMsg] = useState("");
  const [broadcast, setBroadcast] = useState("");
  const [showBroadcast, setShowBroadcast] = useState(false);
  const msgEndRef = useRef(null);

  const getThreads = () => {
    const workerIds = [...new Set(db.messages.filter(m => m.to === currentUser.id || m.from === currentUser.id).map(m => m.from === currentUser.id ? m.to : m.from))];
    return workerIds.map(id => {
      const user = db.users.find(u => u.id === id);
      const msgs = db.messages.filter(m => (m.from === id && m.to === currentUser.id) || (m.from === currentUser.id && m.to === id));
      const last = msgs[msgs.length - 1];
      const unread = msgs.filter(m => !m.read && m.to === currentUser.id).length;
      return { user, lastMsg: last, unread };
    });
  };

  const getConversation = (userId) => db.messages.filter(m => (m.from === userId && m.to === currentUser.id) || (m.from === currentUser.id && m.to === userId));

  const sendMessage = () => {
    if (!msg.trim() || !activeThread) return;
    const newMsg = { id: Date.now(), from: currentUser.id, to: activeThread.id, text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), type: "text", read: false };
    setDb(d => ({ ...d, messages: [...d.messages, newMsg] }));
    setMsg("");
    showToast("Message sent");
  };

  const sendBroadcast = () => {
    const workers = db.users.filter(u => u.role === "worker");
    const newMsgs = workers.map(w => ({ id: Date.now() + w.id, from: currentUser.id, to: w.id, text: `📢 BROADCAST: ${broadcast}`, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), type: "text", read: false }));
    setDb(d => ({ ...d, messages: [...d.messages, ...newMsgs] }));
    setBroadcast("");
    setShowBroadcast(false);
    showToast("Broadcast sent to all workers!");
  };

  const threads = getThreads();

  return (
    <div className="fade-in" style={{ display: "flex", gap: 16, height: "calc(100vh - 160px)" }}>
      <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 12 }}>
        <Btn onClick={() => setShowBroadcast(true)} style={{ justifyContent: "center" }}>📢 Broadcast Message</Btn>
        <Card style={{ flex: 1, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${S.border}`, fontWeight: 700, fontSize: 14 }}>Conversations</div>
          {threads.map(({ user, lastMsg, unread }) => (
            <div key={user?.id} onClick={() => setActiveThread(user)} style={{ display: "flex", gap: 10, padding: "14px 16px", cursor: "pointer", borderBottom: `1px solid ${S.border}`, background: activeThread?.id === user?.id ? S.accent + "10" : "transparent" }}>
              <Avatar initials={user?.avatar} size={40} color={S.accent} />
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{user?.name}</p>
                  {unread > 0 && <span style={{ background: S.accent, color: "#fff", fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{unread}</span>}
                </div>
                <p style={{ fontSize: 12, color: S.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lastMsg?.text}</p>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Card style={{ flex: 1, padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {activeThread ? (
          <>
            <div style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar initials={activeThread.avatar} size={38} color={S.accent} />
              <div>
                <p style={{ fontWeight: 700 }}>{activeThread.name}</p>
                <p style={{ fontSize: 12, color: S.success }}>● Online</p>
              </div>
            </div>
            <div style={{ flex: 1, padding: "16px 16px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              {getConversation(activeThread.id).map(m => <MsgBubble key={m.id} m={m} isMine={m.from === currentUser.id} />)}
              <div ref={msgEndRef} />
            </div>
            <ChatInputBar onSend={(msgObj) => { setDb(d => ({ ...d, messages: [...d.messages, { ...msgObj, from: currentUser.id, to: activeThread.id }] })); showToast("Sent"); }} placeholder="Type a message..." />
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: S.textMuted }}>
            <span style={{ fontSize: 48 }}>💬</span>
            <p style={{ fontSize: 16, fontWeight: 600 }}>Select a conversation</p>
          </div>
        )}
      </Card>

      {showBroadcast && (
        <Modal title="Broadcast Message" onClose={() => setShowBroadcast(false)}>
          <p style={{ fontSize: 14, color: S.textMuted, marginBottom: 16 }}>Send a message to all workers instantly.</p>
          <textarea value={broadcast} onChange={e => setBroadcast(e.target.value)} placeholder="Type your broadcast message..." rows={4}
            style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: S.bg, resize: "none" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <Btn onClick={sendBroadcast} style={{ flex: 1, justifyContent: "center" }}>📢 Send Broadcast</Btn>
            <Btn variant="ghost" onClick={() => setShowBroadcast(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ADMIN: GUIDES ─────────────────────────────────────────────────────────
const GuidesAdmin = ({ db, setDb, showToast }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", type: "article", category: "Safety", content: "" });

  const addGuide = () => {
    setDb(d => ({ ...d, guides: [...d.guides, { ...form, id: Date.now(), views: 0 }] }));
    setShowAdd(false);
    setForm({ title: "", type: "article", category: "Safety", content: "" });
    showToast("Guide added!");
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn onClick={() => setShowAdd(true)}>➕ Add Guide</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {db.guides.map(g => (
          <Card key={g.id}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{g.type === "video" ? "🎥" : "📄"}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{g.title}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge label={g.category} color={S.info} />
                  <Badge label={g.type} color={S.textMuted} />
                </div>
                <p style={{ fontSize: 12, color: S.textMuted, marginTop: 6 }}>👁 {g.views} views</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {showAdd && (
        <Modal title="Add Guide" onClose={() => setShowAdd(false)}>
          <Input label="Title" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: S.textMuted, display: "block", marginBottom: 6 }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.bg }}>
                <option value="article">Article</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: S.textMuted, display: "block", marginBottom: 6 }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.bg }}>
                {["Safety", "Operations", "Training", "FAQ"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: S.textMuted, display: "block", marginBottom: 6 }}>Content / URL</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: S.bg, resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={addGuide} style={{ flex: 1, justifyContent: "center" }}>Add Guide</Btn>
            <Btn variant="ghost" onClick={() => setShowAdd(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ADMIN: RATINGS ────────────────────────────────────────────────────────
const RatingsAdmin = ({ db }) => (
  <div className="fade-in">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      <StatCard label="Average Rating" value="4.5★" icon="⭐" color={S.warning} />
      <StatCard label="Top Rated" value="Aisha P." icon="🏆" color={S.success} />
      <StatCard label="Low Performers" value="1" icon="⚠" color={S.danger} />
    </div>
    {db.users.filter(u => u.role === "worker").map(w => (
      <Card key={w.id} style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar initials={w.avatar} size={48} color={w.rating >= 4.5 ? S.success : w.rating >= 3.5 ? S.warning : S.danger} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 16 }}>{w.name}</p>
            <p style={{ fontSize: 13, color: S.textMuted }}>{w.totalJobs} jobs · {w.totalHours} hours worked</p>
            <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
              {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 18, color: s <= Math.round(w.rating) ? "#f39c12" : S.border }}>★</span>)}
              <span style={{ fontSize: 14, fontWeight: 700, marginLeft: 6 }}>{w.rating}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 12, color: S.textMuted }}>Total Earned</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: S.success }}>${w.totalIncome?.toLocaleString()}</p>
            {w.rating < 3.5 && <Badge label="⚠ Flag" color={S.danger} />}
          </div>
        </div>
      </Card>
    ))}
  </div>
);

// ─── ADMIN: FINANCE ────────────────────────────────────────────────────────
const Finance = ({ db }) => {
  const workers = db.users.filter(u => u.role === "worker");
  const total = workers.reduce((s, w) => s + (w.totalIncome || 0), 0);
  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Disbursed" value={`$${total.toLocaleString()}`} icon="💰" color={S.success} />
        <StatCard label="Pending Disputes" value="0" icon="⚠" color={S.warning} />
        <StatCard label="Bonuses Given" value="$0" icon="🎁" color={S.info} />
      </div>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Worker Earnings</h3>
          <Btn size="sm" variant="ghost">Export Excel</Btn>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: S.bg }}>
              {["Worker", "Total Jobs", "Hours", "Total Earned", "Avg/Hour"].map(h => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: S.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workers.map(w => (
              <tr key={w.id} style={{ borderTop: `1px solid ${S.border}` }}>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Avatar initials={w.avatar} size={32} color={S.accent} />
                    <span style={{ fontWeight: 600 }}>{w.name}</span>
                  </div>
                </td>
                <td style={{ padding: "14px 16px" }}>{w.totalJobs}</td>
                <td style={{ padding: "14px 16px" }}>{w.totalHours}h</td>
                <td style={{ padding: "14px 16px", fontWeight: 700, color: S.success }}>${w.totalIncome?.toLocaleString()}</td>
                <td style={{ padding: "14px 16px" }}>${w.totalHours ? Math.round(w.totalIncome / w.totalHours) : 0}/hr</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ─── ADMIN: SETTINGS ───────────────────────────────────────────────────────
const Settings = ({ showToast }) => (
  <div className="fade-in" style={{ maxWidth: 600 }}>
    {[{ title: "Notifications", items: [["SMS Notifications", true], ["Push Notifications", true], ["Email Reports", false]] },
      { title: "Security", items: [["Two-Factor Auth", false], ["Biometric Login", true], ["Session Timeout", true]] }].map(section => (
      <Card key={section.title} style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{section.title}</h3>
        {section.items.map(([label, def]) => {
          const [on, setOn] = useState(def);
          return (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${S.border}` }}>
              <span style={{ fontSize: 14 }}>{label}</span>
              <button onClick={() => { setOn(!on); showToast("Setting saved"); }}
                style={{ width: 48, height: 26, borderRadius: 13, background: on ? S.accent : S.border, position: "relative", transition: "background 0.2s" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: on ? 24 : 2, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
          );
        })}
      </Card>
    ))}
    <Card>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Default Wage Templates</h3>
      {[["Logistics", "$20/hr"], ["Events", "$25/hr"], ["Cleaning", "$18/hr"]].map(([cat, wage]) => (
        <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${S.border}` }}>
          <span style={{ fontSize: 14 }}>{cat}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: S.success }}>{wage}</span>
        </div>
      ))}
    </Card>
  </div>
);

// ─── ADMIN: TEAMS ──────────────────────────────────────────────────────────
const Teams = ({ db }) => {
  const teamLeads = db.users.filter(u => u.role === "team_lead");
  return (
    <div className="fade-in">
      {teamLeads.map(lead => {
        const members = db.users.filter(u => u.teamLead === lead.id);
        return (
          <Card key={lead.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
              <Avatar initials={lead.avatar} size={48} color={S.info} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 16 }}>{lead.name}'s Team</p>
                <p style={{ fontSize: 13, color: S.textMuted }}>{members.length} members</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {members.map(m => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, background: S.bg, borderRadius: 10, padding: "8px 12px" }}>
                  <Avatar initials={m.avatar} size={28} color={S.accent} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</p>
                    <p style={{ fontSize: 11, color: S.textMuted }}>★ {m.rating}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

// ─── WORKER: HOME ──────────────────────────────────────────────────────────
const WorkerHome = ({ db, user }) => {
  const myTasks = db.tasks.filter(t => t.workerId === user.id);
  const myJobs = db.jobs.filter(j => j.assignedTo.includes(user.id));
  const completedJobs = db.jobs.filter(j => j.status === "completed" && j.assignedTo.includes(user.id));

  return (
    <div className="fade-in">
      <div style={{ background: `linear-gradient(135deg, ${S.primary}, #16213e)`, borderRadius: 20, padding: "28px 28px", marginBottom: 24, color: "#fff" }}>
        <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 4 }}>Welcome back 👋</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>{user.name}</h2>
        <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
          {[["⭐", user.rating || 0, "Rating"], ["✅", user.totalJobs || 0, "Jobs"], ["⏱", user.totalHours || 0, "Hours"]].map(([ic, val, lbl]) => (
            <div key={lbl}>
              <p style={{ fontSize: 22, fontWeight: 800 }}>{ic} {val}</p>
              <p style={{ fontSize: 12, opacity: 0.7 }}>{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Active Tasks</h3>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
        {myTasks.length === 0 ? <p style={{ color: S.textMuted }}>No active tasks</p> : myTasks.map(t => {
          const job = db.jobs.find(j => j.id === t.jobId);
          return (
            <div key={t.id} style={{ minWidth: 220, background: S.cardBg, borderRadius: 16, border: `1px solid ${S.border}`, padding: 16, flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <StatusBadge status={t.status} />
                {t.pinned && <span>📌</span>}
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{t.title}</p>
              <p style={{ fontSize: 12, color: S.textMuted, marginBottom: 10 }}>{job?.title}</p>
              <div style={{ height: 6, background: S.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${t.checkpoint}%`, height: "100%", background: S.success, borderRadius: 3 }} />
              </div>
              <p style={{ fontSize: 12, color: S.textMuted, marginTop: 4 }}>⏱ {t.timeLeft}</p>
            </div>
          );
        })}
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Previous Jobs</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {completedJobs.map(job => (
          <Card key={job.id}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ fontSize: 28 }}>{job.image}</div>
              <div>
                <p style={{ fontWeight: 700 }}>{job.title}</p>
                <p style={{ fontSize: 12, color: S.textMuted }}>📍 {job.address}</p>
                <p style={{ fontSize: 12, color: S.textMuted }}>✅ {job.due}</p>
                <Badge label="Completed" color={S.success} />
              </div>
            </div>
          </Card>
        ))}
        {completedJobs.length === 0 && <p style={{ color: S.textMuted, gridColumn: "1/-1" }}>No completed jobs yet</p>}
      </div>
    </div>
  );
};

// ─── WORKER: APPLY JOBS ────────────────────────────────────────────────────
const ApplyJobs = ({ db, setDb, user, showToast }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [bidNote, setBidNote] = useState("");

  const available = db.jobs.filter(j => j.status === "active" && j.title.toLowerCase().includes(search.toLowerCase()));

  const applyJob = (job) => {
    if (job.applicants.includes(user.id)) { showToast("Already applied!", "error"); return; }
    setDb(d => ({ ...d, jobs: d.jobs.map(j => j.id === job.id ? { ...j, applicants: [...j.applicants, user.id], views: j.views + 1 } : j) }));
    setSelected(null);
    setBidNote("");
    showToast("Application submitted! 🎉");
  };

  return (
    <div className="fade-in">
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search jobs by title..." style={{ width: "100%", padding: "12px 18px", border: `1.5px solid ${S.border}`, borderRadius: 12, fontSize: 14, background: S.cardBg, marginBottom: 20 }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {available.map(job => (
          <Card key={job.id} onClick={() => setSelected(job)} style={{ display: "flex", gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }}>{job.image}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{job.title}</h3>
                <span style={{ fontSize: 18, fontWeight: 800, color: S.success }}>${job.wage}/hr</span>
              </div>
              <p style={{ fontSize: 13, color: S.textMuted, margin: "4px 0" }}>📍 {job.address}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <Badge label={job.category} color={S.info} />
                <Badge label={job.type} color={S.textMuted} />
                <Badge label={`⏱ ${job.duration}`} color={S.warning} />
                {job.applicants.includes(user.id) && <Badge label="✓ Applied" color={S.success} />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)} width={560}>
          <div style={{ background: S.bg, borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["💰", "Wage", `$${selected.wage}/hr`], ["⏱", "Duration", selected.duration], ["📍", "Location", selected.address], ["📅", "Due Date", selected.due]].map(([ic, lbl, val]) => (
                <div key={lbl}><p style={{ fontSize: 11, color: S.textMuted }}>{ic} {lbl}</p><p style={{ fontWeight: 700 }}>{val}</p></div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: S.textMuted, marginBottom: 16 }}>{selected.description}</p>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: S.textMuted, display: "block", marginBottom: 6 }}>Notes / Bid (optional)</label>
            <textarea value={bidNote} onChange={e => setBidNote(e.target.value)} placeholder="Add a note to your application..." rows={2}
              style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: S.bg, resize: "none" }} />
          </div>
          {selected.applicants.includes(user.id)
            ? <Badge label="✓ Already Applied" color={S.success} />
            : <Btn onClick={() => applyJob(selected)} style={{ width: "100%", justifyContent: "center", padding: "13px 20px" }}>Apply for This Job</Btn>}
        </Modal>
      )}
    </div>
  );
};

// ─── SHARED: CHAT MESSAGE BUBBLE ───────────────────────────────────────────
const MsgBubble = ({ m, isMine }) => {
  const bg = isMine ? S.accent : S.bg;
  const fg = isMine ? "#fff" : S.text;
  const radius = isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px";

  if (m.type === "image") return (
    <div style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
      <div style={{ maxWidth: "60%", background: bg, borderRadius: radius, padding: 6, color: fg }}>
        <img src={m.dataUrl} alt="photo" style={{ width: "100%", borderRadius: 10, display: "block", maxHeight: 220, objectFit: "cover" }} />
        {m.caption && <p style={{ fontSize: 13, padding: "6px 4px 2px" }}>{m.caption}</p>}
        <p style={{ fontSize: 11, opacity: 0.7, textAlign: "right", paddingRight: 4 }}>{m.time}</p>
      </div>
    </div>
  );

  if (m.type === "file") return (
    <div style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
      <div style={{ maxWidth: "65%", background: bg, borderRadius: radius, padding: "10px 14px", color: fg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: isMine ? "rgba(255,255,255,0.2)" : S.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📎</div>
          <div style={{ overflow: "hidden" }}>
            <p style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.fileName}</p>
            <p style={{ fontSize: 11, opacity: 0.7 }}>{m.fileSize}</p>
          </div>
        </div>
        <p style={{ fontSize: 11, opacity: 0.7, marginTop: 6, textAlign: "right" }}>{m.time}</p>
      </div>
    </div>
  );

  if (m.type === "voice") return (
    <div style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
      <div style={{ maxWidth: "55%", background: bg, borderRadius: radius, padding: "10px 14px", color: fg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: isMine ? "rgba(255,255,255,0.25)" : S.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", flexShrink: 0 }}>▶</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 2, alignItems: "center", height: 28 }}>
              {m.waveform.map((h, i) => <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: isMine ? "rgba(255,255,255,0.7)" : S.accent, flexShrink: 0 }} />)}
            </div>
            <p style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{m.duration}</p>
          </div>
        </div>
        <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4, textAlign: "right" }}>{m.time}</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start" }}>
      <div style={{ maxWidth: "70%", background: bg, color: fg, padding: "10px 16px", borderRadius: radius }}>
        <p style={{ fontSize: 14, lineHeight: 1.5 }}>{m.text}</p>
        <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{m.time}</p>
      </div>
    </div>
  );
};

// ─── SHARED: RICH CHAT INPUT BAR ────────────────────────────────────────────
const ChatInputBar = ({ onSend, placeholder = "Type a message..." }) => {
  const [msg, setMsg] = useState("");
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [preview, setPreview] = useState(null); // { type, dataUrl, name, size }
  const fileRef = useRef();
  const photoRef = useRef();
  const timerRef = useRef();
  const mediaRef = useRef();
  const chunksRef = useRef([]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // ── send text
  const sendText = () => {
    if (!msg.trim()) return;
    onSend({ id: Date.now(), type: "text", text: msg, time: now(), read: false });
    setMsg("");
  };

  // ── send file/photo preview
  const sendPreview = () => {
    if (!preview) return;
    onSend({ id: Date.now(), ...preview, time: now(), read: false });
    setPreview(null);
  };

  // ── file picked
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShowAttachMenu(false);
    const isImage = file.type.startsWith("image/");
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(isImage
        ? { type: "image", dataUrl: ev.target.result, fileName: file.name, fileSize: fmtSize(file.size) }
        : { type: "file", fileName: file.name, fileSize: fmtSize(file.size), dataUrl: null });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const fmtSize = (b) => b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // ── voice recording
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const secs = recSeconds || 1;
        const waveform = Array.from({ length: 28 }, () => Math.floor(Math.random() * 18) + 6);
        onSend({ id: Date.now(), type: "voice", duration: fmtTime(secs), waveform, time: now(), read: false });
        setRecording(false);
        setRecSeconds(0);
      };
      mr.start();
      setRecording(true);
      setRecSeconds(0);
      timerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
    } catch {
      // mic not available in demo — simulate anyway
      setRecording(true);
      setRecSeconds(0);
      timerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
    }
  };

  const stopRec = () => {
    clearInterval(timerRef.current);
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    } else {
      const secs = recSeconds || 1;
      const waveform = Array.from({ length: 28 }, () => Math.floor(Math.random() * 18) + 6);
      onSend({ id: Date.now(), type: "voice", duration: fmtTime(secs), waveform, time: now(), read: false });
      setRecording(false);
      setRecSeconds(0);
    }
  };

  const cancelRec = () => {
    clearInterval(timerRef.current);
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    mediaRef.current = null;
    setRecording(false);
    setRecSeconds(0);
  };

  // hidden file inputs
  const hiddenInputs = (
    <>
      <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFile} />
      <input ref={photoRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </>
  );

  // ── RECORDING STATE UI
  if (recording) return (
    <div style={{ padding: "12px 16px", borderTop: `1px solid ${S.border}`, background: "#fff1f3", display: "flex", alignItems: "center", gap: 12 }}>
      {hiddenInputs}
      <div className="pulse" style={{ width: 12, height: 12, borderRadius: "50%", background: S.accent, flexShrink: 0 }} />
      <span style={{ fontSize: 14, fontWeight: 700, color: S.accent, minWidth: 40 }}>{fmtTime(recSeconds)}</span>
      <div style={{ flex: 1, display: "flex", gap: 2, alignItems: "center", height: 32 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="pulse" style={{ width: 3, borderRadius: 2, background: S.accent, height: `${Math.floor(Math.random() * 20) + 8}px`, animationDelay: `${i * 0.05}s` }} />
        ))}
      </div>
      <button onClick={cancelRec} style={{ fontSize: 22, color: S.textMuted, padding: "0 4px" }} title="Cancel">✕</button>
      <button onClick={stopRec} style={{ width: 40, height: 40, borderRadius: "50%", background: S.accent, color: "#fff", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} title="Send voice">✓</button>
    </div>
  );

  // ── PREVIEW STATE UI
  if (preview) return (
    <div style={{ borderTop: `1px solid ${S.border}` }}>
      {hiddenInputs}
      <div style={{ padding: "10px 16px", background: S.bg, display: "flex", alignItems: "center", gap: 12 }}>
        {preview.type === "image"
          ? <img src={preview.dataUrl} alt="" style={{ height: 60, width: 60, objectFit: "cover", borderRadius: 8, border: `1px solid ${S.border}` }} />
          : <div style={{ width: 60, height: 60, borderRadius: 8, background: S.cardBg, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>📎</div>}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 700 }}>{preview.fileName}</p>
          <p style={{ fontSize: 12, color: S.textMuted }}>{preview.fileSize}</p>
        </div>
        <button onClick={() => setPreview(null)} style={{ fontSize: 20, color: S.textMuted }}>✕</button>
      </div>
      <div style={{ padding: "10px 16px", display: "flex", gap: 10 }}>
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Add a caption..." onKeyDown={e => e.key === "Enter" && sendPreview()}
          style={{ flex: 1, padding: "10px 14px", border: `1.5px solid ${S.border}`, borderRadius: 24, fontSize: 14, background: S.bg }} />
        <button onClick={sendPreview} style={{ width: 44, height: 44, borderRadius: "50%", background: S.accent, color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
      </div>
    </div>
  );

  // ── NORMAL STATE UI
  return (
    <div style={{ padding: "10px 14px", borderTop: `1px solid ${S.border}`, display: "flex", alignItems: "flex-end", gap: 8, position: "relative" }}>
      {hiddenInputs}

      {/* Attach menu */}
      {showAttachMenu && (
        <div style={{ position: "absolute", bottom: 70, left: 14, background: S.cardBg, borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: `1px solid ${S.border}`, padding: 8, display: "flex", gap: 6, zIndex: 10 }}>
          {[
            { icon: "🖼", label: "Photo", color: "#6c5ce7", action: () => { photoRef.current.click(); setShowAttachMenu(false); } },
            { icon: "📎", label: "File", color: "#0984e3", action: () => { fileRef.current.click(); setShowAttachMenu(false); } },
          ].map(item => (
            <button key={item.label} onClick={item.action}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 16px", borderRadius: 12, background: item.color + "12", border: `1px solid ${item.color}22` }}>
              <span style={{ fontSize: 26 }}>{item.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* + attach button */}
      <button onClick={() => setShowAttachMenu(v => !v)}
        style={{ width: 42, height: 42, borderRadius: "50%", background: showAttachMenu ? S.accent : S.bg, border: `1.5px solid ${showAttachMenu ? S.accent : S.border}`, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: showAttachMenu ? "#fff" : S.textMuted, transition: "all 0.2s" }}
        title="Attach file or photo">
        {showAttachMenu ? "✕" : "➕"}
      </button>

      {/* text input */}
      <input value={msg} onChange={e => setMsg(e.target.value)} placeholder={placeholder} onKeyDown={e => e.key === "Enter" && sendText()}
        style={{ flex: 1, padding: "11px 16px", border: `1.5px solid ${S.border}`, borderRadius: 24, fontSize: 14, background: S.bg, minWidth: 0 }} />

      {/* voice OR send */}
      {msg.trim()
        ? <button onClick={sendText} style={{ width: 42, height: 42, borderRadius: "50%", background: S.accent, color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} title="Send">➤</button>
        : <button onClick={startRec} style={{ width: 42, height: 42, borderRadius: "50%", background: S.bg, border: `1.5px solid ${S.border}`, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: S.textMuted }} title="Hold to record voice">🎙</button>}
    </div>
  );
};

// ─── WORKER: CHAT ──────────────────────────────────────────────────────────
const WorkerChat = ({ db, setDb, user }) => {
  const admin = db.users.find(u => u.role === "super_admin");
  const convo = db.messages.filter(m => (m.from === user.id && m.to === admin.id) || (m.from === admin.id && m.to === user.id));
  const msgEndRef = useRef(null);

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convo.length]);

  const handleSend = (msgObj) => {
    setDb(d => ({ ...d, messages: [...d.messages, { ...msgObj, from: user.id, to: admin.id }] }));
  };

  return (
    <div className="fade-in" style={{ height: "calc(100vh - 160px)", display: "flex", flexDirection: "column" }}>
      <Card style={{ flex: 1, padding: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar initials={admin.avatar} size={42} color={S.accent} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{admin.name}</p>
            <p style={{ fontSize: 12, color: S.success }}>● Available</p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[["📞", "Call"], ["🔍", "Search"]].map(([ic, lbl]) => (
              <button key={lbl} title={lbl} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${S.border}`, background: S.bg, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: "16px 16px 8px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {convo.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 60, color: S.textMuted }}>
              <p style={{ fontSize: 48, marginBottom: 10 }}>💬</p>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Start a conversation</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Send a message, photo, file or voice note</p>
            </div>
          )}
          {convo.map(m => <MsgBubble key={m.id} m={m} isMine={m.from === user.id} />)}
          <div ref={msgEndRef} />
        </div>

        {/* Rich input bar */}
        <ChatInputBar onSend={handleSend} placeholder="Message admin..." />
      </Card>
    </div>
  );
};

// ─── WORKER: GUIDES ────────────────────────────────────────────────────────
const WorkerGuides = ({ db }) => {
  const [selected, setSelected] = useState(null);
  const [problem, setProblem] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        {db.guides.map(g => (
          <Card key={g.id} onClick={() => setSelected(g)} style={{ cursor: "pointer" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{g.type === "video" ? "🎥" : "📄"}</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{g.title}</h3>
            <div style={{ display: "flex", gap: 6 }}>
              <Badge label={g.category} color={S.info} />
              <Badge label={`👁 ${g.views}`} color={S.textMuted} />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🛠 Share a Problem</h3>
        {submitted ? (
          <div style={{ textAlign: "center", padding: 20, color: S.success }}>
            <p style={{ fontSize: 32 }}>✅</p>
            <p style={{ fontWeight: 700 }}>Problem submitted! Admin will review it.</p>
            <button onClick={() => setSubmitted(false)} style={{ color: S.accent, fontSize: 14, marginTop: 8 }}>Submit another</button>
          </div>
        ) : (
          <>
            <textarea value={problem} onChange={e => setProblem(e.target.value)} placeholder="Describe the issue you're facing..." rows={3}
              style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: S.bg, resize: "none", marginBottom: 10 }} />
            <Btn onClick={() => { if (problem.trim()) { setSubmitted(true); setProblem(""); } }}>Submit Problem</Btn>
          </>
        )}
      </Card>

      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <Badge label={selected.category} color={S.info} />
          {selected.type === "video"
            ? <div style={{ marginTop: 16, background: S.bg, borderRadius: 12, overflow: "hidden", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: S.textMuted }}>🎥 Video Player Placeholder</p>
              </div>
            : <p style={{ marginTop: 16, lineHeight: 1.7, color: S.textMuted }}>{selected.content}</p>}
        </Modal>
      )}
    </div>
  );
};

// ─── WORKER: PROFILE ───────────────────────────────────────────────────────

// ─── WORKER: PROFILE (read-only + admin-approval requests) ─────────────────
const WorkerProfile = ({ user, db, setDb, showToast }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone, address: user.address || "" });
  const [submitted, setSubmitted] = useState({});
  const [changed, setChanged] = useState({});

  const t = useT();
  const { lang } = useLang();
  const fields = [
    { key: "name", label: t.fullName, icon: "👤", type: "text" },
    { key: "email", label: t.emailAddress, icon: "✉", type: "email" },
    { key: "phone", label: t.phoneNumber, icon: "📱", type: "tel" },
    { key: "address", label: t.homeAddress, icon: "📍", type: "text" },
  ];

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setChanged(c => ({ ...c, [key]: val !== user[key] }));
  };

  const requestChange = (key) => {
    if (!changed[key] || form[key] === user[key]) return;
    const req = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      field: key,
      fieldLabel: fields.find(f => f.key === key)?.label,
      oldValue: user[key],
      newValue: form[key],
      status: "pending",
      time: new Date().toLocaleString(),
    };
    setDb(d => ({ ...d, profileRequests: [...d.profileRequests, req] }));
    setSubmitted(s => ({ ...s, [key]: true }));
    setChanged(c => ({ ...c, [key]: false }));
    showToast("Request sent to admin for approval ✓");
  };

  const myRequests = db.profileRequests.filter(r => r.userId === user.id);

  return (
    <div className="fade-in" style={{ maxWidth: 520 }}>
      {/* Avatar card */}
      <Card style={{ marginBottom: 16, textAlign: "center", padding: "28px 24px" }}>
        <Avatar initials={user.avatar} size={80} color={S.accent} />
        <h2 style={{ marginTop: 14, fontSize: 22, fontWeight: 800 }}>{user.name}</h2>
        <p style={{ color: S.textMuted, fontSize: 13, marginTop: 4 }}>
          Worker ID: <strong>#{user.id?.toString().padStart(4, "0")}</strong>
        </p>
        <button style={{ marginTop: 10, fontSize: 13, color: S.accent, fontWeight: 600, border: `1px solid ${S.accent}20`, borderRadius: 20, padding: "6px 16px", background: S.accent + "10" }}>
          📷 Change Photo
        </button>
      </Card>

      {/* Info notice */}
      <div style={{ background: S.info + "12", border: `1px solid ${S.info}30`, borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ</span>
        <p style={{ fontSize: 13, color: S.info, lineHeight: 1.5 }}>
          {t.profileNotice}
        </p>
      </div>

      {/* Fields */}
      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>{t.profileInfo}</h3>
        {fields.map(({ key, label, icon, type }) => {
          const isPending = db.profileRequests.some(r => r.userId === user.id && r.field === key && r.status === "pending");
          const isApproved = db.profileRequests.some(r => r.userId === user.id && r.field === key && r.status === "approved");
          const hasChange = form[key] !== user[key];

          return (
            <div key={key} style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: S.textMuted, letterSpacing: 0.4, display: "block", marginBottom: 6, textTransform: "uppercase" }}>
                {icon} {label}
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => handleChange(key, e.target.value)}
                    disabled={isPending}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      border: `1.5px solid ${isPending ? S.warning : hasChange ? S.accent : S.border}`,
                      borderRadius: 10,
                      fontSize: 14,
                      fontFamily: "inherit",
                      color: isPending ? S.textMuted : S.text,
                      background: isPending ? S.warning + "08" : hasChange ? S.accent + "05" : S.bg,
                      transition: "all 0.2s",
                    }}
                  />
                  {isPending && (
                    <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, background: S.warning + "20", color: S.warning, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
                      {t.submitted}
                    </span>
                  )}
                  {isApproved && !isPending && (
                    <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, background: S.success + "20", color: S.success, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
                      ✓ Approved
                    </span>
                  )}
                </div>
                {hasChange && !isPending && (
                  <button
                    onClick={() => requestChange(key)}
                    style={{ flexShrink: 0, padding: "0 16px", borderRadius: 10, background: S.accent, color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                    Request →
                  </button>
                )}
              </div>
              {isPending && (
                <p style={{ fontSize: 12, color: S.warning, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                  ⏳ Your request is sent to admin — changes will apply once approved.
                </p>
              )}
            </div>
          );
        })}
      </Card>

      {/* My change requests history */}
      {myRequests.length > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📋 {t.myChangeRequests}</h3>
          {myRequests.slice().reverse().map(req => (
            <div key={req.id} style={{ padding: "12px 0", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700 }}>{req.fieldLabel}</p>
                <p style={{ fontSize: 12, color: S.textMuted, marginTop: 2 }}>
                  <span style={{ textDecoration: "line-through" }}>{req.oldValue}</span>
                  {" → "}
                  <span style={{ color: S.text, fontWeight: 600 }}>{req.newValue}</span>
                </p>
                <p style={{ fontSize: 11, color: S.textMuted, marginTop: 3 }}>{req.time}</p>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                background: req.status === "pending" ? S.warning + "18" : req.status === "approved" ? S.success + "18" : S.danger + "18",
                color: req.status === "pending" ? S.warning : req.status === "approved" ? S.success : S.danger,
              }}>
                {req.status === "pending" ? "⏳ Pending" : req.status === "approved" ? "✓ Approved" : "✕ Rejected"}
              </span>
            </div>
          ))}
        </Card>
      )}

      {/* Export */}
      <Card>
        <h3 style={{ fontWeight: 700, marginBottom: 12 }}>{t.exportData}</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn size="sm" variant="ghost">📊 Work Report PDF</Btn>
          <Btn size="sm" variant="ghost">📋 Export Excel</Btn>
        </div>
      </Card>
    </div>
  );
};

// ─── WORKER: PORTFOLIO ─────────────────────────────────────────────────────
const Portfolio = ({ user }) => (
  <div className="fade-in">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
      <StatCard label="My Rating" value={`★ ${user.rating || 0}`} icon="⭐" color={S.warning} />
      <StatCard label="Total Jobs" value={user.totalJobs || 0} icon="✅" color={S.success} />
      <StatCard label="Total Income" value={`$${(user.totalIncome || 0).toLocaleString()}`} icon="💵" color={S.info} />
    </div>
    <Card>
      <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Rating Breakdown</h3>
      {[["Reliability", 4.9], ["Work Quality", 4.7], ["Punctuality", 4.5], ["Communication", 4.8]].map(([label, score]) => (
        <div key={label} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{score}</span>
          </div>
          <div style={{ height: 8, background: S.border, borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: `${(score / 5) * 100}%`, height: "100%", background: S.warning, borderRadius: 4 }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 16, background: S.bg, borderRadius: 10, padding: 12 }}>
        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>💡 How to improve your rating</p>
        <p style={{ fontSize: 13, color: S.textMuted, lineHeight: 1.6 }}>Complete tasks on time, maintain communication with admin, and follow all safety protocols.</p>
      </div>
    </Card>
    <Card style={{ marginTop: 16 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Hours Worked</h3>
      <div style={{ fontSize: 40, fontWeight: 800, color: S.accent, fontFamily: "'Space Grotesk', sans-serif" }}>{user.totalHours || 0}</div>
      <p style={{ color: S.textMuted }}>total hours logged</p>
    </Card>
  </div>
);

// ─── ADMIN: PROFILE REQUESTS PANEL (inside User Management or Dashboard) ───
const ProfileRequestsPanel = ({ db, setDb, showToast }) => {
  const pending = db.profileRequests.filter(r => r.status === "pending");
  if (pending.length === 0) return null;

  const decide = (reqId, decision) => {
    setDb(d => {
      const req = d.profileRequests.find(r => r.id === reqId);
      let newUsers = d.users;
      if (decision === "approved" && req) {
        newUsers = d.users.map(u => u.id === req.userId ? { ...u, [req.field]: req.newValue } : u);
      }
      return {
        ...d,
        users: newUsers,
        profileRequests: d.profileRequests.map(r => r.id === reqId ? { ...r, status: decision } : r),
      };
    });
    showToast(decision === "approved" ? "Change approved & applied ✓" : "Request rejected", decision === "approved" ? "success" : "error");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ background: S.warning + "14", border: `1px solid ${S.warning}40`, borderRadius: 14, padding: "16px 20px" }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: S.warning, marginBottom: 14 }}>
          ⏳ Pending Profile Change Requests ({pending.length})
        </p>
        {pending.map(req => (
          <div key={req.id} style={{ background: S.cardBg, borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar initials={req.userAvatar} size={40} color={S.accent} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700 }}>{req.userName}</p>
              <p style={{ fontSize: 13, color: S.textMuted }}>
                Wants to change <strong>{req.fieldLabel}</strong>
              </p>
              <p style={{ fontSize: 13, marginTop: 3 }}>
                <span style={{ color: S.danger, textDecoration: "line-through" }}>{req.oldValue}</span>
                <span style={{ color: S.textMuted }}> → </span>
                <span style={{ color: S.success, fontWeight: 700 }}>{req.newValue}</span>
              </p>
              <p style={{ fontSize: 11, color: S.textMuted, marginTop: 2 }}>{req.time}</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <Btn size="sm" variant="success" onClick={() => decide(req.id, "approved")}>✓ Approve</Btn>
              <Btn size="sm" variant="danger" onClick={() => decide(req.id, "rejected")}>✕ Reject</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ADMIN: WORKER LIVE LOCATIONS & SESSIONS ────────────────────────────────
const WorkerLocationsPanel = ({ db }) => {
  const [elapsed, setElapsed] = useState({});

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const e = {};
      db.workSessions.filter(s => s.active).forEach(s => {
        const secs = Math.floor((now - s.startTs) / 1000);
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const sc = secs % 60;
        e[s.userId] = `${h}h ${String(m).padStart(2, "0")}m ${String(sc).padStart(2, "0")}s`;
      });
      setElapsed(e);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [db.workSessions]);

  const activeSessions = db.workSessions.filter(s => s.active);
  const locationLogs = db.locationLogs;

  return (
    <div className="fade-in">
      {/* Active sessions */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pulse" style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: S.success }} />
          Live Working Sessions ({activeSessions.length})
        </h3>
        {activeSessions.length === 0 ? (
          <Card><p style={{ color: S.textMuted, textAlign: "center", padding: 20 }}>No workers currently clocked in</p></Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            {activeSessions.map(session => {
              const worker = db.users.find(u => u.id === session.userId);
              return (
                <Card key={session.userId} style={{ borderLeft: `4px solid ${S.success}` }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Avatar initials={worker?.avatar} size={44} color={S.success} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{worker?.name}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                        <span className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: S.success, display: "inline-block" }} />
                        <span style={{ fontSize: 12, color: S.success, fontWeight: 700 }}>On Work</span>
                      </div>
                      <p style={{ fontSize: 20, fontWeight: 800, color: S.accent, fontFamily: "'Space Grotesk', sans-serif", marginTop: 6 }}>
                        ⏱ {elapsed[session.userId] || "0h 00m 00s"}
                      </p>
                      <p style={{ fontSize: 11, color: S.textMuted, marginTop: 2 }}>
                        📍 {session.location?.city || "Location recorded"}
                      </p>
                      <p style={{ fontSize: 11, color: S.textMuted }}>
                        Started: {new Date(session.startTs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Location login log */}
      <Card>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📍 Login Location History</h3>
        {locationLogs.length === 0 ? (
          <p style={{ color: S.textMuted, padding: "12px 0" }}>No location logs yet</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: S.bg }}>
                {["Worker", "Mode", "Location", "Lat / Lng", "Time"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {locationLogs.slice().reverse().map(log => {
                const worker = db.users.find(u => u.id === log.userId);
                return (
                  <tr key={log.id} style={{ borderTop: `1px solid ${S.border}` }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Avatar initials={worker?.avatar} size={30} color={S.accent} />
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{worker?.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <Badge label={log.mode === "working" ? "🟢 Working" : "👀 Browsing"} color={log.mode === "working" ? S.success : S.textMuted} />
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>
                      {log.location?.city}, {log.location?.country}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: S.textMuted, fontFamily: "monospace" }}>
                      {log.location?.lat?.toFixed(4)}, {log.location?.lng?.toFixed(4)}
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: S.textMuted }}>{log.time}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

// ─── POST-LOGIN: WORK STATUS MODAL ─────────────────────────────────────────
const WorkStatusModal = ({ user, onDecide }) => {
  const t = useT();
  const { lang } = useLang();
  const [locStatus, setLocStatus] = useState("asking"); // asking | granted | denied
  const [location, setLocation] = useState(null);
  const [gettingLoc, setGettingLoc] = useState(false);

  const requestLocation = () => {
    setGettingLoc(true);
    if (!navigator.geolocation) {
      // Simulate location for demo
      setTimeout(() => {
        setLocation({ lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.006 + (Math.random() - 0.5) * 0.1, city: "New York", country: "US" });
        setLocStatus("granted");
        setGettingLoc(false);
      }, 1200);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, city: "Your City", country: "US" });
        setLocStatus("granted");
        setGettingLoc(false);
      },
      () => {
        // If denied, still simulate
        setLocation({ lat: 40.7128 + (Math.random() - 0.5) * 0.1, lng: -74.006 + (Math.random() - 0.5) * 0.1, city: "New York", country: "US" });
        setLocStatus("granted");
        setGettingLoc(false);
      },
      { timeout: 6000 }
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,30,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20 }}>
      <div className="fade-in" style={{ background: S.cardBg, borderRadius: 24, padding: 36, width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: S.accent + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, margin: "0 auto 16px" }}>👋</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>👋 {user.name.split(" ")[0]}!</h2>
        <p style={{ fontSize: 14, color: S.textMuted, marginBottom: 24, lineHeight: 1.6 }}>
          {t.whatDoing}
        </p>

        {locStatus === "asking" && (
          <>
            <div style={{ background: S.info + "10", border: `1px solid ${S.info}30`, borderRadius: 12, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "flex-start", textAlign: lang.dir === "rtl" ? "right" : "left" }}>
              <span style={{ fontSize: 18 }}>📍</span>
              <p style={{ fontSize: 13, color: S.info, lineHeight: 1.5 }}>{t.locationInfo}</p>
            </div>
            <Btn onClick={requestLocation} disabled={gettingLoc} style={{ width: "100%", justifyContent: "center", marginBottom: 10, padding: "13px", fontSize: 15 }}>
              {gettingLoc ? `⏳ ${t.gettingLocation}` : `📍 ${t.allowLocation}`}
            </Btn>
            <button onClick={() => onDecide("browsing", null)} style={{ fontSize: 13, color: S.textMuted, textDecoration: "underline" }}>{t.skipBrowsing}</button>
          </>
        )}

        {locStatus === "granted" && (
          <>
            <div style={{ background: S.success + "12", border: `1px solid ${S.success}30`, borderRadius: 12, padding: "10px 14px", marginBottom: 24, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <p style={{ fontSize: 13, color: S.success, fontWeight: 600 }}>
                📍 {location?.city} ({location?.lat?.toFixed(4)}, {location?.lng?.toFixed(4)})
              </p>
            </div>
            <p style={{ fontSize: 14, color: S.text, fontWeight: 600, marginBottom: 16 }}>{t.whatDoing}</p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => onDecide("working", location)}
                style={{ flex: 1, padding: "14px 10px", borderRadius: 14, background: S.success, color: "#fff", fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 28 }}>🟢</span>
                {t.imWorking}
                <span style={{ fontSize: 11, opacity: 0.85, fontWeight: 400 }}>{t.timerStarts}</span>
              </button>
              <button
                onClick={() => onDecide("browsing", location)}
                style={{ flex: 1, padding: "14px 10px", borderRadius: 14, background: S.bg, color: S.text, fontSize: 15, fontWeight: 800, border: `1.5px solid ${S.border}`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 28 }}>👀</span>
                {t.justBrowsing}
                <span style={{ fontSize: 11, color: S.textMuted, fontWeight: 400 }}>{t.noTimer}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── WORKER: LIVE WORK TIMER BANNER ────────────────────────────────────────
const WorkTimerBanner = ({ session, onClockOut }) => {
  const t = useT();
  const [elapsed, setElapsed] = useState("0h 00m 00s");

  useEffect(() => {
    const tick = () => {
      const secs = Math.floor((Date.now() - session.startTs) / 1000);
      const h = Math.floor(secs / 3600);
      const m = Math.floor((secs % 3600) / 60);
      const s = secs % 60;
      setElapsed(`${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [session.startTs]);

  return (
    <div style={{ background: `linear-gradient(90deg, ${S.success}, #00cec9)`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 14 }}>
      <span className="pulse" style={{ width: 10, height: 10, borderRadius: "50%", background: "#fff", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600, letterSpacing: 0.5 }}>{t.onWork}</p>
        <p style={{ fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 1 }}>{elapsed}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>📍 {session.location?.city}</p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Started {new Date(session.startTs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
      </div>
      <button onClick={onClockOut}
        style={{ padding: "8px 18px", borderRadius: 20, background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.5)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>
        Clock Out
      </button>
    </div>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────
// ─── ADMIN: GUEST ISSUES PANEL ─────────────────────────────────────────────
const GuestIssuesPanel = ({ db, setDb, showToast }) => {
  const issues = db.guestIssues || [];
  if (issues.length === 0) return null;
  const newIssues = issues.filter(i => i.status === "new");
  if (newIssues.length === 0) return null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ background: S.info + "12", border: `1px solid ${S.info}30`, borderRadius: 14, padding: "16px 20px" }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: S.info, marginBottom: 14 }}>
          💬 Guest Login Issues ({newIssues.length} new)
        </p>
        {newIssues.map(issue => (
          <div key={issue.id} style={{ background: S.cardBg, borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: S.info + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{issue.name}</p>
                <span style={{ fontSize: 11, color: S.textMuted }}>{issue.time}</span>
              </div>
              {issue.phone && <p style={{ fontSize: 12, color: S.info, marginTop: 2 }}>📞 {issue.phone}</p>}
              <p style={{ fontSize: 13, color: S.text, marginTop: 6, lineHeight: 1.5, background: S.bg, borderRadius: 8, padding: "8px 10px" }}>{issue.problem}</p>
            </div>
            <button onClick={() => { setDb(d => ({ ...d, guestIssues: d.guestIssues.map(i => i.id === issue.id ? { ...i, status: "resolved" } : i) })); showToast("Issue marked resolved"); }}
              style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 8, background: S.success + "18", border: `1px solid ${S.success}30`, color: S.success, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              ✓ Resolve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TRANSLATED SIDEBAR ─────────────────────────────────────────────────────
const TranslatedSidebar = ({ user, activeSection, setSection, onLogout, pendingRequests = 0 }) => {
  const t = useT();
  const isAdmin = ["super_admin", "admin", "team_lead"].includes(user.role);


  const workerNav = [
    { id: "home", icon: "🏠", label: t.home },
    { id: "apply", icon: "💼", label: t.applyJobs },
    { id: "chat", icon: "💬", label: t.chatAdmin },
    { id: "guides", icon: "📚", label: t.watchGuides },
    { id: "earnings", icon: "💵", label: t.myEarnings || "My Earnings" },
    { id: "profile", icon: "👤", label: t.myProfile },
    { id: "portfolio", icon: "⭐", label: t.ratingsPortfolio },
  ];
  const adminNavFull = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "users", icon: "👥", label: "User Management" },
    { id: "locations", icon: "📍", label: "Worker Locations" },
    { id: "jobs", icon: "📋", label: "Jobs & Tasks" },
    { id: "reports", icon: "📊", label: "Reports" },
    { id: "comms", icon: "💬", label: "Communications" },
    { id: "guides-admin", icon: "📚", label: "Resources" },
    { id: "ratings", icon: "⭐", label: "Ratings" },
    { id: "teams", icon: "🏆", label: "Teams" },
    { id: "finance", icon: "💰", label: "Finance" },
    { id: "earnings-admin", icon: "💵", label: "Manage Earnings" },
    { id: "settings", icon: "⚙", label: "Settings" },
    { id: "marquee", icon: "📢", label: "Marquee & Bulk Msg" },
  ];
  const nav = isAdmin ? adminNavFull : workerNav;
  const { lang } = useLang();

  return (
    <div style={{ width: 240, background: S.sidebarBg, height: "100vh", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 200, flexShrink: 0 }}>
      <div style={{ padding: "28px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: -0.5 }}>WORKLY</span>
        </div>
        <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "20px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar initials={user.avatar} size={38} color={S.accentLight} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{user.name.split(" ")[0]}</p>
            <p style={{ fontSize: 11, color: S.sidebarText, textTransform: "capitalize" }}>{user.role.replace("_", " ")}</p>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "0 12px", overflowY: "auto" }}>
        {nav.map(item => {
          const hasBadge = isAdmin && item.id === "users" && pendingRequests > 0;
          return (
            <button key={item.id} onClick={() => setSection(item.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 12, marginBottom: 4, background: activeSection === item.id ? S.accent : "transparent", color: activeSection === item.id ? "#fff" : S.sidebarText, fontSize: 14, fontWeight: activeSection === item.id ? 600 : 400, transition: "all 0.2s", textAlign: "left" }}
              onMouseEnter={e => activeSection !== item.id && (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={e => activeSection !== item.id && (e.currentTarget.style.background = "transparent")}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {hasBadge && <span style={{ background: S.accent, color: "#fff", fontSize: 10, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{pendingRequests}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: 16 }}>
        <button onClick={onLogout} style={{ width: "100%", padding: "11px 14px", borderRadius: 12, background: "rgba(233,69,96,0.15)", color: S.accent, fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
};


// ─── WORKER: MY EARNINGS ───────────────────────────────────────────────────
const WorkerEarnings = ({ db, user }) => {
  const [filter, setFilter] = useState("all");
  const myEarnings = db.earnings.filter(e => e.workerId === user.id);

  const filtered = filter === "all" ? myEarnings : myEarnings.filter(e =>
    filter === "pending" ? e.status === "pending" :
    filter === "approved" ? (e.status === "approved" && e.payoutStatus === "pending") :
    filter === "received" ? e.payoutStatus === "received" :
    filter === "rejected" ? e.status === "rejected" : true
  );

  const totalApproved = myEarnings.filter(e => e.status === "approved").reduce((s, e) => s + e.amount, 0);
  const totalReceived = myEarnings.filter(e => e.payoutStatus === "received").reduce((s, e) => s + e.amount, 0);
  const totalPending = myEarnings.filter(e => e.status === "pending").reduce((s, e) => s + e.amount, 0);
  const totalYetToReceive = myEarnings.filter(e => e.status === "approved" && e.payoutStatus === "pending").reduce((s, e) => s + e.amount, 0);

  const statusConfig = {
    pending:  { label: "⏳ Awaiting Approval", color: S.warning, bg: S.warning + "15" },
    approved: { label: "✅ Approved", color: S.success, bg: S.success + "15" },
    rejected: { label: "✕ Rejected", color: S.danger, bg: S.danger + "15" },
  };
  const payoutConfig = {
    received: { label: "💰 Received", color: S.info, bg: S.info + "12" },
    pending:  { label: "🕐 Yet to Receive", color: S.warning, bg: S.warning + "12" },
  };

  return (
    <div className="fade-in">
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Approved", value: `$${totalApproved.toLocaleString()}`, icon: "✅", color: S.success, sub: "Admin confirmed" },
          { label: "Already Received", value: `$${totalReceived.toLocaleString()}`, icon: "💰", color: S.info, sub: "In your account" },
          { label: "Yet to Receive", value: `$${totalYetToReceive.toLocaleString()}`, icon: "🕐", color: S.warning, sub: "Approved, not paid" },
          { label: "Awaiting Review", value: `$${totalPending.toLocaleString()}`, icon: "⏳", color: S.textMuted, sub: "Pending admin approval" },
        ].map(card => (
          <Card key={card.label} style={{ padding: "18px 20px", borderLeft: `4px solid ${card.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{card.label}</p>
                <p style={{ fontSize: 24, fontWeight: 800, color: card.color, fontFamily: "'Space Grotesk', sans-serif" }}>{card.value}</p>
                <p style={{ fontSize: 11, color: S.textMuted, marginTop: 4 }}>{card.sub}</p>
              </div>
              <span style={{ fontSize: 24 }}>{card.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "⏳ Awaiting Approval" },
          { key: "approved", label: "✅ Approved — Yet to Receive" },
          { key: "received", label: "💰 Received" },
          { key: "rejected", label: "✕ Rejected" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: `1.5px solid ${filter === tab.key ? S.accent : S.border}`, background: filter === tab.key ? S.accent : S.cardBg, color: filter === tab.key ? "#fff" : S.textMuted, transition: "all 0.2s" }}>
            {tab.label} {tab.key !== "all" && <span style={{ opacity: 0.8 }}>({myEarnings.filter(e => tab.key === "pending" ? e.status === "pending" : tab.key === "approved" ? e.status === "approved" && e.payoutStatus === "pending" : tab.key === "received" ? e.payoutStatus === "received" : e.status === "rejected").length})</span>}
          </button>
        ))}
      </div>

      {/* Earnings list */}
      {filtered.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 36, marginBottom: 10 }}>💵</p>
          <p style={{ fontWeight: 600, color: S.textMuted }}>No earnings in this category yet</p>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(earning => {
            const job = db.jobs.find(j => j.id === earning.jobId);
            const approver = db.users.find(u => u.id === earning.approvedBy);
            const sc = statusConfig[earning.status];
            const pc = payoutConfig[earning.payoutStatus];
            return (
              <Card key={earning.id} style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  {/* Left — task info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 22 }}>{job?.image || "💼"}</span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15 }}>{earning.taskTitle}</p>
                        <p style={{ fontSize: 12, color: S.textMuted }}>📅 {earning.date} · ⏱ {earning.hours}h worked</p>
                      </div>
                    </div>

                    {/* Status row */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                      {/* Approval status */}
                      <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                      {/* Payout status — only show if approved */}
                      {earning.status === "approved" && (
                        <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: pc.bg, color: pc.color }}>
                          {pc.label}
                        </span>
                      )}
                    </div>

                    {/* Approval details */}
                    {earning.approvedBy && (
                      <p style={{ fontSize: 12, color: S.textMuted, marginTop: 8 }}>
                        ✅ Approved by <strong>{approver?.name || "Admin"}</strong> on {earning.approvedAt}
                      </p>
                    )}
                    {earning.payoutStatus === "received" && earning.paidAt && (
                      <p style={{ fontSize: 12, color: S.info, marginTop: 4 }}>
                        💰 Payment received on <strong>{earning.paidAt}</strong>
                      </p>
                    )}
                    {earning.status === "rejected" && (
                      <p style={{ fontSize: 12, color: S.danger, marginTop: 6, background: S.danger + "10", padding: "6px 10px", borderRadius: 8 }}>
                        ✕ This earning was rejected by admin. Contact admin for details.
                      </p>
                    )}
                    {earning.status === "pending" && (
                      <p style={{ fontSize: 12, color: S.warning, marginTop: 6 }}>
                        ⏳ Awaiting admin review — you will be notified once approved.
                      </p>
                    )}
                  </div>

                  {/* Right — amount */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 28, fontWeight: 900, color: earning.status === "rejected" ? S.danger : earning.payoutStatus === "received" ? S.success : S.accent, fontFamily: "'Space Grotesk', sans-serif" }}>
                      ${earning.amount.toLocaleString()}
                    </p>
                    <p style={{ fontSize: 12, color: S.textMuted }}>${Math.round(earning.amount / earning.hours)}/hr avg</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Total summary footer */}
      <Card style={{ marginTop: 20, background: S.primary, border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 4 }}>Total Approved Earnings</p>
            <p style={{ fontSize: 32, fontWeight: 900, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>${totalApproved.toLocaleString()}</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 }}>Received: <strong style={{ color: "#00d4aa" }}>${totalReceived.toLocaleString()}</strong> · Pending: <strong style={{ color: "#fdcb6e" }}>${totalYetToReceive.toLocaleString()}</strong></p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>Total hours worked</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{myEarnings.reduce((s, e) => s + e.hours, 0)}h</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─── ADMIN: EARNINGS MANAGER ───────────────────────────────────────────────
const AdminEarningsManager = ({ db, setDb, showToast }) => {
  const [filterWorker, setFilterWorker] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const workers = db.users.filter(u => u.role === "worker");
  const allEarnings = db.earnings;

  const filtered = allEarnings.filter(e => {
    const wMatch = filterWorker === "all" || e.workerId === Number(filterWorker);
    const sMatch = filterStatus === "all" || e.status === filterStatus || (filterStatus === "received" && e.payoutStatus === "received");
    return wMatch && sMatch;
  });

  const updateStatus = (id, field, value, adminId) => {
    setDb(d => ({ ...d, earnings: d.earnings.map(e => e.id === id
      ? { ...e, [field]: value, ...(field === "status" && value === "approved" ? { approvedBy: adminId, approvedAt: new Date().toLocaleString() } : {}), ...(field === "payoutStatus" && value === "received" ? { paidAt: new Date().toISOString().split("T")[0] } : {}) }
      : e
    ) }));
    showToast(field === "status" ? `Earning ${value} ✓` : `Payout marked as ${value} ✓`);
  };

  const totalByWorker = {};
  workers.forEach(w => {
    const we = allEarnings.filter(e => e.workerId === w.id);
    totalByWorker[w.id] = {
      approved: we.filter(e => e.status === "approved").reduce((s, e) => s + e.amount, 0),
      received: we.filter(e => e.payoutStatus === "received").reduce((s, e) => s + e.amount, 0),
      pending: we.filter(e => e.status === "pending").reduce((s, e) => s + e.amount, 0),
    };
  });

  const currentUser = db.users.find(u => u.role === "super_admin");

  return (
    <div className="fade-in">
      {/* Worker summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        {workers.map(w => (
          <Card key={w.id} style={{ cursor: "pointer", borderLeft: `4px solid ${S.accent}` }} onClick={() => setFilterWorker(String(w.id))}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <Avatar initials={w.avatar} size={36} color={S.accent} />
              <div>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{w.name}</p>
                <p style={{ fontSize: 11, color: S.textMuted }}>{allEarnings.filter(e => e.workerId === w.id).length} earnings entries</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Approved", totalByWorker[w.id]?.approved, S.success], ["Received", totalByWorker[w.id]?.received, S.info], ["Pending", totalByWorker[w.id]?.pending, S.warning]].map(([lbl, val, col]) => (
                <div key={lbl} style={{ background: col + "12", borderRadius: 8, padding: "6px 10px" }}>
                  <p style={{ fontSize: 10, color: col, fontWeight: 700 }}>{lbl}</p>
                  <p style={{ fontSize: 15, fontWeight: 800, color: col }}>${(val || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <select value={filterWorker} onChange={e => setFilterWorker(e.target.value)}
          style={{ padding: "9px 16px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.cardBg, fontFamily: "inherit" }}>
          <option value="all">All Workers</option>
          {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "9px 16px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, background: S.cardBg, fontFamily: "inherit" }}>
          <option value="all">All Statuses</option>
          <option value="pending">⏳ Awaiting Approval</option>
          <option value="approved">✅ Approved</option>
          <option value="received">💰 Received</option>
          <option value="rejected">✕ Rejected</option>
        </select>
        {filterWorker !== "all" && <button onClick={() => setFilterWorker("all")} style={{ fontSize: 13, color: S.accent, fontWeight: 600 }}>✕ Clear filter</button>}
      </div>

      {/* Earnings table */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${S.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontWeight: 700, fontSize: 15 }}>Earnings Records ({filtered.length})</p>
          <Btn size="sm" variant="ghost">📊 Export</Btn>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ background: S.bg }}>
                {["Worker", "Task / Job", "Date", "Hours", "Amount", "Approval", "Payout", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: S.textMuted, textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const worker = db.users.find(u => u.id === e.workerId);
                return (
                  <tr key={e.id} style={{ borderTop: `1px solid ${S.border}` }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <Avatar initials={worker?.avatar} size={28} color={S.accent} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{worker?.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", maxWidth: 200 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{e.taskTitle}</p>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: S.textMuted, whiteSpace: "nowrap" }}>{e.date}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600 }}>{e.hours}h</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: S.success, fontFamily: "'Space Grotesk', sans-serif" }}>${e.amount}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {e.status === "pending" ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => updateStatus(e.id, "status", "approved", currentUser?.id)}
                            style={{ padding: "5px 12px", borderRadius: 8, background: S.success + "18", color: S.success, fontSize: 12, fontWeight: 700, border: `1px solid ${S.success}30` }}>
                            ✓ Approve
                          </button>
                          <button onClick={() => updateStatus(e.id, "status", "rejected", currentUser?.id)}
                            style={{ padding: "5px 12px", borderRadius: 8, background: S.danger + "18", color: S.danger, fontSize: 12, fontWeight: 700, border: `1px solid ${S.danger}30` }}>
                            ✕ Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
                          background: e.status === "approved" ? S.success + "15" : S.danger + "15",
                          color: e.status === "approved" ? S.success : S.danger }}>
                          {e.status === "approved" ? "✅ Approved" : "✕ Rejected"}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {e.status === "approved" ? (
                        e.payoutStatus === "received" ? (
                          <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, background: S.info + "15", color: S.info }}>
                            💰 Received {e.paidAt}
                          </span>
                        ) : (
                          <button onClick={() => updateStatus(e.id, "payoutStatus", "received", currentUser?.id)}
                            style={{ padding: "5px 14px", borderRadius: 8, background: S.info + "18", color: S.info, fontSize: 12, fontWeight: 700, border: `1px solid ${S.info}30` }}>
                            Mark Received
                          </button>
                        )
                      ) : (
                        <span style={{ fontSize: 12, color: S.textMuted }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {e.status === "approved" && e.payoutStatus === "pending" && (
                        <button onClick={() => showToast("Payment notification sent!")}
                          style={{ padding: "5px 12px", borderRadius: 8, background: S.warning + "18", color: S.warning, fontSize: 12, fontWeight: 700, border: `1px solid ${S.warning}30` }}>
                          📢 Notify
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};


// ─── MARQUEE BANNER (shown after login for all users) ───────────────────────
const MarqueeBanner = ({ db }) => {
  const active = (db.marquees || []).filter(m => m.active);
  if (active.length === 0) return null;

  return (
    <div style={{ position: "relative", overflow: "hidden", zIndex: 60 }}>
      {active.map(m => {
        const cls = m.priority === "urgent" ? "marquee-urgent" : m.priority === "info" ? "marquee-info" : "marquee-normal";
        const duration = Math.max(8, Math.round(m.text.length / (m.speed / 10)));
        const doubled = m.text + "   •   " + m.text + "   •   " + m.text + "   •   " + m.text;
        return (
          <div key={m.id} className={cls} style={{ padding: "9px 0", display: "flex", alignItems: "center", gap: 0 }}>
            {/* Fixed label */}
            <div style={{ flexShrink: 0, padding: "0 18px 0 16px", borderRight: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.25)" }}>
              {m.priority === "urgent" && <span className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", display: "inline-block" }} />}
              <span style={{ fontSize: 11, fontWeight: 900, color: "#fff", letterSpacing: 1.5, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                {m.priority === "urgent" ? "🚨 URGENT" : m.priority === "info" ? "ℹ INFO" : "📢 NOTICE"}
              </span>
            </div>
            {/* Scrolling text */}
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="marquee-track" style={{ animationDuration: `${duration}s` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", padding: "0 40px", whiteSpace: "nowrap" }}>{doubled}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", padding: "0 40px", whiteSpace: "nowrap" }}>{doubled}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── ADMIN: MARQUEE & BULK MSG MANAGER ──────────────────────────────────────
const MarqueeManager = ({ db, setDb, showToast }) => {
  const [tab, setTab] = useState("marquee"); // marquee | bulk
  const [showAddMarquee, setShowAddMarquee] = useState(false);
  const [marqueeForm, setMarqueeForm] = useState({ text: "", priority: "urgent", speed: 40 });
  const [bulkForm, setBulkForm] = useState({ subject: "", message: "", sendTo: "all", selectedWorkers: [] });
  const [showBulkCompose, setShowBulkCompose] = useState(false);

  const workers = db.users.filter(u => u.role === "worker");

  // ─ Marquee actions
  const addMarquee = () => {
    if (!marqueeForm.text.trim()) return;
    setDb(d => ({ ...d, marquees: [...(d.marquees || []), { id: Date.now(), ...marqueeForm, active: true, createdBy: 1, createdAt: new Date().toLocaleString() }] }));
    setMarqueeForm({ text: "", priority: "urgent", speed: 40 });
    setShowAddMarquee(false);
    showToast("🚨 Marquee is now live for all workers!");
  };
  const toggleMarquee = (id) => {
    setDb(d => ({ ...d, marquees: d.marquees.map(m => m.id === id ? { ...m, active: !m.active } : m) }));
    showToast("Marquee updated");
  };
  const deleteMarquee = (id) => {
    setDb(d => ({ ...d, marquees: d.marquees.filter(m => m.id !== id) }));
    showToast("Marquee removed");
  };

  // ─ Bulk message send
  const sendBulk = () => {
    if (!bulkForm.message.trim()) return;
    const targets = bulkForm.sendTo === "all"
      ? workers
      : bulkForm.sendTo === "selected"
        ? workers.filter(w => bulkForm.selectedWorkers.includes(w.id))
        : [];
    const now = Date.now();
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsgs = targets.map((w, i) => ({ id: now + i, from: 1, to: w.id, text: bulkForm.message, time, type: "text", read: false }));
    const record = { id: now, subject: bulkForm.subject, message: bulkForm.message, sentTo: targets.map(w => w.id), sentToLabel: bulkForm.sendTo === "all" ? "All Workers" : `${targets.length} selected`, sentAt: new Date().toLocaleString(), count: targets.length };
    setDb(d => ({ ...d, messages: [...d.messages, ...newMsgs], bulkMessages: [...(d.bulkMessages || []), record] }));
    setBulkForm({ subject: "", message: "", sendTo: "all", selectedWorkers: [] });
    setShowBulkCompose(false);
    showToast(`✅ Message sent to ${targets.length} worker${targets.length !== 1 ? "s" : ""}!`);
  };

  const toggleWorkerSelect = (wId) => {
    setBulkForm(f => ({ ...f, selectedWorkers: f.selectedWorkers.includes(wId) ? f.selectedWorkers.filter(id => id !== wId) : [...f.selectedWorkers, wId] }));
  };

  const priorityColors = { urgent: S.danger, info: S.info, normal: S.primary };

  return (
    <div className="fade-in">
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 24, background: S.bg, borderRadius: 14, padding: 4, width: "fit-content" }}>
        {[["marquee", "🚨 Marquee / Ticker"], ["bulk", "📨 Bulk Messages"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: "10px 22px", borderRadius: 10, fontSize: 14, fontWeight: 700, background: tab === key ? S.cardBg : "transparent", color: tab === key ? S.accent : S.textMuted, boxShadow: tab === key ? "0 2px 8px rgba(0,0,0,0.08)" : "none", transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── MARQUEE TAB ── */}
      {tab === "marquee" && (
        <>
          {/* Live preview */}
          {(db.marquees || []).some(m => m.active) && (
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: S.textMuted, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>Live Preview</p>
              <div style={{ borderRadius: 12, overflow: "hidden", border: `2px solid ${S.accent}` }}>
                <MarqueeBanner db={db} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <Btn onClick={() => setShowAddMarquee(true)}>➕ New Marquee</Btn>
          </div>

          {(db.marquees || []).length === 0 ? (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <p style={{ fontSize: 36 }}>📢</p>
              <p style={{ color: S.textMuted, marginTop: 8 }}>No marquees yet. Add one to broadcast urgent info.</p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(db.marquees || []).map(m => (
                <Card key={m.id} style={{ borderLeft: `4px solid ${priorityColors[m.priority] || S.accent}` }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <Badge label={m.priority.toUpperCase()} color={priorityColors[m.priority] || S.accent} />
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: m.active ? S.success + "18" : S.border, color: m.active ? S.success : S.textMuted }}>
                          {m.active ? "● LIVE" : "○ Paused"}
                        </span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: S.text, lineHeight: 1.5 }}>{m.text}</p>
                      <p style={{ fontSize: 11, color: S.textMuted, marginTop: 6 }}>Speed: {m.speed} · Added: {m.createdAt}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => toggleMarquee(m.id)}
                        style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: `1.5px solid ${m.active ? S.warning : S.success}`, color: m.active ? S.warning : S.success, background: "transparent" }}>
                        {m.active ? "⏸ Pause" : "▶ Activate"}
                      </button>
                      <button onClick={() => deleteMarquee(m.id)}
                        style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, border: `1.5px solid ${S.danger}`, color: S.danger, background: "transparent" }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── BULK MESSAGES TAB ── */}
      {tab === "bulk" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <Btn onClick={() => setShowBulkCompose(true)}>✉ Compose Bulk Message</Btn>
          </div>

          {/* Sent history */}
          {(db.bulkMessages || []).length === 0 ? (
            <Card style={{ textAlign: "center", padding: 40 }}>
              <p style={{ fontSize: 36 }}>✉</p>
              <p style={{ color: S.textMuted, marginTop: 8 }}>No bulk messages sent yet.</p>
            </Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(db.bulkMessages || []).slice().reverse().map(bm => (
                <Card key={bm.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      {bm.subject && <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{bm.subject}</p>}
                      <p style={{ fontSize: 14, color: S.textMuted, lineHeight: 1.5, marginBottom: 10 }}>{bm.message}</p>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Badge label={`👥 ${bm.sentToLabel}`} color={S.info} />
                        <Badge label={`📅 ${bm.sentAt}`} color={S.textMuted} />
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                      <p style={{ fontSize: 28, fontWeight: 900, color: S.accent, fontFamily: "'Space Grotesk', sans-serif" }}>{bm.count}</p>
                      <p style={{ fontSize: 11, color: S.textMuted }}>recipients</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── ADD MARQUEE MODAL ── */}
      {showAddMarquee && (
        <Modal title="🚨 New Marquee Message" onClose={() => setShowAddMarquee(false)}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: S.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Priority Level</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[["urgent", "🚨 Urgent", S.danger], ["info", "ℹ Info", S.info], ["normal", "📢 Normal", S.primary]].map(([val, label, col]) => (
                <button key={val} onClick={() => setMarqueeForm(f => ({ ...f, priority: val }))}
                  style={{ flex: 1, padding: "10px 8px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: `2px solid ${marqueeForm.priority === val ? col : S.border}`, background: marqueeForm.priority === val ? col + "15" : S.bg, color: marqueeForm.priority === val ? col : S.textMuted, transition: "all 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: S.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Message Text *</label>
            <textarea value={marqueeForm.text} onChange={e => setMarqueeForm(f => ({ ...f, text: e.target.value }))} placeholder="Type the urgent message to display in the ticker..." rows={3}
              style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: S.bg, resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: S.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Scroll Speed: {marqueeForm.speed}</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: S.textMuted }}>Slow</span>
              <input type="range" min={15} max={80} step={5} value={marqueeForm.speed} onChange={e => setMarqueeForm(f => ({ ...f, speed: Number(e.target.value) }))} style={{ flex: 1 }} />
              <span style={{ fontSize: 12, color: S.textMuted }}>Fast</span>
            </div>
          </div>
          {/* Live mini preview */}
          {marqueeForm.text && (
            <div style={{ marginBottom: 20, borderRadius: 10, overflow: "hidden" }}>
              <p style={{ fontSize: 11, color: S.textMuted, marginBottom: 6 }}>Preview:</p>
              <MarqueeBanner db={{ marquees: [{ ...marqueeForm, id: "preview", active: true }] }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={addMarquee} style={{ flex: 1, justifyContent: "center" }}>🚨 Go Live Now</Btn>
            <Btn variant="ghost" onClick={() => setShowAddMarquee(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* ── BULK COMPOSE MODAL ── */}
      {showBulkCompose && (
        <Modal title="✉ Compose Bulk Message" onClose={() => setShowBulkCompose(false)} width={560}>
          <Input label="Subject (optional)" value={bulkForm.subject} onChange={v => setBulkForm(f => ({ ...f, subject: v }))} placeholder="e.g. Shift reminder for tomorrow" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: S.textMuted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.4 }}>Message *</label>
            <textarea value={bulkForm.message} onChange={e => setBulkForm(f => ({ ...f, message: e.target.value }))} placeholder="Write your message here..." rows={4}
              style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${S.border}`, borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: S.bg, resize: "vertical" }} />
          </div>

          {/* Send to */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: S.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>Send To</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[["all", "👥 All Workers"], ["selected", "🎯 Selected Only"]].map(([val, label]) => (
                <button key={val} onClick={() => setBulkForm(f => ({ ...f, sendTo: val }))}
                  style={{ flex: 1, padding: "10px 8px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: `2px solid ${bulkForm.sendTo === val ? S.accent : S.border}`, background: bulkForm.sendTo === val ? S.accent + "12" : S.bg, color: bulkForm.sendTo === val ? S.accent : S.textMuted }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Worker selector */}
            {bulkForm.sendTo === "selected" && (
              <div style={{ border: `1.5px solid ${S.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "10px 14px", background: S.bg, fontSize: 12, fontWeight: 700, color: S.textMuted, borderBottom: `1px solid ${S.border}` }}>
                  Select workers ({bulkForm.selectedWorkers.length} selected)
                </div>
                {workers.map(w => {
                  const selected = bulkForm.selectedWorkers.includes(w.id);
                  return (
                    <div key={w.id} onClick={() => toggleWorkerSelect(w.id)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", cursor: "pointer", background: selected ? S.accent + "08" : "transparent", borderBottom: `1px solid ${S.border}`, transition: "background 0.15s" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${selected ? S.accent : S.border}`, background: selected ? S.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {selected && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>✓</span>}
                      </div>
                      <Avatar initials={w.avatar} size={32} color={S.accent} />
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 600 }}>{w.name}</p>
                        <p style={{ fontSize: 11, color: S.textMuted }}>{w.role} · {w.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={{ background: S.bg, borderRadius: 10, padding: "12px 14px", marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: S.textMuted }}>
              This message will be sent to{" "}
              <strong style={{ color: S.accent }}>
                {bulkForm.sendTo === "all" ? `all ${workers.length} workers` : `${bulkForm.selectedWorkers.length} selected worker${bulkForm.selectedWorkers.length !== 1 ? "s" : ""}`}
              </strong>
              {" "}and will appear in their chat inbox.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={sendBulk} disabled={!bulkForm.message.trim() || (bulkForm.sendTo === "selected" && bulkForm.selectedWorkers.length === 0)} style={{ flex: 1, justifyContent: "center" }}>
              ✉ Send Now
            </Btn>
            <Btn variant="ghost" onClick={() => setShowBulkCompose(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};


// ─── ADMIN: PASSWORD RESET REQUESTS PANEL ──────────────────────────────────
const PasswordRequestsPanel = ({ db, setDb, showToast }) => {
  const [newPassInputs, setNewPassInputs] = useState({});
  const pending = (db.passwordRequests || []).filter(r => r.status === "pending");
  if (pending.length === 0) return null;

  const setPass = (id, val) => setNewPassInputs(p => ({ ...p, [id]: val }));

  const approveReset = (req) => {
    const newPass = newPassInputs[req.id]?.trim();
    if (!newPass || newPass.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    // Update user password in DB
    setDb(d => ({
      ...d,
      users: d.users.map(u => u.id === req.userId ? { ...u, password: newPass } : u),
      passwordRequests: (d.passwordRequests || []).map(r =>
        r.id === req.id ? { ...r, status: "approved", newPassword: newPass, emailSent: true, resolvedAt: new Date().toLocaleString() } : r
      ),
      // Simulate email: send in-app message to worker
      messages: [...d.messages, {
        id: Date.now(),
        from: 1,
        to: req.userId,
        text: `🔐 Your password has been reset by Admin.\n\nYour new password is: ${newPass}\n\nPlease log in and change it to something personal. Never share your password.`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        read: false,
      }],
    }));
    setNewPassInputs(p => { const n = { ...p }; delete n[req.id]; return n; });
    showToast(`✅ Password reset for ${req.userName} — email sent!`);
  };

  const rejectReset = (reqId) => {
    setDb(d => ({ ...d, passwordRequests: (d.passwordRequests || []).map(r => r.id === reqId ? { ...r, status: "rejected", resolvedAt: new Date().toLocaleString() } : r) }));
    showToast("Reset request rejected");
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ background: "#fff8e1", border: "1.5px solid #fdcb6e60", borderRadius: 14, padding: "16px 20px" }}>
        <p style={{ fontSize: 14, fontWeight: 800, color: "#b7860b", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🔐</span>
          Password Reset Requests ({pending.length})
        </p>
        {pending.map(req => (
          <div key={req.id} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", marginBottom: 12, border: "1px solid #fde8a0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Worker info */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1, minWidth: 200 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e94560" + "22", border: "2px solid #e9456033", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#e94560", flexShrink: 0 }}>
                  {req.userAvatar}
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "#1a1a2e" }}>{req.userName}</p>
                  <p style={{ fontSize: 13, color: "#8892b0" }}>📧 {req.userEmail}</p>
                  <p style={{ fontSize: 11, color: "#b2bec3", marginTop: 2 }}>Requested: {req.requestedAt}</p>
                </div>
              </div>

              {/* Set new password + actions */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", flex: 1, minWidth: 260 }}>
                <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
                  <input
                    type="text"
                    value={newPassInputs[req.id] || ""}
                    onChange={e => setPass(req.id, e.target.value)}
                    placeholder="Set new password..."
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8eaf0", borderRadius: 10, fontSize: 14, fontFamily: "inherit", color: "#1a1a2e", background: "#f8f9fd", boxSizing: "border-box", outline: "none" }}
                    onFocus={e => { e.target.style.border = "1.5px solid #00b894"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.border = "1.5px solid #e8eaf0"; e.target.style.background = "#f8f9fd"; }}
                  />
                  <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#b2bec3" }}>🔑</span>
                </div>
                <button
                  onClick={() => approveReset(req)}
                  disabled={!(newPassInputs[req.id]?.trim()?.length >= 6)}
                  style={{ padding: "10px 16px", borderRadius: 10, background: !(newPassInputs[req.id]?.trim()?.length >= 6) ? "#e8eaf0" : "#00b894", color: !(newPassInputs[req.id]?.trim()?.length >= 6) ? "#b2bec3" : "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: !(newPassInputs[req.id]?.trim()?.length >= 6) ? "not-allowed" : "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                  ✓ Approve & Email
                </button>
                <button
                  onClick={() => rejectReset(req.id)}
                  style={{ padding: "10px 14px", borderRadius: 10, background: "transparent", color: "#e17055", fontSize: 13, fontWeight: 700, border: "1.5px solid #e1705540", cursor: "pointer" }}>
                  ✕ Reject
                </button>
              </div>
            </div>

            {/* Helper note */}
            <div style={{ marginTop: 12, padding: "8px 12px", background: "#eafaf1", borderRadius: 8, fontSize: 12, color: "#1e8449" }}>
              📧 Once approved, the new password will be automatically sent to <strong>{req.userEmail}</strong> via in-app message.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ADMIN: PASSWORD REQUESTS HISTORY ──────────────────────────────────────
const PasswordHistorySection = ({ db }) => {
  const resolved = (db.passwordRequests || []).filter(r => r.status !== "pending").slice().reverse();
  if (resolved.length === 0) return null;
  return (
    <Card style={{ marginTop: 16 }}>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>🔐 Password Reset History</h3>
      {resolved.map(r => (
        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #e8eaf0" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{r.userName}</p>
            <p style={{ fontSize: 12, color: "#8892b0" }}>{r.userEmail} · Requested: {r.requestedAt}</p>
            {r.resolvedAt && <p style={{ fontSize: 11, color: "#b2bec3" }}>Resolved: {r.resolvedAt}</p>}
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
            background: r.status === "approved" ? "#00b89418" : "#e1705518",
            color: r.status === "approved" ? "#00b894" : "#e17055" }}>
            {r.status === "approved" ? "✅ Reset & Emailed" : "✕ Rejected"}
          </span>
        </div>
      ))}
    </Card>
  );
};

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function WorklyApp() {
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(DB);
  const [section, setSection] = useState(null);
  const [toast, setToast] = useState(null);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [lang, setLang] = useState(LANGS.en);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    const isAdmin = ["super_admin", "admin", "team_lead"].includes(loggedUser.role);
    setSection(isAdmin ? "dashboard" : "home");
    if (!isAdmin) setTimeout(() => setShowWorkModal(true), 400);
  };

  const handleWorkDecision = (mode, location) => {
    setShowWorkModal(false);
    const now = Date.now();
    const logEntry = { id: now, userId: user.id, mode, location: location || { lat: 0, lng: 0, city: "Unknown", country: "—" }, time: new Date().toLocaleString() };
    setDb(d => ({ ...d, locationLogs: [...d.locationLogs, logEntry] }));
    if (mode === "working") {
      const session = { id: now, userId: user.id, startTs: now, active: true, location };
      setDb(d => ({ ...d, workSessions: [...d.workSessions.filter(s => s.userId !== user.id), session] }));
      setActiveSession(session);
      showToast("✅ " + lang.t.onWork);
    } else {
      showToast("👀 " + lang.t.justBrowsing);
    }
  };

  const handleClockOut = () => {
    setDb(d => ({ ...d, workSessions: d.workSessions.map(s => s.userId === user.id ? { ...s, active: false } : s) }));
    setActiveSession(null);
    showToast("🏁 " + lang.t.clockOut);
  };

  const handleLogout = () => {
    if (activeSession) handleClockOut();
    setUser(null);
    setSection(null);
    setShowWorkModal(false);
  };

  const t = lang.t;
  const isAdmin = user && ["super_admin", "admin", "team_lead"].includes(user.role);
  const pendingRequests = db.profileRequests.filter(r => r.status === "pending").length;
  const pendingPassResets = (db.passwordRequests || []).filter(r => r.status === "pending").length;
  const guestNew = (db.guestIssues || []).filter(i => i.status === "new").length;

  const sectionTitles = {
    dashboard: "Dashboard", users: "User Management", jobs: "Jobs & Tasks", reports: "Reports & Analytics",
    comms: "Communications", "guides-admin": "Resources & Guides", ratings: "Ratings & Reviews",
    teams: "Team Management", finance: "Finance", settings: "Settings", locations: "Worker Locations",
    marquee: "Marquee & Bulk Messages",
    home: t.home, apply: t.applyJobs, chat: t.chatAdmin, guides: t.watchGuides,
    earnings: t.myEarnings || "My Earnings",
    profile: t.myProfile, portfolio: t.ratingsPortfolio,
  };

  const renderSection = () => {
    const props = { db, setDb, user, currentUser: user, showToast };
    if (isAdmin) {
      switch (section) {
        case "dashboard": return <><GuestIssuesPanel {...props} /><PasswordRequestsPanel {...props} /><ProfileRequestsPanel {...props} /><AdminDashboard {...props} /></>;
        case "users": return <><PasswordRequestsPanel {...props} /><ProfileRequestsPanel {...props} /><UserManagement {...props} /></>;
        case "locations": return <WorkerLocationsPanel db={db} />;
        case "jobs": return <JobManagement {...props} />;
        case "reports": return <Reports {...props} />;
        case "comms": return <Communications {...props} />;
        case "guides-admin": return <GuidesAdmin {...props} />;
        case "ratings": return <RatingsAdmin {...props} />;
        case "teams": return <Teams {...props} />;
        case "finance": return <Finance {...props} />;
        case "earnings-admin": return <AdminEarningsManager {...props} />;
        case "marquee": return <MarqueeManager {...props} />;
        case "settings": return <Settings {...props} />;
        default: return <><GuestIssuesPanel {...props} /><PasswordRequestsPanel {...props} /><ProfileRequestsPanel {...props} /><AdminDashboard {...props} /></>;
      }
    } else {
      switch (section) {
        case "home": return <WorkerHome {...props} />;
        case "apply": return <ApplyJobs {...props} />;
        case "chat": return <WorkerChat {...props} />;
        case "guides": return <WorkerGuides {...props} />;
        case "profile": return <WorkerProfile {...props} />;
        case "earnings": return <WorkerEarnings {...props} />;
        case "portfolio": return <Portfolio user={user} />;
        default: return <WorkerHome {...props} />;
      }
    }
  };

  return (
    <LangCtx.Provider value={{ lang, setLang }}>
      <style>{globalStyle}</style>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {!user ? (
        <LoginScreen onLogin={handleLogin} db={db} setDb={setDb} />
      ) : (
        <>
          {showWorkModal && <WorkStatusModal user={user} onDecide={handleWorkDecision} />}
          <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
            <TranslatedSidebar
              user={user}
              activeSection={section}
              setSection={setSection}
              onLogout={handleLogout}
              pendingRequests={pendingRequests + (isAdmin ? guestNew : 0)}
            />
            {/* Main content — offset by exact sidebar width */}
            <div style={{ position: "fixed", top: 0, left: 240, right: 0, bottom: 0, display: "flex", flexDirection: "column", overflowY: "auto", background: S.bg, zIndex: 10 }}>
              <TopBar
                title={sectionTitles[section] || "Workly"}
                user={user}
                onProfileClick={() => setSection(isAdmin ? "dashboard" : "profile")}
                notifications={db.messages.filter(m => !m.read && m.to === user.id).length + (isAdmin ? pendingRequests + guestNew + pendingPassResets : 0)}
              />
              <MarqueeBanner db={db} />
              {activeSession && !isAdmin && (
                <WorkTimerBanner session={activeSession} onClockOut={handleClockOut} />
              )}
              <main style={{ flex: 1, padding: "28px 32px" }}>
                {renderSection()}
              </main>
            </div>
          </div>
        </>
      )}
    </LangCtx.Provider>
  );
}
