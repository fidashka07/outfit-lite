import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from flask import Flask
from app_size_recommendation import register_size_recommendation_route

def make_client():
    app = Flask(__name__)
    register_size_recommendation_route(app)
    app.testing = True
    return app.test_client()

def test_recommends_xs():
    response = make_client().get("/api/size-recommendation?chest=80&waist=62&hips=86")
    assert response.status_code == 200
    assert response.get_json()["size"] == "XS"

def test_recommends_s():
    response = make_client().get("/api/size-recommendation?chest=90&waist=70&hips=95")
    assert response.get_json()["size"] == "S"

def test_recommends_m():
    response = make_client().get("/api/size-recommendation?chest=96&waist=80&hips=100")
    assert response.get_json()["size"] == "M"

def test_recommends_l():
    response = make_client().get("/api/size-recommendation?chest=104&waist=87&hips=110")
    assert response.get_json()["size"] == "L"

def test_recommends_xl():
    response = make_client().get("/api/size-recommendation?chest=112&waist=95&hips=120")
    assert response.get_json()["size"] == "XL"

def test_recommends_xxl():
    response = make_client().get("/api/size-recommendation?chest=125&waist=110&hips=130")
    assert response.get_json()["size"] == "XXL"

def test_inclusive_lower_and_upper_chart_boundaries():
    client = make_client()
    assert client.get("/api/size-recommendation?chest=93&waist=75&hips=99").get_json()["size"] == "M"
    assert client.get("/api/size-recommendation?chest=100&waist=82&hips=106").get_json()["size"] == "M"

def test_missing_parameter_returns_400():
    response = make_client().get("/api/size-recommendation?chest=96&waist=80")
    assert response.status_code == 400
    assert "missing" in response.get_json()["error"].lower()

def test_non_numeric_parameter_returns_400():
    response = make_client().get("/api/size-recommendation?chest=large&waist=80&hips=100")
    assert response.status_code == 400
    assert "number" in response.get_json()["error"].lower()

def test_out_of_range_parameter_returns_400():
    response = make_client().get("/api/size-recommendation?chest=140&waist=80&hips=100")
    assert response.status_code == 400
    assert "between" in response.get_json()["error"].lower()

def test_non_integer_measurement_returns_400():
    response = make_client().get("/api/size-recommendation?chest=96.5&waist=80&hips=100")
    assert response.status_code == 400
