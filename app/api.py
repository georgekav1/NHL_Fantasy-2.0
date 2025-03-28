import sqlite3
from flask import Flask, render_template, redirect, url_for, request, flash,abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import requests
from app import User
from datetime import datetime

# # Initialize the Flask app
# api = Flask(__name__)

# # Configure the Flask app
# api.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///users.db"  # SQLite database
# api.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# # Initialize SQLAlchemy
# db = SQLAlchemy(api)

# @api.route('/update_stats', methods=['POST'])
# @login_required
# def update_stats():
#     data = request.get_json()
#     if not data or 'result' not in data:
#         return jsonify({"error": "Invalid request"}), 400

#     result = data['result']
#     user = User.query.get(current_user.id)

#     if not user:
#         return jsonify({"error": "User not found"}), 404

#     user.total_games_played += 1
#     if result == 'win':
#         user.wins += 1
#     elif result == 'loss':
#         user.losses += 1
#     else:
#         return jsonify({"error": "Invalid result type"}), 400

#     user.update_stats()

#     user.update_stats()
#     return jsonify({"message": "Stats updated successfully", "win_rate": user.win_rate, "rank": user.player_rank})

DB_file = r"instance\users.db"

def updateUserRecord(id, player_rank, total_games_played, wins, losses, win_rate):
    with sqlite3.connect(DB_file) as conn:
        cursor = conn.cursor()

        if win:
            cursor.execute("""
            UPDATE user
            SET total_games_played = total_games_played + 1,
                wins = wins + 1,
            WHERE id = ; ?""", (wins, total_games_played,id))
        else:
            cursor.execute("""
            UPDATE user
            SET total_games_played = total_games_played + 1,
                losses = losses + 1
            WHERE id = ?""", (losses, total_games_played, id))
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        print("Tables:", cursor.fetchall())  # Check if 'users' table exists
