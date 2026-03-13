from flask import Blueprint, jsonify, request
from dental_agent.database.db import get_connection

appointments_bp = Blueprint("appointments", __name__)

PATIENT_ID = 1000049


@appointments_bp.route("/api/appointments", methods=["GET"])
def get_appointments():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            id,
            doctor_name as doctor,
            specialization,
            appointment_date,
            appointment_time,
            appointment_type as type,
            status
        FROM appointments
        WHERE patient_id = %s
        ORDER BY appointment_date DESC
    """, (PATIENT_ID,))

    appointments = cursor.fetchall()
    for apt in appointments:
        apt["appointment_date"] = apt["appointment_date"].strftime("%Y-%m-%d")
        apt["appointment_time"] = str(apt["appointment_time"])

    cursor.close()
    conn.close()

    return jsonify(appointments)

@appointments_bp.route("/api/appointments/<int:appointment_id>/cancel", methods=["POST"])
def cancel_appointment(appointment_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE appointments
        SET status = 'cancelled'
        WHERE id = %s AND patient_id = %s
    """, (appointment_id, PATIENT_ID))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Appointment cancelled"})


@appointments_bp.route("/api/book", methods=["POST"])
def book_slot():

    data = request.json
    slot_id = data.get("slot_id")
    print(data)
    patient_id = "1000049"

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:

        conn.start_transaction()

        cursor.execute("""
        SELECT doctor_name, specialization, date_slot
        FROM doctor_availability
        WHERE slot_id = %s AND is_available = 1
        """, (slot_id,))

        slot = cursor.fetchone()

        if not slot:
            conn.rollback()
            return jsonify({"success": False, "message": "Slot unavailable"}), 400

        cursor.execute("""
        UPDATE doctor_availability
        SET is_available = 0,
            patient_to_attend = %s
        WHERE slot_id = %s
        """, (patient_id, slot_id))

        cursor.execute("""
        INSERT INTO appointments
        (patient_id, doctor_name, specialization, appointment_date, appointment_time)
        VALUES (%s,%s,%s,DATE(%s),TIME(%s))
        """, (
            patient_id,
            slot["doctor_name"],
            slot["specialization"],
            slot["date_slot"],
            slot["date_slot"]
        ))

        conn.commit()

        return jsonify({"success": True})

    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@appointments_bp.route("/api/doctors", methods=["GET"])
def get_doctors():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT slot_id, doctor_name, specialization, date_slot
    FROM doctor_availability
    WHERE is_available = 1
    ORDER BY doctor_name, date_slot
    """

    cursor.execute(query)
    rows = cursor.fetchall()

    doctors = {}

    for row in rows:
        doctor = row["doctor_name"]

        if doctor not in doctors:
            doctors[doctor] = {
                "name": doctor,
                "specialization": row["specialization"],
                "slots": []
            }

        doctors[doctor]["slots"].append({
            "slot_id": row["slot_id"],
            "datetime": row["date_slot"]
        })

    cursor.close()
    conn.close()

    return jsonify(list(doctors.values()))

@appointments_bp.route("/api/slots")
def get_slots():
    doctor = request.args.get("doctor")

    query = """
        SELECT slot_id,
            DATE(date_slot) as date,
            TIME(date_slot) as time
        FROM doctor_availability
        WHERE doctor_name=%s
        AND is_available=1
        ORDER BY date_slot
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, (doctor,))
    rows = cursor.fetchall()

    slots = []

    for row in rows:
        slots.append({
            "slot_id":row["slot_id"],
            "date": str(row["date"]),
            "time": str(row["time"])
        })

    return jsonify({
        "success": True,
        "slots": slots
    })