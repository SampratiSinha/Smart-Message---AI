from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routes import auth, message, ai, campaigns, analytics

load_dotenv()

app = FastAPI(title="NexaChat Backend", version="1.0.0")

# ── CORS — allows your React app on port 3000 to call this backend ────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # Update to your deployed frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ROUTES ────────────────────────────────────────────────────────────────────
app.include_router(auth.router,      prefix="/api/auth",      tags=["Auth"])
app.include_router(message.router,  prefix="/api/messages",  tags=["Messages"])
app.include_router(ai.router,        prefix="/api/ai",        tags=["AI"])
app.include_router(campaigns.router, prefix="/api/campaigns", tags=["Campaigns"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"status": "NexaChat Backend Running ✅", "version": "1.0.0"}