from openai import OpenAI
import json
import re

def deepseek_response(request):
    client = OpenAI(
        base_url="https://api.deepseek.com",
        api_key="TU_API_KEY_AQUI"
    )

    completion = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {
                "role": "system",
                "content": (
                    "Eres un evaluador extremadamente estricto para un sistema de gamificación. "
                    "Tu trabajo es clasificar tareas humanas en dificultad y áreas específicas. "
                    "Nunca inventes o adivines valores: si una tarea no aplica, asigna 0."
                )
            },
            {
                "role": "user",
                "content": request
            }
        ],
        stream=False,
        response_format={"type": "json_object"}
    )

    content = completion.choices[0].message.content.strip()

    # Aislar JSON válido si hay texto extra
    match = re.search(r'\{.*\}', content, re.DOTALL)
    if match:
        content = match.group(0)

    try:
        return json.loads(content)
    except Exception:
        return {
            "difficulty": 1,
            "body": 0,
            "mind": 0,
            "productivity": 0,
            "creativity": 0,
            "social": 0,
            "reason": "Error al parsear JSON — valores por defecto estrictos."
        }


def stats_and_difficulty(info):
    prompt = f"""
    Analiza esta tarea: "{info}"

    Eres un evaluador extremadamente estricto.  
    Si una tarea NO pertenece claramente a una categoría, asigna 0 sin excepción.

    Devuelve SOLO este JSON:
    {{
      "difficulty": (int 1–10),
      "body": (int 0–10),
      "mind": (int 0–10),
      "productivity": (int 0–10),
      "creativity": (int 0–10),
      "social": (int 0–10),
      "reason": "breve explicación objetiva"
    }}

    Reglas:
    - No incluyas nada fuera del JSON.
    - difficulty siempre ≥ 1.
    - NO inventes: si no aplica → 0.
    - Si la tarea es ambigua/absurda → todo 0 excepto difficulty = 1.
    - Sin valores flotantes. Solo enteros.
    - Sé corto y directo en "reason".

    Ejemplos válidos:

    "Correr 5 km" =>
    {{
      "difficulty": 6, "body": 8, "mind": 2,
      "productivity": 1, "creativity": 0, "social": 0,
      "reason": "Actividad física moderada"
    }}

    "Leer 30 min filosofía" =>
    {{
      "difficulty": 3, "body": 0, "mind": 8,
      "productivity": 5, "creativity": 2, "social": 0,
      "reason": "Requiere concentración y reflexión"
    }}

    "Ser mejor persona" =>
    {{
      "difficulty": 1, "body": 0, "mind": 0,
      "productivity": 0, "creativity": 0, "social": 0,
      "reason": "Demasiado vago para evaluar"
    }}
    """

    response = deepseek_response(prompt)

    # Normalización
    for key in ["difficulty", "body", "mind", "productivity", "creativity", "social"]:
        try:
            val = int(response.get(key, 0))
            response[key] = max(0, min(10, val))
        except:
            response[key] = 0

    # Reglas estrictas finales
    if response["difficulty"] < 1:
        response["difficulty"] = 1

    if "reason" not in response:
        response["reason"] = "Explicación no proporcionada"

    return response
