import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ─── SUPABASE CONFIG ─────────────────────────────────────────────────────────
// ⚠️ Substitui com as tuas credenciais do Supabase
const SUPABASE_URL = "https://xgzibkhleztbymwxkheu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhnemlia2hsZXp0Ynltd3hraGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDY4MTksImV4cCI6MjA4NjU4MjgxOX0.7zsrVtVpa1o38VA7Z5KwfQOGxZAdKonm2iOf5BerN7U";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── THEME ───────────────────────────────────────────────────────────────────
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0f0f;
    --surface: #1a1a1a;
    --surface2: #242424;
    --border: #2e2e2e;
    --accent: #d4a843;
    --accent2: #b8892e;
    --text: #f0ece4;
    --muted: #888;
    --error: #e05353;
    --success: #3eb87a;
    --sidebar: 72px;
    --radius: 10px;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
  }
  .sidebar-logo {
    width: 40px; height: 40px;
    background: var(--accent);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 20px; color: #000;
    margin-bottom: 32px;
  }
  .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 6px; width: 100%; padding: 0 10px; }
  .nav-btn {
    width: 100%; aspect-ratio: 1;
    background: none; border: none; border-radius: var(--radius);
    color: var(--muted); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; transition: all .2s;
    position: relative;
  }
  .nav-btn:hover { background: var(--surface2); color: var(--text); }
  .nav-btn.active { background: var(--accent); color: #000; }
  .sidebar-bottom { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 0 10px; width: 100%; }
  .theme-toggle {
    width: 52px; border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden;
  }
  .theme-btn {
    width: 100%; padding: 6px 0; background: none; border: none;
    color: var(--muted); cursor: pointer; font-size: 14px; transition: all .2s;
  }
  .theme-btn.active { background: var(--surface2); color: var(--text); }
  .logout-btn {
    background: none; border: none; color: var(--muted);
    cursor: pointer; font-size: 22px; padding: 8px; transition: color .2s;
  }
  .logout-btn:hover { color: var(--error); }

  /* MAIN */
  .main { margin-left: var(--sidebar); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .page { flex: 1; padding: 32px; max-width: 900px; width: 100%; margin: 0 auto; }

  /* AUTH */
  .auth-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg);
    background-image: radial-gradient(circle at 20% 50%, rgba(212,168,67,.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(212,168,67,.05) 0%, transparent 40%);
  }
  .auth-card {
    width: 100%; max-width: 420px; background: var(--surface);
    border: 1px solid var(--border); border-radius: 16px;
    padding: 40px; margin: 20px;
  }
  .auth-logo { text-align: center; margin-bottom: 32px; }
  .auth-logo h1 { font-family: 'Bebas Neue', sans-serif; font-size: 42px; color: var(--accent); letter-spacing: 3px; }
  .auth-logo p { color: var(--muted); font-size: 13px; margin-top: 4px; }
  .tab-bar { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 28px; }
  .tab { flex: 1; padding: 12px; background: none; border: none; color: var(--muted); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; transition: all .2s; }
  .tab.active { color: var(--text); border-bottom: 2px solid var(--accent); margin-bottom: -1px; }

  /* FORMS */
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 6px; }
  .form-control {
    width: 100%; padding: 12px 16px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--radius);
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px;
    outline: none; transition: border-color .2s;
  }
  .form-control:focus { border-color: var(--accent); }
  .form-control::placeholder { color: var(--muted); }
  select.form-control { cursor: pointer; }

  /* BUTTONS */
  .btn {
    padding: 12px 24px; border: none; border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all .2s; display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary { background: var(--accent); color: #000; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: var(--error); color: #fff; }
  .btn-full { width: 100%; justify-content: center; }
  .btn:disabled { opacity: .5; cursor: not-allowed; }

  /* CARDS */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
  .card-body { padding: 20px; }

  /* PAGE HEADER */
  .page-header { margin-bottom: 28px; }
  .page-header h2 { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 2px; color: var(--accent); }
  .page-header p { color: var(--muted); font-size: 14px; margin-top: 4px; }

  /* CLIENTS LIST */
  .search-bar { display: flex; gap: 0; margin-bottom: 20px; }
  .search-bar .form-control { border-radius: var(--radius) 0 0 var(--radius); }
  .search-btn { padding: 12px 18px; background: var(--accent); border: none; border-radius: 0 var(--radius) var(--radius) 0; color: #000; cursor: pointer; font-size: 16px; }

  .client-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 16px; display: flex; align-items: center; gap: 16px;
    cursor: pointer; transition: all .2s; margin-bottom: 8px;
  }
  .client-card:hover { border-color: var(--accent); transform: translateX(2px); }
  .client-avatar {
    width: 56px; height: 56px; border-radius: 10px; object-fit: cover;
    background: var(--surface2); flex-shrink: 0;
  }
  .client-info { flex: 1; }
  .client-name { font-weight: 600; font-size: 16px; margin-bottom: 2px; }
  .client-meta { color: var(--muted); font-size: 13px; }
  .chevron { color: var(--muted); font-size: 20px; }

  .fab {
    position: fixed; bottom: 32px; right: 32px;
    width: 60px; height: 60px; border-radius: 50%;
    background: var(--accent); border: none; color: #000;
    font-size: 28px; cursor: pointer; box-shadow: 0 4px 20px rgba(212,168,67,.4);
    display: flex; align-items: center; justify-content: center;
    transition: all .2s; z-index: 50;
  }
  .fab:hover { transform: scale(1.1); background: var(--accent2); }

  /* STATS ROW */
  .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border-radius: var(--radius); overflow: hidden; margin-bottom: 20px; }
  .stat-box { background: var(--surface2); padding: 20px; text-align: center; }
  .stat-icon { font-size: 28px; margin-bottom: 8px; }
  .stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--accent); }
  .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: .5px; margin-top: 4px; }

  /* CLIENT INFO */
  .client-header-card {
    background: var(--surface); border: 1px solid var(--accent); border-radius: var(--radius);
    padding: 20px; display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
  }
  .client-header-avatar { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; }
  .client-header-info { flex: 1; }
  .client-header-name { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
  .client-header-sub { font-size: 13px; color: var(--muted); line-height: 1.6; }

  /* HISTORY */
  .history-item { padding: 16px 0; border-bottom: 1px solid var(--border); }
  .history-date { font-size: 12px; color: var(--muted); margin-bottom: 10px; }
  .history-images { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .before-after-img { width: 70px; height: 70px; border-radius: 8px; object-fit: cover; border: 2px solid var(--accent); background: var(--surface2); position: relative; }
  .img-label { font-size: 10px; font-weight: 700; background: #d97b51; color: #fff; padding: 1px 6px; border-radius: 4px; position: absolute; top: 0; left: 0; }
  .history-meta { display: flex; align-items: center; gap: 10px; }
  .barber-mini { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; background: var(--surface2); }
  .history-price { margin-left: auto; font-size: 20px; font-weight: 700; color: var(--accent); }

  /* CRIAR */
  .services-grid { display: grid; gap: 10px; margin-bottom: 20px; }
  .service-check {
    background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;
    cursor: pointer; transition: all .2s;
  }
  .service-check.checked { border-color: var(--accent); background: rgba(212,168,67,.08); }
  .service-check-label { font-size: 16px; font-weight: 500; }
  .checkbox { width: 20px; height: 20px; border-radius: 4px; border: 2px solid var(--border); background: var(--surface); display: flex; align-items: center; justify-content: center; color: #000; font-size: 12px; transition: all .2s; }
  .checkbox.checked { background: var(--accent); border-color: var(--accent); }

  .price-display {
    background: var(--surface2); border-radius: var(--radius);
    height: 80px; display: flex; align-items: center; justify-content: center;
    font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: var(--accent); letter-spacing: 2px;
    margin-bottom: 12px;
  }

  /* CONFIG */
  .avatar-upload {
    width: 140px; height: 140px; border-radius: 50%;
    border: 3px solid var(--accent); margin: 0 auto 24px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; cursor: pointer; position: relative;
    background: var(--surface2);
  }
  .avatar-upload img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-upload-overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,.5);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity .2s; font-size: 24px;
  }
  .avatar-upload:hover .avatar-upload-overlay { opacity: 1; }

  /* TOAST */
  .toast {
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    padding: 12px 24px; border-radius: var(--radius); font-size: 14px; font-weight: 600;
    z-index: 9999; animation: slideUp .3s ease;
    color: #fff;
  }
  .toast.success { background: var(--success); }
  .toast.error { background: var(--error); }
  @keyframes slideUp { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 32px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--accent); margin-bottom: 24px; letter-spacing: 1px; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

  /* HOME */
  .home-welcome { margin-bottom: 40px; }
  .home-welcome h1 { font-family: 'Bebas Neue', sans-serif; font-size: 52px; letter-spacing: 3px; line-height: 1; color: var(--accent); }
  .home-welcome p { color: var(--muted); font-size: 16px; margin-top: 8px; }
  .home-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .home-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 24px; cursor: pointer; transition: all .2s;
  }
  .home-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .home-card-icon { font-size: 32px; margin-bottom: 12px; }
  .home-card-title { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .home-card-desc { font-size: 13px; color: var(--muted); }

  .back-btn { background: none; border: none; color: var(--muted); font-size: 22px; cursor: pointer; padding: 4px 8px 4px 0; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; transition: color .2s; }
  .back-btn:hover { color: var(--text); }

  .loading { display: flex; align-items: center; justify-content: center; padding: 60px; color: var(--muted); font-size: 14px; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--muted); }
  .empty-state .icon { font-size: 48px; margin-bottom: 12px; }
  .section-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; color: var(--muted); margin-bottom: 14px; }
  .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
  .tag-gold { background: rgba(212,168,67,.15); color: var(--accent); border: 1px solid rgba(212,168,67,.3); }

  @media (max-width: 600px) {
    .home-grid { grid-template-columns: 1fr; }
    .stats-row { grid-template-columns: 1fr; }
    .page { padding: 16px; }
  }
