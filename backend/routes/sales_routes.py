from flask import request, jsonify
from db import get_connection

def register_sales_routes(app):

    # ADD SALE
    @app.route("/add_sale", methods=["POST"])
    def add_sale():
        conn = get_connection()
        cursor = conn.cursor()
        data = request.get_json()

        # Customer Auto Save
        cursor.execute("""
        INSERT INTO customers
        (customer_name, phone, email, address)
        VALUES(%s,%s,%s,%s)
        """, (

            data["customer_name"],
            data["customer_phone"],
            data["customer_email"],
            "",
            

        ))
        
        conn.commit()

        # Save Main Sale
        cursor.execute("""
        INSERT INTO sales
        (
            bill_no,
            customer_name,
            customer_phone,
            customer_email,
            grand_total,
            payment_method,
            payment_status,
            sale_date
        )
        VALUES(%s,%s,%s,%s,%s,%s,%s,%s)
        """, (

            data["bill_no"],
            data["customer_name"],
            data["customer_phone"],
            data["customer_email"],
            data["grand_total"],
            data["payment_method"],
            data["payment_status"],
            data["sale_date"]

        ))

        conn.commit()

        sale_id = cursor.lastrowid

        # Save Products
        for item in data["items"]:

            # Check Stock
            cursor.execute("""
            SELECT quantity
            FROM stockdetails
            WHERE product_name=%s
            """, (

                item["product_name"],

            ))

            product = cursor.fetchone()

            if not product:

                return jsonify({
                    "message":
                    f'{item["product_name"]} Not Found'
                }), 404

            stock = product[0]

            if stock < int(item["quantity"]):

                return jsonify({
                    "message":
                    f'Insufficient Stock For {item["product_name"]}'
                }), 400

            # Save Item
            cursor.execute("""
            INSERT INTO sale_items
            (
                sale_id,
                product_name,
                quantity,
                price,
                total
            )
            VALUES(%s,%s,%s,%s,%s)
            """, (

                sale_id,
                item["product_name"],
                item["quantity"],
                item["price"],
                item["total"]

            ))

            # Update Inventory
            
            cursor.execute("""
            UPDATE stockdetails
            SET quantity = quantity - %s
            WHERE product_name = %s
            """, (

                item["quantity"],
                item["product_name"]

            ))
            print("Product :", item["product_name"])

            print("Rows Updated:", cursor.rowcount)

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({
            "message":
            "Sale Added Successfully"
        })


    # GET SALES
    @app.route("/sales", methods=["GET"])
    def get_sales():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT *
        FROM sales
        ORDER BY id ASC
        """)

        rows = cursor.fetchall()

        sales = []

        for row in rows:

            sales.append({

                "id": row[0],
                "bill_no": row[1],
                "customer_name": row[2],
                "customer_phone": row[3],
                "customer_email": row[4],
                "grand_total": float(row[5]),
                "payment_method": row[6],
                "payment_status": row[7],
                "sale_date": str(row[8])

            })
        cursor.close()
        conn.close()
        return jsonify(sales)


    # GET BILL ITEMS
    @app.route("/sale_items/<int:sale_id>", methods=["GET"])
    def get_sale_items(sale_id):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT
        product_name,
        quantity,
        price,
        total
        FROM sale_items
        WHERE sale_id=%s
        """, (

            sale_id,

        ))

        rows = cursor.fetchall()

        items = []

        for row in rows:

            items.append({

                "product_name": row[0],
                "quantity": row[1],
                "price": float(row[2]),
                "total": float(row[3])

            })
        cursor.close()
        conn.close()
        return jsonify(items)


    # DELETE SALE
    @app.route("/delete_sale/<int:id>", methods=["DELETE"])
    def delete_sale(id):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        DELETE FROM sale_items
        WHERE sale_id=%s
        """, (

            id,

        ))

        cursor.execute("""
        DELETE FROM sales
        WHERE id=%s
        """, (

            id,

        ))

        conn.commit()

        
        # Reset AUTO_INCREMENT
        cursor.execute("""
        SELECT MAX(id)
        FROM sales
        """)

        max_id = cursor.fetchone()[0]

        if max_id is None:
            cursor.execute("""
            ALTER TABLE sales
            AUTO_INCREMENT = 1
      """)

        else:
            cursor.execute("""
            ALTER TABLE sales
            AUTO_INCREMENT = %s
            """, (max_id + 1,))
        conn.commit()

        cursor.close()
        conn.close()
        return jsonify({
            "message":
            "Sale Deleted Successfully"
        })
        