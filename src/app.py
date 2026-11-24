import os
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Mock product data
products = [
    {"id": 1, "name": "Classic White T-Shirt", "price": 25.00, "category": "tops", "color": "White"},
    {"id": 2, "name": "Black Oversized T-Shirt", "price": 30.00, "category": "tops", "color": "Black"},
    {"id": 3, "name": "Blue Denim Shirt", "price": 45.00, "category": "tops", "color": "Blue"},
    {"id": 4, "name": "Beige Hoodie", "price": 55.00, "category": "tops", "color": "Beige"},
    {"id": 5, "name": "Pink Summer Blouse", "price": 35.00, "category": "tops", "color": "Pink"},

    {"id": 6, "name": "Blue Straight Jeans", "price": 60.00, "category": "bottoms", "color": "Blue"},
    {"id": 7, "name": "Black Wide-Leg Trousers", "price": 50.00, "category": "bottoms", "color": "Black"},
    {"id": 8, "name": "Beige Shorts", "price": 35.00, "category": "bottoms", "color": "Beige"},
    {"id": 9, "name": "Grey Joggers", "price": 40.00, "category": "bottoms", "color": "Grey"},
    {"id": 10, "name": "White Summer Skirt", "price": 42.00, "category": "bottoms", "color": "White"},

    {"id": 11, "name": "White Sneakers", "price": 75.00, "category": "shoes", "color": "White"},
    {"id": 12, "name": "Black Sneakers", "price": 80.00, "category": "shoes", "color": "Black"},
    {"id": 13, "name": "Brown Boots", "price": 95.00, "category": "shoes", "color": "Brown"},
    {"id": 14, "name": "Beige Sandals", "price": 45.00, "category": "shoes", "color": "Beige"},
    {"id": 15, "name": "Grey Running Shoes", "price": 70.00, "category": "shoes", "color": "Grey"},
]


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/products")
def product_list():
    category = request.args.get("category")

    if category:
        filtered_products = [
            product for product in products
            if product["category"] == category
        ]
    else:
        filtered_products = products

    return render_template(
        "products.html",
        products=filtered_products,
        selected_category=category
    )


@app.route("/products/<int:id>")
def product_detail(id):
    product = next(
        (item for item in products if item["id"] == id),
        None
    )

    if product is None:
        return jsonify({"error": "Product not found"}), 404

    return render_template("product_detail.html", product=product)


@app.route("/studio")
def studio():
    return render_template("studio.html", products=products)


@app.route("/api/outfit-price")
def outfit_price():
    items_parameter = request.args.get("items")

    if not items_parameter:
        return jsonify({"error": "Please provide item IDs"}), 400

    try:
        item_ids = [int(value) for value in items_parameter.split(",")]
    except ValueError:
        return jsonify({"error": "Invalid item IDs"}), 400

    selected_products = []

    for item_id in item_ids:
        product = next(
            (item for item in products if item["id"] == item_id),
            None
        )

        if product is None:
            return jsonify({"error": f"Product {item_id} not found"}), 400

        selected_products.append(product)

    total = sum(item["price"] for item in selected_products)

    return jsonify({
        "items": selected_products,
        "total_price": round(total, 2)
    })


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/version")
def version():
    return jsonify({
        "version": "1.0.0",
        "commit": os.environ.get("GIT_SHA", "dev")
    })


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Page not found"}), 404


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)