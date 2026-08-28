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

## Rodar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Depois abre `http://127.0.0.1:5500` no navegador.


> Os comandos de backend acima usam `py` (funcionou aqui no Windows). Se `py` não for reconhecido no seu terminal, tente `python` ou `python3` no lugar.