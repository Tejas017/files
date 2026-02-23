import time
import speech_recognition as sr
import pyttsx3
import datetime

recognizer = sr.Recognizer()
engine = pyttsx3.init()
voices = engine.getProperty('voices') 
engine.setProperty('voice', voices[1].id)
def speak(text):
    print(f"Speaking: {text}")
    engine.say(text)
    engine.runAndWait()
    engine.stop()

def listen():
    with sr.Microphone() as mic:
        recognizer.adjust_for_ambient_noise(mic, duration=0.2)
        print("Listening...")
        speak("Listening")
        audio = recognizer.listen(mic)
        try:
            text = recognizer.recognize_google(audio)
            return text.lower()
        except sr.UnknownValueError:
            speak("Sorry, I didn't catch that.")
            return None

def save_note(note_text):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"note_{timestamp}.txt"
    with open(filename, "w") as file:
        file.write(note_text)
    speak("Note saved successfully.")
    print(f"Note saved to {filename}")

# Main loop
speak("Voice assistant ready. Say 'take a note' to begin.")
while True:
    command = listen()
    if command:
        if "take a note" in command or "note that" in command :
            speak("What would you like me to note?")
            time.sleep(1)
            note = listen()
            if note:
                save_note(note)
        elif "exit" in command or "stop" in command:
            speak("Goodbye!")
            break
