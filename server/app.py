from flask import Flask, jsonify, request, g
import google.generativeai as genai
from functions.question_generation import generate_questions

# from functions.emotion_analysis import analyze_fun
from functions.review_generation import gen_review
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
from config.database import get_db
from models.models import User, Interview
from sqlalchemy import exc
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

load_dotenv()  # Loads the variables from the .env file
gemini_api_key = ""

# Initialize the Generative AI model and chat session globally
genai.configure(api_key=gemini_api_key)

model = genai.GenerativeModel(model_name="gemini-1.5-flash")


@app.before_request
def before_request():
    g.model = model
    g.db = next(get_db())


@app.teardown_appcontext
def teardown_db(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()


@app.route("/")
def home():
    return "Weclome to Mock-Interview-System/Server", 200


@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"status": 404, "message": "Not Found"}), 404


@app.route("/api/get-questions", methods=["POST"])
def ask_questions():
    try:
        data = request.get_json()
        job_role = data["job_role"]
        experience_lvl = data["experience_lvl"]
        response = generate_questions(job_role, experience_lvl)

        # if not list then error
        if not isinstance(response, list):
            return jsonify({"errorMsg": response}), 400
        else:  # success
            return (
                jsonify(
                    {
                        "job_role": job_role,
                        "exp_level": experience_lvl,
                        "qtns": response,
                    }
                ),
                200,
            )
    except Exception as e:
        print(f"Error occurred while generating question: {e}")
        return jsonify({"errorMsg": "Something went wrong"}), 400


@app.route("/api/get-review", methods=["POST"])
def get_review():
    try:
        data = request.get_json()
        job_role = data["job_role"]
        qns = data["qns"]
        ans = data["ans"]
        emotion = data["emotion"]
        suspiciousCount = data["suspiciousCount"]
        user_id = data["userId"]  # Get userId from request

        # get review
        review = gen_review(job_role, qns, ans, emotion, suspiciousCount)

        # Store interview data in database
        new_interview = Interview(user_id=user_id, applying_for=job_role, result=review)
        g.db.add(new_interview)
        g.db.commit()

        return jsonify({"review": review})
    except Exception as e:
        print(f"Error occurred while generating review: {e}")
        g.db.rollback()  # Rollback on error
        return jsonify({"errorMsg": "Something went wrong"}), 400


# Emotion analysis using backend, not used anymore
# @app.route('/api/analyze-emotions', methods=['POST'])
# def analyze_emotions():
#     try:
#         data = request.get_json()
#         frames = data['frames']
#         response = analyze_fun(frames)

#         return jsonify({'response': response})
#     except Exception as e:
#         print(f"Error occurred while generating emotion analysis data: {e}")
#         return jsonify({'errorMsg': "Something went wrong"}), 400


# Not used anymore since emotion analysis done in front end itself
# @app.route('/api/get-review-old', methods=['POST'])
# def get_review_old():
#     try:
#         data = request.get_json()
#         job_role = data['job_role']
#         # experience_lvl = data['experience_lvl']
#         qns = data['qns']
#         ans = data['ans']
#         frames = data['frames']

#         # get emotion analysis
#         emotion = analyze_fun(frames)

#         # get review
#         review = gen_review(job_role,qns,ans,emotion)

#         return jsonify({'response': review})
#     except Exception as e:
#         print(f"Error occurred while generating review: {e}")
#         return jsonify({'errorMsg': "Something went wrong"}), 400


@app.route("/api/signin", methods=["POST"])
def signin():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Check if user exists
        existing_user = g.db.query(User).filter(User.email == email).first()

        if not existing_user:
            return jsonify({"error": "Email not found. Please sign up first"}), 404

        # Verify password
        if check_password_hash(existing_user.password, password):
            return (
                jsonify(
                    {
                        "message": "Login successful",
                        "user": {
                            "id": existing_user.id,
                            "email": existing_user.email,
                            "first_name": existing_user.first_name,
                            "last_name": existing_user.last_name,
                            "role": existing_user.role,
                        },
                    }
                ),
                200,
            )
        else:
            return jsonify({"error": "Invalid password"}), 401

    except Exception as e:
        print(f"Error in signin: {e}")
        return jsonify({"error": "Something went wrong"}), 500


@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        phone = data.get("phone")

        # Validate required fields
        if not all([email, password, first_name, last_name, phone]):
            return jsonify({"error": "All fields are required"}), 400

        # Check if user already exists
        if g.db.query(User).filter(User.email == email).first():
            return jsonify({"error": "Email already registered"}), 409

        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(
            email=email,
            password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            phone=phone,
            role="employee",
        )

        g.db.add(new_user)
        g.db.commit()

        return (
            jsonify(
                {
                    "message": "User registered successfully",
                    "user": {
                        "id": new_user.id,
                        "email": new_user.email,
                        "first_name": new_user.first_name,
                        "last_name": new_user.last_name,
                        "role": new_user.role,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        print(f"Error in signup: {e}")
        g.db.rollback()
        return jsonify({"error": "Something went wrong"}), 500


@app.route("/api/admin/interviews", methods=["GET"])
def list_interviews():
    try:
        interviews = (
            g.db.query(Interview).join(User).order_by(Interview.created_at.desc()).all()
        )
        return jsonify(
            {
                "interviews": [
                    {
                        "id": interview.id,
                        "created_at": interview.created_at,
                        "applying_for": interview.applying_for,
                        "user": {
                            "email": interview.user.email,
                            "first_name": interview.user.first_name,
                            "last_name": interview.user.last_name,
                            "phone": interview.user.phone,
                        },
                    }
                    for interview in interviews
                ]
            }
        )
    except Exception as e:
        print(f"Error fetching interviews: {e}")
        return jsonify({"error": "Failed to fetch interviews"}), 500


@app.route("/api/admin/interviews/<int:id>", methods=["GET"])
def get_interview(id):
    try:
        interview = g.db.query(Interview).join(User).filter(Interview.id == id).first()
        if not interview:
            return jsonify({"error": "Interview not found"}), 404

        return jsonify(
            {
                "interview": {
                    "id": interview.id,
                    "created_at": interview.created_at,
                    "applying_for": interview.applying_for,
                    "result": interview.result,
                    "user": {"email": interview.user.email},
                }
            }
        )
    except Exception as e:
        print(f"Error fetching interview: {e}")
        return jsonify({"error": "Failed to fetch interview"}), 500


if __name__ == "__main__":
    app.run(debug=True)
