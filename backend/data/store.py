# Mirrors your frontend data exactly

DEMO_USERS = [
    {"id": 1, "name": "Samprati", "email": "demo@nexachat.com", "password": "123456", "role": "admin", "dept": "IT"},
    {"id": "u1", "email": "agent@nexachat.io", "password": "demo123", "role": "Agent", "name": "Diya Ramesh",  "dept": "Customer Success"},
    {"id": "u2", "email": "admin@nexachat.io", "password": "demo123", "role": "Admin", "name": "Arjun Sharma", "dept": "Operations"},
]

CONVERSATIONS = [
    {"id": 1, "name": "Priya Sharma",   "initials": "PS", "color": "#f472b6", "bg": "rgba(244,114,182,0.15)", "platform": "whatsapp",  "platformIcon": "💬", "platformColor": "#25d366", "platformBg": "rgba(37,211,102,0.1)",  "preview": "Thanks! Is there a discount for the sneakers?", "time": "2m",  "unread": True,  "score": 87, "tier": "Gold",   "tierColor": "#fbbf24", "tierBg": "rgba(251,191,36,0.15)",   "ltv": "₹24,800", "orders": 12, "intent": 87, "intentLabel": "Purchase Intent",  "tags": [{"label": "Urgent", "bg": "rgba(239,68,68,0.15)", "color": "#f87171"}, {"label": "VIP", "bg": "rgba(251,191,36,0.15)", "color": "#fbbf24"}]},
    {"id": 2, "name": "Rohan Mehta",    "initials": "RM", "color": "#38bdf8", "bg": "rgba(56,189,248,0.15)",  "platform": "instagram", "platformIcon": "📸", "platformColor": "#e1306c", "platformBg": "rgba(225,48,108,0.1)", "preview": "Seen this jacket on your page. Available?",     "time": "8m",  "unread": True,  "score": 62, "tier": "Silver", "tierColor": "#94a3b8", "tierBg": "rgba(148,163,184,0.15)", "ltv": "₹9,200",  "orders": 5,  "intent": 62, "intentLabel": "Browse Intent",   "tags": [{"label": "Browse", "bg": "rgba(167,139,250,0.15)", "color": "#a78bfa"}]},
    {"id": 3, "name": "Anita Krishnan", "initials": "AK", "color": "#34d399", "bg": "rgba(52,211,153,0.15)",  "platform": "sms",       "platformIcon": "✉️", "platformColor": "#94a3b8", "platformBg": "rgba(148,163,184,0.1)", "preview": "Order #2847 — when does it arrive?",            "time": "22m", "unread": False, "score": 45, "tier": "New",    "tierColor": "#a78bfa", "tierBg": "rgba(167,139,250,0.15)", "ltv": "₹3,100",  "orders": 1,  "intent": 45, "intentLabel": "Support Intent",  "tags": [{"label": "Support", "bg": "rgba(56,189,248,0.15)", "color": "#38bdf8"}]},
    {"id": 4, "name": "Kiran Nair",     "initials": "KN", "color": "#fb923c", "bg": "rgba(251,146,60,0.15)",  "platform": "whatsapp",  "platformIcon": "💬", "platformColor": "#25d366", "platformBg": "rgba(37,211,102,0.1)",  "preview": "I abandoned my cart, any discount?",            "time": "1h",  "unread": False, "score": 78, "tier": "Gold",   "tierColor": "#fbbf24", "tierBg": "rgba(251,191,36,0.15)",  "ltv": "₹18,400", "orders": 9,  "intent": 78, "intentLabel": "Re-Engage Intent", "tags": [{"label": "Cart", "bg": "rgba(251,146,60,0.15)", "color": "#fb923c"}]},
]

MESSAGES_BY_ID = {
    1: [
        {"id": 1, "role": "user",  "text": "Hey! I saw the Air Max 270 on your site. Still in stock?", "time": "10:21"},
        {"id": 2, "role": "agent", "text": "Hi Priya! 👋 Yes, the Air Max 270 is available in sizes 5–9. You've been eyeing our sneakers for a while — great taste! 🔥", "time": "10:21", "ai": True, "read": True},
        {"id": 3, "role": "user",  "text": "I want the white/coral in size 6. But ₹8,499 feels a bit steep 😅", "time": "10:23"},
        {"id": 4, "role": "agent", "text": "As a Gold member, you're eligible for our exclusive 12% loyalty discount! That brings it to ₹7,479 — plus free express delivery 🎁. Want me to reserve your size?", "time": "10:23", "ai": True, "read": True},
        {"id": 5, "role": "user",  "text": "Thanks! Is there a discount for the sneakers?", "time": "10:24"},
    ],
    2: [
        {"id": 1, "role": "user",  "text": "Seen this jacket on your IG page. Still available in L?", "time": "09:55"},
        {"id": 2, "role": "agent", "text": "Hey Rohan! 🙌 That's the Quilted Bomber in Olive — size L is available. Only 3 left in stock!", "time": "09:55", "ai": True, "read": False},
        {"id": 3, "role": "user",  "text": "Seen this jacket on your page. Available?", "time": "09:58"},
    ],
    3: [
        {"id": 1, "role": "user",  "text": "Order #2847 — when does it arrive?", "time": "08:10"},
        {"id": 2, "role": "agent", "text": "Hi Anita! 📦 Your order is out for delivery today and expected between 2–5 PM. Here's your live tracking: track.nexachat.io/2847", "time": "08:11", "ai": True, "read": True},
    ],
    4: [
        {"id": 1, "role": "agent", "text": "Hey Kiran! 👋 Noticed you left the Leather Derby Shoes in your cart. Just checking — need any help completing your order?", "time": "Yesterday", "ai": True, "read": True},
        {"id": 2, "role": "user",  "text": "I abandoned my cart, any discount?", "time": "07:40"},
        {"id": 3, "role": "agent", "text": "Of course! Since you're a valued Gold member, here's a one-time 10% cart rescue code: KIRAN10 🎉 Valid for next 2 hours!", "time": "07:40", "ai": True, "read": False},
    ],
}

