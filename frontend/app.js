const loginScreen = document.getElementById("login-screen");
const registerScreen = document.getElementById("register-screen");
const tasksScreen = document.getElementById("tasks-screen");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const taskForm = document.getElementById("task-form");

const loginError = document.getElementById("login-error");
const registerError = document.getElementById("register-error");
const registerSuccess = document.getElementById("register-success");
const tasksError = document.getElementById("tasks-error");

const taskList = document.getElementById("task-list");
const emptyMsg = document.getElementById("empty-msg");
const taskItemTemplate = document.getElementById("task-item-template");
const userEmailLabel = document.getElementById("user-email");

function mostrarTela(tela) {
  [loginScreen, registerScreen, tasksScreen].forEach((t) => t.classList.add("hidden"));
  tela.classList.remove("hidden");
}

function limparMensagens() {
  loginError.textContent = "";
  registerError.textContent = "";
  registerSuccess.textContent = "";
  tasksError.textContent = "";
}

document.getElementById("go-to-register").addEventListener("click", (e) => {
  e.preventDefault();
  limparMensagens();
  mostrarTela(registerScreen);
});

document.getElementById("go-to-login").addEventListener("click", (e) => {
  e.preventDefault();
  limparMensagens();
  mostrarTela(loginScreen);
});

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  limparMensagens();

  const email = document.getElementById("register-email").value.trim();
  const senha = document.getElementById("register-password").value;

  try {
    await cadastrarUsuario(email, senha);
    registerSuccess.textContent = "Conta criada! Faça login para continuar.";
    registerForm.reset();
    setTimeout(() => {
      limparMensagens();
      mostrarTela(loginScreen);
    }, 1200);
  } catch (err) {
    registerError.textContent = err.message;
  }
});

// ===== Login =====
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  limparMensagens();

  const email = document.getElementById("login-email").value.trim();
  const senha = document.getElementById("login-password").value;

  try {
    const resultado = await fazerLogin(email, senha);
    salvarToken(resultado.access_token);
    localStorage.setItem("userEmail", email);
    loginForm.reset();
    await entrarNoApp();
  } catch (err) {
    loginError.textContent = err.message;
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  limparToken();
  mostrarTela(loginScreen);
});

async function entrarNoApp() {
  userEmailLabel.textContent = localStorage.getItem("userEmail") || "";
  mostrarTela(tasksScreen);
  await carregarTarefas();
}

async function carregarTarefas() {
  tasksError.textContent = "";
  try {
    const tarefas = await listarTarefas();
    renderizarTarefas(tarefas);
  } catch (err) {
    limparToken();
    mostrarTela(loginScreen);
    loginError.textContent = "Sessão expirada. Faça login novamente.";
  }
}

function renderizarTarefas(tarefas) {
  taskList.innerHTML = "";
  emptyMsg.classList.toggle("hidden", tarefas.length > 0);

  tarefas.forEach((tarefa) => {
    const node = taskItemTemplate.content.cloneNode(true);
    const li = node.querySelector(".task-item");
    const checkbox = node.querySelector(".task-check");
    const tituloEl = node.querySelector(".task-titulo");
    const descricaoEl = node.querySelector(".task-descricao");
    const dateEl = node.querySelector(".task-date");
    const editBtn = node.querySelector(".edit-btn");
    const deleteBtn = node.querySelector(".delete-btn");

    li.dataset.id = tarefa.id;
    tituloEl.textContent = tarefa.titulo;
    descricaoEl.textContent = tarefa.descricao || "";
    descricaoEl.classList.toggle("hidden", !tarefa.descricao);

    const data = new Date(tarefa.data_criacao);
    dateEl.textContent = data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const estaConcluida = tarefa.status === "concluida";
    checkbox.checked = estaConcluida;
    li.classList.toggle("concluida", estaConcluida);

    // marcar/desmarcar como concluída
    checkbox.addEventListener("change", async () => {
      try {
        const novoStatus = checkbox.checked ? "concluida" : "pendente";
        await atualizarTarefa(tarefa.id, { status: novoStatus });
        li.classList.toggle("concluida", checkbox.checked);
      } catch (err) {
        tasksError.textContent = err.message;
        checkbox.checked = !checkbox.checked; 
      }
    });

    editBtn.addEventListener("click", async () => {
      const novoTitulo = prompt("Editar título:", tarefa.titulo);
      if (novoTitulo === null || novoTitulo.trim() === "") return;
      try {
        await atualizarTarefa(tarefa.id, { titulo: novoTitulo.trim() });
        await carregarTarefas();
      } catch (err) {
        tasksError.textContent = err.message;
      }
    });

    deleteBtn.addEventListener("click", async () => {
      if (!confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) return;
      try {
        await deletarTarefa(tarefa.id);
        await carregarTarefas();
      } catch (err) {
        tasksError.textContent = err.message;
      }
    });

    taskList.appendChild(node);
  });
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  tasksError.textContent = "";

  const tituloInput = document.getElementById("task-titulo");
  const descricaoInput = document.getElementById("task-descricao");

  const titulo = tituloInput.value.trim();
  const descricao = descricaoInput.value.trim();

  if (!titulo) return;

  try {
    await criarTarefa(titulo, descricao || null);
    tituloInput.value = "";
    descricaoInput.value = "";
    await carregarTarefas();
  } catch (err) {
    tasksError.textContent = err.message;
  }
});

(async function iniciar() {
  if (getToken()) {
    await entrarNoApp();
  } else {
    mostrarTela(loginScreen);
  }
})();
