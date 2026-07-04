from flask import Flask
from flask_cors import CORS
from routes.login_routes import register_login_routes
from routes.dashboard_routes import register_dashboard_routes
from routes.inventory_routes import register_inventory_routes

from routes.sales_routes import register_sales_routes
from routes.stockdetails_routes import register_stockdetails_routes
app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Smart Grocery Store Backend Running Successfully"
register_login_routes(app)
register_dashboard_routes(app)
register_inventory_routes(app)

register_sales_routes(app)
register_stockdetails_routes(app)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003, debug=True)
    