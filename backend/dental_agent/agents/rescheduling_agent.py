from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langgraph.prebuilt import ToolNode

from dental_agent.config.settings import GEMINI_API_KEY, MODEL_NAME, TEMPERATURE
from dental_agent.models.state import AppointmentState
from dental_agent.tools.csv_reader import get_patient_appointments, get_available_slots
from dental_agent.tools.csv_writer import reschedule_appointment
from dental_agent.utils import sanitize_messages


RESCHEDULE_TOOLS = [
    get_patient_appointments,
    get_available_slots,
    reschedule_appointment
]


RESCHEDULE_SYSTEM = """You are the Rescheduling Agent for a dental appointment management system.

Your ONLY job is to move an existing appointment to a new time slot.

## Workflow
1. Collect REQUIRED information:
   - patient_id
   - current_date_slot
   - new_date_slot
   - doctor_name

2. If patient doesn't know current slot → call get_patient_appointments.

3. If patient doesn't know new slot → call get_available_slots.

4. Call reschedule_appointment.

5. Confirm the reschedule clearly (old → new).

## Date Format
M/D/YYYY H:MM
"""


RESCHEDULE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", RESCHEDULE_SYSTEM),
    ("placeholder", "{messages}"),
])


rescheduling_tool_node = ToolNode(tools=RESCHEDULE_TOOLS)


def rescheduling_agent_node(state: AppointmentState) -> dict:

    llm = ChatGoogleGenerativeAI(
        model=MODEL_NAME,
        google_api_key=GEMINI_API_KEY,
        temperature=TEMPERATURE,
    ).bind_tools(RESCHEDULE_TOOLS)

    chain = RESCHEDULE_PROMPT | llm

    response = chain.invoke({
        "messages": sanitize_messages(state["messages"])
    })

    return {
        "messages": [response],
        "final_response": response.content if not response.tool_calls else None,
    }