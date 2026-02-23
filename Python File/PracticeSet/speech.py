import speech_recognition
import pyttsx3

recognizer = speech_recognition.Recognizer()
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

while True:

    try:
        with speech_recognition.Microphone() as mic:

            recognizer.adjust_for_ambient_noise(mic,duration=0.2)
            print("Please speak something...")
            speak("Hey How can i help you...")
            # engine.say("Hey How can i help you...")
            # engine.runAndWait()
            audio= recognizer.listen(mic)

            text=recognizer.recognize_google(audio)
            text=text.lower()
            speak(f"you said {text}")
            #engine.say(f"you said {text}")
            
            if "stop" in text or "exit" in text or "quit" in text or "bus" in text or "bore" in text:
                speak("Goodbye!")
                #  engine.say("Goodbye!")
                #  engine.runAndWait()
                break

            print(f"Recognized , You said : {text}")

    except speech_recognition.UnknownValueError:
        recognizer = speech_recognition.Recognizer()
        engine = pyttsx3.init()
        # engine.say("Hey How can i help you...")
        # engine.runAndWait()
        continue
        



