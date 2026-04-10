from data.store import DEMO_USERS
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from data.store import CONVERSATIONS, SIGNALS_BY_ID, AI_SUGGESTIONS_BY_ID, runtime_messages
from middleware.auth import get_current_user

router = APIRouter()

class SendMessageRequest(BaseModel):
    text: str

@router.get("/conversations")
def get_conversations(user=Depends(get_current_user)):
    return {"conversations": CONVERSATIONS}

@router.get("/conversations/{conv_id}")
def get_conversation(conv_id: int, user=Depends(get_current_user)):
    conv = next((c for c in CONVERSATIONS if c["id"] == conv_id), None)
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    return {"conversation": conv}

@router.get("/{conv_id}/chat")
def get_chat(conv_id: int, user=Depends(get_current_user)):
    msgs = runtime_messages.get(conv_id, [])
    return {"messages": msgs}

@router.post("/{conv_id}/send")
def send_message(conv_id: int, body: SendMessageRequest, user=Depends(get_current_user)):
    if not body.text.strip():
        raise HTTPException(status_code=400, detail="Message text is required.")

    now = datetime.now().strftime("%I:%M %p")
    agent_msg = {
        "id":   int(datetime.now().timestamp() * 1000),
        "role": "agent",
        "text": body.text.strip(),
        "time": now,
        "ai":   False,
        "read": False,
    }

    if conv_id not in runtime_messages:
        runtime_messages[conv_id] = []
    runtime_messages[conv_id].append(agent_msg)

    # Note: auto-reply simulation is handled client-side (setTimeout in React)
    # For real-time replies, use WebSockets (FastAPI supports them natively)
    return {"success": True, "message": agent_msg}

@router.get("/{conv_id}/signals")
def get_signals(conv_id: int, user=Depends(get_current_user)):
    return {"signals": SIGNALS_BY_ID.get(conv_id, [])}

@router.get("/{conv_id}/suggestions")
def get_suggestions(conv_id: int, user=Depends(get_current_user)):
    return {"suggestions": AI_SUGGESTIONS_BY_ID.get(conv_id, [])}