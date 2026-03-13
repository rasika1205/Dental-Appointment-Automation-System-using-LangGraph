from langchain_core.tools import tool
from dental_agent.database.db import get_connection
import datetime


@tool
def book_appointment(patient_id: str, doctor_name: str, date_slot: str) -> dict:
    """
        Book an appointment: mark slot as unavailable and assign patient_id.

        Args:
            patient_id: Numeric patient ID string, e.g. '1000082'.
            doctor_name: Doctor name (case-insensitive), e.g. 'emily johnson'.
            date_slot: Slot in M/D/YYYY H:MM format, e.g. '5/10/2026 9:00'.

        Returns:
            Dict with keys: success (bool), message (str).
        """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        target_dt = datetime.datetime.strptime(date_slot, "%m/%d/%Y %H:%M")
    except:
        return {"success": False, "message": "Invalid date format"}

    query = """
    SELECT is_available
    FROM doctor_availability
    WHERE LOWER(doctor_name)=%s AND date_slot=%s
    """

    cursor.execute(query, (doctor_name.lower().strip(), target_dt))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return {"success": False, "message": "Slot not found"}

    if not row[0]:
        conn.close()
        return {"success": False, "message": "Slot already booked"}

    update_query = """
    UPDATE doctor_availability
    SET is_available=FALSE, patient_to_attend=%s
    WHERE LOWER(doctor_name)=%s AND date_slot=%s
    """

    cursor.execute(update_query, (patient_id, doctor_name.lower().strip(), target_dt))
    conn.commit()

    conn.close()

    return {
        "success": True,
        "message": f"Appointment booked for patient {patient_id}"
    }


@tool
def cancel_appointment(patient_id: str, date_slot: str) -> dict:
    """
        Cancel an appointment: mark slot available and clear patient_id.

        Args:
            patient_id: Patient whose appointment to cancel.
            date_slot: Slot in M/D/YYYY H:MM format to cancel.

        Returns:
            Dict with keys: success (bool), message (str).
        """
    conn = get_connection()
    cursor = conn.cursor()

    try:
        target_dt = datetime.datetime.strptime(date_slot, "%m/%d/%Y %H:%M")
    except:
        return {"success": False, "message": "Invalid date format"}

    query = """
    UPDATE doctor_availability
    SET is_available=TRUE, patient_to_attend=NULL
    WHERE patient_to_attend=%s AND date_slot=%s
    """

    cursor.execute(query, (patient_id, target_dt))

    if cursor.rowcount == 0:
        conn.close()
        return {"success": False, "message": "No appointment found"}

    conn.commit()
    conn.close()

    return {"success": True, "message": "Appointment cancelled"}


@tool
def reschedule_appointment(
    patient_id: str,
    current_date_slot: str,
    new_date_slot: str,
    doctor_name: str,
) -> dict:
    """
        Reschedule by cancelling the old slot and booking a new one atomically.

        Args:
            patient_id: Patient whose appointment to reschedule.
            current_date_slot: Existing booked slot to vacate (M/D/YYYY H:MM).
            new_date_slot: Desired new slot (M/D/YYYY H:MM).
            doctor_name: Doctor name (must match the booking's doctor).

        Returns:
            Dict with keys: success (bool), message (str).
        """
    cancel = cancel_appointment.invoke({
        "patient_id": patient_id,
        "date_slot": current_date_slot
    })

    if not cancel["success"]:
        return cancel

    book = book_appointment.invoke({
        "patient_id": patient_id,
        "doctor_name": doctor_name,
        "date_slot": new_date_slot
    })

    return book
