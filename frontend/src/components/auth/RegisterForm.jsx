import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cadastrarUsuario } from "../../api/auth";
import AuthCard from "./AuthCard";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");
    try {
      await cadastrarUsuario(email.trim(), senha);
      setSucesso("Conta criada! Faça login para continuar.");
      setEmail("");
      setSenha("");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <AuthCard title="Criar conta">
      <form onSubmit={handleSubmit}>
        <label htmlFor="register-email">E-mail</label>
        <input
          type="email"
          id="register-email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="register-password">Senha</label>
        <input
          type="password"
          id="register-password"
          required
          minLength={6}
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit">Cadastrar</button>
      </form>
      <p className="error">{erro}</p>
      <p className="success">{sucesso}</p>
      <p className="switch">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </AuthCard>
  );
}
