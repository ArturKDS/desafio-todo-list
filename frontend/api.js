function getToken() {
  return localStorage.getItem("token");
}

function salvarToken(token) {
  localStorage.setItem("token", token);
}

function limparToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
}

async function cadastrarUsuario(email, senha) {
  const resposta = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.detail || "Erro ao cadastrar");
  }
  return dados;
}

async function fazerLogin(email, senha) {
  const resposta = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.detail || "E-mail ou senha incorretos");
  }
  return dados; 
}

async function listarTarefas() {
  const resposta = await fetch(`${API_BASE_URL}/tasks/`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.detail || "Erro ao buscar tarefas");
  }
  return dados;
}

async function criarTarefa(titulo, descricao) {
  const resposta = await fetch(`${API_BASE_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ titulo, descricao }),
  });

  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.detail || "Erro ao criar tarefa");
  }
  return dados;
}

async function atualizarTarefa(id, mudancas) {
  const resposta = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(mudancas),
  });

  const dados = await resposta.json();
  if (!resposta.ok) {
    throw new Error(dados.detail || "Erro ao atualizar tarefa");
  }
  return dados;
}

async function deletarTarefa(id) {
  const resposta = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (!resposta.ok) {
    throw new Error("Erro ao apagar tarefa");
  }
}
