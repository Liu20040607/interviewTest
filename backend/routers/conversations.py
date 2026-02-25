from fastapi import APIRouter, HTTPException
from models.chat import (
    ConversationResponse,
    CreateConversationRequest,
)
from services.supabase_service import get_supabase

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


def _format_conversation(row: dict, messages: list[dict]) -> ConversationResponse:
    last_msg = messages[-1]["content"][:50] + "..." if messages else ""
    return ConversationResponse(
        id=str(row["id"]),
        title=row["title"],
        created_at=row["created_at"],
        updated_at=row["updated_at"],
        message_count=len(messages),
        last_message=last_msg,
    )


@router.get("/", response_model=list[ConversationResponse])
def list_conversations():
    """取得所有對話清單（依更新時間降序）"""
    db = get_supabase()

    convs = (
        db.table("conversations")
        .select("*")
        .order("updated_at", desc=True)
        .execute()
        .data
    )

    result = []
    for conv in convs:
        msgs = (
            db.table("messages")
            .select("content")
            .eq("conversation_id", conv["id"])
            .order("created_at")
            .execute()
            .data
        )
        result.append(_format_conversation(conv, msgs))

    return result


@router.post("/", response_model=ConversationResponse, status_code=201)
def create_conversation(body: CreateConversationRequest):
    """建立新對話"""
    db = get_supabase()

    row = (
        db.table("conversations")
        .insert({"title": body.title})
        .execute()
        .data[0]
    )

    return _format_conversation(row, [])


@router.delete("/{conversation_id}", status_code=204)
def delete_conversation(conversation_id: str):
    """刪除對話（訊息會被 CASCADE 刪除）"""
    db = get_supabase()

    result = (
        db.table("conversations")
        .delete()
        .eq("id", conversation_id)
        .execute()
        .data
    )

    if not result:
        raise HTTPException(status_code=404, detail="對話不存在")
