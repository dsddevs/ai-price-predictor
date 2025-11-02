from datetime import datetime, timedelta
from unittest.mock import Mock

import pytest
from app.auth import (
    APIKeyManager,
    AuthManager,
    RateLimiter,
    TokenData,
    generate_secure_password,
    validate_password_strength,
)
from fastapi import HTTPException


# --- Fixtures ---
@pytest.fixture
def auth_manager():
    return AuthManager(secret_key="test-secret-key", access_token_expire_minutes=1)


@pytest.fixture
def rate_limiter():
    return RateLimiter(requests=3, window=1)


@pytest.fixture
def api_key_manager():
    return APIKeyManager()


# --- Password Hashing & Verification ---
def test_password_hashing_and_verification(auth_manager):
    password = "StrongPass123!"
    hashed = auth_manager.get_password_hash(password)

    assert hashed != password
    assert auth_manager.verify_password(password, hashed) is True
    assert auth_manager.verify_password("wrong", hashed) is False


# --- JWT Token Creation & Decoding ---
def test_create_and_decode_access_token(auth_manager):
    data = {"sub": "testuser", "user_id": "123", "scopes": ["read", "write"]}
    token = auth_manager.create_access_token(data)

    decoded = auth_manager.decode_token(token)
    assert decoded.username == "testuser"
    assert decoded.user_id == "123"
    assert "read" in decoded.scopes
    assert "write" in decoded.scopes


def test_expired_token_raises_unauthorized(auth_manager, monkeypatch):
    expire = datetime.utcnow() - timedelta(minutes=1)
    data = {
        "sub": "testuser",
        "exp": expire,
        "iat": datetime.utcnow(),
        "jti": "test",
    }

    from jose import jwt

    token = jwt.encode(data, "test-secret-key", algorithm="HS256")

    with pytest.raises(HTTPException) as exc:
        auth_manager.decode_token(token)
    assert exc.value.status_code == 401
    assert "Invalid authentication credentials" in exc.value.detail


def test_missing_sub_raises_error(auth_manager):
    """Test that creating a token without 'sub' raises ValueError"""
    data = {"user_id": "123"}

    with pytest.raises(ValueError) as exc:
        auth_manager.create_access_token(data)
    assert "sub" in str(exc.value)


# --- Scopes & Permissions ---
def test_check_permissions():
    token_data = TokenData(username="user", user_id="1", scopes=["read", "forecast"])

    auth = AuthManager(secret_key="test")
    assert auth.check_permissions(token_data, ["read"]) is True
    assert auth.check_permissions(token_data, ["read", "forecast"]) is True
    assert auth.check_permissions(token_data, ["admin"]) is False
    assert auth.check_permissions(token_data, []) is True


# --- Rate Limiter ---
def test_rate_limiter_allows_requests_under_limit(rate_limiter):
    client_id = "127.0.0.1"
    assert rate_limiter.is_allowed(client_id) is True
    assert rate_limiter.is_allowed(client_id) is True
    assert rate_limiter.is_allowed(client_id) is True


def test_rate_limiter_blocks_excess_requests(rate_limiter):
    client_id = "127.0.0.1"
    for _ in range(3):
        rate_limiter.is_allowed(client_id)
    assert rate_limiter.is_allowed(client_id) is False


def test_rate_limiter_resets_after_window(rate_limiter, monkeypatch):
    client_id = "127.0.0.1"
    for _ in range(3):
        rate_limiter.is_allowed(client_id)

    def fake_now():
        return datetime.utcnow() + timedelta(seconds=1.1)

    monkeypatch.setattr("app.auth.datetime", Mock(utcnow=fake_now))
    assert rate_limiter.is_allowed(client_id) is True


# --- API Key Manager ---
def test_api_key_generation_and_validation(api_key_manager):
    key = api_key_manager.add_api_key(
        name="test-service", scopes=["forecast", "health"]
    )

    assert key.startswith("tp_")
    assert len(key) > 10

    info = api_key_manager.validate_api_key(key)
    assert info["name"] == "test-service"
    assert "forecast" in info["scopes"]
    assert info["active"] is True
    assert isinstance(info["created_at"], datetime)


def test_invalid_api_key_returns_none(api_key_manager):
    assert api_key_manager.validate_api_key("invalid_key") is None


def test_revoke_api_key(api_key_manager):
    key = api_key_manager.add_api_key("service", ["read"])
    assert api_key_manager.validate_api_key(key)["active"] is True
    assert api_key_manager.revoke_api_key(key) is True
    assert api_key_manager.validate_api_key(key) is None


# --- Password Utilities ---
def test_generate_secure_password():
    password = ""
    attempts = 0
    max_attempts = 100
    while attempts < max_attempts:
        password = generate_secure_password(16)
        if (
            any(c.isupper() for c in password)
            and any(c.islower() for c in password)
            and any(c.isdigit() for c in password)
            and any(c in "!@#$%^&*" for c in password)
        ):
            break
        attempts += 1
    else:
        pytest.fail(
            "Failed to generate password with "
            "all required character types in 100 attempts"
        )

    assert len(password) == 16
    assert any(c.isupper() for c in password)
    assert any(c.islower() for c in password)
    assert any(c.isdigit() for c in password)
    assert any(c in "!@#$%^&*" for c in password)


@pytest.mark.parametrize(
    "password, is_valid, message",
    [
        ("Ab1!", False, "Password must be at least 8 characters long"),
        (
            "short123",
            False,
            "Password must contain at least one uppercase letter",
        ),
        (
            "NOLOWER123!",
            False,
            "Password must contain at least one lowercase letter",
        ),
        ("NoDigit!@#", False, "Password must contain at least one digit"),
        (
            "NoSpecial123",
            False,
            "Password must contain at least one special character",
        ),
        ("StrongPass1!", True, "Password is strong"),
    ],
)
def test_validate_password_strength(password, is_valid, message):
    valid, msg = validate_password_strength(password)
    assert valid == is_valid
    if not is_valid:
        assert msg == message
    else:
        assert msg == "Password is strong"
