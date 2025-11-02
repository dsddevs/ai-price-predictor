"""
Authentication and authorization module
"""

import logging
import secrets
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt  # type: ignore
from passlib.context import CryptContext  # type: ignore
from pydantic import BaseModel, EmailStr

logger = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Bearer
security = HTTPBearer()


class TokenData(BaseModel):
    """Token payload data"""

    username: Optional[str] = None
    user_id: Optional[str] = None
    scopes: list[str] = []


class User(BaseModel):
    """User model"""

    id: str
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    disabled: bool = False
    is_admin: bool = False
    created_at: datetime
    last_login: Optional[datetime] = None


class UserInDB(User):
    """User model with hashed password"""

    hashed_password: str


class AuthManager:
    """Handle authentication and authorization"""

    def __init__(
        self,
        secret_key: str,
        algorithm: str = "HS256",
        access_token_expire_minutes: int = 30,
    ):
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.access_token_expire_minutes = access_token_expire_minutes

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)

    def create_access_token(
        self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()

        # Validate that 'sub' (subject) is present
        if "sub" not in to_encode:
            raise ValueError("Token data must include 'sub' (subject/username)")

        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=self.access_token_expire_minutes
            )

        to_encode.update(
            {
                "exp": expire,
                "iat": datetime.utcnow(),
                # JWT ID for token revocation
                "jti": secrets.token_urlsafe(32),
            }
        )

        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """Create a JWT refresh token"""
        expires_delta = timedelta(days=7)  # Refresh tokens last 7 days
        return self.create_access_token(data, expires_delta)

    def decode_token(self, token: str) -> TokenData:
        """Decode and validate a JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            username: str = payload.get("sub", "")
            user_id: str = payload.get("user_id", "")
            scopes: list = payload.get("scopes", [])

            if username is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            return TokenData(username=username, user_id=user_id, scopes=scopes)

        except JWTError as e:
            logger.error(f"JWT decode error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

    async def get_current_user(
        self, credentials: HTTPAuthorizationCredentials = Depends(security)
    ) -> TokenData:
        """Get current user from JWT token"""
        token = credentials.credentials
        return self.decode_token(token)

    def check_permissions(
        self, token_data: TokenData, required_scopes: list[str]
    ) -> bool:
        """Check if user has required permissions"""
        for scope in required_scopes:
            if scope not in token_data.scopes:
                return False
        return True


class RateLimiter:
    """Simple in-memory rate limiter"""

    def __init__(self, requests: int = 100, window: int = 60):
        self.requests = requests
        self.window = window
        self.clients: Dict[str, list[datetime]] = {}

    def is_allowed(self, client_id: str) -> bool:
        """Check if client is within rate limit"""
        now = datetime.utcnow()

        if client_id not in self.clients:
            self.clients[client_id] = []

        # Remove old requests outside the window
        self.clients[client_id] = [
            req_time
            for req_time in self.clients[client_id]
            if (now - req_time).total_seconds() < self.window
        ]

        # Check if within limit
        if len(self.clients[client_id]) < self.requests:
            self.clients[client_id].append(now)
            return True

        return False


class APIKeyManager:
    """Manage API keys for service-to-service authentication"""

    def __init__(self):
        self.api_keys: Dict[str, Dict[str, Any]] = {}

    def generate_api_key(self) -> str:
        """Generate a new API key"""
        return f"tp_{secrets.token_urlsafe(32)}"

    def add_api_key(self, name: str, scopes: list[str]) -> str:
        """Add a new API key with specified scopes"""
        api_key = self.generate_api_key()
        self.api_keys[api_key] = {
            "name": name,
            "scopes": scopes,
            "created_at": datetime.utcnow(),
            "last_used": None,
            "active": True,
        }
        return api_key

    def validate_api_key(self, api_key: str) -> Optional[Dict[str, Any]]:
        """Validate an API key"""
        if api_key in self.api_keys and self.api_keys[api_key]["active"]:
            self.api_keys[api_key]["last_used"] = datetime.utcnow()
            return self.api_keys[api_key]
        return None

    def revoke_api_key(self, api_key: str) -> bool:
        """Revoke an API key"""
        if api_key in self.api_keys:
            self.api_keys[api_key]["active"] = False
            return True
        return False


# Security utilities
def generate_secure_password(length: int = 16) -> str:
    """Generate a secure random password"""
    alphabet = (
        "abcdefghijklmnopqrstuvwxyz" "ABCDEFGHIJKLMNOPQRSTUVWXYZ" "0123456789!@#$%^&*"
    )
    return "".join(secrets.choice(alphabet) for _ in range(length))


def validate_password_strength(password: str) -> tuple[bool, str]:
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"

    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"

    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"

    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one digit"

    special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if not any(c in special_chars for c in password):
        return False, "Password must contain at least one special character"

    return True, "Password is strong"
