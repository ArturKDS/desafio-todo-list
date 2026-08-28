from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models import StatusTarefa


class UsuarioCadastro(BaseModel):
    email: EmailStr
    senha: str = Field(min_length=6)


class UsuarioLogin(BaseModel):
    email: EmailStr
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
    titulo: str = Field(min_length=1, max_length=200)
    descricao: Optional[str] = Field(default=None, max_length=2000)


class TarefaAtualizar(BaseModel):
    titulo: Optional[str] = Field(default=None, min_length=1, max_length=200)
    descricao: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[StatusTarefa] = None


class TarefaResposta(BaseModel):
    id: int
    titulo: str
    descricao: Optional[str] = None
    status: str
    data_criacao: datetime

    class Config:
        from_attributes = True