import sys
import json
from Bard import Chatbot

def process_parameters(gb1psid, gb1psidts, text):
    if gb1psid is None or gb1psidts is None or text is None:
        result = {
            "success": False,
            "message": "Command sample: python answer.py \"<gb1psid>\" \"<gb1psidts>\" \"<text>\""
        }
        return json.dumps(result)

    # Process the parameters as needed
    chatbot = Chatbot(gb1psid, gb1psidts)
    answer = chatbot.ask(text)
    result = {
        "success": True,
        "message": answer
    }
    return json.dumps(result)


# Retrieve parameters from command line arguments
gb1psid = sys.argv[1] if len(sys.argv) > 1 else None
gb1psidts = sys.argv[2] if len(sys.argv) > 2 else None
text = sys.argv[3] if len(sys.argv) > 3 else None

# Process the parameters and return the result
try:
    result = process_parameters(gb1psid, gb1psidts, text)
    print(result)
except Exception as e:
    result = {
        "success": False,
        "message": str(e)
    }
    print(json.dumps(result))