import { useState } from "react";
import "./TaskForm.css";

export default function TaskForm({ onCriar }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const tituloLimpo = titulo.trim();
    if (!tituloLimpo) return;

    await onCriar(tituloLimpo, descricao.trim() || null);
    setTitulo("");
    setDescricao("");
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título da tarefa"
        required
        maxLength={120}
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descrição (opcional)"
        maxLength={500}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <button type="submit">Adicionar</button>
    </form>
  );
}
