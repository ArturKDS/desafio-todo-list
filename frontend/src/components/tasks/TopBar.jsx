import "./TopBar.css";

export default function TopBar({ email, onLogout }) {
  return (
    <header className="topbar">
      <h1>Minhas Tarefas</h1>
      <div className="topbar-right">
        <span>{email}</span>
        <button className="secondary" onClick={onLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}
