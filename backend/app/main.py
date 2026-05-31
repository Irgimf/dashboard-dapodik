import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, dashboard, map, users, sync

app = FastAPI(title="Dashboard Backbone Dapodik API")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://dashboard-dapodik.vercel.app",
    os.getenv("FRONTEND_URL", ""),
]

# Hapus string kosong dari list
origins = [o for o in origins if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(map.router, prefix="/api/map", tags=["Map"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(sync.router, prefix="/api/sync", tags=["Sync"])

@app.get("/")
def root():
    return {"message": "Dashboard Backbone Dapodik API is running"}