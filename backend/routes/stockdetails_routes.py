
from flask import request, jsonify
from db import get_connection

def register_stockdetails_routes(app):

    # Get all stock items
    @app.route("/stockdetails", methods=["GET"])
    def get_stock_items():
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT *
            FROM stockdetails
            ORDER BY id ASC
        """)

        rows = cursor.fetchall()

        data = []

        for row in rows:
            data.append({
                "id": row[0],
                "product_name": row[1],
                "category": row[2],
                "quantity": row[3],
                "price": float(row[4]),
                "import_date": str(row[5]),
                "manufacture_date": str(row[6]),
                "expire_date": str(row[7]),
                "supplier": row[8],
                "batch":row[9]
            })

        cursor.close()
        conn.close()

        return jsonify(data)

    # Add stock item
    @app.route("/stockdetails", methods=["POST"])
    def add_stock_item():
        conn = get_connection()
        data = request.json

        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO stockdetails
            (
                product_name,
                category,
                quantity,
                price,
                import_date,
                manufacture_date,
                expire_date,
                supplier,
                batch
                
            )
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            data["product_name"],
            data["category"],
            data["quantity"],
            data["price"],
            data["import_date"],
            data["manufacture_date"],
            data["expire_date"],
            data["supplier"],
            data["batch"]
        ))
        

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Stock Item Added Successfully"
        })

    # Update stock item
    @app.route("/stockdetails/<int:id>", methods=["PUT"])
    def update_stock_item(id):
        conn = get_connection()

        data = request.json

        cursor = conn.cursor()

        cursor.execute("""
            UPDATE stockdetails
            SET
                product_name=%s,
                category=%s,
                quantity=%s,
                price=%s,
                import_date=%s,
                manufacture_date=%s,
                expire_date=%s,
                supplier=%s,
                batch=%s
            WHERE product_name=%s
        """, (
            data["product_name"],
            data["category"],
            data["quantity"],
            data["price"],
            data["import_date"],
            data["manufacture_date"],
            data["expire_date"],
            data["supplier"],
            data["batch"],
            data["product_name"]
        ))
        cursor.execute("""
            UPDATE inventory
            SET
                product_name=%s,
                category=%s,
                quantity=%s,
                price=%s,
                supplier=%s,
                batch=%s
            WHERE product_name=%s
        """, (
            data["product_name"],
            data["category"],
            data["quantity"],
            data["price"],
            data["supplier"],
            data["batch"],
            data["product_name"]
        ))
        

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Stock Item Updated Successfully"
        })

    @app.route("/stockdetails/<int:id>", methods=["DELETE"])
    def delete_stock_item(id):
        conn = get_connection()
        cursor = conn.cursor()

        # Find product name using id
        cursor.execute(
            "SELECT product_name FROM stockdetails WHERE id=%s",
            (id,)
        )

        result = cursor.fetchone()

        if result is None:
            cursor.close()
            conn.close()
            return jsonify({
                "message": "Stock item not found"
            }),404

        product_name = result[0]

        # Delete from stockdetails
        cursor.execute(
            "DELETE FROM stockdetails WHERE id=%s",
            (id,)
        )

        # Delete from inventory
        cursor.execute(
            "DELETE FROM inventory WHERE product_name=%s",
            (product_name,)
        )

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "message":"Stock Item Deleted Successfully"
        })

