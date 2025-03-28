from flask import Flask, render_template, redirect, url_for, request, flash,abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flasgger import Swagger
from werkzeug.security import generate_password_hash, check_password_hash
import requests
from datetime import datetime
import api

app = Flask(__name__)
swagger = Swagger(app)

# App Configuration
app.config['SECRET_KEY'] = 'your_secret_key'  # You should change this to a secret key
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///users.db"  # SQLite database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialise SQLAlchemy and login manager
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'  

# User table for the database
class User(UserMixin, db.Model):
    __tablename__ = 'user'
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

# Admin table for the database
class Admin(UserMixin, db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=True, nullable=False)

    role = db.Column(db.String(50), nullable=False, default="Admin")
    last_login = db.Column(db.DateTime, default=datetime, onupdate=datetime.utcnow)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)

# Initialising the database
def create_tables():
    with app.app_context():
        db.create_all()
create_tables()

# User loader for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    admin_user = Admin.query.get(int(user_id))  # Check if the user is an admin
    if admin_user:
        return admin_user

    user = User.query.get(int(user_id))     # Check if the user is a regular user
    return user

def update_last_login(user):
    user.last_login = datetime.utcnow()
    db.session.commit()

def some():
    return User




# All Routes
@app.route("/", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        global username
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            update_last_login(user)
            api.check_ip()
            api.updateUserRecord(username, True)  # Update user record in the database
            user.update_stats()  # Update user stats after game ends
            return redirect(url_for('home')), username  # Go to home page after login

        flash('Invalid username or password', 'danger')

    return render_template("Client/index.html") 

# Temporary route to check DELETE
@app.route("/test")
def test():
    users = User.query.all()
    for user in users:
        print(user.username)
    return render_template("test.html", users=users)

@app.route("/home")
@login_required
def home():
    return render_template("Client/home.html", username=current_user.username) 

@app.route("/howToPlay")
def how_to_play():
    return render_template("Client/howToPlay.html")

@app.route("/VsComputer")
def vs_computer():
    return render_template("Client/VsComputer.html")

@app.route("/passAndPlay")
def pass_and_play():
    return render_template("Client/passAndPlay.html")

@app.route("/pickUpCard")
def pick_up_card():
    return render_template("Client/pickUpCard.html")

@app.route("/endOfRound")
def end_of_round():
    return render_template("Client/endOfRound.html")

@app.route("/gameOver")
def game_over():
    return render_template("Client/gameOver.html")

@app.route("/card")
def card():
    return render_template("Client/card.html", username=current_user.username)

@app.route("/computersTurn")
def computers_turn():
    return render_template("Client/computersTurn.html")
        
@app.route("/register", methods=['GET', 'POST'])
def register():
    """
    Register a new user.
    ---
    tags:
      - User Registration
    parameters:
      - name: username
        in: formData
        type: string
        required: true
      - name: password
        in: formData
        type: string
        required: true
      - name: email
        in: formData
        type: string
        required: true
    responses:
      200:
        description: Registration successful
      400:
        description: Invalid input
    """
    if request.method == 'POST':    
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        # Check if the username or email already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash("Username already taken", 'danger')
            return redirect(url_for('register'))
        
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            flash("Email already registered", 'danger')
            return redirect(url_for('register'))

        # Password hashing
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        new_user = User(username=username, password=hashed_password, email=email)

        db.session.add(new_user)
        db.session.commit()

        flash("Registration successful!", 'success')
        return redirect(url_for('login'))
    return render_template("Client/register.html")

@app.route("/logout")
@login_required
def logout():
    """
    Log out the current user.
    ---
    tags:
      - Logout
    responses:
      200:
        description: Successfully logged out
    """
    # Check if the current user is an admin
    if isinstance(current_user, Admin):  
        logout_user()  
        flash('You have been logged out successfully.', 'success')
        return redirect(url_for('admin_login'))     # Redirect to the admin login page
    
    # If the logged-in user is a regular user
    logout_user()  
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('login'))  # Redirect to the user login page

@app.route("/proxy/<path:url>")
def proxy(url):
    """
    Proxy API request to another server.
    ---
    tags:
      - Proxy
    parameters:
      - name: url
        in: path
        type: string
        required: true
    responses:
      200:
        description: API response
    """
    query_string = request.query_string.decode()
    print(query_string)
    full_url = f"{url}?{query_string}"
    print(full_url)
    response = requests.get(full_url)
    return jsonify(response.json())

def update_last_login(admin_user):
    admin_user.last_login = datetime.utcnow()
    db.session.commit()

@app.route("/adminLogin", methods=['GET', 'POST'])
def admin_login():
    """
    Admin Login
    ---
    tags:
      - Admin Login
    parameters:
      - name: username
        in: formData
        type: string
        required: true
      - name: password
        in: formData
        type: string
        required: true
    responses:
      200:
        description: Admin logged in
      400:
        description: Invalid credentials
    """
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Fetch the admin user from the database
        admin_user = Admin.query.filter_by(username=username).first()

        # Check if the admin user exists and the password matches
        if admin_user and check_password_hash(admin_user.password, password):
            login_user(admin_user)
            update_last_login(admin_user)

            return redirect(url_for('admin_home')) 
          
        flash('Invalid admin credentials', 'danger')
    return render_template("Admin/adminLogin.html")

@app.route("/adminHome")
@login_required
def admin_home():
    return render_template("Admin/adminHome.html", username=current_user.username)

@app.route("/admin_table")
def admin_table():
    # Get all records from the admin table
    admins = Admin.query.all()

    # Pass the data to a template for displaying
    return render_template("Admin/admin_table.html", admins=admins)

@app.route("/manageUsers")
@login_required
def manage_users():
    # Get all users from the database
    users = User.query.all()
    # Pass the users to the manageUsers.html template
    return render_template("Admin/manageUsers.html", users=users)

@app.route("/delete_user/<int:user_id>", methods=['POST'])
@login_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)   #Check if the user exists

    db.session.delete(user)
    db.session.commit()

    return redirect(url_for('manage_users'))

# Function to fetch player stats from the API
def get_player_stats(player_id):
    url = f"https://some-nhl-api.com/players/{player_id}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()  
    else:
        return None 
    
@app.route("/player/<int:player_id>")
def player_profile(player_id):
    player_data = get_player_stats(player_id)
    
    if player_data:
        return render_template("player_profile.html", player=player_data)
    else:
        return "Player not found", 404

# Main entry point for running the app
if __name__ == '__main__':
    app.run(debug=True, port=5002)  # Set debug=True for development purposes
