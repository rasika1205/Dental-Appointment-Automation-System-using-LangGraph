import pandas as pd
from langchain_core.tools import tool
from dental_agent.database.db import get_connection
import datetime


@tool
def get_available_slots(
    specialization: str = "",
    doctor_name: str = "",
    date_filter: str = "",
) -> list:
    """
        Return available (is_available=TRUE) appointment slots.

        Args:
            specialization: Filter by specialization, e.g. 'orthodontist'. Leave empty to skip.
            doctor_name: Filter by doctor name (case-insensitive), e.g. 'emily johnson'. Leave empty to skip.
            date_filter: Filter by date string M/D/YYYY, e.g. '5/10/2026'. Leave empty to skip.

        Returns:
            List of dicts with keys: date_slot, specialization, doctor_name.
            Returns at most 20 rows to keep response concise.
        """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT date_slot, specialization, doctor_name
    FROM doctor_availability
    WHERE is_available = TRUE
    """

    params = []

    if specialization:
        query += " AND LOWER(specialization)=%s"
        params.append(specialization.lower().strip())

    if doctor_name:
        query += " AND LOWER(doctor_name)=%s"
        params.append(doctor_name.lower().strip())

    if date_filter:
        try:
            target = datetime.datetime.strptime(date_filter, "%m/%d/%Y").date()
            query += " AND DATE(date_slot)=%s"
            params.append(target)
        except:
            pass

    query += " LIMIT 20"

    cursor.execute(query, params)
    rows = cursor.fetchall()

    for r in rows:
        r["date_slot"] = r["date_slot"].strftime("%m/%d/%Y %H:%M")

    conn.close()
    return rows

@tool
def get_patient_appointments(patient_id: str) -> list:
    """
        Return all booked appointments for a given patient ID.

        Args:
            patient_id: Numeric patient ID string, e.g. '1000082'.

        Returns:
            List of dicts with keys: date_slot, specialization, doctor_name, patient_to_attend.
        """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT date_slot, specialization, doctor_name, patient_to_attend
    FROM doctor_availability
    WHERE patient_to_attend=%s
    """

    cursor.execute(query, (str(patient_id),))
    rows = cursor.fetchall()

    for r in rows:
        r["date_slot"] = r["date_slot"].strftime("%m/%d/%Y %H:%M")

    conn.close()
    return rows


@tool
def check_slot_availability(doctor_name: str, date_slot: str) -> dict:
    """
        Check if a specific doctor slot is available.

        Args:
            doctor_name: Doctor name, e.g. 'emily johnson'.
            date_slot: Slot string in M/D/YYYY H:MM format, e.g. '5/10/2026 9:00'.

        Returns:
            Dict with keys: found (bool), is_available (bool), patient_to_attend (str).
        """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        target_dt = datetime.datetime.strptime(date_slot, "%m/%d/%Y %H:%M")
    except:
        return {"found": False, "is_available": False, "patient_to_attend": ""}

    query = """
    SELECT is_available, patient_to_attend
    FROM doctor_availability
    WHERE LOWER(doctor_name)=%s AND date_slot=%s
    """

    cursor.execute(query, (doctor_name.lower().strip(), target_dt))
    row = cursor.fetchone()

    conn.close()

    if not row:
        return {"found": False, "is_available": False, "patient_to_attend": ""}

    return {
        "found": True,
        "is_available": bool(row["is_available"]),
        "patient_to_attend": row["patient_to_attend"] or "",
    }


@tool
def list_doctors_by_specialization(specialization: str) -> list:
    """
        Return distinct doctor names for a given specialization.

        Args:
            specialization: e.g. 'orthodontist'.

        Returns:
            Sorted list of doctor name strings.
        """
    conn = get_connection()
    cursor = conn.cursor()

    query = """
    SELECT DISTINCT doctor_name
    FROM doctor_availability
    WHERE LOWER(specialization)=%s
    """

    cursor.execute(query, (specialization.lower().strip(),))

    doctors = [r[0] for r in cursor.fetchall()]

    conn.close()

    return sorted(doctors)