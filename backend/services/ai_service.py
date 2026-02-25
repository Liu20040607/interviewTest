import os
from google import genai
from google.genai import types

SYSTEM_PROMPT = """你是一個專業的 AI 助理，擅長回答各種技術問題。
請使用繁體中文回覆，回答要清楚、有條理，適時使用條列式或程式碼區塊輔助說明。"""


def get_ai_client() -> genai.Client:
    return genai.Client(api_key=os.environ["GEMINI_API_KEY"])


async def generate_reply(history: list[dict]) -> str:
    """
    呼叫 Gemini 2.5 Flash 產生回覆。

    history 格式：
        [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}, ...]
    """
    client = get_ai_client()

    # 將歷史訊息轉換成 Gemini SDK 的 Content 格式
    contents: list[types.Content] = []
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        contents.append(
            types.Content(
                role=role,
                parts=[types.Part(text=msg["content"])],
            )
        )

    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.7,
            max_output_tokens=2048,
        ),
    )

    return response.text
