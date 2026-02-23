import speech_recognition as sr
import pyttsx3


# Initialize recognizer
recognizer = sr.Recognizer()
engine = pyttsx3.init()

# Use the microphone as source
with sr.Microphone() as source:
    print("Please speak something...")
    audio = recognizer.listen(source)

    try:
        # Convert speech to text using Google Web Speech API
        text = recognizer.recognize_google(audio)
        print("You said:", text)
        engine.say(f"You said: {text}")
        engine.runAndWait()
    except sr.UnknownValueError:
        print("Sorry, I could not understand the audio.")
    except sr.RequestError:
        print("Could not request results; check your internet connection.")
