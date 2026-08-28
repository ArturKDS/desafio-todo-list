from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import Token, UsuarioCadastro, UsuarioLogin, UsuarioResposta
from app.security import criar_hash_senha, criar_token, senha_confere

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UsuarioResposta, status_code=status.HTTP_201_CREATED)
def cadastrar(dados: UsuarioCadastro, db: Session = Depends(get_db)):
    ja_existe = db.query(User).filter(User.email == dados.email).first()
    if ja_existe:
        raise HTTPException(status_code=400, detail="Esse e-mail já está cadastrado")

    novo_usuario = User(email=dados.email, senha_hash=criar_hash_senha(dados.senha))
    db.add(novo_usuario)
    try:
        db.commit()
    except IntegrityError:
     
        db.rollback()
        raise HTTPException(status_code=400, detail="Esse e-mail já está cadastrado") from None

    db.refresh(novo_usuario)
    return novo_usuario


@router.post("/login", response_model=Token)
def login(dados: UsuarioLogin, db: Session = Depends(get_db)):
    usuario = db.query(User).filter(User.email == dados.email).first()

    if not usuario or not senha_confere(dados.senha, usuario.senha_hash):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")

    token = criar_token(usuario.id)
    return {"access_token": token, "token_type": "bearer"}
