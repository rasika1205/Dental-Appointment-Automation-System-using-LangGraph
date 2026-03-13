from langchain_xai import ChatXAI
from langchain_core.prompts import ChatPromptTemplate
from langgraph.prebuilt import ToolNode
from dental_agent.config.settings import GEMINI_API_KEY, MODEL_NAME, TEMPERATURE
from dental_agent.models.state import AppointmentState
from dental_agent.tools.csv_reader import get_patient_appointments
from dental_agent.tools.csv_writer import cancel_appointment
from dental_agent.utils import sanitize_messages

from langchain_google_genai import ChatGoogleGenerativeAI


CANCEL_TOOLS = [get_patient_appointments, cancel_appointment]


def cancellation_agent_node(state: AppointmentState) -> dict:

    llm = ChatGoogleGenerativeAI(
        model=MODEL_NAME,
        google_api_key=GEMINI_API_KEY,
        temperature=TEMPERATURE,
    ).bind_tools(CANCEL_TOOLS)

    chain = CANCEL_PROMPT | llm

    response = chain.invoke({
        "messages": sanitize_messages(state["messages"])
    })

    return {
        "messages": [response],
        "final_response": response.content if not response.tool_calls else None,
    }
