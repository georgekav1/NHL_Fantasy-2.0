import sqlite3
from flask import Flask, render_template, redirect, url_for, request, flash,abort, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import Resource, Api
from extensions import db

import requests

from datetime import datetime

DB_file = r"instance\users.db"

class User(UserMixin, db.Model):
    __tablename__ = 'user'
    __table_args__ = {'extend_existing': True} 

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    last_login = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    player_rank = db.Column(db.String(50), nullable=False, default="Bronze")
    total_games_played = db.Column(db.Integer, nullable=False, default=0)
    wins = db.Column(db.Integer, nullable=False, default=0)
    losses = db.Column(db.Integer, nullable=False, default=0)
    win_rate = db.Column(db.Float, nullable=False, default=0.0)

    def update_stats(self):
        """Recalculate win rate and update rank based on wins."""
        if self.total_games_played > 0:
            self.win_rate = round((self.wins / self.total_games_played) * 100, 2)
        else:
            self.win_rate = 0.0
        
        # Rank update logic based on win count
        if self.wins >= 50:
            self.player_rank = "Prestige"
        elif self.wins >= 40:
            self.player_rank = "Diamond"
        elif self.wins >= 30:
            self.player_rank = "Platinum"
        elif self.wins >= 20:
            self.player_rank = "Gold"
        elif self.wins >= 10:
            self.player_rank = "Silver"
        else:
            self.player_rank = "Bronze"
        
        db.session.commit()


class NHLapi(Resource):
    # GET method retrieves all drivers from the database
    def get(self):
        from app import User # imporeted here to avoid circular import issues
        users = User.query.all()
        user_list = []

        # Loop through each driver and prepare data for JSON response
        for user in users:
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "last login": user.last_login,
                "rank": user.player_rank,
                "total games played": user.total_games_played,
                "wins": user.wins,
                "losses": user.losses,
                "win rate": user.win_rate,
            }
            user_list.append(user_data)

        # Return the driver list in JSON format
        return jsonify(user_list)

    # def check_ip():
    #     if request.remote_addr not in ALLOWED_IPS:
    #         print("not allowed")
    #         return jsonify({"error": "Unauthorized IP address"}), 403

    def post(self):
        data = request.get_json()
        username = data.get('username')
        if not username:
            return jsonify({"error": "Username is required"}), 400
        
        new_user = User(username=username, password="default_password", email="example@example.com")
        db.session.add(new_user)
        db.session.commit()
        
        return {"message": f"success {username}"}, 200

    def dosomething(username):
        print(username)

    def updateUserRecord(username, win):
        with sqlite3.connect(DB_file) as conn:
            cursor = conn.cursor()

            if win:
                cursor.execute("""
                UPDATE user
                SET total_games_played = total_games_played + 10,
                    wins = wins + 1
                WHERE username = ?""", (username,))
            else:
                cursor.execute("""
                UPDATE user
                SET total_games_played = total_games_played + 1,
                    losses = losses + 1
                WHERE username = ?""", (username,))
            
            conn.commit()  # Commit the changes to the database

def create_api(app):
    api = Api(app)  # Create an instance of the API class
    api.add_resource(NHLapi, '/nhlapi')  # Pass the class, not an instance
    return api


