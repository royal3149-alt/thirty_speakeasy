import React, { useState, useEffect, useRef } from "react";
import {
  Music,
  Armchair,
  Wine,
  X,
  Check,
  Lock,
  ChevronRight,
  AlertCircle,
  ArrowRight,
  Zap,
  Users,
  Cloud,
  Moon,
  AtSign,
  Trash2,
  Loader2,
  Volume2,
  Flame,
  Calendar,
  CalendarPlus,
  RotateCcw,
  Quote,
  Radio,
  Pin,
  Instagram,
  Eye,
  Gem,
  UserCheck,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// ==========================================
// ★ 設定區：Firebase 鑰匙 (不更動) ★
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCXQA8lA8_p1_ni2hb3EP85iWWHov7W6t8",
  authDomain: "thirtybistro-f8f49.firebaseapp.com",
  projectId: "thirtybistro-f8f49",
  storageBucket: "thirtybistro-f8f49.firebasestorage.app",
  messagingSenderId: "466579634030",
  appId: "1:466579634030:web:19425ec805ef5248c9f37f",
};

const emailConfig = {
  serviceID: "service_rlmha4o",
  templateID: "template_5oj9a5m",
  publicKey: "L721UTMrL0vn2z0qJ",
};

// 初始化 Firebase
let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase Error:", e);
}

const appId = "thirty-speakeasy-v1";
const ALL_POSSIBLE_SLOTS = [
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
];

// ★ 主理人名單 ★
const HOSTS = [
  { id: "Chris", label: "Chris" },
  { id: "Rio", label: "Rio" },
  { id: "Barron", label: "Barron" },
];

// --- 題目資料 ---
const VIBE_QUESTIONS = [
  {
    id: "sound",
    question: "推開沈重的木門，你希望空氣中流淌著什麼樣的聲音？",
    subtext: "第一秒的聽覺，決定了今晚的頻率。",
    options: [
      {
        id: "rock",
        label: "Rock",
        icon: <Zap size={24} />,
        desc: "叛逆與躁動",
      },
      {
        id: "jazz",
        label: "Jazz",
        icon: <Music size={24} />,
        desc: "搖擺與即興",
      },
      {
        id: "citypop",
        label: "City Pop",
        icon: <Cloud size={24} />,
        desc: "迷離的霓虹",
      },
      {
        id: "soul",
        label: "Soul",
        icon: <Moon size={24} />,
        desc: "靈魂的律動",
      },
    ],
  },
  {
    id: "seat",
    question: "穿過微暗的長廊，若要尋找一處安放身心的角落，你會走向...？",
    subtext: "身體的直覺，會帶你去最舒適的地方。",
    options: [
      {
        id: "bar",
        label: "Bar Counter",
        icon: <Wine size={24} />,
        desc: "靠近光源，想聽調酒師說說故事",
      },
      {
        id: "lounge",
        label: "Sofa Lounge",
        icon: <Users size={24} />,
        desc: "深陷柔軟角落，期待深度交流",
      },
      {
        id: "table",
        label: "Open Table",
        icon: <Armchair size={24} />,
        desc: "置身人群之中，期待認識新朋友",
      },
      {
        id: "anywhere",
        label: "Anywhere",
        icon: <Radio size={24} />,
        desc: "只想讓重低音震動心臟",
      },
    ],
  },
  {
    id: "mood",
    question: "現在的你，內心是什麼顏色？",
    subtext: "每一種情緒，都有屬於它的色溫。",
    options: [
      {
        id: "expect",
        label: "Golden / Hope",
        color: "bg-yellow-600",
        desc: "期待",
      },
      {
        id: "tired",
        label: "Grey / Faded",
        color: "bg-stone-500",
        desc: "疲憊",
      },
      {
        id: "excited",
        label: "Red / Passion",
        color: "bg-red-600",
        desc: "興奮",
      },
      { id: "blue", label: "Blue / Deep", color: "bg-blue-900", desc: "憂鬱" },
    ],
  },
  {
    id: "taste",
    question: "調酒師遞給你一杯酒，直覺告訴你，那是一杯...？",
    subtext: "你的潛意識，決定了入口的風味。",
    options: [
      { id: "gimlet", label: "Gimlet", desc: "酸楚卻清晰的直率" },
      { id: "clover", label: "Clover Club", desc: "絲絨般的莓果香甜" },
      { id: "negroni", label: "Negroni", desc: "苦甜交織的深沉重擊" },
      { id: "highball", label: "Highball", desc: "氣泡升騰的清爽" },
    ],
  },
];

