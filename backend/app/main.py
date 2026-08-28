from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import auth, schemas
from .database import Base, Task, User, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="To-Do List API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def raiz():
    return {"status": "ok", "docs": "/docs"}


@app.post(
    "/auth/register",
    response_model=schemas.UsuarioResposta,
    status_code=status.HTTP_201_CREATED,
)
def cadastrar(dados: schemas.UsuarioCadastro, db: Session = Depends(get_db)):
    ja_existe = db.query(User).filter(User.email == dados.email).first()
    if ja_existe:
        raise HTTPException(status_code=400, detail="Esse e-mail já está cadastrado")

    novo_usuario = User(email=dados.email, senha_hash=auth.criar_hash_senha(dados.senha))
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario


@app.post("/auth/login", response_model=schemas.Token)
def login(dados: schemas.UsuarioCadastro, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.email == dados.email).first()

    if not usuario or not auth.senha_confere(dados.senha, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")

    token = auth.criar_token(usuario.id)
    return {"access_token": token, "token_type": "bearer"}


def buscar_tarefa_do_usuario(db: Session, task_id: int, user_id: int) -> Task:
    """Busca a tarefa garantindo que ela é do usuário logado (senão, 404)."""
    tarefa = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return tarefa


@app.get("/tasks/", response_model=list[schemas.TarefaResposta])
def listar_tarefas(db: Session = Depends(get_db), usuario: User = Depends(auth.get_current_user)):
    return (
        db.query(Task)
        .filter(Task.user_id == usuario.id)
        .order_by(Task.data_criacao.desc())
        .all()
    )


@app.post("/tasks/", response_model=schemas.TarefaResposta, status_code=status.HTTP_201_CREATED)
def criar_tarefa(
    dados: schemas.TarefaCriar,
    db: Session = Depends(get_db),
    usuario: User = Depends(auth.get_current_user),
):
    tarefa = Task(titulo=dados.titulo, descricao=dados.descricao, user_id=usuario.id)
    db.add(tarefa)
    db.commit()
    db.refresh(tarefa)
    return tarefa


@app.put("/tasks/{task_id}", response_model=schemas.TarefaResposta)
def atualizar_tarefa(
    task_id: int,
    dados: schemas.TarefaAtualizar,
    db: Session = Depends(get_db),
    usuario: User = Depends(auth.get_current_user),
):
    tarefa = buscar_tarefa_do_usuario(db, task_id, usuario.id)

    if dados.titulo is not None:
        tarefa.titulo = dados.titulo
    if dados.descricao is not None:
        tarefa.descricao = dados.descricao
    if dados.status is not None:
        tarefa.status = dados.status

    db.commit()
    db.refresh(tarefa)
    return tarefa


@app.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_tarefa(
    task_id: int, db: Session = Depends(get_db), usuario: User = Depends(auth.get_current_user)
):
    tarefa = buscar_tarefa_do_usuario(db, task_id, usuario.id)
    db.delete(tarefa)
    db.commit()
