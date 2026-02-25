from dotenv import load_dotenv
load_dotenv()  # 必須在其他 import 之前載入 .env

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import conversations, messages

app = FastAPI(
    title="GAI 聊天系統 API",
    version="1.0.0",
    description="支援多輪對話與 AI 回覆評分的聊天後端",
)

# CORS：允許前端 dev server 存取
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite 預設 port
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversations.router)
app.include_router(messages.router)


@app.get("/health")
def health():
    return {"status": "ok"}
