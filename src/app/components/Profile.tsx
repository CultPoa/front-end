import { useState, useCallback } from "react";
import {
  User,
  Award,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  Camera,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  X,
  ImageIcon,
  ChevronRight,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { API_BASE_URL } from "../services/api";

function patchMe(token, body) {
  return fetch(`${API_BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

function InputField({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  rightSlot,
  ...props
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] transition-all"
        {...props}
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

function SubmitButton({ loading, label, loadingLabel }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-[#E63946] to-[#F4A261] text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {loading ? loadingLabel : label}
    </button>
  );
}

function Toast({ message, type }) {
  const isSuccess = type === "success";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium whitespace-nowrap ${
        isSuccess ? "bg-[#2A9D8F] text-white" : "bg-red-500 text-white"
      }`}
    >
      {isSuccess ? (
        <Check className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {message}
    </motion.div>
  );
}

function useAuth() {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("cultpoa_token"),
  );
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("cultpoa_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loadingUser, setLoadingUser] = useState(false);

  const fetchMe = async (accessToken) => {
    setLoadingUser(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      sessionStorage.setItem("cultpoa_user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch {
      sessionStorage.removeItem("cultpoa_token");
      sessionStorage.removeItem("cultpoa_user");
      setToken(null);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const login = async (newToken) => {
    sessionStorage.setItem("cultpoa_token", newToken);
    setToken(newToken);
    await fetchMe(newToken);
  };

  const logout = () => {
    sessionStorage.removeItem("cultpoa_token");
    sessionStorage.removeItem("cultpoa_user");
    localStorage.removeItem("auth");
    setToken(null);
    setUser(null);
  };

  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      sessionStorage.setItem("cultpoa_user", JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    token,
    user,
    isAuthenticated: !!token,
    loadingUser,
    login,
    logout,
    updateUser,
  };
}

function SettingsPage({ user, token, onBack, onUserUpdate }) {
  const [section, setSection] = useState(null); // null | "name" | "email" | "password" | "avatar"

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // name
  const [name, setName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);

  // email
  const [email, setEmail] = useState(user?.email || "");
  const [emailLoading, setEmailLoading] = useState(false);

  // password
  const [passwords, setPasswords] = useState({ next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ next: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  // avatar
  const [avatarUrl, setAvatarUrl] = useState(user?.image_url || "");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarPreviewOk, setAvatarPreviewOk] = useState(!!user?.image_url);

  const handleNameSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setNameLoading(true);
    try {
      const res = await patchMe(token, { name: name.trim() });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Erro ao atualizar nome.");
      }
      onUserUpdate({ name: name.trim() });
      showToast("Nome atualizado com sucesso!");
      setSection(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setNameLoading(false);
    }
  };

  const handleEmailSave = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    try {
      const res = await patchMe(token, { email });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Erro ao atualizar email.");
      }
      onUserUpdate({ email });
      showToast("Email atualizado com sucesso!");
      setSection(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwError("");
    if (passwords.next !== passwords.confirm) {
      setPwError("As senhas não coincidem.");
      return;
    }
    if (passwords.next.length < 6) {
      setPwError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setPwLoading(true);
    try {
      const res = await patchMe(token, { password: passwords.next });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Erro ao atualizar senha.");
      }
      setPasswords({ next: "", confirm: "" });
      showToast("Senha atualizada com sucesso!");
      setSection(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setPwLoading(false);
    }
  };

  const handleAvatarSave = async (e) => {
    e.preventDefault();
    setAvatarLoading(true);
    try {
      const res = await patchMe(token, { image_url: avatarUrl || null });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || "Erro ao atualizar foto.");
      }
      onUserUpdate({ image_url: avatarUrl || null });
      showToast("Foto de perfil atualizada!");
      setSection(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setAvatarLoading(false);
    }
  };

  const menuItems = [
    {
      id: "avatar",
      icon: Camera,
      color: "#2A9D8F",
      bg: "#2A9D8F1A",
      label: "Foto de perfil",
      sub: "Alterar imagem de perfil",
    },
    {
      id: "name",
      icon: Pencil,
      color: "#6C63FF",
      bg: "#6C63FF1A",
      label: "Nome de usuário",
      sub: user?.name,
    },
    {
      id: "email",
      icon: Mail,
      color: "#E63946",
      bg: "#E639461A",
      label: "Endereço de email",
      sub: user?.email,
    },
    {
      id: "password",
      icon: Lock,
      color: "#F4A261",
      bg: "#F4A2611A",
      label: "Senha",
      sub: "Alterar senha de acesso",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* header */}
      <div className="bg-gradient-to-br from-[#E63946] to-[#F4A261] pt-12 pb-8 px-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-white text-lg font-semibold">Configurações</h1>
        </div>
      </div>

      <div className="px-4 -mt-2">
        <AnimatePresence mode="wait">
          {!section ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden mt-4"
            >
              {menuItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                      i < menuItems.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: item.bg }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: item.color }}
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-800">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">
                          {item.sub}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                );
              })}
            </motion.div>
          ) : section === "name" ? (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              className="mt-4"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <button
                    onClick={() => setSection(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Alterar nome
                  </h2>
                </div>
                <form onSubmit={handleNameSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Novo nome
                    </label>
                    <InputField
                      icon={Pencil}
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                    />
                  </div>
                  <SubmitButton
                    loading={nameLoading}
                    label="Salvar nome"
                    loadingLabel="Salvando..."
                  />
                </form>
              </div>
            </motion.div>
          ) : section === "email" ? (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              className="mt-4"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <button
                    onClick={() => setSection(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Alterar email
                  </h2>
                </div>
                <form onSubmit={handleEmailSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Novo email
                    </label>
                    <InputField
                      icon={Mail}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="novo@email.com"
                    />
                  </div>
                  <SubmitButton
                    loading={emailLoading}
                    label="Salvar email"
                    loadingLabel="Salvando..."
                  />
                </form>
              </div>
            </motion.div>
          ) : section === "password" ? (
            <motion.div
              key="password"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              className="mt-4"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <button
                    onClick={() => setSection(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Alterar senha
                  </h2>
                </div>
                <form onSubmit={handlePasswordSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Nova senha
                    </label>
                    <InputField
                      icon={Lock}
                      type={showPw.next ? "text" : "password"}
                      required
                      value={passwords.next}
                      onChange={(e) =>
                        setPasswords({ ...passwords, next: e.target.value })
                      }
                      placeholder="••••••••"
                      rightSlot={
                        <button
                          type="button"
                          onClick={() =>
                            setShowPw((s) => ({ ...s, next: !s.next }))
                          }
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPw.next ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Confirmar senha
                    </label>
                    <InputField
                      icon={Lock}
                      type={showPw.confirm ? "text" : "password"}
                      required
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                      placeholder="••••••••"
                      rightSlot={
                        <button
                          type="button"
                          onClick={() =>
                            setShowPw((s) => ({ ...s, confirm: !s.confirm }))
                          }
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPw.confirm ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      }
                    />
                  </div>
                  {/* password match indicator */}
                  {passwords.next && passwords.confirm && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg ${
                        passwords.next === passwords.confirm
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {passwords.next === passwords.confirm ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Senhas coincidem
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" /> Senhas não coincidem
                        </>
                      )}
                    </motion.div>
                  )}
                  {pwError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {pwError}
                    </motion.p>
                  )}
                  <SubmitButton
                    loading={pwLoading}
                    label="Salvar senha"
                    loadingLabel="Salvando..."
                  />
                </form>
              </div>
            </motion.div>
          ) : section === "avatar" ? (
            <motion.div
              key="avatar"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              className="mt-4"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <button
                    onClick={() => setSection(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h2 className="text-sm font-semibold text-gray-800">
                    Foto de perfil
                  </h2>
                </div>
                <form onSubmit={handleAvatarSave} className="space-y-4">
                  {/* live preview */}
                  <div className="flex justify-center py-2">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-[#E63946]/20">
                      {avatarUrl && avatarPreviewOk ? (
                        <img
                          src={avatarUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={() => setAvatarPreviewOk(false)}
                          onLoad={() => setAvatarPreviewOk(true)}
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-300" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      URL da imagem
                    </label>
                    <InputField
                      icon={ImageIcon}
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => {
                        setAvatarUrl(e.target.value);
                        setAvatarPreviewOk(false);
                      }}
                      placeholder="https://exemplo.com/foto.jpg"
                    />
                    {avatarUrl && !avatarPreviewOk && (
                      <p className="text-xs text-amber-500 mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> URL inválida ou
                        imagem não carregou
                      </p>
                    )}
                    {/* preload img tag to trigger onLoad/onError for preview */}
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        className="hidden"
                        onLoad={() => setAvatarPreviewOk(true)}
                        onError={() => setAvatarPreviewOk(false)}
                        alt=""
                      />
                    )}
                  </div>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarUrl("");
                        setAvatarPreviewOk(false);
                      }}
                      className="w-full py-2.5 border border-gray-200 text-gray-500 text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Remover foto
                    </button>
                  )}
                  <SubmitButton
                    loading={avatarLoading}
                    label="Salvar foto"
                    loadingLabel="Salvando..."
                  />
                </form>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <Toast key="toast" message={toast.message} type={toast.type} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── AuthPage ────────────────────────────────────────────────────────────────

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = new URLSearchParams({
        grant_type: "password",
        username: loginData.email,
        password: loginData.password,
        scope: "",
        client_id: "string",
        client_secret: "",
      });
      const res = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error("Email ou senha incorretos.");
      }
      const data = await res.json();
      localStorage.setItem("auth", data.access_token);
      await onLogin(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Erro ao criar conta. Tente novamente.");
      }
      const loginBody = new URLSearchParams({
        grant_type: "password",
        username: registerData.email,
        password: registerData.password,
        scope: "",
        client_id: "string",
        client_secret: "",
      });
      const loginRes = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: loginBody.toString(),
      });
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        await onLogin(loginData.access_token);
        localStorage.setItem("auth", loginData.access_token);
      } else {
        setMode("login");
        setError("Conta criada! Faça login para continuar.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <div className="bg-gradient-to-br from-[#E63946] to-[#F4A261] pt-16 pb-32 px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          {/* <h1 className="text-white text-2xl font-bold tracking-tight"> */}
          <h1 className='font-["Dongle"] text-white font-bold text-5xl'>
            Cultpoa
          </h1>
          <p className="text-white/75 text-basez mt-1">
            Cultura em cada esquina
          </p>
        </motion.div>
      </div>

      <div className="-mt-20 px-4 flex-1">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex border-b border-gray-100">
            {[
              { id: "login", label: "Entrar" },
              { id: "register", label: "Criar conta" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setMode(tab.id);
                  setError("");
                }}
                className={`flex-1 py-4 text-sm font-medium transition-colors ${
                  mode === tab.id
                    ? "text-[#E63946] border-b-2 border-[#E63946]"
                    : "text-gray-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Email
                    </label>
                    <InputField
                      icon={Mail}
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Senha
                    </label>
                    <InputField
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      }
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg"
                    >
                      {error}
                    </motion.p>
                  )}
                  <SubmitButton
                    loading={loading}
                    label="Entrar"
                    loadingLabel="Entrando..."
                  />
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Nome completo
                    </label>
                    <InputField
                      icon={User}
                      required
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Email
                    </label>
                    <InputField
                      icon={Mail}
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Senha
                    </label>
                    <InputField
                      icon={Lock}
                      type={showPassword ? "text" : "password"}
                      required
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      rightSlot={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      }
                    />
                  </div>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg"
                    >
                      {error}
                    </motion.p>
                  )}
                  <SubmitButton
                    loading={loading}
                    label="Criar conta"
                    loadingLabel="Criando conta..."
                  />
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        <p className="text-center text-xs text-gray-400 mt-6">
          Cultpoa 1.0.0 • Feito com ❤️ em Porto Alegre
        </p>
      </div>
    </div>
  );
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export function Profile() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    token,
    user,
    loadingUser,
    login,
    logout,
    updateUser,
  } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  if (!isAuthenticated) return <AuthPage onLogin={login} />;

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#E63946]/20 border-t-[#E63946] rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return (
      <SettingsPage
        user={user}
        token={token}
        onBack={() => setShowSettings(false)}
        onUserUpdate={updateUser}
      />
    );
  }

  const isAdmin = user?.is_superuser ?? false;
  const displayName = user?.name || "Explorador Cultural";
  const avatarUrl = user?.image_url;

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-24">
      <div className="bg-gradient-to-br from-[#E63946] to-[#F4A261] pt-12 pb-24 px-4">
        <div className="flex justify-end mb-8"></div>

        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full items-center justify-center"
                style={{ display: avatarUrl ? "none" : "flex" }}
              >
                <User className="w-12 h-12 text-[#E63946]" />
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#2A9D8F] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#238276] transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-white mb-1">{displayName}</h2>
          <p className="text-white/80 text-sm">{user?.email}</p>

          {isAdmin && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => navigate("/admin")}
              className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              Painel Administrativo
            </motion.button>
          )}
        </div>
      </div>

      <div className="-mt-16 px-4">
        <div className="space-y-3">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F4A261]/10 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-[#F4A261]" />
              </div>
              <span className="text-gray-700">Configurações</span>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button
            onClick={logout}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-gray-700">Sair</span>
            </div>
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-xs text-gray-500">
            Cultpoa 1.0.0 • Feito com ❤️ em Porto Alegre
          </p>
        </div>
      </div>
    </div>
  );
}
