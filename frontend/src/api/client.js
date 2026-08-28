export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export function getToken() {
  return localStorage.getItem("token");
}

export function salvarSessao(token, email) {
  localStorage.setItem("token", token);
  localStorage.setItem("userEmail", email);
}

export function limparSessao() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
}

export function getEmailSalvo() {
  return localStorage.getItem("userEmail") || "";
}

/**
 * Wrapper em cima do fetch: monta a URL, injeta o token (quando existir)
 * e converte respostas de erro no formato {detail: "..."} da API em
 * uma exceção com mensagem amigável.
 */
export async function apiFetch(path, { method = "GET", body, autenticado = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (autenticado) headers["Authorization"] = `Bearer ${getToken()}`;

  const resposta = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new Error(dados?.detail || "Ocorreu um erro inesperado");
  }

  return dados;
}
