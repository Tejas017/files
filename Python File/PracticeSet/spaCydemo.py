import spacy

# Load English model
nlp = spacy.load("en_core_web_sm")

# Process a sentence
doc = nlp("Apple is looking at buying a startup in the UK for $1 billion.")

# Named Entity Recognition
for ent in doc.ents:
    print(ent.text, ent.label_)

print("===========================")
# Part-of-Speech Tagging
for token in doc:
    print(token.text, token.pos_, token.dep_)
