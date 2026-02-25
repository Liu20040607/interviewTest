from fastapi import APIRouter, HTTPException
from models.chat import (
    MessageResponse,
    SendMessageRequest,
    RateMessageRequest,
)
from services.supabase_service import get_supabase
from services.ai_service import generate_reply

router = APIRouter(prefix="/api/conversations", tags=["messages"])


def _format_message(row: dict) -> MessageResponse:
    return MessageResponse(
        id=str(row["id"]),
        conversation_id=str(row["conversation_id"]),
        role=row["role"],
        content=row["content"],
        rating=row.get("rating"),
        created_at=row["created_at"],
    )


@router.get("/{conversation_id}/messages", response_model=list[MessageResponse])
def get_messages(conversation_id: str):
    """取得指定對話的所有訊息"""
    db = get_supabase()

    # 確認對話存在
    conv = (
        db.table("conversations")
        .select("id")
        .eq("id", conversation_id)
        .execute()
        .data
    )
    if not conv:
        raise HTTPException(status_code=404, detail="對話不存在")

    rows = (
        db.table("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
        .data
    )

    return [_format_message(r) for r in rows]


@router.post("/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(conversation_id: str, body: SendMessageRequest):
    """
    送出使用者訊息，並呼叫 Gemini 產生 AI 回覆。
    回傳 AI 的回覆訊息。
    """
    db = get_supabase()

    # 確認對話存在
    conv = (
        db.table("conversations")
        .select("id, title, message_count:messages(count)")
        .eq("id", conversation_id)
        .execute()
        .data
    )
    if not conv:
        raise HTTPException(status_code=404, detail="對話不存在")

    # 1. 儲存使用者訊息
    user_row = (
        db.table("messages")
        .insert({
            "conversation_id": conversation_id,
            "role": "user",
            "content": body.content,
        })
        .execute()
        .data[0]
    )

    # 2. 取出歷史訊息（含剛插入的），傳給 Gemini 做 multi-turn
    history = (
        db.table("messages")
        .select("role, content")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
        .data
    )

    # 3. 呼叫 Gemini API
    ai_text = await generate_reply(history)

    # 4. 儲存 AI 回覆
    ai_row = (
        db.table("messages")
        .insert({
            "conversation_id": conversation_id,
            "role": "assistant",
            "content": ai_text,
        })
        .execute()
        .data[0]
    )

    # 5. 若是第一則訊息，自動更新對話標題
    is_first_message = len(history) == 1  # 只有剛插入的 user msg
    if is_first_message:
        title = body.content[:30] + ("..." if len(body.content) > 30 else "")
        db.table("conversations").update({"title": title}).eq("id", conversation_id).execute()

    return _format_message(ai_row)


@router.put("/messages/{message_id}/rating", response_model=MessageResponse)
def rate_message(message_id: str, body: RateMessageRequest):
    """對 AI 回覆進行星星評分（1-5，傳 null 可清除評分）"""
    db = get_supabase()

    rows = (
        db.table("messages")
        .update({"rating": body.rating})
        .eq("id", message_id)
        .eq("role", "assistant")   # 只允許對 AI 訊息評分
        .execute()
        .data
    )

    if not rows:
        raise HTTPException(status_code=404, detail="訊息不存在或不可評分")

    return _format_message(rows[0])
