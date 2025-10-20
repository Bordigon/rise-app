from openai import OpenAI
import json


def deepseek_response(request):

    client = OpenAI(
        base_url="https://api.deepseek.com",
        api_key="sk-feebc043444b41dab953186dfd5b516c"
    )

    completion = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {
                "role": "user",
                "content": 'responde en un párrafo, no aclaares que es un párrafo solo responde a lo siguiente después de esto:'+str(request)
            }
        ],
        stream=False,
        response_format={"type": "json_object"}
    )

    return json.loads(completion.choices[0].message.content)


def stats_and_difficulty(info):
    propmpt = ('antes de empezar tu vas a recibir una tarea, dicha tarea va a ser'
               f'-{info}-, y en base a esa tarea tienes que '
               'devolver un tipo json, el tipo json debe ser un diccionario con lo siguiente,'
               'una clave de -difficulty-, tu le asignaras un valor que consideres adecuado,'
               'por ejmplo, si la tarea fuera correr un maraton, eso tendria una difficulty de 10'
               'si fuera estudiar por 10 horas seguidas tambien tendria una difficulty de 10, el punto'
               'es que le asignes la difficulty en funcion de que ten dificil seria par ala persona promedio'
               'realizar esa tarea. Luego el resto del diccionario va a tener las claves de -body-, -mind-,'
               '-productivity-, -creativity- y -social-, por ejemplo un maraton tendria un 10 en body, un 5 o asi en mind'
               'y seria 0 en todos los demas stats, el valor de la clave puede y DEBE ser 0 si esa clave '
               'tiene poco que ver o nada que ver con la actividad principal que se realiza en la tarea.'
               'En caso de que la tarea sea algo inconciso o sin sentido, simplemente pon todos los valores en 0 excepto difficulty,'
               'difficulty no puede ser jamas 0 y tiene que ser como minimo, 1, el máximo en todas las claves siempre será 10, no más,'
               'también debes ser rígido, si la acción principal no envuelve o no se caracteriza por alguna de las claves, el valor de esa clave'
               'debe ser 0'
               )
    return deepseek_response(propmpt)
