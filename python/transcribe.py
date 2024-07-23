import speech_recognition as sr
from os import path
import json
import sys

if len(sys.argv) < 2:
    result = {
        "success": False,
        "message": "Audio file not provided!"
    }
    print(json.dumps(result))

AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), sys.argv[1])

# use the audio file as the audio source
r = sr.Recognizer()
with sr.AudioFile(AUDIO_FILE) as source:
    audio = r.record(source)  # read the entire audio file

# recognize speech using Google Speech Recognition
try:
    # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
    result = {
        "success": True,
        "message": r.recognize_google(audio)
    }
    print(json.dumps(result))
except sr.UnknownValueError:
    result = {
        "success": False,
        "message": "Google Speech Recognition could not understand audio!"
    }
    print(json.dumps(result))
except sr.RequestError as e:
    result = {
        "success": False,
        "message": "Could not request results from Google Speech Recognition service; {0}".format(e)
    }
    print(json.dumps(result))