// --- UI 組件 ---
const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  const base =
    "px-6 py-3 transition-all duration-500 font-serif tracking-widest uppercase text-sm flex items-center justify-center gap-2 rounded-sm active:scale-95";
  const style =
    variant === "primary"
      ? "bg-[#4a0404] text-[#e5d5b0] hover:bg-[#680606] border border-[#4a0404] shadow-xl"
      : "bg-transparent border border-[#333] text-[#a89f91] hover:text-[#e5d5b0]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${style} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, onClick, selected, className = "" }) => (
  <div
    onClick={onClick}
    className={`relative p-6 cursor-pointer transition-all border ${
      selected
        ? "bg-[#2a0e0e] border-[#e5d5b0]"
        : "bg-[#1a1a1a] border-[#333] hover:border-[#5c4033]"
    } ${className}`}
  >
    {children}
    {selected && (
      <div className="absolute top-2 right-2 text-[#e5d5b0] animate-in fade-in zoom-in">
        <Check size={16} />
      </div>
    )}
  </div>
);

// --- Pages ---

const LandingPage = ({ onStart, onSkip, savedUser, onLogoClick }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // 智慧跳過
  const handleSkipClick = () => {
    if (savedUser) {
      onSkip();
    } else {
      setShowConfirm(true);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 animate-fade-in relative z-10">
      <div
        className="mb-12 flex flex-col items-center cursor-default"
        onClick={onLogoClick}
      >
        <div className="w-[1px] h-20 bg-[#4a0404] mb-6"></div>
        {savedUser ? (
          <div>
            <p className="text-[#8a6a57] text-xs tracking-widest mb-2 font-serif uppercase">
              Welcome Back
            </p>
            <h1 className="text-3xl font-serif text-[#e5d5b0]">
              {savedUser.name}
            </h1>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl md:text-6xl font-serif text-[#e5d5b0] tracking-widest mb-3 uppercase">
              三拾酒館
            </h1>
            <p className="text-[#8a6a57] font-serif italic text-sm tracking-[0.3em] uppercase">
              Thirty Speakeasy
            </p>
          </div>
        )}
      </div>
      <p className="text-[#a89f91] text-sm max-w-sm mb-12 leading-loose opacity-80 h-16 font-serif">
        {savedUser ? (
          <>
            旅人，歡迎回來。
            <br />
            聊聊這趟旅途，有沒有讓靈魂產生些許變化？
          </>
        ) : (
          <>
            這裡不只是酒館，而是我們一同撿拾快樂的空間。
            <br />
            推開門之前，我們先聊聊你的靈魂。
          </>
        )}
      </p>
      <div className="space-y-8 flex flex-col items-center">
        <Button onClick={onStart}>
          {savedUser ? "再次探索靈魂" : "Begin The Journey"}{" "}
          <ChevronRight size={16} />
        </Button>
        <button
          onClick={handleSkipClick}
          className="text-zinc-400 text-xs tracking-widest uppercase border-b border-zinc-600 hover:text-white pb-0.5 transition-colors"
        >
          跳過測驗，直接預約
        </button>
      </div>
      {showConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-6">
          <div className="bg-[#151515] border border-[#4a0404] p-8 max-w-sm text-center shadow-2xl rounded-sm">
            <AlertCircle className="mx-auto text-[#4a0404] mb-4" size={32} />
            <h3 className="text-xl text-[#e5d5b0] font-serif mb-4">
              確定要略過嗎？
            </h3>
            <p className="text-[#a89f91] text-sm mb-8 leading-relaxed">
              跳過測驗，您將錯失體驗{" "}
              <span className="text-white font-bold border-b border-[#4a0404]">
                「Thirty Talk」
              </span>{" "}
              遊戲的機會。我們將無法為您調製專屬風味。
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={onStart}>返回測驗 (推薦)</Button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onSkip();
                }}
                className="text-zinc-600 text-xs py-2 hover:text-white transition-colors font-serif"
              >
                沒關係，忍痛放棄
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QuizPage = ({ onAnswerComplete, currentAnswers }) => {
  const [qIndex, setQIndex] = useState(0);
  const [isTrans, setIsTrans] = useState(false);
  const currentQ = VIBE_QUESTIONS[qIndex];
  const handleSelect = (id) => {
    onAnswerComplete(currentQ.id, id);
    setIsTrans(true);
    setTimeout(() => {
      if (qIndex < VIBE_QUESTIONS.length - 1) {
        setQIndex((i) => i + 1);
        setIsTrans(false);
      } else {
        onAnswerComplete("DONE", null);
      }
    }, 400);
  };
  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto px-6 pt-12 pb-6 relative z-10">
      <div className="flex-1">
        <div className="flex justify-between items-end mb-8 border-b border-[#333] pb-4 text-zinc-500">
          <div>
            <span className="text-[#4a0404] font-bold text-xl">
              0{qIndex + 1}
            </span>
            <span className="text-sm"> / 0{VIBE_QUESTIONS.length}</span>
          </div>
          <span className="text-[#555] text-xs tracking-widest uppercase font-mono tracking-[0.2em]">
            Soul Archive
          </span>
        </div>
        <div
          className={`transition-opacity duration-300 ${
            isTrans ? "opacity-0" : "opacity-100"
          }`}
        >
          <h2 className="text-2xl text-[#e5d5b0] font-serif mb-2">
            {currentQ.question}
          </h2>
          <p className="text-[#8a6a57] text-sm mb-10 font-serif italic opacity-80">
            {currentQ.subtext}
          </p>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {currentQ.options.map((opt) => (
              <Card
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                selected={currentAnswers[currentQ.id] === opt.id}
                className="hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  {opt.icon && <div className="text-[#5c4033]">{opt.icon}</div>}
                  {opt.color && (
                    <div
                      className={`w-5 h-5 rounded-full ${opt.color} opacity-70`}
                    ></div>
                  )}
                  <div className="text-left font-serif text-zinc-200">
                    {opt.label}
                    <p className="text-[#666] text-xs mt-1">{opt.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TeaserPage = ({ onNext }) => (
  <div className="h-full flex flex-col items-center justify-center text-center px-6 animate-fade-in bg-[#0a0a0a] relative z-10">
    <div className="border border-[#e5d5b0] p-1 mb-10 rounded-sm">
      <div className="border border-[#e5d5b0] px-10 py-16 md:px-16 md:py-24 bg-[#1a1a1a] shadow-inner">
        <Wine className="mx-auto text-[#4a0404] mb-8" size={40} />
        <h2 className="text-3xl font-serif text-[#e5d5b0] mb-6 tracking-widest uppercase font-bold">
          Thirty Talk
        </h2>
        <div className="w-12 h-[1px] bg-[#5c4033] mx-auto mb-8"></div>
        <p className="text-[#a89f91] max-w-sm mx-auto leading-loose font-serif text-sm">
          我們捕捉到了，那份獨特的共鳴。
          <br />
          <br />
          透過預約，你將獲得開啟「Thirty Talk」遊戲的權限。
          <br />
          這不僅是一杯酒，而是一場交換靈魂故事的深度對談。
          <br />
          <br />
          <span className="text-[#e5d5b0] italic font-medium tracking-wide text-base drop-shadow-md">
            Let our stories intertwine.
          </span>
        </p>
      </div>
    </div>
    <Button onClick={onNext}>
      接受邀約，預約入席 <ArrowRight size={16} />
    </Button>
  </div>
);

const BookingPage = ({ onSubmit, availability, isSubmitting, savedUser }) => {
  const [data, setData] = useState({
    date: "",
    time: "",
    name: savedUser?.name || "",
    contact: savedUser?.contact || "",
    guests: 2,
    note: "",
    host: "",
  });

  const openDates = Object.keys(availability).sort();

  const getSlots = () => {
    if (!data.date) return [];

    const daySchedule = availability[data.date];

    if (Array.isArray(daySchedule)) return daySchedule;

    if (!data.host || data.host === "all") {
      const allSlots = new Set();
      Object.values(daySchedule).forEach((slots) => {
        if (Array.isArray(slots)) slots.forEach((s) => allSlots.add(s));
      });
      return Array.from(allSlots).sort();
    }

    return daySchedule[data.host] || [];
  };

  const slots = getSlots();

  return (
    <div className="h-full flex flex-col items-center justify-start pt-20 p-4 animate-fade-in overflow-y-auto no-scrollbar relative z-10">
      <div className="w-full max-w-4xl bg-[#151515] p-6 md:p-10 border border-[#333] grid grid-cols-1 md:grid-cols-2 gap-10 rounded-sm shadow-2xl">
        <div className="space-y-8">
          {/* 1. 選擇主理人 */}
          <div>
            <h3 className="text-[#e5d5b0] font-serif text-lg flex items-center gap-2 font-bold uppercase mb-4">
              <UserCheck size={18} className="text-[#4a0404]" /> HOST
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  setData({ ...data, host: "all", date: "", time: "" })
                }
                className={`py-3 text-xs border rounded transition-all ${
                  !data.host || data.host === "all"
                    ? "bg-[#e5d5b0] text-black font-bold border-[#e5d5b0]"
                    : "border-[#333] text-[#666]"
                }`}
              >
                不指定
              </button>
              {HOSTS.map((h) => (
                <button
                  key={h.id}
                  onClick={() =>
                    setData({ ...data, host: h.id, date: "", time: "" })
                  }
                  className={`py-3 text-xs border rounded transition-all ${
                    data.host === h.id
                      ? "bg-[#4a0404] text-[#e5d5b0] border-[#4a0404] font-bold"
                      : "border-[#333] text-[#666]"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. 選擇日期 */}
          <div>
            <label className="text-[#8a6a57] text-[10px] block mb-2 uppercase tracking-widest font-bold">
              DATE
            </label>
            <div className="grid grid-cols-3 gap-2">
              {openDates.length > 0 ? (
                openDates.map((d) => (
                  <button
                    key={d}
                    onClick={() => setData({ ...data, date: d, time: "" })}
                    className={`py-2 text-xs border transition-colors ${
                      data.date === d
                        ? "bg-[#e5d5b0] text-black border-[#e5d5b0] font-bold"
                        : "border-[#333] text-[#a89f91] hover:border-[#5c4033]"
                    }`}
                  >
                    {d}
                  </button>
                ))
              ) : (
                <div className="text-zinc-600 text-xs italic text-center col-span-3">
                  暫未開放日期
                </div>
              )}
            </div>
          </div>

          {/* 3. 選擇時段 */}
          <div>
            <label className="text-[#8a6a57] text-[10px] block mb-2 uppercase tracking-widest font-bold">
              TIME
            </label>
            <div className="grid grid-cols-4 gap-2">
              {slots.length > 0
                ? slots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setData({ ...data, time: t })}
                      className={`py-2 text-xs border transition-all ${
                        data.time === t
                          ? "bg-[#4a0404] text-[#e5d5b0] border-[#4a0404] font-bold"
                          : "border-[#333] text-[#666]"
                      }`}
                    >
                      {t}
                    </button>
                  ))
                : data.date && (
                    <div className="text-zinc-600 text-xs italic col-span-4 text-center border border-dashed border-zinc-800 p-2">
                      該主理人此日無空檔
                    </div>
                  )}
            </div>
          </div>

          <div>
            <label className="text-[#8a6a57] text-[10px] block mb-2 uppercase tracking-widest font-bold">
              Guests
            </label>
            <input
              type="number"
              value={data.guests}
              className="w-full bg-black border border-[#333] text-white p-3 outline-none focus:border-[#4a0404]"
              onChange={(e) => setData({ ...data, guests: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-[#e5d5b0] font-serif text-xl mb-6 font-bold uppercase">
              聯絡資訊
            </h3>
            <input
              placeholder="Your Name"
              value={data.name}
              className="w-full bg-transparent border-b border-[#333] py-3 text-white outline-none focus:border-[#4a0404] font-serif placeholder-zinc-700"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <input
              placeholder="IG / Line ID"
              value={data.contact}
              className="w-full bg-transparent border-b border-[#333] py-3 text-white outline-none focus:border-[#4a0404] font-serif placeholder-zinc-700"
              onChange={(e) => setData({ ...data, contact: e.target.value })}
            />
            <textarea
              placeholder="Whispers..."
              className="w-full bg-black/40 border border-[#333] p-4 text-white h-24 mt-4 outline-none focus:border-[#4a0404] font-serif placeholder-zinc-700 resize-none"
              onChange={(e) => setData({ ...data, note: e.target.value })}
            />
          </div>
          <Button
            disabled={
              !data.date ||
              !data.time ||
              !data.name ||
              !data.contact ||
              isSubmitting
            }
            onClick={() => onSubmit(data)}
            className="w-full mt-6 shadow-2xl"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : "確認預約"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ★ SuccessPage：回復「雜誌封面式」排版（無黑膠囊） ★
const SuccessPage = ({ data, quizResult, onReplay, onHome }) => {
  const IG_URL =
    "https://www.instagram.com/30_speakeasy?igsh=MTRrZGZnbHBxbG42bw%3D%3D&utm_source=qr";

  // 強制 Fallback，確保有卡片
  let persona = {
    zh: "神秘旅人",
    en: "THE MYSTERY",
    quote: "你保留了靈魂的秘密，準備在今晚親自揭曉。",
    kw: "#未知 #期待",
    img: "https://i.ibb.co/JW22yLfJ/IMG-5297.jpg",
  };

  if (quizResult && quizResult.seat) {
    if (quizResult.seat === "bar")
      persona = {
        zh: "話題領航員",
        en: "THE NAVIGATOR",
        quote: "你掌握著夜晚的航向，與調酒師的對話是你探索未知的羅盤。",
        kw: "#連結 #探索",
        img: "https://i.ibb.co/zWm6BGxT/IMG-5301.jpg",
      };
    else if (quizResult.seat === "lounge")
      persona = {
        zh: "微醺引力點",
        en: "THE MAGNET",
        quote: "你就是夜晚的引力中心，吸引著頻率相同的靈魂。",
        kw: "#交流 #吸引",
        img: "https://i.ibb.co/S4tNyR2d/IMG-5303.jpg",
      };
    else if (quizResult.seat === "table")
      persona = {
        zh: "城市漫遊者",
        en: "THE DRIFTER",
        quote: "不被座位束縛，你的雷達隨時開啟，準備在人海中捕捉訊號。",
        kw: "#流動 #觀察",
        img: "https://i.ibb.co/0yNSCz9p/IMG-5300.jpg",
      };
    else if (quizResult.seat === "anywhere")
      persona = {
        zh: "頻率共振者",
        en: "THE RESONATOR",
        quote: "座位只是形式。只要音樂對了，整個空間都是你的主場。",
        kw: "#直覺 #氛圍",
        img: "https://i.ibb.co/5XZnpVbs/IMG-5299.jpg",
      };
  }

  const downloadICSFile = () => {
    const start = new Date(`${data.date}T${data.time}`)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(
      new Date(`${data.date}T${data.time}`).getTime() + 7200000
    )
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");
    const blob = new Blob(
      [
        `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:三拾酒館 訂位\nLOCATION:三拾酒館 Thirty Speakeasy\nEND:VEVENT\nEND:VCALENDAR`,
      ],
      { type: "text/calendar;charset=utf-8" }
    );
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "thirty_booking.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start overflow-y-auto no-scrollbar pb-20 bg-black relative z-20">
      {/* 視覺卡片：長圖海報，雜誌排版邏輯 */}
      <div className="w-full relative flex flex-col items-center justify-start shadow-2xl bg-[#0a0a0a]">
        <div className="w-full relative">
          <img
            src={persona.img}
            className="w-full h-auto object-cover block"
            alt="Persona Poster"
          />

          {/* 上層漸層輔助閱讀 (不遮擋主體) */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/60 to-transparent"></div>
          {/* 下層漸層輔助閱讀 */}
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          {/* 頂部文字區 (Header)：關鍵字 + 標題組 */}
          <div className="absolute inset-x-0 top-0 p-10 pt-16 text-center flex flex-col items-center z-30">
            <p className="text-[10px] text-amber-500 font-bold tracking-[0.5em] uppercase mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {persona.kw}
            </p>
            <div className="flex flex-col items-center gap-1 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
              <h2 className="text-4xl font-serif text-white tracking-[0.15em] font-bold uppercase leading-none">
                {persona.zh}
              </h2>
              <p className="text-[10px] text-white/70 font-mono tracking-[0.4em] uppercase italic">
                {persona.en}
              </p>
            </div>
          </div>

          {/* 底部文字區 (Footer)：語錄 */}
          <div className="absolute inset-x-0 bottom-0 p-8 pt-20 text-center flex flex-col items-center z-30">
            <p className="text-[#e5d5b0] font-serif italic text-sm leading-relaxed mb-12 max-w-xs drop-shadow-md">
              "{persona.quote}"
            </p>

            {/* IG 連結按鈕 (右下角) */}
            <div className="absolute bottom-6 right-6 z-40">
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-2xl hover:bg-white/20 active:scale-95 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:bg-[#4a0404] group-hover:text-white transition-colors">
                  <Instagram size={18} strokeWidth={2} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-white/70 font-mono tracking-wider">
                    DM for Location
                  </span>
                  <span className="text-[8px] text-[#e5d5b0] font-bold uppercase tracking-widest">
                    私訊索取地標
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 資訊與按鈕區 */}
      <div className="w-full max-w-sm px-6 mt-8 space-y-4">
        {/* 預約資訊 */}
        <div className="bg-[#111] p-8 border border-[#222] rounded-[32px] text-sm shadow-xl relative group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#4a0404]/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-all duration-1000"></div>
          <div className="flex justify-between border-b border-white/5 pb-4 mb-4 text-zinc-500 uppercase tracking-widest text-[10px] relative z-10 font-serif">
            <span>Guest</span>
            <span className="text-[#e5d5b0] font-serif text-base font-bold">
              {data.name}
            </span>
          </div>
          <div className="flex justify-between text-zinc-500 uppercase tracking-widest text-[10px] relative z-10 font-serif">
            <span>Time</span>
            <span className="text-[#e5d5b0] font-mono">
              {data.date} {data.time}
            </span>
          </div>
          <div className="flex justify-between text-zinc-500 uppercase tracking-widest text-[10px] relative z-10 font-serif mt-2 border-t border-white/5 pt-2">
            <span>Host</span>
            <span className="text-[#a89f91]">
              {data.host === "all" || !data.host ? "Any" : data.host}
            </span>
          </div>
        </div>

        {/* 行事曆區塊 */}
        <div>
          <p className="text-zinc-600 text-[9px] uppercase tracking-[0.2em] mb-2 text-center font-bold">
            加入行事曆
          </p>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=三拾酒館&dates=${data.date?.replace(
                /-/g,
                ""
              )}/${data.date?.replace(/-/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 border border-zinc-800 hover:border-[#a89f91] text-zinc-500 hover:text-[#e5d5b0] py-4 rounded-2xl flex items-center justify-center gap-2 text-[11px] transition-all uppercase tracking-widest font-bold"
            >
              <CalendarPlus size={14} /> Add to Google
            </a>
            <button
              onClick={downloadICSFile}
              className="bg-zinc-900 border border-zinc-800 hover:border-white text-zinc-500 hover:text-white py-4 rounded-2xl flex items-center justify-center gap-2 text-[11px] transition-all uppercase tracking-widest font-bold"
            >
              <Calendar size={14} /> Add to iCal
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onReplay}
            className="flex-1 py-4 text-zinc-600 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-2xl flex items-center justify-center gap-2 text-[10px] transition-colors uppercase tracking-[0.2em] font-serif font-bold"
          >
            <RotateCcw size={12} /> Replay
          </button>
          <Button
            onClick={onHome}
            variant="outline"
            className="flex-[2] py-4 text-[11px] tracking-[0.2em] rounded-2xl font-bold"
          >
            Back to Entrance
          </Button>
        </div>

        {/* 家規區塊 */}
        <div className="mt-12 border-t border-zinc-800 pt-10 pb-10">
          <h4 className="text-zinc-600 text-[10px] uppercase tracking-[0.4em] mb-8 text-center font-bold">
            House Rules
          </h4>
          <div className="space-y-8 px-2">
            <div className="flex gap-5 items-center">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#4a0404] flex-shrink-0 shadow-lg">
                <Volume2 size={18} />
              </div>
              <div>
                <p className="text-zinc-200 text-sm font-serif mb-1 font-bold">
                  輕聲細語
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  為了維護微醺的品質，22:00 後請降低音量。
                </p>
              </div>
            </div>
            <div className="flex gap-5 items-center">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#4a0404] flex-shrink-0 shadow-lg">
                <Flame size={18} />
              </div>
              <div>
                <p className="text-zinc-200 text-sm font-serif mb-1 font-bold">
                  注意火源
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  菸蒂請確認完全熄滅，留給夜晚清新的呼吸。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Admin Panel (管理後台) - ★ 修正：極簡化結果顯示 ★ ---
const AdminPanel = ({
  reservations,
  availability,
  onUpdateAvailability,
  onExit,
}) => {
  const [login, setLogin] = useState(false);
  const [pwd, setPwd] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHost, setSelectedHost] = useState("Chris");
  const [view, setView] = useState("bookings");

  if (!login)
    return (
      <div className="h-full flex items-center justify-center bg-black p-10 z-50 relative">
        <div className="p-10 border border-[#222] w-full max-w-sm text-center bg-[#0a0a0a] rounded-[40px] shadow-2xl">
          <Lock className="mx-auto text-[#4a0404] mb-8" size={32} />
          <input
            type="password"
            placeholder="Passcode"
            className="w-full bg-[#111] border border-[#222] p-4 text-white mb-6 text-center outline-none rounded-xl font-serif"
            onChange={(e) => setPwd(e.target.value)}
          />
          <Button
            className="w-full py-4 rounded-xl"
            onClick={() => (pwd === "3030" ? setLogin(true) : alert("Denied"))}
          >
            Unlock Staff View
          </Button>
          <button
            onClick={onExit}
            className="mt-8 text-zinc-600 text-xs tracking-widest uppercase underline underline-offset-4 font-serif"
          >
            Exit
          </button>
        </div>
      </div>
    );

  const toggleSlot = (date, hostId, slot) => {
    const dayData = availability[date] || {};
    let hostSlots = [];
    if (Array.isArray(dayData)) {
      hostSlots = [];
    } else {
      hostSlots = dayData[hostId] || [];
    }

    const newHostSlots = hostSlots.includes(slot)
      ? hostSlots.filter((s) => s !== slot)
      : [...hostSlots, slot].sort();

    const newDayData = {
      ...(Array.isArray(dayData) ? {} : dayData),
      [hostId]: newHostSlots,
    };

    onUpdateAvailability(date, newDayData);
  };

  return (
    <div className="h-full bg-black flex flex-col relative z-20">
      <div className="flex justify-between items-center px-6 py-6 border-b border-[#222] bg-black shrink-0 font-serif">
        <h2 className="text-[#e5d5b0] font-bold uppercase tracking-widest">
          Thirty Console
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView("bookings")}
            className={`px-4 py-2 text-[10px] rounded-full transition-all ${
              view === "bookings"
                ? "bg-[#4a0404] text-white font-bold"
                : "bg-zinc-900 text-zinc-500"
            }`}
          >
            BOOKINGS
          </button>
          <button
            onClick={() => setView("cal")}
            className={`px-4 py-2 text-[10px] rounded-full transition-all ${
              view === "cal"
                ? "bg-[#4a0404] text-white font-bold"
                : "bg-zinc-900 text-zinc-500"
            }`}
          >
            SCHEDULE
          </button>
          <X
            size={20}
            className="ml-4 text-zinc-500 cursor-pointer"
            onClick={onExit}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        {view === "bookings" ? (
          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="p-6 bg-[#111] border border-[#222] rounded-2xl relative group hover:border-[#4a0404] transition-all"
              >
                <div className="text-[#e5d5b0] font-bold text-lg font-serif mb-1">
                  {res.name}{" "}
                  <span className="text-zinc-500 text-[10px] ml-2">
                    ({res.contact})
                  </span>
                </div>
                <div className="text-zinc-500 text-xs font-mono tracking-widest uppercase">
                  {res.date} {res.time} | {res.guests} PPL
                </div>

                <div className="text-zinc-400 text-xs mt-1 border-l-2 border-[#4a0404] pl-2">
                  Host:{" "}
                  <span className="text-white">
                    {res.host === "all" || !res.host ? "不指定" : res.host}
                  </span>
                </div>

                {/* ★ 修正：極簡化結果顯示 (文字列表：rock / bar / excited / gimlet) ★ */}
                {res.quizResult && res.quizResult.seat !== "default" ? (
                  <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-zinc-400 font-mono tracking-wide">
                    {res.quizResult.sound} / {res.quizResult.seat} /{" "}
                    {res.quizResult.mood} / {res.quizResult.taste}
                  </div>
                ) : (
                  <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-zinc-600 italic">
                    (未測驗)
                  </div>
                )}

                {res.note && (
                  <div className="mt-4 p-3 bg-black/50 text-zinc-600 text-xs italic rounded-lg border border-white/5">
                    "{res.note}"
                  </div>
                )}
                <Trash2
                  size={16}
                  className="absolute top-6 right-6 text-red-900 cursor-pointer hover:text-red-500 opacity-30 group-hover:opacity-100 transition-opacity"
                  onClick={async () => {
                    if (window.confirm("Delete this booking?"))
                      await deleteDoc(
                        doc(
                          db,
                          "artifacts",
                          appId,
                          "public",
                          "data",
                          "thirty_bookings",
                          res.id
                        )
                      );
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="sticky top-0 z-10 bg-black/95 backdrop-blur py-4 border-b border-[#333] -mt-2 mb-4 space-y-4">
              <div className="flex gap-2 justify-center">
                {HOSTS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHost(h.id)}
                    className={`px-4 py-2 text-xs rounded-full border transition-all ${
                      selectedHost === h.id
                        ? "bg-[#e5d5b0] text-black border-[#e5d5b0] font-bold"
                        : "text-zinc-500 border-zinc-800"
                    }`}
                  >
                    {h.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 items-center px-2">
                <input
                  type="date"
                  className="bg-[#111] border border-[#333] text-[#e5d5b0] p-3 rounded-xl outline-none flex-1 text-sm font-serif"
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button
                  className="px-6 py-3 bg-[#4a0404] text-white font-bold uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#680606] transition-colors shadow-lg"
                  onClick={() => {
                    if (selectedDate) {
                      onUpdateAvailability(selectedDate, {
                        ...availability[selectedDate],
                        [selectedHost]: [],
                      });
                    }
                  }}
                >
                  Add Date
                </button>
              </div>
            </div>

            {Object.keys(availability)
              .sort()
              .map((d) => {
                const dayData = availability[d] || {};
                const safeDayData = Array.isArray(dayData) ? {} : dayData;
                const currentHostSlots = safeDayData[selectedHost] || [];

                return (
                  <div
                    key={d}
                    className="p-6 bg-[#111] border border-[#222] rounded-2xl"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-[#333] pb-2">
                      <span className="text-[#e5d5b0] font-mono tracking-widest text-sm font-bold">
                        {d}
                      </span>
                      <button
                        onClick={() => onUpdateAvailability(d, null)}
                        className="text-red-900 hover:text-red-500 text-[10px] font-bold tracking-widest uppercase transition-colors"
                      >
                        Delete Day
                      </button>
                    </div>

                    <div className="mb-2 text-zinc-500 text-[10px]">
                      Editing:{" "}
                      <span className="text-[#e5d5b0]">{selectedHost}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {ALL_POSSIBLE_SLOTS.map((slot) => {
                        const isActive = currentHostSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            onClick={() => toggleSlot(d, selectedHost, slot)}
                            className={`text-[10px] py-1 border rounded transition-all ${
                              isActive
                                ? "bg-[#4a0404] text-white border-[#4a0404] shadow-md"
                                : "bg-transparent text-zinc-600 border-[#222] hover:border-zinc-500"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            {Object.keys(availability).length === 0 && (
              <div className="text-zinc-600 text-xs italic text-center py-10 font-serif">
                No dates open.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- App Root ---
export default function App() {
  const [step, setStep] = useState("landing");
  const [quizAns, setQuizAns] = useState({});
  const [bookData, setBookData] = useState({});
  const [reservations, setReservations] = useState([]);
  const [availability, setAvailability] = useState({});
  const [user, setUser] = useState(null);
  const [logoClicks, setLogoClicks] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedUser, setSavedUser] = useState(null);
  const isEmailJSReady = useRef(false);

  const handleAdminTrigger = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setStep("admin");
        return 0;
      }
      return next;
    });
  };

  useEffect(() => {
    const data = localStorage.getItem("thirty_user_info");
    if (data) setSavedUser(JSON.parse(data));

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
    script.async = true;
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init(emailConfig.publicKey);
        isEmailJSReady.current = true;
      }
    };
    document.head.appendChild(script);

    const twScript = document.createElement("script");
    twScript.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(twScript);

    if (auth) {
      signInAnonymously(auth).catch(console.error);
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const unsub1 = onSnapshot(
      doc(
        db,
        "artifacts",
        appId,
        "public",
        "data",
        "thirty_settings",
        "calendar"
      ),
      (snap) => setAvailability(snap.exists() ? snap.data().dates || {} : {})
    );
    const unsub2 = onSnapshot(
      collection(db, "artifacts", appId, "public", "data", "thirty_bookings"),
      (snap) =>
        setReservations(
          snap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        )
    );
    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  const handleBooking = async (data) => {
    setIsSubmitting(true);
    try {
      localStorage.setItem(
        "thirty_user_info",
        JSON.stringify({ name: data.name, contact: data.contact })
      );
      await addDoc(
        collection(db, "artifacts", appId, "public", "data", "thirty_bookings"),
        { ...data, quizResult: quizAns, createdAt: new Date().toISOString() }
      );
      if (isEmailJSReady.current && window.emailjs) {
        try {
          await window.emailjs.send(
            emailConfig.serviceID,
            emailConfig.templateID,
            { ...data, vibe_result: Object.values(quizAns).join(", ") }
          );
        } catch (err) {
          console.warn(err);
        }
      }
      setBookData(data);
      setStep("success");
    } catch (e) {
      console.error(e);
      alert("預約失敗，請檢查網路。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAvailability = async (date, slots) => {
    if (!user || !db) return;
    const newAvail = { ...availability };
    if (slots === null) delete newAvail[date];
    else newAvail[date] = slots;
    setAvailability(newAvail);
    try {
      await setDoc(
        doc(
          db,
          "artifacts",
          appId,
          "public",
          "data",
          "thirty_settings",
          "calendar"
        ),
        { dates: newAvail },
        { merge: true }
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full h-screen bg-black text-[#dcdcdc] font-serif overflow-hidden relative selection:bg-[#4a0404]">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-20 pointer-events-none"></div>
      <div
        className="absolute top-0 left-0 w-20 h-20 z-[100]"
        onClick={() =>
          logoClicks + 1 >= 5
            ? (setStep("admin"), setLogoClicks(0))
            : setLogoClicks((v) => v + 1)
        }
      ></div>

      <div className="relative z-10 w-full h-full no-scrollbar overflow-y-auto">
        {step === "landing" && (
          <LandingPage
            onStart={() => {
              setQuizAns({});
              setStep("quiz");
            }}
            onSkip={() => {
              setQuizAns({ seat: "default" });
              setStep("booking");
            }}
            savedUser={savedUser}
            onLogoClick={handleAdminTrigger}
          />
        )}
        {step === "quiz" && (
          <QuizPage
            onAnswerComplete={(q, a) =>
              q === "DONE"
                ? setStep("teaser")
                : setQuizAns((v) => ({ ...v, [q]: a }))
            }
            currentAnswers={quizAns}
          />
        )}
        {step === "teaser" && <TeaserPage onNext={() => setStep("booking")} />}
        {step === "booking" && (
          <BookingPage
            onSubmit={handleBooking}
            availability={availability}
            isSubmitting={isSubmitting}
            savedUser={savedUser}
          />
        )}
        {step === "success" && (
          <SuccessPage
            data={bookData}
            quizResult={quizAns}
            onReplay={() => {
              setQuizAns({});
              setStep("quiz");
            }}
            onHome={() => setStep("landing")}
          />
        )}
        {step === "admin" && (
          <AdminPanel
            reservations={reservations}
            availability={availability}
            onUpdateAvailability={handleUpdateAvailability}
            onExit={() => setStep("landing")}
          />
        )}
      </div>
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .animate-fade-in { animation: fade-in 1.2s ease-out forwards; } @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
