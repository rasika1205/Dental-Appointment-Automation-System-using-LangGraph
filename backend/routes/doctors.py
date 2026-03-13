from flask import Flask, Blueprint,jsonify
from dental_agent.database.db import get_connection
doctors_bp = Blueprint("doctors", __name__)

@doctors_bp.route("/api/doctors", methods=["GET"])
def get_doctors():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            id,
            name,
            specialization,
            experience,
            rating,
            total_reviews,
            description,
            available_today
        FROM doctors
    """)

    rows = cursor.fetchall()

    doctors = []
    for row in rows:
        doctors.append({
            "id": row[0],
            "name": row[1],
            "specialization": row[2],
            "experience": row[3],
            "rating": row[4],
            "totalReviews": row[5],
            "description": row[6],
            "image": row[1][:2].upper(),
            "availableToday": row[7]
        })

    conn.close()

    return jsonify(doctors)