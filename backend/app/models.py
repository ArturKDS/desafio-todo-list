from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base


class StatusTarefa(str, Enum):

    PENDENTE = "pendente"
    CONCLUIDA = "concluida"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    senha_hash: Mapped[str] = mapped_column(String, nullable=False)

    tarefas = relationship("Task", back_populates="dono", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    titulo: Mapped[str] = mapped_column(String(200), nullable=False)
    descricao: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    status: Mapped[StatusTarefa] = mapped_column(
        SAEnum(StatusTarefa, native_enum=False, length=20),
        default=StatusTarefa.PENDENTE,
        nullable=False,
    )
    data_criacao: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # index=True: toda listagem de tarefas filtra por user_id - sem índice
    # isso vira um full table scan conforme a tabela cresce.
    # ondelete="CASCADE": evita tarefas órfãs se um usuário for apagado.
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    dono = relationship("User", back_populates="tarefas")
