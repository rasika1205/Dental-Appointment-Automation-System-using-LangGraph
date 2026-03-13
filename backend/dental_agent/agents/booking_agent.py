from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langgraph.prebuilt import ToolNode

from dental_agent.config.settings import GEMINI_API_KEY, MODEL_NAME, TEMPERATURE
from dental_agent.models.state import AppointmentState
from dental_agent.tools.csv_reader import get_available_slots, check_slot_availability
from dental_agent.tools.csv_writer import book_appointment
from dental_agent.utils import sanitize_messages


BOOKING_TOOLS = [get_available_slots, check_slot_availability, book_appointment]


BOOKING_SYSTEM = """You are the Booking Agent for a dental appointment management system.

Your ONLY job is to book NEW appointments for patients.

## Workflow
1. Collect REQUIRED information (ask if missing):
   - patient_id
   - specialization
   - doctor_name
   - date_slot

2. Call check_slot_availability first.

3. If unavailable → call get_available_slots.

4. If available → call book_appointment.

## Date Format
M/D/YYYY H:MM
"""


BOOKING_PROMPT = ChatPromptTemplate.from_messages([
    ("system", BOOKING_SYSTEM),
    ("placeholder", "{messages}"),
])


booking_tool_node = ToolNode(tools=BOOKING_TOOLS)


def booking_agent_node(state: AppointmentState) -> dict:

    llm = ChatGoogleGenerativeAI(
        model=MODEL_NAME,
        google_api_key=GEMINI_API_KEY,
        temperature=TEMPERATURE,
    ).bind_tools(BOOKING_TOOLS)

    chain = BOOKING_PROMPT | llm

    response = chain.invoke({
        "messages": sanitize_messages(state["messages"])
    })

    return {
        "messages": [response],
        "final_response": response.content if not response.tool_calls else None,
    }
