from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import decodificar_token

# HTTPBearer em vez de OAuth2PasswordBearer: o /auth/login deste projeto
# recebe JSON (não form-urlencoded), e o esquema OAuth2 clássico deixava o
# botão "Authorize" do Swagger (/docs) quebrado, pois declarava um formato
# de corpo diferente do que a rota realmente aceita.
security = HTTPBearer()


def get_current_user(
    credenciais: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Lê o token enviado pelo frontend e descobre qual usuário está logado."""
    erro_login = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar o login. Faça login novamente.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        usuario_id = decodificar_token(credenciais.credentials)
    except ValueError as exc:
        raise erro_login from exc

    usuario = db.query(User).filter(User.id == usuario_id).first()
    if usuario is None:
        raise erro_login
    return usuario