`;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    home: "🏠", cut: "✂️", clients: "👤", chart: "📈", settings: "⚙️",
    logout: "🚪", sun: "☀️", moon: "🌙", add: "+", back: "←",
    search: "🔍", edit: "✏️", check: "✓", euro: "€", calendar: "📅",
    scissors: "✂️", cake: "🎂", phone: "📱", mail: "✉️", arrow: "→",
    chevron: "›", verified: "✓",
  };
  return <span style={{ fontSize: size }}>{icons[name] || "?"}</span>;
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, []);
  return <div className={`toast ${type}`}>{msg}</div>;
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const handleLogin = async () => {
    if (!email || !password) return showToast("Preenche todos os campos", "error");
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Check user status
      const { data: statusData } = await supabase.from("user_status").select("status").eq("id", data.user.id).single();
      if (statusData?.status !== 1) {
        await supabase.auth.signOut();
        return showToast("O teu utilizador ainda não foi aprovado", "error");
      }
      onLogin(data.user);
    } catch (e) {
      showToast(e.message || "Erro ao iniciar sessão", "error");
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!email || !password) return showToast("Preenche todos os campos", "error");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      showToast("Conta criada! Aguarda aprovação do administrador.");
      setTab("login");
    } catch (e) {
      showToast(e.message || "Erro ao criar conta", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>✂ BARBER</h1>
          <p>Sistema de Gestão de Barbearia</p>
        </div>
        <div className="tab-bar">
          <button className={`tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Novo utilizador</button>
          <button className={`tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Log In</button>
        </div>
        {tab === "register" ? (
          <>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 20 }}>Novos utilizadores têm de ser previamente aprovados por um administrador.</p>
            <div className="form-group"><label>Email</label><input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" /></div>
            <div className="form-group"><label>Senha</label><input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></div>
            <button className="btn btn-primary btn-full" onClick={handleRegister} disabled={loading}>{loading ? "A criar..." : "Criar conta"}</button>
          </>
        ) : (
          <>
            <div className="form-group"><label>Email</label><input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" /></div>
            <div className="form-group"><label>Senha</label><input className="form-control" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} /></div>
            <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={loading}>{loading ? "A entrar..." : "Log In"}</button>
          </>
        )}
      </div>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ barber, onNavigate }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  return (
    <div className="page">
      <div className="home-welcome">
        <h1>{greeting},<br />{barber?.name || "Barbeiro"} ✂</h1>
        <p>Bem-vindo ao teu sistema de gestão</p>
      </div>
      <div className="home-grid">
        {[
          { page: "criar", icon: "✂️", title: "Novo Corte", desc: "Registar um novo serviço" },
          { page: "clientes", icon: "👥", title: "Clientes", desc: "Ver e gerir clientes" },
          { page: "dashboard", icon: "📊", title: "Dashboard", desc: "Estatísticas e relatórios" },
          { page: "config", icon: "⚙️", title: "Configurações", desc: "Perfil e definições" },
        ].map(c => (
          <div key={c.page} className="home-card" onClick={() => onNavigate(c.page)}>
            <div className="home-card-icon">{c.icon}</div>
            <div className="home-card-title">{c.title}</div>
            <div className="home-card-desc">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLIENTS PAGE ─────────────────────────────────────────────────────────────
function ClientesPage({ onNavigate }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let q = supabase.from("clients").select("*").order("name");
    if (query) q = q.or(`name.ilike.%${query}%,email.ilike.%${query}%,phone_number.ilike.%${query}%`);
    q.then(({ data }) => { setClients(data || []); setLoading(false); });
  }, [query]);

  return (
    <div className="page">
      <div className="page-header"><h2>Clientes</h2><p>{clients.length} clientes registados</p></div>
      <div className="search-bar">
        <input className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Procurar por nome, email ou telefone..." onKeyDown={e => e.key === "Enter" && setQuery(search)} />
        <button className="search-btn" onClick={() => setQuery(search)}>🔍</button>
      </div>
      {loading ? <div className="loading">A carregar...</div> : clients.length === 0 ? (
        <div className="empty-state"><div className="icon">👥</div><p>Nenhum cliente encontrado</p></div>
      ) : clients.map(c => (
        <div key={c.id} className="client-card" onClick={() => onNavigate("client-info", c)}>
          <img className="client-avatar" src={c.image || "https://xgzibkhleztbymwxkheu.supabase.co/storage/v1/object/public/ProfilePictures/Clients/nullPhoto.png"} alt="" onError={e => e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(c.name) + "&background=2a2a2a&color=d4a843"} />
          <div className="client-info">
            <div className="client-name">{c.name}</div>
            <div className="client-meta">{c.email} · {c.phone_number}</div>
          </div>
          <span className="chevron">›</span>
        </div>
      ))}
      <button className="fab" onClick={() => onNavigate("edit-client", null)} title="Novo cliente">+</button>
    </div>
  );
}

// ─── CLIENT INFO ──────────────────────────────────────────────────────────────
function ClientInfoPage({ client, onNavigate, onBack }) {
  const [stats, setStats] = useState(null);
  const [haircuts, setHaircuts] = useState([]);
  const [prices, setPrices] = useState({});
  const [barbers, setBarbers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("client_statistics").select("*").eq("client_id", client.id).single(),
      supabase.from("client_haircuts").select("*").eq("client_id", client.id).order("created_at", { ascending: false }),
      supabase.from("prices").select("*"),
      supabase.from("barbers").select("*"),
    ]).then(([statsR, haircutsR, pricesR, barbersR]) => {
      setStats(statsR.data);
      setHaircuts(haircutsR.data || []);
      const pm = {}; (pricesR.data || []).forEach(p => pm[p.id] = p); setPrices(pm);
      const bm = {}; (barbersR.data || []).forEach(b => bm[b.id] = b); setBarbers(bm);
      setLoading(false);
    });
  }, [client.id]);

  const calcPrice = (cut, priceRow) => {
    if (!priceRow) return 0;
    if (cut.hair && cut.beard) return priceRow.hairandbeard_price || 0;
    let total = 0;
    if (cut.hair) total += priceRow.hair_price || 0;
    if (cut.beard) total += priceRow.beard_price || 0;
    if (cut.eyebrows) total += priceRow.eyebrows_price || 0;
    return total;
  };

  const formatDate = d => d ? new Date(d).toLocaleDateString("pt-PT") : "n/a";
  const formatPrice = v => v != null ? `€${Number(v).toFixed(2).replace(".", ",")}` : "€0,00";

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← Voltar</button>
      <div className="client-header-card">
        <img className="client-header-avatar" src={client.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(client.name) + "&background=2a2a2a&color=d4a843"} alt="" onError={e => e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(client.name) + "&background=2a2a2a&color=d4a843"} />
        <div className="client-header-info">
          <div className="client-header-name">{client.name} <span style={{ color: "#3eb87a", fontSize: 16 }}>✓</span></div>
          <div className="client-header-sub">
            {client.email && <div>✉ {client.email}</div>}
            {client.phone_number && <div>📱 {client.phone_number}</div>}
            {client.birthday && <div>🎂 {formatDate(client.birthday)}</div>}
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => onNavigate("edit-client", client)} style={{ flexShrink: 0 }}>✏️</button>
      </div>

      {loading ? <div className="loading">A carregar...</div> : (
        <>
          <div className="stats-row">
            <div className="stat-box"><div className="stat-icon">✂️</div><div className="stat-value">{stats?.total_works || 0}</div><div className="stat-label">Cortes feitos</div></div>
            <div className="stat-box"><div className="stat-icon">€</div><div className="stat-value">{stats?.total_spent ? `${Number(stats.total_spent).toFixed(0)}€` : "0€"}</div><div className="stat-label">Valor gasto</div></div>
            <div className="stat-box"><div className="stat-icon">📅</div><div className="stat-value" style={{ fontSize: 18 }}>{formatDate(stats?.last_work)}</div><div className="stat-label">Último corte</div></div>
          </div>

          <div className="section-title">Histórico</div>
          {haircuts.length === 0 ? (
            <div className="empty-state"><div className="icon">✂️</div><p>Sem histórico de cortes</p></div>
          ) : haircuts.map(cut => {
            const price = cut.custom_price != null ? cut.custom_price : calcPrice(cut, prices[cut.price_id]);
            const barber = barbers[cut.barber_id];
            const services = [cut.hair && "Cabelo", cut.beard && "Barba", cut.eyebrows && "Sobrancelha"].filter(Boolean);
            return (
              <div key={cut.id} className="history-item">
                <div className="history-date">{formatDate(cut.created_at)}</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  {services.map(s => <span key={s} className="tag tag-gold">{s}</span>)}
                </div>
                {(cut.image_before || cut.image_after) && (
                  <div className="history-images">
                    {cut.image_before && (
                      <div style={{ position: "relative" }}>
                        <img className="before-after-img" src={`${SUPABASE_URL}/storage/v1/object/public/${cut.image_before}`} alt="antes" onError={e => e.target.style.display = "none"} />
                        <span className="img-label">Antes</span>
                      </div>
                    )}
                    {cut.image_before && cut.image_after && <span style={{ color: "var(--muted)" }}>→</span>}
                    {cut.image_after && (
                      <img className="before-after-img" src={`${SUPABASE_URL}/storage/v1/object/public/${cut.image_after}`} alt="depois" onError={e => e.target.style.display = "none"} />
                    )}
                  </div>
                )}
                <div className="history-meta">
                  {barber && <><img className="barber-mini" src={barber.image} alt="" onError={e => e.target.style.display = "none"} /><span style={{ fontSize: 13, color: "var(--muted)" }}>{barber.name}</span></>}
                  <span className="history-price">{formatPrice(price)}</span>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

// ─── EDIT CLIENT ──────────────────────────────────────────────────────────────
function EditClientPage({ client, onBack, onSaved, showToast }) {
  const [form, setForm] = useState({
    name: client?.name || "",
    email: client?.email || "",
    phone_number: client?.phone_number || "",
    birthday: client?.birthday ? client.birthday.split("T")[0] : "",
  });
  const [loading, setLoading] = useState(false);
  const isNew = !client;

  const save = async () => {
    if (!form.name) return showToast("O nome é obrigatório", "error");
    setLoading(true);
    try {
      if (isNew) {
        const { error } = await supabase.from("clients").insert({ ...form, status: 1 });
        if (error) throw error;
        showToast("Cliente criado com sucesso!");
      } else {
        const { error } = await supabase.from("clients").update(form).eq("id", client.id);
        if (error) throw error;
        showToast("Guardado com sucesso!");
      }
      onSaved();
    } catch (e) {
      showToast(e.message || "Erro ao guardar", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← Voltar</button>
      <div className="page-header"><h2>{isNew ? "Novo Cliente" : "Editar Cliente"}</h2></div>
      <div className="form-group"><label>Nome</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" /></div>
      <div className="form-group"><label>Email</label><input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" /></div>
      <div className="form-group"><label>Telefone</label><input className="form-control" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} placeholder="+351 912 345 678" /></div>
      <div className="form-group"><label>Data de Nascimento</label><input className="form-control" type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} /></div>
      <button className="btn btn-primary btn-full" onClick={save} disabled={loading} style={{ marginTop: 8 }}>{loading ? "A guardar..." : "Guardar"}</button>
    </div>
  );
}

// ─── CRIAR PAGE ───────────────────────────────────────────────────────────────
function CriarPage({ showToast }) {
  const [services, setServices] = useState({ hair: false, beard: false, eyebrows: false });
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [useStd, setUseStd] = useState(true);
  const [customPrice, setCustomPrice] = useState("");
  const [stdPrices, setStdPrices] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("clients").select("id,name").order("name").then(({ data }) => setClients(data || []));
    supabase.from("prices").select("*").is("deleted_at", null).order("id").limit(1).single().then(({ data }) => setStdPrices(data));
  }, []);

  const calcStdPrice = () => {
    if (!stdPrices) return 0;
    if (services.hair && services.beard) return stdPrices.hairandbeard_price || 0;
    let t = 0;
    if (services.hair) t += stdPrices.hair_price || 0;
    if (services.beard) t += stdPrices.beard_price || 0;
    if (services.eyebrows) t += stdPrices.eyebrows_price || 0;
    return t;
  };

  const displayPrice = useStd ? calcStdPrice() : (parseFloat(customPrice) || 0);
  const formatPrice = v => `€${Number(v).toFixed(2).replace(".", ",")}`;

  const save = async () => {
    if (!clientId) return showToast("Seleciona o cliente", "error");
    if (!services.hair && !services.beard && !services.eyebrows) return showToast("Seleciona pelo menos um serviço", "error");
    if (!useStd && !customPrice) return showToast("Insere o preço manual", "error");
    setLoading(true);
    try {
      const { error } = await supabase.from("client_haircuts").insert({
        client_id: parseInt(clientId),
        hair: services.hair,
        beard: services.beard,
        eyebrows: services.eyebrows,
        price_id: useStd ? stdPrices?.id : null,
        custom_price: !useStd ? parseFloat(customPrice) : null,
      });
      if (error) throw error;
      showToast("Corte registado com sucesso! ✂");
      setServices({ hair: false, beard: false, eyebrows: false });
      setClientId(""); setCustomPrice("");
    } catch (e) {
      showToast(e.message || "Erro ao guardar", "error");
    } finally { setLoading(false); }
  };

  const svc = [
    { key: "hair", label: "✂ Cabelo" },
    { key: "beard", label: "🧔 Barba" },
    { key: "eyebrows", label: "👁 Sobrancelha" },
  ];

  return (
    <div className="page">
      <div className="page-header"><h2>Novo Corte</h2><p>Regista um novo serviço</p></div>
      <div className="section-title">Serviços</div>
      <div className="services-grid">
        {svc.map(s => (
          <div key={s.key} className={`service-check ${services[s.key] ? "checked" : ""}`} onClick={() => setServices({ ...services, [s.key]: !services[s.key] })}>
            <span className="service-check-label">{s.label}</span>
            <div className={`checkbox ${services[s.key] ? "checked" : ""}`}>{services[s.key] && "✓"}</div>
          </div>
        ))}
      </div>
      <div className="section-title" style={{ marginTop: 20 }}>Cliente</div>
      <div className="form-group">
        <select className="form-control" value={clientId} onChange={e => setClientId(e.target.value)}>
          <option value="">Selecione o cliente...</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="section-title" style={{ marginTop: 20 }}>Preço</div>
      <div className="price-display">{formatPrice(displayPrice)}</div>
      <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}>
        <div className={`checkbox ${useStd ? "checked" : ""}`} onClick={() => setUseStd(!useStd)}>{useStd && "✓"}</div>
        <span style={{ fontSize: 15 }}>Utilizar preço padrão</span>
      </label>
      {!useStd && (
        <div className="form-group">
          <label>Preço Manual (€)</label>
          <input className="form-control" type="number" step="0.01" value={customPrice} onChange={e => setCustomPrice(e.target.value)} placeholder="0.00" />
        </div>
      )}
      <button className="btn btn-primary btn-full" onClick={save} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "A guardar..." : "✂ Guardar Corte"}
      </button>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("client_haircuts").select("*", { count: "exact", head: true }),
      supabase.from("clients").select("*", { count: "exact", head: true }),
      supabase.from("client_haircuts").select("custom_price, price_id, hair, beard, eyebrows"),
      supabase.from("prices").select("*"),
    ]).then(([haircutsCount, clientsCount, haircutsData, pricesData]) => {
      const pm = {}; (pricesData.data || []).forEach(p => pm[p.id] = p);
      let total = 0;
      (haircutsData.data || []).forEach(cut => {
        if (cut.custom_price != null) { total += cut.custom_price; return; }
        const p = pm[cut.price_id];
        if (!p) return;
        if (cut.hair && cut.beard) { total += p.hairandbeard_price || 0; return; }
        if (cut.hair) total += p.hair_price || 0;
        if (cut.beard) total += p.beard_price || 0;
        if (cut.eyebrows) total += p.eyebrows_price || 0;
      });
      setStats({ totalCuts: haircutsCount.count || 0, totalClients: clientsCount.count || 0, totalRevenue: total });
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="page"><div className="loading">A carregar...</div></div>;

  return (
    <div className="page">
      <div className="page-header"><h2>Dashboard</h2><p>Resumo da tua barbearia</p></div>
      <div className="stats-row" style={{ marginBottom: 32 }}>
        <div className="stat-box"><div className="stat-icon">✂️</div><div className="stat-value">{stats.totalCuts}</div><div className="stat-label">Total de cortes</div></div>
        <div className="stat-box"><div className="stat-icon">👥</div><div className="stat-value">{stats.totalClients}</div><div className="stat-label">Total de clientes</div></div>
        <div className="stat-box"><div className="stat-icon">€</div><div className="stat-value">{`${stats.totalRevenue.toFixed(0)}€`}</div><div className="stat-label">Receita total</div></div>
      </div>
      <div className="empty-state" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 40 }}>
        <div className="icon">📊</div>
        <p style={{ marginTop: 8 }}>Mais gráficos e análises em breve</p>
      </div>
    </div>
  );
}

// ─── CONFIG PAGE ──────────────────────────────────────────────────────────────
function ConfigPage({ user, barber, onBarberUpdate, showToast }) {
  const [form, setForm] = useState({ name: barber?.name || "", user_email: barber?.user_email || "", phone_number: barber?.phone_number || "" });
  const [priceForm, setPriceForm] = useState({ hair_price: "", beard_price: "", eyebrows_price: "", hairandbeard_price: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("prices").select("*").is("deleted_at", null).order("id").limit(1).single()
      .then(({ data }) => { if (data) setPriceForm({ hair_price: data.hair_price || "", beard_price: data.beard_price || "", eyebrows_price: data.eyebrows_price || "", hairandbeard_price: data.hairandbeard_price || "" }); });
  }, []);

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("barbers").update(form).eq("user_id", user.id);
      if (error) throw error;
      onBarberUpdate({ ...barber, ...form });
      showToast("Perfil guardado!");
    } catch (e) { showToast(e.message || "Erro", "error"); }
    finally { setLoading(false); }
  };

  const savePrices = async () => {
    setLoading(true);
    try {
      const { data: existing } = await supabase.from("prices").select("id").is("deleted_at", null).limit(1).single();
      const payload = { hair_price: parseFloat(priceForm.hair_price) || 0, beard_price: parseFloat(priceForm.beard_price) || 0, eyebrows_price: parseFloat(priceForm.eyebrows_price) || 0, hairandbeard_price: parseFloat(priceForm.hairandbeard_price) || 0 };
      if (existing) { await supabase.from("prices").update(payload).eq("id", existing.id); }
      else { await supabase.from("prices").insert(payload); }
      showToast("Preços guardados!");
    } catch (e) { showToast(e.message || "Erro", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-header"><h2>Configurações</h2></div>
      <div className="avatar-upload" style={{ width: 100, height: 100 }}>
        <img src={barber?.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(barber?.name || "B") + "&background=2a2a2a&color=d4a843"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div className="section-title">Perfil</div>
      <div className="form-group"><label>Nome</label><input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
      <div className="form-group"><label>Email</label><input className="form-control" value={form.user_email} onChange={e => setForm({ ...form, user_email: e.target.value })} /></div>
      <div className="form-group"><label>Telefone</label><input className="form-control" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} /></div>
      <button className="btn btn-primary btn-full" onClick={saveProfile} disabled={loading} style={{ marginBottom: 32 }}>Guardar perfil</button>

      <div className="section-title">Preços Padrão (€)</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="form-group"><label>✂ Cabelo</label><input className="form-control" type="number" step="0.5" value={priceForm.hair_price} onChange={e => setPriceForm({ ...priceForm, hair_price: e.target.value })} /></div>
        <div className="form-group"><label>🧔 Barba</label><input className="form-control" type="number" step="0.5" value={priceForm.beard_price} onChange={e => setPriceForm({ ...priceForm, beard_price: e.target.value })} /></div>
        <div className="form-group"><label>👁 Sobrancelha</label><input className="form-control" type="number" step="0.5" value={priceForm.eyebrows_price} onChange={e => setPriceForm({ ...priceForm, eyebrows_price: e.target.value })} /></div>
        <div className="form-group"><label>✂+🧔 Cabelo+Barba</label><input className="form-control" type="number" step="0.5" value={priceForm.hairandbeard_price} onChange={e => setPriceForm({ ...priceForm, hairandbeard_price: e.target.value })} /></div>
      </div>
      <button className="btn btn-primary btn-full" onClick={savePrices} disabled={loading}>Guardar preços</button>

      <div style={{ marginTop: 40, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>Versão da APP</div>
        <div style={{ color: "var(--muted)", fontSize: 12, marginTop: 4 }}>v1.0.0 · Web Edition</div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ page, onNavigate, onLogout }) {
  const navItems = [
    { page: "home", icon: "🏠", label: "Início" },
    { page: "criar", icon: "✂️", label: "Novo Corte" },
    { page: "clientes", icon: "👥", label: "Clientes" },
    { page: "dashboard", icon: "📊", label: "Dashboard" },
    { page: "config", icon: "⚙️", label: "Config" },
  ];
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">B</div>
      <div className="sidebar-nav">
        {navItems.map(n => (
          <button key={n.page} className={`nav-btn ${page === n.page ? "active" : ""}`} title={n.label} onClick={() => onNavigate(n.page)}>{n.icon}</button>
        ))}
      </div>
      <div className="sidebar-bottom">
        <button className="logout-btn" title="Sair" onClick={onLogout}>🚪</button>
      </div>
    </nav>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [barber, setBarber] = useState(null);
  const [page, setPage] = useState("home");
  const [pageData, setPageData] = useState(null);
  const [toast, setToast] = useState(null);
  const [checking, setChecking] = useState(true);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        supabase.from("barbers").select("*").eq("user_id", session.user.id).single()
          .then(({ data }) => setBarber(data));
      }
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const navigate = (p, data = null) => { setPage(p); setPageData(data); };
  const logout = async () => { await supabase.auth.signOut(); setUser(null); setBarber(null); setPage("home"); };

  if (checking) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f0f", color: "#888" }}>A carregar...</div>;
  if (!user) return <><style>{style}</style><AuthPage onLogin={u => { setUser(u); supabase.from("barbers").select("*").eq("user_id", u.id).single().then(({ data }) => setBarber(data)); }} /></>;

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage barber={barber} onNavigate={navigate} />;
      case "criar": return <CriarPage showToast={showToast} />;
      case "clientes": return <ClientesPage onNavigate={navigate} />;
      case "client-info": return <ClientInfoPage client={pageData} onNavigate={navigate} onBack={() => navigate("clientes")} />;
      case "edit-client": return <EditClientPage client={pageData} onBack={() => pageData ? navigate("client-info", pageData) : navigate("clientes")} onSaved={() => navigate("clientes")} showToast={showToast} />;
      case "dashboard": return <DashboardPage />;
      case "config": return <ConfigPage user={user} barber={barber} onBarberUpdate={setBarber} showToast={showToast} />;
      default: return <HomePage barber={barber} onNavigate={navigate} />;
    }
  };

  const mainPage = ["home", "criar", "clientes", "dashboard", "config"].includes(page) ? page : page === "client-info" || page === "edit-client" ? "clientes" : "home";

  return (
    <>
      <style>{style}</style>
      <div className="app">
        <Sidebar page={mainPage} onNavigate={navigate} onLogout={logout} />
        <div className="main">{renderPage()}</div>
      </div>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  );
}
