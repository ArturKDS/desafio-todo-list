from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt

from app.config import settings


def criar_hash_senha(senha: str) -> str:
    """Nunca guardamos a senha 'crua' no banco - só o hash."""
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def senha_confere(senha_digitada: str, senha_hash: str) -> bool:
    return bcrypt.checkpw(senha_digitada.encode("utf-8"), senha_hash.encode("utf-8"))


def criar_token(usuario_id: int) -> str:
    expira_em = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    dados = {"sub": str(usuario_id), "exp": expira_em}
    return jwt.encode(dados, settings.secret_key, algorithm=settings.algorithm)


def decodificar_token(token: str) -> int:
    """Decodifica o token e devolve o id do usuário.

    Correção de segurança importante: no código original, `int(usuario_id)`
    ficava FORA do try/except do jwt.decode. Um token adulterado sem o campo
    "sub" (ou com "sub" não numérico) fazia `int(None)` ou `int("abc")`
    lançar TypeError/ValueError, que não era capturado - a API respondia 500
    com stacktrace em vez de 401. Aqui capturamos tudo que pode falhar nessa
    conversão, então qualquer token inválido vira 401 corretamente.
    """
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return int(payload["sub"])
    except (JWTError, KeyError, ValueError, TypeError) as exc:
        raise ValueError("Token inválido") from exc
