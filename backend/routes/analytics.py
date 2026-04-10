from fastapi import APIRouter, Depends
from middleware.auth import get_current_user

router = APIRouter()

MSG_VOLS = {
    "Today": [0, 0, 0, 0, 0, 0, 1284],
    "7d":    [820, 1140, 960, 1380, 1280, 740, 620],
    "30d":   [600,820,1140,960,1380,1280,740,620,900,1100,850,970,1200,880,760,1050,1300,940,820,680,1100,1250,870,990,1140,750,630,1020,1180,900],
}

@router.get("/")
def get_analytics(range: str = "7d", user=Depends(get_current_user)):
    return {
        "kpis": [
            {"label": "Messages Sent", "val": "1,284", "delta": "+12%", "color": "var(--cyan)",   "up": True},
            {"label": "Open Rate",     "val": "74%",   "delta": "+3%",  "color": "var(--green)",  "up": True},
            {"label": "Conversions",   "val": "68",    "delta": "+22%", "color": "var(--orange)", "up": True},
            {"label": "Avg. Response", "val": "18s",   "delta": "−4s",  "color": "var(--purple)", "up": True},
            {"label": "CSAT Score",    "val": "4.7★",  "delta": "+0.2", "color": "#fbbf24",       "up": True},
        ],
        "msgVols":  MSG_VOLS.get(range, MSG_VOLS["7d"]),
        "funnel": [
            {"label": "Delivered",  "val": 1284, "pct": 100, "color": "var(--cyan)"  },
            {"label": "Opened",     "val": 950,  "pct": 74,  "color": "var(--green)" },
            {"label": "Clicked",    "val": 410,  "pct": 32,  "color": "var(--orange)"},
            {"label": "Converted",  "val": 68,   "pct": 5.3, "color": "var(--purple)"},
        ],
        "channels": [
            {"name": "WhatsApp",  "pct": 48, "color": "var(--green)"},
            {"name": "Instagram", "pct": 31, "color": "var(--pink)" },
            {"name": "SMS",       "pct": 21, "color": "var(--purple)"},
        ],
        "agents": [
            {"name": "Diya R.",  "msgs": 342, "resp": 14, "cvr": 8.2, "status": "Online" },
            {"name": "Arjun S.", "msgs": 289, "resp": 19, "cvr": 6.8, "status": "Online" },
            {"name": "Meera P.", "msgs": 261, "resp": 22, "cvr": 5.9, "status": "Away"   },
            {"name": "Kabir T.", "msgs": 198, "resp": 28, "cvr": 4.1, "status": "Offline"},
        ],
    }