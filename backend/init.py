import pandas as pd
import mysql.connector

df = pd.read_csv(r"C:\Users\rasik\Downloads\Dental-Appointment-System-using-LangGraph\backend\doctor_availability.csv")

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="1234",
    database="dental_system"
)

cursor = conn.cursor()

for _, row in df.iterrows():
    cursor.execute(
        """
        INSERT INTO doctor_availability 
        (date_slot, specialization, doctor_name, is_available, patient_to_attend)
        VALUES (%s,%s,%s,%s,%s)
        """,
        (
            row["date_slot"],
            row["specialization"],
            row["doctor_name"],
            row["is_available"],
            row["patient_to_attend"]
        )
    )

conn.commit()

print("CSV imported successfully!")