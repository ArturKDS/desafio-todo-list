import { apiFetch } from "./client";

export function cadastrarUsuario(email, senha) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: { email, senha },
    autenticado: false,
  });
}

export function fazerLogin(email, senha) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: { email, senha },
    autenticado: false,
  });
}
