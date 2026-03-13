import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # project root

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")
TEMPERATURE = float(os.getenv("TEMPERATURE"))

VALID_SPECIALIZATIONS = [
    "general_dentist",
    "oral_surgeon",
    "orthodontist",
    "cosmetic_dentist",
    "prosthodontist",
    "pediatric_dentist",
    "emergency_dentist",
]

VALID_DOCTORS = [
    "john doe",
    "emily johnson",
    "sarah wilson",
    "jane smith",
    "michael green",
    "robert martinez",
    "lisa brown",
    "susan davis",
    "daniel miller",
    "kevin anderson",
]

DATE_FORMAT = "%m/%d/%Y %H:%M"
