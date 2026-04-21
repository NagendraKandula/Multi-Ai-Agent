from fastapi import FastAPI, Body
# Add this line at the top of app/main.py
from app.graph.debate_graph import app_graph
import uuid

app = FastAPI()

@app.post("/start")
async def start_simulation(data: dict = Body(...)):
    thread_id = str(uuid.uuid4())

    result = app_graph.invoke({
        "messages": [],
        "round": 1,
        "onboarding_data": data,   # 👈 your Step1–4 data
        "threadId": thread_id
    })

    return {
        "threadId": thread_id
    }
@app.post("/message")
async def message(data: dict):
    result = app_graph.invoke({
        "messages": [data.get("problem")],
        "round": 1,
        "threadId": data.get("threadId"),
        "agents": data.get("agents"),
        "onboarding_data": {}  # optional for now
    })

    return {
        "discussion": [
            {"agent": "CTO", "message": "We should build using scalable tech."},
            {"agent": "CFO", "message": "Keep cost low initially."}
        ],
        "finalDecision": "Start with MVP"
    }