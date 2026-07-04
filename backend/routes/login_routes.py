from flask import request, jsonify
from db import get_connection

def register_login_routes(app):

    @app.route("/login", methods=["POST"])
    def login():
        conn = get_connection()
        cursor = conn.cursor()
        data = request.get_json()

        username = data["username"]
        password = data["password"]

        

        cursor.execute("""
            SELECT *
            FROM users
            WHERE username=%s
            AND password=%s
        """, (username, password))

        user = cursor.fetchone()

        cursor.close()
        
        conn.close()

        if user:
            return jsonify({
                "success": True,
                "message": "Login Successful"
            })

        return jsonify({
            "success": False,
            "message": "Invalid Username or Password"
        }), 401