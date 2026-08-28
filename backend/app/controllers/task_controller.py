from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import Task, User
from app.schemas import TarefaAtualizar, TarefaCriar, TarefaResposta

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    dependencies=[Depends(get_current_user)],  
)


def buscar_tarefa_do_usuario(db: Session, task_id: int, user_id: int) -> Task:
    """Busca a tarefa garantindo que ela é do usuário logado (senão, 404).

    Devolvemos 404 (nunca 403) para tarefa de outro dono, para não confirmar
    para quem não é dono que aquele id existe.
    """
    tarefa = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not tarefa:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")
    return tarefa


@router.get("/", response_model=list[TarefaResposta])
def listar_tarefas(db: Session = Depends(get_db), usuario: User = Depends(get_current_user)):
    return (
        db.query(Task)
        .filter(Task.user_id == usuario.id)
        .order_by(Task.data_criacao.desc())
        .all()
    )


@router.post("/", response_model=TarefaResposta, status_code=status.HTTP_201_CREATED)
def criar_tarefa(
    dados: TarefaCriar,
    db: Session = Depends(get_db),
    usuario: User = Depends(get_current_user),
):
    tarefa = Task(titulo=dados.titulo, descricao=dados.descricao, user_id=usuario.id)
    db.add(tarefa)
    db.commit()
    db.refresh(tarefa)
    return tarefa


@router.put("/{task_id}", response_model=TarefaResposta)
def atualizar_tarefa(
    task_id: int,
    dados: TarefaAtualizar,
    db: Session = Depends(get_db),
    usuario: User = Depends(get_current_user),
):
    tarefa = buscar_tarefa_do_usuario(db, task_id, usuario.id)

    for campo, valor in dados.model_dump(exclude_unset=True).items():
        setattr(tarefa, campo, valor)

    db.commit()
    db.refresh(tarefa)
    return tarefa


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_tarefa(
    task_id: int, db: Session = Depends(get_db), usuario: User = Depends(get_current_user)
):
    tarefa = buscar_tarefa_do_usuario(db, task_id, usuario.id)
    db.delete(tarefa)
    db.commit()
