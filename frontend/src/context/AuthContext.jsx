import { createContext, useContext, useState, useCallback } from "react";
import { fazerLogin as apiFazerLogin } from "../api/auth";
import { getToken, getEmailSalvo, salvarSessao, limparSessao } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [email, setEmail] = useState(() => (getToken() ? getEmailSalvo() : ""));
  const estaLogado = Boolean(getToken());

  const login = useCallback(async (emailDigitado, senha) => {
    const resultado = await apiFazerLogin(emailDigitado, senha);
    salvarSessao(resultado.access_token, emailDigitado);
    setEmail(emailDigitado);
  }, []);

  const logout = useCallback(() => {
    limparSessao();
    setEmail("");
  }, []);

  /** Chamado quando uma chamada autenticada volta 401: derruba a sessão local. */
  const sessaoExpirou = useCallback(() => {
    limparSessao();
    setEmail("");
  }, []);

  return (
    <AuthContext.Provider value={{ email, estaLogado, login, logout, sessaoExpirou }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  return ctx;
}
