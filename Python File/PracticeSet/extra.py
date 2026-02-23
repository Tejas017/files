import speech_recognition as sr

import spacy

recognizer = sr.Recognizer()
with sr.Microphone() as source:
    print("Speak now...")
    audio = recognizer.listen(source)

text = recognizer.recognize_google(audio)
print("You said:", text)


nlp = spacy.load("en_core_web_sm")
doc = nlp(text)

name = None
for ent in doc.ents:
    if ent.label_ == "PERSON":
        name = ent.text
        break

print("Extracted name:", name)
