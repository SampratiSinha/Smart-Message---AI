from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from datetime import datetime
from data.store import campaigns_store, GENERATED_MESSAGES
from middleware.auth import get_current_user
import uuid

router = APIRouter()

class LaunchRequest(BaseModel):
    audiences: List[str]
    platforms: List[str]
    template: str
    abEnabled: bool = False
    scheduleType: str = "now"
    scheduleTime: str = ""

@router.get("/")
def get_campaigns(user=Depends(get_current_user)):
    return {"campaigns": campaigns_store}

@router.get("/templates")
def get_templates(user=Depends(get_current_user)):
    return {"templates": GENERATED_MESSAGES}

@router.post("/launch")
def launch_campaign(body: LaunchRequest, user=Depends(get_current_user)):
    reach = len(body.audiences) * 1240 + len(body.platforms) * 300

    new_campaign = {
        "id":           str(uuid.uuid4()),
        "icon":         "📡",
        "name":         f"{body.template} — {', '.join(body.audiences)}",
        "platform":     " + ".join(body.platforms),
        "reach":        f"{reach:,}",
        "openRate":     "—",
        "status":       f"Scheduled · {body.scheduleTime[:10]}" if body.scheduleType == "later" else "Live",
        "color":        "var(--orange)" if body.scheduleType == "later" else "var(--green)",
        "abEnabled":    body.abEnabled,
        "scheduleType": body.scheduleType,
        "scheduleTime": body.scheduleTime if body.scheduleType == "later" else None,
        "launchedAt":   datetime.utcnow().isoformat(),
        "launchedBy":   user["name"],
    }

    if body.scheduleType == "later":
        campaigns_store["scheduled"].append(new_campaign)
    else:
        campaigns_store["active"].append(new_campaign)

    return {
        "success": True,
        "campaign": new_campaign,
        "estimatedReach": reach,
        "openRate": "~74%",
        "ctr": "~18%",
        "conversion": "~6%",
    }