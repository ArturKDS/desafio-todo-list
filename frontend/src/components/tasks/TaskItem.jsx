import "./TaskItem.css";

function formatarData(isoString) {
  return new Date(isoString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TaskItem({ tarefa, onToggleStatus, onEditar, onExcluir }) {
  const estaConcluida = tarefa.status === "concluida";

  function handleToggle(e) {
    onToggleStatus(tarefa, e.target.checked);
  }

  function handleEditar() {
    const novoTitulo = prompt("Editar título:", tarefa.titulo);
    if (novoTitulo === null || novoTitulo.trim() === "") return;
    onEditar(tarefa, novoTitulo.trim());
  }

  function handleExcluir() {
    if (!confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) return;
    onExcluir(tarefa);
  }

  return (
    <li className={`task-item${estaConcluida ? " concluida" : ""}`}>
      <div className="task-main">
        <input
          type="checkbox"
          className="task-check"
          checked={estaConcluida}
          onChange={handleToggle}
        />
        <div className="task-text">
          <span className="task-titulo">{tarefa.titulo}</span>
          {tarefa.descricao && <span className="task-descricao">{tarefa.descricao}</span>}
          <span className="task-date">{formatarData(tarefa.data_criacao)}</span>
        </div>
      </div>
      <div className="task-actions">
        <button className="edit-btn" onClick={handleEditar}>
          Editar
        </button>
        <button className="delete-btn" onClick={handleExcluir}>
          Excluir
        </button>
      </div>
    </li>
  );
}
