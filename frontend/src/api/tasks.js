import { apiFetch } from "./client";

export function listarTarefas() {
  return apiFetch("/tasks/");
}

export function criarTarefa(titulo, descricao) {
  return apiFetch("/tasks/", {
    method: "POST",
    body: { titulo, descricao },
  });
}

export function atualizarTarefa(id, mudancas) {
  return apiFetch(`/tasks/${id}`, {
    method: "PUT",
    body: mudancas,
  });
}

export function deletarTarefa(id) {
  return apiFetch(`/tasks/${id}`, { method: "DELETE" });
}
