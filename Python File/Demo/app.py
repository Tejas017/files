from flask import Flask, request, jsonify, render_template
import pyttsx3
import datetime

app = Flask(__name__)
engine = pyttsx3.init()
voices = engine.getProperty('voices')
engine.setProperty('voice', voices[1].id)

def speak(text):
    engine.say(text)
    engine.runAndWait()
    engine.stop()

def save_note(note_text):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"note_{timestamp}.txt"
    with open(filename, "w") as file:
        file.write(note_text)
    speak("Note saved successfully.")
    return f"Note saved to {filename}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    data = request.get_json()
    command = data.get('text', '').lower()

    if "take a note" in command or "note that" in command:
        speak("What would you like me to note?")
        return jsonify(response="What would you like me to note?")
    elif "exit" in command or "stop" in command:
        speak("Goodbye!")
        return jsonify(response="Goodbye!")
    else:
        result = save_note(command)
        return jsonify(response=result)

if __name__ == '__main__':
    app.run(debug=True)
