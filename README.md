## Rodar o Backend

```bash
cd backend
py -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env
```

Abra o `.env` e troque o valor de `SECRET_KEY` por uma chave gerada com:

```bash
py -c "import secrets; print(secrets.token_hex(32))"
```

Depois suba o servidor:

```bash
uvicorn app.main:app --reload --port 8000
```

A API sobe em `http://127.0.0.1:8000`. Dá pra testar as rotas direto pelo
navegador em `http://127.0.0.1:8000/docs`.

O banco (`todo.db`) é criado sozinho na primeira vez que o backend roda.

## Rodar o Frontend

O frontend é um app em React (Vite). Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Depois abre `http://127.0.0.1:5500` no navegador (a porta já vem configurada
em `vite.config.js` batendo com o CORS liberado no backend).

O `.env` controla pra qual API o frontend aponta (`VITE_API_BASE_URL`) —
não precisa mudar nada se o backend estiver rodando em `127.0.0.1:8000`.

### Estrutura do frontend

```
frontend/src/
├── api/            chamadas HTTP (client.js, auth.js, tasks.js)
├── components/     componentes de UI, um arquivo .jsx + .css por peça
│   ├── auth/       tela de login e cadastro
│   └── tasks/      barra superior, formulário e lista de tarefas
├── context/        AuthContext: estado de login compartilhado
├── pages/          páginas que juntam os componentes (uma por rota)
├── App.jsx         rotas do app (react-router-dom)
└── main.jsx        ponto de entrada
```

> Os comandos de backend acima usam `py` (funcionou aqui no Windows). Se `py` não for reconhecido no seu terminal, tente `python` ou `python3` no lugar.