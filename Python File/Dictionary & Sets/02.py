import pyttsx3

words={ "vachva":"Help",
    "mi" : "I",
    "amba":"Mango"}


word=input("Please enter the word: ")
print(words[word])
engine = pyttsx3.init()
engine.say(words[word])
engine.runAndWait()