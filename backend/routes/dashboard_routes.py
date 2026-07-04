from flask import jsonify
from db import get_connection

def register_dashboard_routes(app):

    @app.route("/dashboard", methods=["GET"])
    def dashboard_data():
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
        SELECT
            product_name,
            quantity
        FROM inventory
        """)

        inventory = cursor.fetchall()

        total_products = len(inventory)

        low_stock = 0

        for item in inventory:
            if item[1] < 10:
                low_stock += 1

        cursor.close()
        conn.close()
        return jsonify({
            "total_products": total_products,
            "low_stock": low_stock
        })