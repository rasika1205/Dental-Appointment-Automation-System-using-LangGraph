from flask import Blueprint, request, jsonify
from langchain_core.messages import HumanMessage,AIMessage, AIMessageChunk
from dental_agent.agent import dental_graph

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        user_message = data.get("message")
        history = data.get("history", [])

        if not user_message:
            return jsonify({"error": "Message required"}), 400

        messages = []

        # rebuild conversation
        for msg in history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                messages.append(AIMessage(content=msg["content"]))

        # append new user message
        messages.append(HumanMessage(content=user_message))

        agent_reply = ""
        final_messages = None

        for event_type, data in dental_graph.stream(
                {"messages": messages},
                stream_mode=["messages", "values"],
                config={"recursion_limit": 20},
        ):

            if event_type == "messages":
                chunk, meta = data

                if (
                        isinstance(chunk, AIMessageChunk)
                        and chunk.content
                        and not getattr(chunk, "tool_calls", None)
                ):

                    content = chunk.content

                    if isinstance(content, list):
                        for block in content:
                            if isinstance(block, dict) and block.get("type") == "text":
                                agent_reply += block.get("text", "")
                    else:
                        agent_reply += str(content)

            elif event_type == "values":
                final_messages = data.get("messages", [])

        # convert messages to frontend format
        response_history = []

        if final_messages:
            for msg in final_messages:
                if isinstance(msg, HumanMessage):
                    response_history.append({
                        "role": "user",
                        "content": msg.content
                    })

                elif isinstance(msg, AIMessage):
                    response_history.append({
                        "role": "assistant",
                        "content": msg.content
                    })

        return jsonify({
            "response": agent_reply,
            "history": response_history
        })

    except Exception as e:
        print("CHAT ERROR:", e)  # 👈 shows real error in terminal
        return jsonify({"error": str(e)}), 500