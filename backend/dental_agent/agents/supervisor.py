from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from dental_agent.config.settings import GEMINI_API_KEY, MODEL_NAME, TEMPERATURE
from dental_agent.models.state import AppointmentState, RouteTarget
from dental_agent.utils import sanitize_messages


class SupervisorDecision(BaseModel):
    intent: str = Field(
        description="One of: get_info, book, cancel, reschedule, unknown, end."
    )
    next_agent: RouteTarget = Field(
        description="Routing target: info_agent, booking_agent, cancellation_agent, rescheduling_agent, end."
    )
    reasoning: str = Field(
        description="Brief explanation of routing decision."
    )


SUPERVISOR_SYSTEM = """You are the supervisor and router for a dental appointment system.

Your ONLY job is to classify the user intent and route to the correct agent.

## Routing Rules

get_info → info_agent
book → booking_agent
cancel → cancellation_agent
reschedule → rescheduling_agent
end → end
unknown → info_agent

Do NOT answer the user directly.

Output ONLY JSON matching the schema.
"""


SUPERVISOR_PROMPT = ChatPromptTemplate.from_messages([
    ("system", SUPERVISOR_SYSTEM),
    ("placeholder", "{messages}"),
])


def supervisor_node(state: AppointmentState) -> dict:

    llm = ChatGoogleGenerativeAI(
        model=MODEL_NAME,
        google_api_key=GEMINI_API_KEY,
        temperature=TEMPERATURE,
    ).with_structured_output(SupervisorDecision)

    chain = SUPERVISOR_PROMPT | llm

    decision: SupervisorDecision = chain.invoke({
        "messages": sanitize_messages(state["messages"])
    })

    return {
        "intent": decision.intent,
        "next_agent": decision.next_agent,
    }
