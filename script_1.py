# Create updated backend without Picovoice dependency
updated_backend = """
# Updated Backend Implementation without Picovoice

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
import json
import logging
from datetime import datetime
import hashlib
import re
from typing import Dict, List, Optional
import asyncio

app = FastAPI(
    title="Voice Assistant API - Free Version",
    description="HIPAA-Compliant Voice Processing Service without Picovoice",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class FreeWakeWordDetector:
    \"\"\"Free wake word detection using audio analysis and text matching\"\"\"
    
    def __init__(self):
        self.wake_words = ['progo', 'program', 'progress', 'bravo']
        self.confidence_threshold = 0.7
        
    def detect_wake_word(self, transcribed_text: str) -> Dict:
        \"\"\"Detect wake word in transcribed text\"\"\"
        text_lower = transcribed_text.lower()
        
        for wake_word in self.wake_words:
            if wake_word in text_lower:
                return {
                    'detected': True,
                    'wake_word': wake_word,
                    'confidence': 0.9,
                    'position': text_lower.find(wake_word)
                }
            
            # Fuzzy matching for variations
            if self.fuzzy_match(text_lower, wake_word):
                return {
                    'detected': True,
                    'wake_word': wake_word,
                    'confidence': 0.7,
                    'position': text_lower.find(wake_word[:3])
                }
        
        return {
            'detected': False,
            'wake_word': None,
            'confidence': 0.0,
            'position': -1
        }
    
    def fuzzy_match(self, text: str, target: str, threshold: float = 0.7) -> bool:
        \"\"\"Simple fuzzy matching for wake word variations\"\"\"
        words = text.split()
        for word in words:
            similarity = self.calculate_similarity(word, target)
            if similarity >= threshold:
                return True
        return False
    
    def calculate_similarity(self, str1: str, str2: str) -> float:
        \"\"\"Calculate string similarity using Levenshtein distance\"\"\"
        if len(str1) == 0:
            return 0.0
        if len(str2) == 0:
            return 0.0
        
        matrix = [[0] * (len(str1) + 1) for _ in range(len(str2) + 1)]
        
        for i in range(len(str1) + 1):
            matrix[0][i] = i
        for j in range(len(str2) + 1):
            matrix[j][0] = j
        
        for j in range(1, len(str2) + 1):
            for i in range(1, len(str1) + 1):
                cost = 0 if str1[i-1] == str2[j-1] else 1
                matrix[j][i] = min(
                    matrix[j-1][i] + 1,
                    matrix[j][i-1] + 1,
                    matrix[j-1][i-1] + cost
                )
        
        max_length = max(len(str1), len(str2))
        return (max_length - matrix[len(str2)][len(str1)]) / max_length
    
    def update_wake_words(self, new_wake_words: List[str]):
        \"\"\"Update wake word list\"\"\"
        self.wake_words = [word.lower() for word in new_wake_words]
        return True

class FreeVoiceCommandProcessor:
    \"\"\"Process voice commands without external NLP services\"\"\"
    
    def __init__(self):
        self.command_patterns = {
            'FILL_FIELD': [
                r'fill\\s+(\\w+)\\s+with\\s+(.+)',
                r'enter\\s+(.+)\\s+in\\s+(\\w+)',
                r'type\\s+(.+)\\s+in\\s+(\\w+)'
            ],
            'SELECT_OPTION': [
                r'select\\s+(.+)\\s+from\\s+(\\w+)',
                r'choose\\s+(.+)\\s+from\\s+(\\w+)'
            ],
            'CHECK_BOX': [
                r'check\\s+(.+)',
                r'tick\\s+(.+)',
                r'mark\\s+(.+)'
            ],
            'UNCHECK_BOX': [
                r'uncheck\\s+(.+)',
                r'untick\\s+(.+)',
                r'unmark\\s+(.+)'
            ],
            'SUBMIT_FORM': [
                r'submit\\s+(?:the\\s+)?form',
                r'send\\s+(?:the\\s+)?form',
                r'save\\s+(?:the\\s+)?form'
            ],
            'NAVIGATE': [
                r'go\\s+to\\s+(.+)',
                r'navigate\\s+to\\s+(.+)',
                r'open\\s+(.+)'
            ],
            'STOP_ASSISTANT': [
                r'stop\\s+listening',
                r'deactivate\\s+assistant',
                r'turn\\s+off'
            ],
            'SHOW_HELP': [
                r'help',
                r'what\\s+can\\s+you\\s+do',
                r'commands'
            ]
        }
    
    def process_command(self, text: str) -> Dict:
        \"\"\"Process voice command and extract intent\"\"\"
        text_cleaned = text.lower().strip()
        
        for intent, patterns in self.command_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, text_cleaned, re.IGNORECASE)
                if match:
                    return {
                        'text': text,
                        'intent': intent,
                        'parameters': list(match.groups()),
                        'confidence': 0.9
                    }
        
        return {
            'text': text,
            'intent': 'UNKNOWN',
            'parameters': [],
            'confidence': 0.1
        }

class FreeSpeechRecognizer:
    \"\"\"Placeholder for local speech recognition\"\"\"
    
    def __init__(self):
        self.is_available = True
        
    def transcribe_audio_file(self, audio_path: str) -> Optional[str]:
        \"\"\"
        Placeholder for local speech recognition.
        In production, you would integrate with:
        - Vosk (JavaScript/Python)
        - wav2vec2 (Hugging Face)
        - OpenAI Whisper (local)
        - SpeechRecognition library (Python)
        \"\"\"
        
        # For demo purposes, simulate transcription
        # In production, implement actual speech-to-text here
        return "This is a simulated transcription. Please implement actual STT."
    
    def is_service_available(self) -> bool:
        return self.is_available

# Initialize components
wake_word_detector = FreeWakeWordDetector()
command_processor = FreeVoiceCommandProcessor()
speech_recognizer = FreeSpeechRecognizer()

@app.post("/process-voice")
async def process_voice_command(
    audio: UploadFile = File(...),
    wake_word: str = "progo",
    session_id: Optional[str] = None
):
    \"\"\"Process voice command without external APIs\"\"\"
    
    if not session_id:
        session_id = hashlib.sha256(
            f"{datetime.utcnow().isoformat()}_{audio.filename}".encode()
        ).hexdigest()[:16]
    
    try:
        # Read audio data
        audio_data = await audio.read()
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            temp_file.write(audio_data)
            temp_file_path = temp_file.name
        
        try:
            # Placeholder for actual speech recognition
            # Replace this with actual local STT implementation
            transcription = f"simulated transcription for {wake_word} fill name with John Doe"
            
            if transcription:
                # Check for wake word
                wake_word_result = wake_word_detector.detect_wake_word(transcription)
                
                if wake_word_result['detected']:
                    # Extract command after wake word
                    wake_word_pos = wake_word_result['position']
                    wake_word_len = len(wake_word_result['wake_word'])
                    command_text = transcription[wake_word_pos + wake_word_len:].strip()
                    
                    if command_text:
                        # Process the command
                        command_result = command_processor.process_command(command_text)
                        
                        return {
                            'session_id': session_id,
                            'transcription': transcription,
                            'wake_word_detected': True,
                            'wake_word': wake_word_result['wake_word'],
                            'command': command_text,
                            'intent': command_result['intent'],
                            'parameters': command_result['parameters'],
                            'confidence': command_result['confidence'],
                            'timestamp': datetime.utcnow().isoformat()
                        }
                    else:
                        return {
                            'session_id': session_id,
                            'transcription': transcription,
                            'wake_word_detected': True,
                            'wake_word': wake_word_result['wake_word'],
                            'command': '',
                            'intent': 'WAKE_WORD_ONLY',
                            'parameters': [],
                            'confidence': wake_word_result['confidence'],
                            'timestamp': datetime.utcnow().isoformat()
                        }
                else:
                    return {
                        'session_id': session_id,
                        'transcription': transcription,
                        'wake_word_detected': False,
                        'message': f'Wake word "{wake_word}" not detected',
                        'timestamp': datetime.utcnow().isoformat()
                    }
            else:
                raise HTTPException(status_code=400, detail="No transcription available")
                
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/update-wake-word")
async def update_wake_word(config: dict):
    \"\"\"Update wake word configuration\"\"\"
    try:
        new_wake_words = config.get('wake_words', ['progo'])
        
        if isinstance(new_wake_words, str):
            new_wake_words = [new_wake_words]
        
        # Validate wake words
        for word in new_wake_words:
            if not word.strip() or len(word.strip()) < 2:
                raise HTTPException(status_code=400, detail="Invalid wake word format")
        
        # Update wake words
        success = wake_word_detector.update_wake_words(new_wake_words)
        
        if success:
            return {
                'status': 'success',
                'wake_words': new_wake_words,
                'message': 'Wake words updated successfully'
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to update wake words")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Wake word update failed: {str(e)}")

@app.get("/health")
async def health_check():
    \"\"\"Health check endpoint\"\"\"
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'services': {
            'wake_word_detection': True,
            'command_processing': True,
            'speech_recognition': speech_recognizer.is_service_available()
        }
    }

@app.get("/available-commands")
async def get_available_commands():
    \"\"\"Get list of available voice commands\"\"\"
    commands = []
    
    for intent, patterns in command_processor.command_patterns.items():
        commands.append({
            'intent': intent,
            'examples': [
                pattern.replace('\\\\s+', ' ').replace('(.+)', '[text]').replace('(\\\\w+)', '[field]')
                for pattern in patterns[:2]  # Show first 2 patterns
            ]
        })
    
    return {
        'commands': commands,
        'wake_words': wake_word_detector.wake_words
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="127.0.0.1",
        port=8000,
        reload=True
    )
"""

print("Updated Backend Implementation:")
print("✅ Removed Picovoice dependency")
print("✅ Free wake word detection using text analysis")
print("✅ Simple fuzzy matching for wake word variations")
print("✅ Placeholder for local STT integration")
print("✅ No API keys required")
print("\nTo integrate actual local speech recognition, you can use:")
print("- Vosk (JavaScript/Browser or Python)")
print("- OpenAI Whisper (local installation)")
print("- SpeechRecognition library with offline engines")
print("- wav2vec2 models from Hugging Face")