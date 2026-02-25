from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field, UUID4


# ===== DB 回傳資料結構 =====

class ConversationRow(BaseModel):
    id: UUID4
    title: str
    created_at: datetime
    updated_at: datetime


class MessageRow(BaseModel):
    id: UUID4
    conversation_id: UUID4
    role: Literal["user", "assistant"]
    content: str
    rating: Optional[int] = None
    created_at: datetime


# ===== API 回應格式（含前端需要的計算欄位）=====

class ConversationResponse(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    message_count: int
    last_message: str


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: Literal["user", "assistant"]
    content: str
    rating: Optional[int] = None
    created_at: str


# ===== API 請求格式 =====

class SendMessageRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=4000)


class RateMessageRequest(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)


class CreateConversationRequest(BaseModel):
    title: str = Field(default="新對話", max_length=100)
