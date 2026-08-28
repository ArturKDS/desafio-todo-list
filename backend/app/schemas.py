from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UsuarioCadastro(BaseModel):
    email: str
    senha: str


class UsuarioLogin(BaseModel):
    email: str
    senha: str


class UsuarioResposta(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TarefaCriar(BaseModel):
    titulo: str
    descricao: Optional[str] = None


class TarefaAtualizar(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    status: Optional[str] = None


class TarefaResposta(BaseModel):
    id: int
    titulo: str
    descricao: Optional[str] = None
    status: str
    data_criacao: datetime

    class Config:
        from_attributes = True
