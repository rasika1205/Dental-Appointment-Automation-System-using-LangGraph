from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from routes.appointments import appointments_bp

load_dotenv()

from langchain_core.messages import HumanMessage, AIMessageChunk
from dental_agent.agent import dental_graph
from routes.doctors import doctors_bp
from routes.chat import chat_bp
app = Flask(__name__)
CORS(app)

# register routes
app.register_blueprint(doctors_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(appointments_bp)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
