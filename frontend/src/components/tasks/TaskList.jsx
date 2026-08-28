import TaskItem from "./TaskItem";
import "./TaskList.css";

export default function TaskList({ tarefas, onToggleStatus, onEditar, onExcluir }) {
  if (tarefas.length === 0) {
    return <p className="empty">Nenhuma tarefa ainda. Adicione a primeira acima!</p>;
  }

  return (
    <ul className="task-list">
      {tarefas.map((tarefa) => (
        <TaskItem
          key={tarefa.id}
          tarefa={tarefa}
          onToggleStatus={onToggleStatus}
          onEditar={onEditar}
          onExcluir={onExcluir}
        />
      ))}
    </ul>
  );
}
