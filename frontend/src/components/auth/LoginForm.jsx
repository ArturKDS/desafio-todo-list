import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthCard from "./AuthCard";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const location = useLocation();
  const [erro, setErro] = useState(location.state?.erro || "");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    try {
      await login(email.trim(), senha);
      navigate("/tarefas");
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <AuthCard title="Entrar">
      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">E-mail</label>
        <input
          type="email"
          id="login-email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="login-password">Senha</label>
        <input
          type="password"
          id="login-password"
          required
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
      <p className="error">{erro}</p>
      <p className="switch">
        Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </AuthCard>
  );
}
