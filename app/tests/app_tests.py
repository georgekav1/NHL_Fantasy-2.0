import pytest
from app import app, db, User  # Import your Flask app, database, and models
from flask import Flask, url_for, json
from werkzeug.security import generate_password_hash

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use in-memory DB for testing
    client = app.test_client()
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    yield client
    
    # Teardown
    with app.app_context():
        db.drop_all()

def test_register_user(client):
    """Test user registration"""
    response = client.post('/register', data={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 302 # Redirect to login on success

def test_login_user(client):
    """Test user login"""
    hashed_password = generate_password_hash("password123")
    
    # Add test user
    with app.app_context():
        user = User(username="testuser", email="test@example.com", password=hashed_password)
        db.session.add(user)
        db.session.commit()
    
    # Attempt login
    response = client.post('/', data={
        'username': 'testuser',
        'password': 'password123'
    })
    
    assert response.status_code == 302  # Redirect to home on success

def test_protected_route(client):
    """Test access to a protected route without authentication"""
    response = client.get('/home')
    assert response.status_code == 302  # Redirect to login
