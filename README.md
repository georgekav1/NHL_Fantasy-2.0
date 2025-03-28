# Hockey Heroes

Welcome to Hockey Heroes! This project is a Top Trumps-style game that allows users to create and manage their fantasy NHL teams, track player statistics, and make decisions based on real-time data analysis of NHL players' stats.

---

## Features

- **Fantasy Team Management**: Users can create and manage their fantasy hockey teams with ease.
- **Player Statistics**: Track players' stats such as goals, assists, and overall performance.
- **Data Analysis**: Make informed decisions for your team based on data-driven insights.
- **User Authentication**: Secure login system for users and administrators.
- **Interactive UI**: A user-friendly interface for easy interaction with the game.
- **API Documentation**: API endpoints for interacting with data, powered by Swagger UI.

---

## Installation

Follow these steps to install and run the application on your local machine:

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/NHL_Fantasy-2.0.git
```

### 2. Navigate to the project directory:
```bash
cd NHL_Fantasy-2.0
```

### 3. Install the required dependencies:
```bash
pip install flask flask_sqlalchemy flask_login flasgger requests flask_restful
```

---

## Usage

Once the dependencies are installed, you can run the application locally:

### 1. Start the Flask Application:
Navigate to the `app` directory and run the app:

```bash
cd app
python app.py
```

### 2. Access the Game:
After running the application, you can access the game at the following URL in your browser:

```plaintext
http://localhost:5000/
```

You can now follow the on-screen instructions to create and manage your fantasy hockey team, play the game, and track your players’ statistics.

---

## API Documentation

The project includes an API that allows users to interact with the game data programmatically. The API documentation is available via Swagger UI, which you can use to explore available endpoints and test them directly.

### How to Access the Documentation

Once the Flask application is running locally, open your browser and navigate to the following URL to access the Swagger UI documentation for the API:

```plaintext
http://localhost:5000/apidocs
```

The API documentation will provide detailed information about each route, available parameters, and expected responses.

---

## Testing
```bash
pip install pytest
```

```bash
pytest tests/app_tests.py
```

## Contributing

We welcome contributions to this project! If you would like to contribute, please follow these steps:

1. **Fork the repository**.
2. **Create a new branch** for your feature or bug fix.
3. **Make your changes** and commit them.
4. **Push to your fork** and create a pull request.

All contributions are reviewed, and we encourage you to submit issues or suggest features as well!

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any questions or suggestions, please reach out to the repository owner at:

**Email**: your.email@example.com

---
