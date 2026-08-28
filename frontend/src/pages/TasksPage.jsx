import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listarTarefas, criarTarefa, atualizarTarefa, deletarTarefa } from "../api/tasks";
import TopBar from "../components/tasks/TopBar";
import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import "./TasksPage.css";

export default function TasksPage() {
  const [tarefas, setTarefas] = useState([]);
  const [erro, setErro] = useState("");
  const { email, logout, sessaoExpirou } = useAuth();
  const navigate = useNavigate();

  const carregarTarefas = useCallback(async () => {
    setErro("");
    try {
      const dados = await listarTarefas();
      setTarefas(dados);
    } catch (err) {
      sessaoExpirou();
      navigate("/login", { state: { erro: "Sessão expirada. Faça login novamente." } });
    }
  }, [navigate, sessaoExpirou]);

  useEffect(() => {
    carregarTarefas();
  }, [carregarTarefas]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function handleCriar(titulo, descricao) {
    try {
      await criarTarefa(titulo, descricao);
      await carregarTarefas();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleToggleStatus(tarefa, marcado) {
    const anterior = tarefas;
    const novoStatus = marcado ? "concluida" : "pendente";
    // atualização otimista, igual ao comportamento original
    setTarefas((atuais) =>
      atuais.map((t) => (t.id === tarefa.id ? { ...t, status: novoStatus } : t))
    );
    try {
      await atualizarTarefa(tarefa.id, { status: novoStatus });
    } catch (err) {
      setErro(err.message);
      setTarefas(anterior);
    }
  }

  async function handleEditar(tarefa, novoTitulo) {
    try {
      await atualizarTarefa(tarefa.id, { titulo: novoTitulo });
      await carregarTarefas();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function handleExcluir(tarefa) {
    try {
      await deletarTarefa(tarefa.id);
      await carregarTarefas();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <>
      <TopBar email={email} onLogout={handleLogout} />
      <main className="container">
        <TaskForm onCriar={handleCriar} />
        <p className="error">{erro}</p>
        <TaskList
          tarefas={tarefas}
          onToggleStatus={handleToggleStatus}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      </main>
    </>
  );
}
