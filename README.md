import React, { useState, useEffect, useRef } from "react";
import {
  Bell, Settings, ChevronLeft, ChevronRight, Plus, Package, Home as HomeIcon,
  CreditCard, Car, Wallet, PieChart as PieIcon, Calendar as CalendarIcon, Box,
  Utensils, ShoppingBag, Plane, Clapperboard, Satellite, Pill, Fuel, Sparkles,
  BookOpen, Landmark, ShoppingCart, PawPrint, Users, Laptop, AlertTriangle,
  FileText, ArrowLeft, Info, Shield, X, Trash2
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";

/* ---------------------------------- tokens ---------------------------------- */
const C = {
  bgPage: "#0a0b14",
  surface: "#12141f",
  surface2: "#171a29",
  border: "#242640",
  borderSoft: "#1d1f33",
  textMuted: "#888ba3",
  textFaint: "#5c5f78",
  blue: "#5b7cfa",
  purple: "#9061f9",
  red: "#ff6b6b",
  amber: "#f5a623",
  green: "#34d399",
  teal: "#2dd4bf",
  orange: "#f59e0b",
};
const accentGrad = "linear-gradient(135deg,#5b7cfa 0%,#9061f9 100%)";
const card1Grad = "linear-gradient(135deg,#3572e8 0%,#122a63 100%)";
const card2Grad = "linear-gradient(135deg,#b768f5 0%,#5b21b6 100%)";
const CARD_GRADIENTS = [card1Grad, card2Grad, "linear-gradient(135deg,#2dd4bf 0%,#0f5f57 100%)", "linear-gradient(135deg,#f59e0b 0%,#7c4a03 100%)"];

const baht = (n) =>
  "฿" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const bahtShort = (n) => baht(n).replace(".00", "");

/* ---------------------------------- persistence ---------------------------------- */
function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

/* ---------------------------------- default data ---------------------------------- */
const DEFAULT_CARDS = [
  { id: "kbank", name: "KBank Platinum", network: "VISA", grad: card1Grad, used: 18750, limitLeft: 831250, statementDay: 15, dueDay: 5 },
  { id: "scb", name: "SCB Infinite", network: "MC", grad: card2Grad, used: 31500, limitLeft: 48500, statementDay: 20, dueDay: 10 },
];

const DEFAULT_DEBTS = [
  { id: "house", name: "บ้าน", iconKey: "home", amount: 2750000, monthly: 15200, status: "กำลังผ่อน", color: C.orange },
  { id: "car", name: "รถยนต์", iconKey: "car", amount: 380000, monthly: 8900, status: "กำลังผ่อน", color: "#fb923c" },
];
const DEBT_ICONS = { home: HomeIcon, car: Car, loan: FileText };

const DEFAULT_SUBSCRIPTIONS = [
  { id: "netflix", name: "Netflix", icon: "🎬", amount: 349, cycle: "รายเดือน", date: "13 ก.ค.", card: "KB...", daysLeft: 8, urgency: "green" },
  { id: "spotify", name: "Spotify", icon: "🎵", amount: 129, cycle: "รายเดือน", date: "20 ก.ค.", card: "KB...", daysLeft: 15, urgency: "green" },
  { id: "true", name: "True Internet", icon: "🌐", amount: 790, cycle: "รายเดือน", date: "10 ก.ค.", card: "SC...", daysLeft: 5, urgency: "amber" },
  { id: "aia", name: "AIA ประกันชีวิต", icon: "🛡️", amount: 18000, cycle: "รายปี", date: "3 ก.ค.", card: "ไม่ผูกบัตร", daysLeft: 60, urgency: "green" },
];

const CATEGORIES = [
  { id: "food", label: "อาหาร", icon: Utensils },
  { id: "shopping", label: "ช้อปปิ้ง", icon: ShoppingBag },
  { id: "travel", label: "เดินทาง", icon: Plane },
  { id: "entertainment", label: "บันเทิง", icon: Clapperboard },
  { id: "bills", label: "บัตร/ค่าไฟ", icon: Satellite },
  { id: "health", label: "สุขภาพ", icon: Pill },
  { id: "fuel", label: "น้ำมัน", icon: Fuel },
  { id: "beauty", label: "ความงาม", icon: Sparkles },
  { id: "education", label: "การศึกษา", icon: BookOpen },
  { id: "finance", label: "การเงิน", icon: Landmark },
  { id: "auto", label: "ยานยนต์", icon: Car },
  { id: "grocery", label: "ซุปเปอร์", icon: ShoppingCart },
  { id: "pet", label: "สัตว์เลี้ยง", icon: PawPrint },
  { id: "homegoods", label: "ของใช้บ้าน", icon: HomeIcon },
  { id: "family", label: "ครอบครัว", icon: Users },
  { id: "it", label: "ไอที", icon: Laptop },
  { id: "membership", label: "สมาชิก", icon: Package },
  { id: "interest", label: "ดอกเบี้ย", icon: AlertTriangle },
  { id: "fine", label: "ค่าปรับ", icon: FileText },
  { id: "other", label: "อื่นๆ", icon: CreditCard },
];

const SUGGESTIONS = ["Grab Food", "Lineman", "Foodpanda", "ร้านอาหาร", "กาแฟ", "เครื่องดื่ม", "ขนม", "KFC", "McDonald's", "Starbucks"];

const THAI_MONTHS = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
const THAI_WEEKDAYS = ["อา","จ","อ","พ","พฤ","ศ","ส"];

const dotColor = { red: C.red, green: C.green, teal: C.teal, orange: C.orange };

/* ---------------------------------- shared bits ---------------------------------- */
function IconButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 40, height: 40, borderRadius: 999, background: C.surface2,
        border: `1px solid ${C.border}`, display: "flex", alignItems: "center",
        justifyContent: "center", color: "#e5e6ef", flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

function Header({ title, onBack, onReset }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: "18px 20px 14px" }}>
      {onBack ? (
        <IconButton onClick={onBack}><ArrowLeft size={18} /></IconButton>
      ) : (
        <div className="flex items-center gap-2" style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 999, padding: "5px 12px 5px 5px" }}>
          <div style={{ width: 26, height: 26, borderRadius: 999, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>G</div>
          <span style={{ fontSize: 13, color: "#e5e6ef", fontWeight: 500 }}>Guest</span>
        </div>
      )}
      <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
        {title === "CardWallet" && (
          <span style={{ width: 16, height: 11, borderRadius: 2, background: accentGrad, display: "inline-block" }} />
        )}
        {title}
      </div>
      <div className="flex items-center gap-2">
        <IconButton><Bell size={17} /></IconButton>
        {!onBack && (
          <IconButton onClick={onReset}><Settings size={17} /></IconButton>
        )}
      </div>
    </div>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [
    { id: "wallet", label: "กระเป๋า", icon: Wallet },
    { id: "overview", label: "ภาพรวม", icon: PieIcon },
    null,
    { id: "calendar", label: "ปฏิทิน", icon: CalendarIcon },
    { id: "expenses", label: "รายจ่าย", icon: Box },
  ];
  return (
    <div
      style={{
        position: "sticky", bottom: 0, left: 0, right: 0, background: "rgba(10,11,20,0.92)",
        backdropFilter: "blur(8px)", borderTop: `1px solid ${C.borderSoft}`,
        display: "flex", alignItems: "center", justifyContent: "space-around", padding: "10px 8px 14px",
      }}
    >
      {items.map((it, idx) =>
        it === null ? (
          <button
            key="add"
            onClick={() => setScreen("add")}
            style={{
              width: 52, height: 52, borderRadius: 999, background: accentGrad, border: "none",
              display: "flex", alignItems: "center", justifyContent: "center", marginTop: -26,
              boxShadow: "0 8px 20px rgba(91,124,250,0.45)", flexShrink: 0,
            }}
          >
            <Plus size={24} color="#fff" />
          </button>
        ) : (
          <button
            key={it.id}
            onClick={() => setScreen(it.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", flex: 1 }}
          >
            <it.icon size={20} color={screen === it.id ? C.blue : C.textFaint} />
            <span style={{ fontSize: 11, color: screen === it.id ? C.blue : C.textFaint, fontWeight: screen === it.id ? 600 : 400 }}>{it.label}</span>
          </button>
        )
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "22px 20px 12px" }}>{children}</div>;
}

/* ---------------------------------- modal ---------------------------------- */
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }}>
      <div style={{ width: "100%", maxWidth: 480, background: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, border: `1px solid ${C.border}`, borderBottom: "none", padding: 20, maxHeight: "85vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{title}</span>
          <button onClick={onClose} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 999, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color="#dcdde8" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6, marginTop: 14 }}>{children}</div>;
}
const inputStyle = { width: "100%", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none" };

/* ---------------------------------- wallet screen ---------------------------------- */
function CardTile({ card, onDelete }) {
  return (
    <div style={{ minWidth: 300, width: 300, height: 176, borderRadius: 20, padding: 20, background: card.grad, position: "relative", flexShrink: 0, boxShadow: "0 12px 30px rgba(0,0,0,0.35)" }}>
      <div className="flex items-center justify-between">
        <div style={{ width: 34, height: 24, borderRadius: 5, background: "linear-gradient(135deg,#f3d98b,#c9a44c)" }} />
        <div className="flex items-center gap-2">
          {card.network === "VISA" ? (
            <span style={{ fontStyle: "italic", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: 0.5 }}>VISA</span>
          ) : (
            <div style={{ position: "relative", width: 40, height: 26 }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: 26, height: 26, borderRadius: 999, background: "#eb001b" }} />
              <div style={{ position: "absolute", left: 14, top: 0, width: 26, height: 26, borderRadius: 999, background: "#f79e1b", opacity: 0.9 }} />
            </div>
          )}
          <button onClick={onDelete} style={{ background: "rgba(0,0,0,0.25)", border: "none", borderRadius: 999, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trash2 size={12} color="rgba(255,255,255,0.8)" />
          </button>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>ยอดใช้ไป</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>{baht(card.used)}</div>
      </div>
      <div className="flex items-end justify-between" style={{ position: "absolute", left: 20, right: 20, bottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{card.name}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>คงเหลือ</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{baht(card.limitLeft)}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>ตัดรอบ: วันที่ {card.statementDay}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>ชำระ: วันที่ {card.dueDay}</div>
        </div>
      </div>
    </div>
  );
}

function AddCardTile({ onClick }) {
  return (
    <button onClick={onClick} style={{ minWidth: 220, width: 220, height: 176, borderRadius: 20, border: `1.5px dashed ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, flexShrink: 0, background: "rgba(255,255,255,0.01)" }}>
      <div style={{ width: 44, height: 44, borderRadius: 999, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Plus size={20} color={C.blue} />
      </div>
      <span style={{ fontSize: 13, color: C.textMuted }}>เพิ่มบัตรใหม่</span>
    </button>
  );
}

function AddCardModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [network, setNetwork] = useState("VISA");
  const [limit, setLimit] = useState("");
  const [statementDay, setStatementDay] = useState("15");
  const [dueDay, setDueDay] = useState("5");

  const save = () => {
    if (!name || !limit) return;
    onSave({
      id: "card_" + Date.now(),
      name,
      network,
      grad: CARD_GRADIENTS[Math.floor(Math.random() * CARD_GRADIENTS.length)],
      used: 0,
      limitLeft: Number(limit),
      statementDay: Number(statementDay),
      dueDay: Number(dueDay),
    });
  };

  return (
    <Modal title="เพิ่มบัตรใหม่" onClose={onClose}>
      <FieldLabel>ชื่อบัตร</FieldLabel>
      <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น Krungsri Prestige" />
      <FieldLabel>เครือข่าย</FieldLabel>
      <div className="flex gap-2">
        {["VISA", "MC"].map((n) => (
          <button key={n} onClick={() => setNetwork(n)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: network === n ? `1.5px solid ${C.blue}` : `1px solid ${C.border}`, background: network === n ? "rgba(91,124,250,0.12)" : C.surface2, color: "#fff", fontSize: 13 }}>{n === "VISA" ? "VISA" : "Mastercard"}</button>
        ))}
      </div>
      <FieldLabel>วงเงิน (บาท)</FieldLabel>
      <input style={inputStyle} value={limit} onChange={(e) => setLimit(e.target.value.replace(/[^0-9]/g, ""))} placeholder="100000" inputMode="numeric" />
      <div className="grid grid-cols-2" style={{ gap: 12 }}>
        <div>
          <FieldLabel>วันตัดรอบ</FieldLabel>
          <input style={inputStyle} value={statementDay} onChange={(e) => setStatementDay(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" />
        </div>
        <div>
          <FieldLabel>วันครบกำหนดชำระ</FieldLabel>
          <input style={inputStyle} value={dueDay} onChange={(e) => setDueDay(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" />
        </div>
      </div>
      <button onClick={save} style={{ width: "100%", marginTop: 22, padding: "14px 0", borderRadius: 14, border: "none", background: accentGrad, color: "#fff", fontWeight: 700, fontSize: 14 }}>บันทึกบัตร</button>
    </Modal>
  );
}

function WalletScreen({ cards, setCards, expenses, setScreen, setExpTab, debts, onReset }) {
  const scrollRef = useRef(null);
  const [dot, setDot] = useState(0);
  const [showAddCard, setShowAddCard] = useState(false);

  const totalCC = cards.reduce((s, c) => s + c.used, 0);
  const totalLimitLeft = cards.reduce((s, c) => s + c.limitLeft, 0);
  const totalOther = debts.reduce((s, d) => s + d.amount, 0);
  const totalDebt = totalCC + totalOther;
  const totalInterest = debts.reduce((s, d) => s + Math.round(d.monthly * 0.12), 0) || 13396;

  const scrollBy = (dir) => scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setDot(Math.min(Math.round(el.scrollLeft / 320), cards.length));
  };

  return (
    <div>
      <Header title="CardWallet" onReset={onReset} />
      <div className="flex items-start justify-between" style={{ padding: "4px 20px 8px" }}>
        <div>
          <div style={{ fontSize: 13, color: C.textMuted }}>ยอดหนี้รวมทั้งหมด</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#fff" }}>{baht(totalDebt)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>ดอกเบี้ย/เดือน</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.amber }}>{bahtShort(totalInterest)}</div>
        </div>
      </div>

      <div className="flex items-center" style={{ marginTop: 18, padding: "0 8px", gap: 6 }}>
        <IconButton onClick={() => scrollBy(-1)}><ChevronLeft size={18} /></IconButton>
        <div ref={scrollRef} onScroll={onScroll} style={{ display: "flex", gap: 14, overflowX: "auto", padding: "2px 8px", scrollSnapType: "x mandatory" }}>
          {cards.map((c) => (
            <CardTile key={c.id} card={c} onDelete={() => setCards(cards.filter((x) => x.id !== c.id))} />
          ))}
          <AddCardTile onClick={() => setShowAddCard(true)} />
        </div>
        <IconButton onClick={() => scrollBy(1)}><ChevronRight size={18} /></IconButton>
      </div>

      <div className="flex items-center justify-center" style={{ gap: 6, marginTop: 14 }}>
        {[...cards, {}].map((_, i) => (
          <span key={i} style={{ width: i === dot ? 20 : 6, height: 6, borderRadius: 999, background: i === dot ? C.blue : C.borderSoft, transition: "all .2s" }} />
        ))}
      </div>

      <div className="grid grid-cols-2" style={{ gap: 14, padding: "22px 20px 4px" }}>
        <button onClick={() => { setExpTab("sub"); setScreen("expenses"); }} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, textAlign: "left" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#2a2440", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>📦</div>
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: "#fff" }}>รายจ่ายประจำ</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>จัดการ Subscriptions</div>
        </button>
        <button onClick={() => { setExpTab("other"); setScreen("expenses"); }} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, textAlign: "left" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#2a2440", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🏠</div>
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 700, color: "#fff" }}>หนี้สินอื่นๆ</div>
          <div style={{ fontSize: 11, color: C.textMuted }}>บ้าน, รถ, เงินกู้</div>
        </button>
      </div>

      <SectionLabel>สรุปภาระหนี้สิน</SectionLabel>
      <div className="grid grid-cols-2" style={{ gap: 14, padding: "0 20px 4px" }}>
        <StatCard icon={CreditCard} iconColor={C.blue} label="บัตรเครดิต" value={baht(totalCC)} sub={`วงเงินคงเหลือ ${baht(totalLimitLeft)}`} valueColor={C.red} />
        {debts.map((d) => {
          const Icon = DEBT_ICONS[d.iconKey] || FileText;
          return <StatCard key={d.id} icon={Icon} iconColor={d.color} label={d.name} value={baht(d.amount)} sub={d.status} valueColor={C.red} />;
        })}
      </div>

      {expenses.length > 0 && (
        <>
          <SectionLabel>รายการล่าสุด</SectionLabel>
          <div style={{ padding: "0 20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {expenses.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center justify-between" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{e.desc || CATEGORIES.find((c) => c.id === e.category)?.label || "รายจ่าย"}</div>
                  <div style={{ fontSize: 11, color: C.textFaint }}>{e.date} • {e.cardName || "ไม่ผูกบัตร"}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.red }}>-{bahtShort(e.amount)}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {expenses.length === 0 && <div style={{ height: 20 }} />}

      {showAddCard && (
        <AddCardModal
          onClose={() => setShowAddCard(false)}
          onSave={(newCard) => { setCards([...cards, newCard]); setShowAddCard(false); }}
        />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, iconColor, label, value, sub, valueColor }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
        <Icon size={15} color={iconColor} />
        <span style={{ fontSize: 12, color: C.textMuted }}>{label}</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: valueColor }}>{value}</div>
      <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

/* ---------------------------------- overview screen ---------------------------------- */
function OverviewScreen({ cards, debts, onReset }) {
  const totalCC = cards.reduce((s, c) => s + c.used, 0);
  const totalLimitLeft = cards.reduce((s, c) => s + c.limitLeft, 0);
  const totalOther = debts.reduce((s, d) => s + d.amount, 0);
  const totalDebt = totalCC + totalOther;
  const totalInterest = debts.reduce((s, d) => s + Math.round(d.monthly * 0.12), 0) || 13396;
  const totalMonthlyPay = debts.reduce((s, d) => s + d.monthly, 0);

  const palette = [C.blue, C.purple, C.orange, "#fb923c", C.teal, C.red];
  const data = [
    ...cards.map((c, i) => ({ name: c.name, value: c.used, color: palette[i % palette.length] })),
    ...debts.map((d, i) => ({ name: d.name, value: d.amount, color: d.color || palette[(i + 2) % palette.length] })),
  ].filter((d) => d.value > 0);

  return (
    <div>
      <Header title="ภาพรวมหนี้สิน" onReset={onReset} />
      <div style={{ margin: "6px 20px 0", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: C.textMuted }}>ยอดหนี้รวมทั้งหมด</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{baht(totalDebt)}</div>
        </div>
        <div style={{ marginTop: 18, background: C.surface2, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>ภาระดอกเบี้ย (ต่อเดือน)</div>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span className="flex items-center gap-1" style={{ fontSize: 13, color: "#dcdde8" }}>ดอกเบี้ยบัตรเครดิต <Info size={12} color={C.textFaint} /></span>
            <span style={{ fontSize: 13, color: "#dcdde8" }}>฿0</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 13, color: "#dcdde8" }}>ดอกเบี้ยหนี้อื่นๆรวม</span>
            <span style={{ fontSize: 13, color: "#dcdde8" }}>{bahtShort(totalInterest)}</span>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, margin: "12px 0" }} />
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>ดอกเบี้ยที่ต้องรับผิดชอบรวม</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{bahtShort(totalInterest)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: 14, padding: "18px 20px 0" }}>
        <StatCard icon={CreditCard} iconColor={C.blue} label="บัตรเครดิต" value={baht(totalCC)} sub=" " valueColor={C.red} />
        <StatCard icon={FileText} iconColor={C.orange} label="หนี้อื่นๆ" value={baht(totalOther)} sub=" " valueColor={C.red} />
        <StatCard icon={Wallet} iconColor={C.purple} label="ผ่อน/เดือน" value={bahtShort(totalMonthlyPay)} sub=" " valueColor={C.purple} />
        <StatCard icon={Shield} iconColor={C.green} label="วงเงินคงเหลือ" value={baht(totalLimitLeft)} sub=" " valueColor={C.green} />
      </div>

      <SectionLabel>โครงสร้างหนี้</SectionLabel>
      {data.length > 0 ? (
        <>
          <div className="flex items-center justify-center" style={{ padding: "0 20px" }}>
            <PieChart width={240} height={240}>
              <Pie data={data} dataKey="value" innerRadius={78} outerRadius={110} startAngle={90} endAngle={450} stroke="none">
                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div style={{ padding: "8px 20px 28px" }}>
            {data.map((d) => (
              <div key={d.name} className="flex items-center justify-between" style={{ padding: "9px 0", borderBottom: `1px solid ${C.borderSoft}` }}>
                <div className="flex items-center gap-2">
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: d.color, display: "inline-block" }} />
                  <span style={{ fontSize: 13, color: "#dcdde8" }}>{d.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 12, color: C.textMuted, width: 40, textAlign: "right" }}>{((d.value / totalDebt) * 100).toFixed(1)}%</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{baht(d.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div style={{ padding: "20px", textAlign: "center", color: C.textFaint, fontSize: 13 }}>ยังไม่มีข้อมูลหนี้สิน</div>
      )}
    </div>
  );
}

/* ---------------------------------- calendar screen ---------------------------------- */
function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix = [];
  let day = 1 - firstDay;
  for (let w = 0; w < 6 && day <= daysInMonth; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      row.push(day >= 1 && day <= daysInMonth ? day : null);
      day++;
    }
    matrix.push(row);
  }
  return matrix;
}

function CalendarScreen({ cards, debts, onReset }) {
  const today = new Date();
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(today.getDate());
  const base = new Date(today.getFullYear(), today.getMonth(), 1);
  base.setMonth(base.getMonth() + offset);
  const year = base.getFullYear();
  const month = base.getMonth();
  const isBaseline = offset === 0;
  const matrix = getMonthMatrix(year, month);

  const events = {};
  cards.forEach((c) => {
    events[c.statementDay] = [...(events[c.statementDay] || []), "orange"];
    events[c.dueDay] = [...(events[c.dueDay] || []), "red"];
  });

  return (
    <div>
      <Header title="ปฏิทินหนี้สิน" onReset={onReset} />
      <div className="flex items-center justify-between" style={{ padding: "8px 20px 4px" }}>
        <IconButton onClick={() => { setOffset(offset - 1); }}><ChevronLeft size={18} /></IconButton>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{THAI_MONTHS[month]} {year + 543}</div>
        <IconButton onClick={() => { setOffset(offset + 1); }}><ChevronRight size={18} /></IconButton>
      </div>

      <div className="grid grid-cols-7" style={{ padding: "16px 20px 4px", gap: 4 }}>
        {THAI_WEEKDAYS.map((w) => (
          <div key={w} style={{ textAlign: "center", fontSize: 12, color: C.textFaint, fontWeight: 600 }}>{w}</div>
        ))}
      </div>

      <div style={{ padding: "4px 20px 24px" }}>
        {matrix.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7" style={{ gap: 4, marginBottom: 4 }}>
            {row.map((d, di) => {
              if (!d) return <div key={di} />;
              const isToday = isBaseline && d === today.getDate();
              const isSelected = isBaseline && d === selected;
              const dayEvents = isBaseline ? events[d] : null;
              return (
                <button
                  key={di}
                  onClick={() => setSelected(d)}
                  style={{
                    aspectRatio: "1", borderRadius: 12, border: "none", cursor: "pointer",
                    background: isSelected ? C.blue : isToday ? "#161c33" : "transparent",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: isSelected ? 700 : 500, color: isSelected ? "#fff" : "#dcdde8" }}>{d}</span>
                  {dayEvents && (
                    <span style={{ display: "flex", gap: 2 }}>
                      {dayEvents.map((c, i) => (
                        <span key={i} style={{ width: 5, height: 5, borderRadius: 999, background: dotColor[c] }} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px 24px", display: "flex", gap: 16, fontSize: 11, color: C.textMuted }}>
        <span className="flex items-center gap-1"><span style={{ width: 8, height: 8, borderRadius: 999, background: C.orange }} /> วันตัดรอบ</span>
        <span className="flex items-center gap-1"><span style={{ width: 8, height: 8, borderRadius: 999, background: C.red }} /> วันครบกำหนดชำระ</span>
      </div>
    </div>
  );
}

/* ---------------------------------- expenses screen ---------------------------------- */
function AddSubscriptionModal({ onClose, onSave, cards }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cycle, setCycle] = useState("รายเดือน");
  const [date, setDate] = useState("");
  const [cardId, setCardId] = useState("");

  const save = () => {
    if (!name || !amount) return;
    const card = cards.find((c) => c.id === cardId);
    onSave({
      id: "sub_" + Date.now(),
      name,
      icon: "🔔",
      amount: Number(amount),
      cycle,
      date: date || "-",
      card: card ? card.name.split(" ")[0] : "ไม่ผูกบัตร",
      daysLeft: 30,
      urgency: "green",
    });
  };

  return (
    <Modal title="เพิ่ม Subscription" onClose={onClose}>
      <FieldLabel>ชื่อรายการ</FieldLabel>
      <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น YouTube Premium" />
      <FieldLabel>ยอดเงิน (บาท)</FieldLabel>
      <input style={inputStyle} value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0" inputMode="decimal" />
      <FieldLabel>รอบการตัดเงิน</FieldLabel>
      <div className="flex gap-2">
        {["รายเดือน", "รายปี"].map((c) => (
          <button key={c} onClick={() => setCycle(c)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: cycle === c ? `1.5px solid ${C.blue}` : `1px solid ${C.border}`, background: cycle === c ? "rgba(91,124,250,0.12)" : C.surface2, color: "#fff", fontSize: 13 }}>{c}</button>
        ))}
      </div>
      <FieldLabel>วันที่ตัดเงินถัดไป (เช่น 13 ก.ค.)</FieldLabel>
      <input style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} placeholder="13 ก.ค." />
      <FieldLabel>บัตรที่ใช้ตัด</FieldLabel>
      <select style={inputStyle} value={cardId} onChange={(e) => setCardId(e.target.value)}>
        <option value="">ไม่ผูกบัตร</option>
        {cards.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button onClick={save} style={{ width: "100%", marginTop: 22, padding: "14px 0", borderRadius: 14, border: "none", background: accentGrad, color: "#fff", fontWeight: 700, fontSize: 14 }}>บันทึก Subscription</button>
    </Modal>
  );
}

function ExpensesScreen({ expTab, setExpTab, setScreen, subs, setSubs, debts, cards, onReset }) {
  const [showAddSub, setShowAddSub] = useState(false);
  const monthlyTotal = subs.filter((s) => s.cycle === "รายเดือน").reduce((s, x) => s + x.amount, 0);
  const yearlyExtra = subs.filter((s) => s.cycle === "รายปี").reduce((s, x) => s + x.amount, 0);

  return (
    <div>
      <Header title="รายจ่ายประจำ" onReset={onReset} />
      <div className="flex" style={{ margin: "6px 20px 0", background: C.surface2, borderRadius: 999, padding: 4, border: `1px solid ${C.border}` }}>
        <button onClick={() => setExpTab("sub")} style={{ flex: 1, padding: "9px 0", borderRadius: 999, border: "none", fontSize: 13, fontWeight: 600, background: expTab === "sub" ? accentGrad : "transparent", color: expTab === "sub" ? "#fff" : C.textMuted }}>📦 Subscription</button>
        <button onClick={() => setExpTab("other")} style={{ flex: 1, padding: "9px 0", borderRadius: 999, border: "none", fontSize: 13, fontWeight: 600, background: expTab === "other" ? accentGrad : "transparent", color: expTab === "other" ? "#fff" : C.textMuted }}>🏠 หนี้อื่นๆ</button>
      </div>

      {expTab === "sub" ? (
        <>
          <div className="flex items-center justify-between" style={{ margin: "16px 20px 0", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: C.textMuted }}>รายจ่ายประจำ/เดือน</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{bahtShort(monthlyTotal)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: C.textFaint }}>รายปี + {subs.filter((s) => s.cycle === "รายปี").length}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.amber }}>+{bahtShort(yearlyExtra)}</div>
            </div>
          </div>

          <button onClick={() => setShowAddSub(true)} style={{ display: "block", width: "calc(100% - 40px)", margin: "16px 20px 0", padding: "14px 0", borderRadius: 14, border: "none", background: accentGrad, color: "#fff", fontWeight: 700, fontSize: 14 }}>+ เพิ่ม Subscription</button>

          <SectionLabel>รายจ่ายทั้งหมด ({subs.length})</SectionLabel>
          <div className="grid grid-cols-2" style={{ gap: 14, padding: "0 20px 24px" }}>
            {subs.map((s) => (
              <div key={s.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 14, position: "relative" }}>
                <button onClick={() => setSubs(subs.filter((x) => x.id !== s.id))} style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none" }}>
                  <X size={13} color={C.textFaint} />
                </button>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{s.icon}</div>
                <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600, color: "#fff" }}>{s.name}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 2 }}>{bahtShort(s.amount)}</div>
                <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>{s.cycle} • {s.date}</div>
                <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
                  <span style={{ fontSize: 10, background: C.surface2, borderRadius: 6, padding: "3px 7px", color: C.textMuted }}>{s.card}</span>
                  <span style={{ fontSize: 10, background: s.urgency === "amber" ? "rgba(245,166,35,0.15)" : "rgba(52,211,153,0.15)", color: s.urgency === "amber" ? C.amber : C.green, borderRadius: 6, padding: "3px 7px", fontWeight: 600 }}>อีก {s.daysLeft} วัน</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <SectionLabel>หนี้สินอื่นๆ ({debts.length})</SectionLabel>
          <div style={{ padding: "0 20px 12px", display: "flex", flexDirection: "column", gap: 12 }}>
            {debts.map((d) => {
              const Icon = DEBT_ICONS[d.iconKey] || FileText;
              return (
                <div key={d.id} className="flex items-center justify-between" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16 }}>
                  <div className="flex items-center gap-3">
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: C.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color={d.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{d.name}</div>
                      <div style={{ fontSize: 11, color: C.textFaint }}>{d.status} • ผ่อน {bahtShort(d.monthly)}/เดือน</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.red }}>{baht(d.amount)}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showAddSub && (
        <AddSubscriptionModal cards={cards} onClose={() => setShowAddSub(false)} onSave={(s) => { setSubs([...subs, s]); setShowAddSub(false); }} />
      )}
    </div>
  );
}

/* ---------------------------------- add expense screen ---------------------------------- */
function AddExpenseScreen({ setScreen, cards, setCards, expenses, setExpenses }) {
  const [cardId, setCardId] = useState(cards[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [desc, setDesc] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    const card = cards.find((c) => c.id === cardId);
    const record = {
      id: "exp_" + Date.now(),
      amount: amt,
      category,
      desc,
      cardId,
      cardName: card ? card.name : null,
      date: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short" }),
    };
    setExpenses([record, ...expenses]);
    if (card) {
      setCards(cards.map((c) => c.id === card.id ? { ...c, used: c.used + amt, limitLeft: Math.max(0, c.limitLeft - amt) } : c));
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setScreen("expenses"); }, 700);
  };

  return (
    <div>
      <Header title="บันทึกรายจ่าย" onBack={() => setScreen("wallet")} />
      <div style={{ padding: "4px 20px 0" }}>
        <div style={{ fontSize: 13, color: "#dcdde8", fontWeight: 600, marginBottom: 10 }}>เลือกบัตรที่ใช้จ่าย</div>
        <div className="grid grid-cols-2" style={{ gap: 12 }}>
          {cards.map((c) => (
            <button
              key={c.id}
              onClick={() => setCardId(c.id)}
              style={{
                borderRadius: 14, padding: 16, textAlign: "left", height: 72, position: "relative",
                background: cardId === c.id ? c.grad : "rgba(255,255,255,0.03)",
                border: cardId === c.id ? "2px solid rgba(255,255,255,0.5)" : `1px solid ${C.border}`,
                opacity: cardId === c.id ? 1 : 0.55,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{c.name}</span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 13, color: "#dcdde8", fontWeight: 600, margin: "22px 0 10px" }}>ยอดเงิน</div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: C.textFaint }}>฿</span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0"
            inputMode="decimal"
            style={{ background: "transparent", border: "none", outline: "none", fontSize: 24, fontWeight: 700, color: amount ? "#fff" : C.textFaint, width: "100%" }}
          />
        </div>

        <div style={{ fontSize: 13, color: "#dcdde8", fontWeight: 600, margin: "22px 0 10px" }}>หมวดหมู่</div>
        <div className="grid grid-cols-3" style={{ gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px 4px",
                borderRadius: 12, background: category === cat.id ? "rgba(91,124,250,0.12)" : "rgba(255,255,255,0.02)",
                border: category === cat.id ? `1.5px solid ${C.blue}` : `1px solid ${C.border}`,
              }}
            >
              <cat.icon size={17} color={category === cat.id ? C.blue : C.textMuted} />
              <span style={{ fontSize: 10, color: category === cat.id ? "#fff" : C.textMuted, textAlign: "center" }}>{cat.label}</span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 13, color: "#dcdde8", fontWeight: 600, margin: "22px 0 10px" }}>รายการ / คำอธิบาย</div>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="พิมพ์หรือเลือกจากคำแนะนำ..."
          style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", color: "#fff", fontSize: 13, outline: "none" }}
        />
        <div className="flex flex-wrap" style={{ gap: 8, marginTop: 12 }}>
          {SUGGESTIONS.map((s) => (
            <button key={s} onClick={() => setDesc(s)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 999, background: C.surface2, border: `1px solid ${C.border}`, color: "#dcdde8", fontSize: 12 }}>🔖 {s}</button>
          ))}
        </div>

        <button onClick={handleSave} style={{ display: "block", width: "100%", margin: "24px 0 20px", padding: "15px 0", borderRadius: 14, border: "none", background: accentGrad, color: "#fff", fontWeight: 700, fontSize: 14 }}>
          {saved ? "บันทึกแล้ว ✓" : "บันทึกรายการ"}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */
export default function App() {
  const [screen, setScreen] = useState("wallet");
  const [expTab, setExpTab] = useState("sub");
  const [cards, setCards] = usePersistentState("cardwallet_cards", DEFAULT_CARDS);
  const [debts] = usePersistentState("cardwallet_debts", DEFAULT_DEBTS);
  const [subs, setSubs] = usePersistentState("cardwallet_subs", DEFAULT_SUBSCRIPTIONS);
  const [expenses, setExpenses] = usePersistentState("cardwallet_expenses", []);

  const resetAll = () => {
    if (!window.confirm("ล้างข้อมูลทั้งหมดและเริ่มใหม่?")) return;
    localStorage.removeItem("cardwallet_cards");
    localStorage.removeItem("cardwallet_debts");
    localStorage.removeItem("cardwallet_subs");
    localStorage.removeItem("cardwallet_expenses");
    window.location.reload();
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bgPage }}>
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", display: "flex", flexDirection: "column", background: C.bgPage }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {screen === "wallet" && <WalletScreen cards={cards} setCards={setCards} debts={debts} expenses={expenses} setScreen={setScreen} setExpTab={setExpTab} onReset={resetAll} />}
          {screen === "overview" && <OverviewScreen cards={cards} debts={debts} onReset={resetAll} />}
          {screen === "calendar" && <CalendarScreen cards={cards} debts={debts} onReset={resetAll} />}
          {screen === "expenses" && <ExpensesScreen expTab={expTab} setExpTab={setExpTab} setScreen={setScreen} subs={subs} setSubs={setSubs} debts={debts} cards={cards} onReset={resetAll} />}
          {screen === "add" && <AddExpenseScreen setScreen={setScreen} cards={cards} setCards={setCards} expenses={expenses} setExpenses={setExpenses} />}
        </div>
        {screen !== "add" && <BottomNav screen={screen} setScreen={setScreen} />}
      </div>
    </div>
  );
}
