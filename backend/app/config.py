from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    secret_key: str  # sem default -> a API não sobe sem essa variável
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = "sqlite:///./todo.db"

    # Lista explícita de origens permitidas no CORS. Nunca usar "*" junto
    # com allow_credentials=True (é inválido pela própria especificação de
    # CORS e o navegador rejeita).
    cors_origins: list[str] = ["http://127.0.0.1:5500", "http://localhost:5500"]


settings = Settings()
