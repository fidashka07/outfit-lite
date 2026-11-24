"""Small, deterministic size recommendation service."""

SIZE_CHART = {
    "XS": {"chest": (76, 84), "waist": (58, 66), "hips": (82, 90)},
    "S":  {"chest": (85, 92), "waist": (67, 74), "hips": (91, 98)},
    "M":  {"chest": (93, 100), "waist": (75, 82), "hips": (99, 106)},
    "L":  {"chest": (101, 108), "waist": (83, 90), "hips": (107, 114)},
    "XL": {"chest": (109, 116), "waist": (91, 100), "hips": (115, 124)},
    "XXL":{"chest": (117, 130), "waist": (101, 120), "hips": (125, 135)},
}

INPUT_RANGES = {
    "chest": (70, 130),
    "waist": (55, 120),
    "hips": (75, 135),
}

def recommend_size(measurements):
    """Return the largest size needed across chest, waist and hips."""
    required_sizes = []
    details = {}

    for measurement, value in measurements.items():
        matching = [
            size for size, chart in SIZE_CHART.items()
            if chart[measurement][0] <= value <= chart[measurement][1]
        ]
        if not matching:
            # Measurements in chart gaps are conservatively assigned upward.
            matching = [
                size for size, chart in SIZE_CHART.items()
                if value < chart[measurement][0]
            ]
            chosen = matching[0] if matching else "XXL"
        else:
            chosen = matching[0]
        required_sizes.append(chosen)
        details[measurement] = {
            "value_cm": value,
            "size": chosen,
            "chart_range_cm": list(SIZE_CHART[chosen][measurement]),
        }

    size_order = list(SIZE_CHART)
    recommended = max(required_sizes, key=size_order.index)
    return {"size": recommended, "details": details}

def register_size_recommendation_route(app):
    from flask import jsonify, request

    @app.route("/api/size-recommendation")
    def size_recommendation():
        measurements = {}
        for name, (minimum, maximum) in INPUT_RANGES.items():
            raw_value = request.args.get(name)
            if raw_value is None or raw_value.strip() == "":
                return jsonify({"error": f"Missing required parameter: {name}"}), 400
            try:
                value = float(raw_value)
            except (TypeError, ValueError):
                return jsonify({"error": f"{name} must be a number"}), 400
            if not value.is_integer():
                return jsonify({"error": f"{name} must be a whole number"}), 400
            value = int(value)
            if not minimum <= value <= maximum:
                return jsonify({
                    "error": f"{name} must be between {minimum} and {maximum} cm"
                }), 400
            measurements[name] = value

        return jsonify(recommend_size(measurements))
