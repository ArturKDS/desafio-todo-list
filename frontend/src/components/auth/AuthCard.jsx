import "./AuthCard.css";

export default function AuthCard({ title, children }) {
  return (
    <section className="auth-screen">
      <div className="card">
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}
