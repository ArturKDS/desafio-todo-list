import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RotaProtegida from "./components/RotaProtegida";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route
          path="/tarefas"
          element={
            <RotaProtegida>
              <TasksPage />
            </RotaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/tarefas" replace />} />
      </Routes>
    </AuthProvider>
  );
}