SIGNALS_BY_ID = {
    1: [{"icon": "👟", "text": "Viewed Air Max 270 — 3 times in 2 days", "time": "2h ago"}, {"icon": "🛒", "text": "Added to cart, didn't checkout", "time": "5h ago"}, {"icon": "⭐", "text": "Left 5★ review last month", "time": "30d ago"}, {"icon": "🔄", "text": "Opened last 3 WhatsApp messages", "time": "3d ago"}],
    2: [{"icon": "📸", "text": "Engaged with 5 posts this week", "time": "1d ago"}, {"icon": "🔍", "text": "Searched 'bomber jacket men'", "time": "3h ago"}, {"icon": "💬", "text": "First inquiry via Instagram DM", "time": "Now"}],
    3: [{"icon": "📦", "text": "Order #2847 shipped yesterday", "time": "1d ago"}, {"icon": "📱", "text": "SMS open rate: 95%", "time": "Always"}, {"icon": "🆕", "text": "First purchase — new customer", "time": "2d ago"}],
    4: [{"icon": "🛒", "text": "Cart abandoned 18 hours ago", "time": "18h ago"}, {"icon": "💰", "text": "Cart value: ₹4,299", "time": "18h ago"}, {"icon": "👁️", "text": "Returned to cart page twice", "time": "10h ago"}, {"icon": "🏆", "text": "Gold member since Jan 2023", "time": ""}],
}

AI_SUGGESTIONS_BY_ID = {
    1: ["Offer loyalty discount 🎁", "Check size availability", "Share style guide", "Apply flash offer ⚡"],
    2: ["Confirm stock availability", "Suggest similar styles", "Share lookbook link", "Offer try-at-home"],
    3: ["Share tracking link 📦", "Estimate delivery time", "Offer post-delivery review"],
    4: ["Send rescue coupon 🎫", "Highlight urgency ⏰", "Suggest bundle deal", "Offer EMI option"],
}

GENERATED_MESSAGES = {
    "Cart Recovery":   "Hey {name}! 🛒 You left something behind — your {product} is almost gone! Use code SAVE10 for 10% off in the next 2 hours. Tap to complete: nexachat.io/cart",
    "Loyalty Reward":  "Hi {name}! 🌟 Your {tier} loyalty reward is ready — enjoy exclusive 15% off your next order + free shipping! Valid this weekend only.",
    "Back in Stock":   "Great news, {name}! ✨ The {product} you wanted is back in stock. Sizes are filling up fast — grab yours now before it's gone!",
    "Reengagement":    "We miss you, {name}! 👋 It's been a while. Here's a special 'welcome back' surprise — 20% off storewide. Let's shop! 🛍️",
    "Flash Sale":      "⚡ Flash Sale LIVE! {name}, 40% off everything for the next 3 hours. Our top picks based on your style: running shoes & joggers. Shop now!",
}

# Runtime in-memory message store (new messages sent this session)
import copy
runtime_messages = copy.deepcopy(MESSAGES_BY_ID)

# Runtime campaigns store
campaigns_store = {
    "active": [
        {"id": "c1", "icon": "🛒", "name": "Cart Recovery — Gold Members", "platform": "WhatsApp",           "reach": "2,140",  "openRate": "68%", "status": "Live",              "color": "var(--green)"},
        {"id": "c2", "icon": "⚡", "name": "Flash Sale — All Users",        "platform": "WhatsApp + Instagram","reach": "8,320",  "openRate": "74%", "status": "Live",              "color": "var(--green)"},
    ],
    "scheduled": [
        {"id": "c3", "icon": "🌟", "name": "Loyalty Reward — Tier Upgrade", "platform": "WhatsApp",           "reach": "~1,200", "openRate": "—",   "status": "Scheduled · Apr 10","color": "var(--orange)", "sched": "Apr 10, 10:00 AM"},
        {"id": "c4", "icon": "📦", "name": "Back-in-Stock Alert — Wishlist","platform": "SMS + Instagram",     "reach": "~3,800", "openRate": "—",   "status": "Scheduled · Apr 12","color": "var(--orange)", "sched": "Apr 12, 9:00 AM"},
    ],
    "completed": [
        {"id": "c5", "icon": "👋", "name": "Re-engagement — Inactive 30d",  "platform": "WhatsApp",           "reach": "1,980",  "openRate": "61%", "status": "Completed",         "color": "var(--text-dim)"},
        {"id": "c6", "icon": "🎁", "name": "Diwali Flash Sale",              "platform": "All Channels",       "reach": "14,200", "openRate": "81%", "status": "Completed",         "color": "var(--text-dim)"},
    ],
}