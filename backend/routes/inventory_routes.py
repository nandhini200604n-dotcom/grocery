from flask import request, jsonify
from db import get_connection

def register_inventory_routes(app):
    
    # Add Inventory
    @app.route("/add_inventory", methods=["POST"])
    def add_inventory():
        conn = get_connection()
        cursor = conn.cursor()
        data = request.get_json()

        cursor.execute("""
        INSERT INTO inventory
        (product_name, category, quantity, price, supplier,batch)
        VALUES (%s,%s,%s,%s,%s,%s)
        """, (

            data["product_name"],
            data["category"],
            data["quantity"],
            data["price"],
            data["supplier"],
            data["batch"]

        ))

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({
            "message": "Inventory Added Successfully"
        })
        


    # Get Inventory
    @app.route("/inventory", methods=["GET"])
    def get_inventory():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT
        id,
        product_name,
        category,
        quantity,
        price,
        supplier,
        batch
        FROM stockdetails
        """)

        data = cursor.fetchall()

        inventory = []

        for row in data:

            inventory.append({

                "id": row[0],
                "product_name": row[1],
                "category": row[2],
                "quantity": row[3],
                "price": float(row[4]) if row[4] is not None else 0,
                "supplier": row[5] if row[5] else "",
                "batch": row[6] if row[6] else ""

            })

        cursor.close()
        conn.close()
        return jsonify(inventory)


    # Update Inventory
    @app.route("/update_inventory/<int:id>", methods=["PUT"])
    def update_inventory(id):
        conn = get_connection()
        cursor = conn.cursor()
        data = request.get_json()

        cursor.execute("""
        UPDATE inventory
        SET product_name=%s,
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
            "message": "Inventory Updated Successfully"
        })


    # Delete Inventory
    @app.route("/delete_inventory/<string:product_name>", methods=["DELETE"])
    def delete_inventory(product_name):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM inventory WHERE product_name=%s",
            (product_name,)
        )
        conn.commit()

        # Check if inventory table is empty
        cursor.execute(
            "SELECT COUNT(*) FROM inventory"
        )

        count = cursor.fetchone()[0]

        # Reset AUTO_INCREMENT if empty
        if count == 0:

            cursor.execute(
                "ALTER TABLE inventory AUTO_INCREMENT = 1"
            )

            conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "message": "Inventory Deleted Successfully"
        })


    # Products For Sales Dropdown
    @app.route("/products", methods=["GET"])
    def get_products():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT product_name, price
        FROM stockdetails
        """)

        data = cursor.fetchall()

        products = []

        for row in data:

            products.append({

                "product_name": row[0],
                "price": float(row[1])

            })
        cursor.close()
        conn.close()
        return jsonify(products)