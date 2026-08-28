import os
from datetime import datetime, timedelta, timezone

import bcrypt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from .database import User, get_db

load_dotenv()  

SECRET_KEY = os.getenv("SECRET_KEY", "chave-secreta-so-para-estudo")
ALGORITHM = "HS256"
TEMPO_EXPIRACAO_MINUTOS = 60 * 24

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def criar_hash_senha(senha: str) -> str:
    """Transforma a senha num hash. Nunca guardamos a senha 'crua' no banco."""
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def senha_confere(senha_digitada: str, senha_hash: str) -> bool:
    return bcrypt.checkpw(senha_digitada.encode("utf-8"), senha_hash.encode("utf-8"))


def criar_token(usuario_id: int) -> str:
    expira_em = datetime.now(timezone.utc) + timedelta(minutes=TEMPO_EXPIRACAO_MINUTOS)
    dados = {"sub": str(usuario_id), "exp": expira_em}
    return jwt.encode(dados, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    """Lê o token enviado pelo frontend e descobre qual usuário está logado."""
    erro_login = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar o login. Faça login novamente.",
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id = payload.get("sub")
    except JWTError:
        raise erro_login

    usuario = db.query(User).filter(User.id == int(usuario_id)).first()
    if usuario is None:
        raise erro_login
    return usuario
