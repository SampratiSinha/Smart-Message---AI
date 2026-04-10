from fastapi import APIRouter, Depends
from pydantic import BaseModel
from openai import OpenAI
from data.store import CONVERSATIONS, GENERATED_MESSAGES, AI_SUGGESTIONS_BY_ID
from middleware.auth import get_current_user
from dotenv import load_dotenv
import os, json

load_dotenv()   # ← load .env FIRST before anything else
router = APIRouter()

# ── Create client lazily inside functions, NOT at module level ────────────────
def get_openai_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

class GenerateRequest(BaseModel):
    trigger: str
    convId: int

class SuggestionsRequest(BaseModel):
    lastMessage: str
    convId: int

def _fallback_message(trigger: str, conv: dict) -> str:
    first_name = conv["name"].split()[0] if conv else "there"
    tier = conv.get("tier", "valued") if conv else "valued"
    tpl = GENERATED_MESSAGES.get(trigger, "")
    return tpl.replace("{name}", first_name).replace("{product}", "your favourited item").replace("{tier}", tier)

@router.post("/generate")
async def generate_message(body: GenerateRequest, user=Depends(get_current_user)):
    conv = next((c for c in CONVERSATIONS if c["id"] == body.convId), None)
    api_key = os.getenv("OPENAI_API_KEY", "")

    if not api_key or api_key == "your_openai_api_key_here":
        return {"message": _fallback_message(body.trigger, conv), "source": "template"}

    try:
        client = get_openai_client()   # ← created here, not at import time
        first_name = conv["name"].split()[0] if conv else "there"
        tier   = conv.get("tier", "regular") if conv else "regular"
        intent = conv.get("intentLabel", "") if conv else ""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are NexaChat's AI message writer for an Indian e-commerce brand. Write short, warm, personalised WhatsApp-style messages (max 2 sentences + emoji). Never use placeholders. Use actual customer data. Be casual, friendly and persuasive. No markdown."},
                {"role": "user",   "content": f'Write a "{body.trigger}" message for:\n- Customer name: {first_name}\n- Tier: {tier} member\n- Intent: {intent}\n- Platform: {conv.get("platform", "WhatsApp") if conv else "WhatsApp"}'},
            ],
            max_tokens=150,
            temperature=0.75,
        )
        return {"message": response.choices[0].message.content.strip(), "source": "openai"}

    except Exception as e:
        print(f"OpenAI error: {e}")
        return {"message": _fallback_message(body.trigger, conv), "source": "template_fallback"}

@router.post("/suggestions")
async def get_ai_suggestions(body: SuggestionsRequest, user=Depends(get_current_user)):
    conv    = next((c for c in CONVERSATIONS if c["id"] == body.convId), None)
    api_key = os.getenv("OPENAI_API_KEY", "")

    if not api_key or api_key == "your_openai_api_key_here":
        return {"suggestions": AI_SUGGESTIONS_BY_ID.get(body.convId, [])}

    try:
        client = get_openai_client()   # ← created here too
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an e-commerce support AI. Return exactly 4 short action labels (max 5 words each). Return only a valid JSON array of strings, nothing else."},
                {"role": "user",   "content": f'Customer message: "{body.lastMessage}". Tier: {conv.get("tier", "regular") if conv else "regular"}. Return JSON array only.'},
            ],
            max_tokens=80,
            temperature=0.5,
        )
        raw = response.choices[0].message.content.strip()
        return {"suggestions": json.loads(raw)}

    except Exception as e:
        print(f"Suggestions error: {e}")
        return {"suggestions": AI_SUGGESTIONS_BY_ID.get(body.convId, [])}