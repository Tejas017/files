// Enhanced Voice Assistant SDK with Text-to-Speech

class EnhancedVoiceAssistantSDK {
    constructor() {
        this.isActive = false;
        this.isListening = false;
        this.isProcessing = false;
        this.isWakeWordMode = false;
        this.isCommandMode = false;
        this.isSpeaking = false;
        this.currentWakeWord = 'progo';
        this.audioLevel = 0;
        
        // TTS Settings
        this.ttsSettings = {
            rate: 0.9,
            pitch: 1.0,
            volume: 0.8,
            voice: null
        };
        
        this.availableVoices = [];
        this.currentUtterance = null;
        this.voicesLoaded = false;
        
        // Voice Prompts from data
        this.voicePrompts = {
            welcome: "Hello! Voice assistant is now active. Please say progo followed by your command.",
            wakeWordDetected: "Hello! I am listening for your command. What would you like me to do?",
            commandAcknowledged: "Executing {command}",
            commandCompleted: "Command completed successfully",
            commandFailed: "I had trouble executing that command",
            unknownCommand: "I am sorry, I did not understand that command. Please try again or say help for available commands.",
            helpPrompt: "Available commands: Fill name with John Doe, Select United States from country, Check newsletter, Submit the form, Navigate to settings, Stop listening",
            deactivated: "Voice assistant deactivated. Goodbye!"
        };

        // Command patterns
        this.commandPatterns = [
            { pattern: /^fill\s+name\s+with\s+(.+)$/i, intent: 'FILL_NAME' },
            { pattern: /^fill\s+(\w+)\s+with\s+(.+)$/i, intent: 'FILL_FIELD' },
            { pattern: /^select\s+(.+)\s+from\s+(\w+)$/i, intent: 'SELECT_OPTION' },
            { pattern: /^select\s+(.+)$/i, intent: 'SELECT_COUNTRY' },
            { pattern: /^check\s+(.+)$/i, intent: 'CHECK_BOX' },
            { pattern: /^uncheck\s+(.+)$/i, intent: 'UNCHECK_BOX' },
            { pattern: /^select\s+age\s+range\s+(.+)$/i, intent: 'SELECT_RADIO' },
            { pattern: /^submit\s+(?:the\s+)?form$/i, intent: 'SUBMIT_FORM' },
            { pattern: /^navigate\s+to\s+(.+)$/i, intent: 'NAVIGATE' },
            { pattern: /^stop\s+listening$/i, intent: 'STOP_ASSISTANT' },
            { pattern: /^help$/i, intent: 'SHOW_HELP' }
        ];

        this.commandQueue = [];
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
                this.initializeTTS();
                this.startAudioLevelSimulation();
                this.logMessage('Enhanced Voice Assistant SDK with TTS initialized', 'info');
            });
        } else {
            this.bindEvents();
            this.initializeTTS();
            this.startAudioLevelSimulation();
            this.logMessage('Enhanced Voice Assistant SDK with TTS initialized', 'info');
        }
    }

    initializeTTS() {
        // Check if speech synthesis is available
        if ('speechSynthesis' in window) {
            // Load voices immediately if available
            this.loadVoices();
            
            // Handle voice changes - some browsers need this event
            speechSynthesis.addEventListener('voiceschanged', () => {
                if (!this.voicesLoaded) {
                    this.loadVoices();
                }
            });

            // Fallback: try to load voices after a delay
            setTimeout(() => {
                if (!this.voicesLoaded) {
                    this.loadVoices();
                }
            }, 100);

            this.updateTTSStatus('Ready', 'success');
        } else {
            this.logMessage('Text-to-speech not supported in this browser', 'warning');
            this.updateTTSStatus('Not Supported', 'error');
        }
    }

    loadVoices() {
        this.availableVoices = speechSynthesis.getVoices();
        const voiceSelect = document.getElementById('voiceSelect');
        
        if (voiceSelect) {
            voiceSelect.innerHTML = '';
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Default Voice';
            voiceSelect.appendChild(defaultOption);
            
            if (this.availableVoices.length > 0) {
                // Add available voices
                this.availableVoices.forEach((voice, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    if (voice.default && !this.ttsSettings.voice) {
                        option.selected = true;
                        this.ttsSettings.voice = voice;
                    }
                    voiceSelect.appendChild(option);
                });
                
                this.voicesLoaded = true;
                this.logMessage(`Loaded ${this.availableVoices.length} voices for TTS`, 'success');
            } else {
                // Add placeholder if no voices yet
                const noVoicesOption = document.createElement('option');
                noVoicesOption.value = '';
                noVoicesOption.textContent = 'Loading voices...';
                voiceSelect.appendChild(noVoicesOption);
            }
        }
    }

    bindEvents() {
        // Voice button
        const voiceButton = document.getElementById('voiceButton');
        if (voiceButton) {
            voiceButton.addEventListener('click', () => this.toggleVoiceAssistant());
        }

        // Wake word simulation button
        const simulateWakeWordBtn = document.getElementById('simulateWakeWord');
        if (simulateWakeWordBtn) {
            simulateWakeWordBtn.addEventListener('click', () => this.simulateWakeWordDetection());
        }

        // TTS Settings
        this.bindTTSControls();

        // Demo command buttons
        const demoCmdButtons = document.querySelectorAll('.demo-cmd');
        demoCmdButtons.forEach(button => {
            button.addEventListener('click', () => {
                const command = button.getAttribute('data-command');
                this.simulateVoiceCommand(command);
            });
        });

        // Form submission
        const demoForm = document.getElementById('demoForm');
        if (demoForm) {
            demoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }
    }

    bindTTSControls() {
        // Speech rate
        const speechRate = document.getElementById('speechRate');
        const rateValue = document.getElementById('rateValue');
        if (speechRate && rateValue) {
            speechRate.addEventListener('input', (e) => {
                this.ttsSettings.rate = parseFloat(e.target.value);
                rateValue.textContent = `${this.ttsSettings.rate}x`;
            });
        }

        // Speech pitch
        const speechPitch = document.getElementById('speechPitch');
        const pitchValue = document.getElementById('pitchValue');
        if (speechPitch && pitchValue) {
            speechPitch.addEventListener('input', (e) => {
                this.ttsSettings.pitch = parseFloat(e.target.value);
                pitchValue.textContent = `${this.ttsSettings.pitch}x`;
            });
        }

        // Speech volume
        const speechVolume = document.getElementById('speechVolume');
        const volumeValue = document.getElementById('volumeValue');
        if (speechVolume && volumeValue) {
            speechVolume.addEventListener('input', (e) => {
                this.ttsSettings.volume = parseFloat(e.target.value);
                volumeValue.textContent = this.ttsSettings.volume;
            });
        }

        // Voice selection
        const voiceSelect = document.getElementById('voiceSelect');
        if (voiceSelect) {
            voiceSelect.addEventListener('change', (e) => {
                const voiceIndex = e.target.value;
                if (voiceIndex === '') {
                    this.ttsSettings.voice = null;
                    this.logMessage('Voice set to default', 'info');
                } else {
                    this.ttsSettings.voice = this.availableVoices[parseInt(voiceIndex)];
                    this.logMessage(`Voice changed to: ${this.ttsSettings.voice.name}`, 'info');
                }
            });

            // Force refresh voices on click
            voiceSelect.addEventListener('click', () => {
                if (this.availableVoices.length === 0) {
                    this.loadVoices();
                }
            });
        }

        // Test speech button
        const testSpeech = document.getElementById('testSpeech');
        if (testSpeech) {
            testSpeech.addEventListener('click', () => {
                const testMessage = `This is a test of the text to speech system. Speech rate is ${this.ttsSettings.rate}, pitch is ${this.ttsSettings.pitch}, and volume is ${this.ttsSettings.volume}. How do I sound?`;
                this.speak(testMessage);
            });
        }
    }

    async toggleVoiceAssistant() {
        if (!this.isActive) {
            await this.startVoiceAssistant();
        } else {
            this.stopVoiceAssistant();
        }
    }

    async startVoiceAssistant() {
        try {
            this.logMessage('Starting voice assistant...', 'info');
            this.updateTTSStatus('Initializing', 'warning');
            
            // Simulate microphone permission request
            await this.simulatePermissionRequest();
            
            this.isActive = true;
            this.isWakeWordMode = true;
            this.isListening = true;
            this.updateUI();
            this.updateTranscription('Listening for wake word...');
            
            this.logMessage('Voice Assistant activated. Listening for wake word...', 'success');
            
            // Start listening simulation
            this.startListeningSimulation();
            
            // Speak welcome message with a small delay
            setTimeout(() => {
                this.speak(this.voicePrompts.welcome);
            }, 500);
            
        } catch (error) {
            this.logMessage('Failed to start Voice Assistant: ' + error.message, 'error');
            this.updateTTSStatus('Error', 'error');
        }
    }

    stopVoiceAssistant() {
        // Stop any current speech
        if (this.currentUtterance) {
            speechSynthesis.cancel();
        }
        
        this.isActive = false;
        this.isListening = false;
        this.isProcessing = false;
        this.isWakeWordMode = false;
        this.isCommandMode = false;
        this.isSpeaking = false;
        this.hideWakeWordIndicator();
        this.updateUI();
        this.updateTranscription('Voice assistant stopped');
        
        this.logMessage('Voice Assistant deactivated', 'info');
        
        // Speak goodbye message
        setTimeout(() => {
            this.speak(this.voicePrompts.deactivated);
        }, 200);
        
        this.clearHighlights();
        this.updateTTSStatus('Ready', 'info');
    }

    simulatePermissionRequest() {
        return new Promise((resolve) => {
            this.updateTTSStatus('Requesting Permissions', 'warning');
            setTimeout(() => {
                this.updateTTSStatus('Active', 'success');
                resolve();
            }, 1000);
        });
    }

    simulateWakeWordDetection() {
        if (!this.isActive || !this.isWakeWordMode) {
            this.logMessage('Voice Assistant must be active and in wake word mode', 'warning');
            return;
        }

        this.logMessage(`Wake word "${this.currentWakeWord}" detected!`, 'success');
        this.showWakeWordIndicator();
        this.isWakeWordMode = false;
        this.isCommandMode = true;
        this.updateUI();
        this.updateTranscription('Wake word detected! Ready for commands...');
        
        // Speak wake word detection message
        this.speak(this.voicePrompts.wakeWordDetected);
        
        // Auto return to wake word mode after 30 seconds if no command
        setTimeout(() => {
            if (this.isActive && this.isCommandMode && !this.isProcessing) {
                this.returnToWakeWordMode();
            }
        }, 30000);
    }

    returnToWakeWordMode() {
        this.isCommandMode = false;
        this.isWakeWordMode = true;
        this.hideWakeWordIndicator();
        this.updateUI();
        this.updateTranscription('Listening for wake word...');
        this.logMessage('Returning to wake word listening mode', 'info');
    }

    showWakeWordIndicator() {
        const indicator = document.getElementById('wakeWordIndicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            setTimeout(() => {
                indicator.classList.add('hidden');
            }, 3000);
        }
    }

    hideWakeWordIndicator() {
        const indicator = document.getElementById('wakeWordIndicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    updateTranscription(text) {
        const transcriptionElement = document.getElementById('currentTranscription');
        if (transcriptionElement) {
            transcriptionElement.textContent = text;
            transcriptionElement.classList.toggle('active', this.isActive);
        }
    }

    startListeningSimulation() {
        if (this.listeningInterval) {
            clearInterval(this.listeningInterval);
        }
        
        this.listeningInterval = setInterval(() => {
            if (this.isActive && this.isListening && !this.isProcessing && !this.isSpeaking) {
                if (this.isWakeWordMode) {
                    this.audioLevel = Math.random() * 25 + 5; // Low activity for wake word
                } else if (this.isCommandMode) {
                    this.audioLevel = Math.random() * 40 + 15; // Higher activity for command mode
                }
                this.updateAudioMeter();
            }
        }, 150);
    }

    startAudioLevelSimulation() {
        setInterval(() => {
            if (!this.isActive) {
                this.audioLevel = Math.random() * 3; // Very low background noise
                this.updateAudioMeter();
            }
        }, 200);
    }

    updateAudioMeter() {
        const audioMeter = document.getElementById('audioLevel');
        if (audioMeter) {
            audioMeter.style.width = `${Math.min(this.audioLevel, 100)}%`;
        }
    }

    simulateVoiceCommand(command) {
        if (!this.isActive) {
            this.logMessage('Voice Assistant is not active. Please start it first.', 'warning');
            return;
        }

        if (!this.isCommandMode) {
            this.logMessage('Please say the wake word first or click "Simulate Wake Word"', 'warning');
            return;
        }

        this.logMessage(`Voice command received: "${command}"`, 'info');
        this.updateTranscription(`Processing: "${command}"`);
        this.processCommand(command);
    }

    processCommand(command) {
        this.isProcessing = true;
        this.audioLevel = 70; // High audio level during processing
        this.updateUI();
        this.updateAudioMeter();
        
        this.logMessage(`Processing command: "${command}"`, 'info');
        
        // Add to command queue
        this.commandQueue.push({
            command: command,
            timestamp: new Date()
        });
        
        // Simulate processing time
        setTimeout(() => {
            this.executeCommand(command);
            this.isProcessing = false;
            this.audioLevel = 20;
            this.updateUI();
            this.updateAudioMeter();
        }, 800 + Math.random() * 1000);
    }

    executeCommand(command) {
        let executed = false;
        
        for (const { pattern, intent } of this.commandPatterns) {
            const match = command.match(pattern);
            if (match) {
                executed = true;
                this.handleIntent(intent, match, command);
                break;
            }
        }
        
        if (!executed) {
            this.logMessage(`Command not recognized: "${command}"`, 'error');
            this.speak(this.voicePrompts.unknownCommand);
        }

        // Return to wake word mode after processing
        setTimeout(() => {
            if (this.isActive && !this.isProcessing) {
                this.returnToWakeWordMode();
            }
        }, 2000);
    }

    handleIntent(intent, match, originalCommand) {
        const commandResponse = this.voicePrompts.commandAcknowledged.replace('{command}', originalCommand);
        
        switch (intent) {
            case 'FILL_NAME':
                this.speak(commandResponse);
                setTimeout(() => this.fillNameField(match[1]), 1000);
                break;
            case 'FILL_FIELD':
                this.speak(commandResponse);
                setTimeout(() => this.fillField(match[1], match[2]), 1000);
                break;
            case 'SELECT_OPTION':
                this.speak(commandResponse);
                setTimeout(() => this.selectOption(match[2], match[1]), 1000);
                break;
            case 'SELECT_COUNTRY':
                this.speak(commandResponse);
                setTimeout(() => this.selectCountry(match[1]), 1000);
                break;
            case 'CHECK_BOX':
                this.speak(commandResponse);
                setTimeout(() => this.checkBox(match[1], true), 1000);
                break;
            case 'UNCHECK_BOX':
                this.speak(commandResponse);
                setTimeout(() => this.checkBox(match[1], false), 1000);
                break;
            case 'SELECT_RADIO':
                this.speak(commandResponse);
                setTimeout(() => this.selectRadio(match[1]), 1000);
                break;
            case 'SUBMIT_FORM':
                this.speak(commandResponse);
                setTimeout(() => this.submitForm(), 1000);
                break;
            case 'NAVIGATE':
                this.speak(commandResponse);
                setTimeout(() => this.navigate(match[1]), 1000);
                break;
            case 'STOP_ASSISTANT':
                this.stopVoiceAssistant();
                break;
            case 'SHOW_HELP':
                this.showHelp();
                break;
        }
    }

    speak(text) {
        if (!('speechSynthesis' in window)) {
            this.logMessage('TTS not available: ' + text, 'warning');
            return;
        }

        // Cancel any current speech
        speechSynthesis.cancel();
        
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance.rate = this.ttsSettings.rate;
        this.currentUtterance.pitch = this.ttsSettings.pitch;
        this.currentUtterance.volume = this.ttsSettings.volume;
        
        if (this.ttsSettings.voice) {
            this.currentUtterance.voice = this.ttsSettings.voice;
        }
        
        this.currentUtterance.onstart = () => {
            this.isSpeaking = true;
            this.updateTTSStatus('Speaking', 'success');
            this.logMessage(`🔊 TTS: ${text}`, 'tts');
        };
        
        this.currentUtterance.onend = () => {
            this.isSpeaking = false;
            this.updateTTSStatus('Ready', 'info');
        };
        
        this.currentUtterance.onerror = (event) => {
            this.isSpeaking = false;
            this.updateTTSStatus('Error', 'error');
            this.logMessage(`TTS Error: ${event.error}`, 'error');
        };
        
        speechSynthesis.speak(this.currentUtterance);
    }

    updateTTSStatus(status, type) {
        const statusElement = document.getElementById('ttsStatus');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `status status--${type}`;
        }
    }

    fillNameField(value) {
        const nameField = document.getElementById('name');
        if (nameField) {
            // Clear the field first
            nameField.value = '';
            
            // Simulate typing effect
            let index = 0;
            const typeText = () => {
                if (index < value.length) {
                    nameField.value += value[index];
                    index++;
                    setTimeout(typeText, 50);
                } else {
                    // Field filling complete
                    this.highlightField(nameField);
                    this.logMessage(`Filled name field with "${value}"`, 'success');
                    this.speak(`Filled name field with ${value}. ${this.voicePrompts.commandCompleted}`);
                    nameField.dispatchEvent(new Event('change', { bubbles: true }));
                }
            };
            typeText();
        } else {
            this.logMessage('Name field not found', 'error');
            this.speak(this.voicePrompts.commandFailed);
        }
    }

    fillField(fieldName, value) {
        const field = this.findField(fieldName);
        if (field) {
            field.value = value;
            this.highlightField(field);
            this.logMessage(`Filled "${fieldName}" with "${value}"`, 'success');
            this.speak(`Filled ${fieldName} field with ${value}. ${this.voicePrompts.commandCompleted}`);
            
            field.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            this.logMessage(`Field "${fieldName}" not found`, 'error');
            this.speak(this.voicePrompts.commandFailed);
        }
    }

    selectOption(fieldName, value) {
        const field = this.findField(fieldName);
        if (field && field.tagName === 'SELECT') {
            const options = Array.from(field.options);
            const option = options.find(opt => 
                opt.text.toLowerCase().includes(value.toLowerCase()) || 
                opt.value.toLowerCase().includes(value.toLowerCase())
            );
            
            if (option) {
                field.value = option.value;
                this.highlightField(field);
                this.logMessage(`Selected "${option.text}" in "${fieldName}"`, 'success');
                this.speak(`Selected ${option.text} from ${fieldName}. ${this.voicePrompts.commandCompleted}`);
                
                field.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                this.logMessage(`Option "${value}" not found in "${fieldName}"`, 'error');
                this.speak(this.voicePrompts.commandFailed);
            }
        } else {
            this.logMessage(`Select field "${fieldName}" not found`, 'error');
            this.speak(this.voicePrompts.commandFailed);
        }
    }

    selectCountry(value) {
        const field = document.getElementById('country');
        if (field) {
            const options = Array.from(field.options);
            const option = options.find(opt => 
                opt.text.toLowerCase().includes(value.toLowerCase())
            );
            
            if (option) {
                field.value = option.value;
                this.highlightField(field);
                this.logMessage(`Selected country "${option.text}"`, 'success');
                this.speak(`Selected ${option.text} as country. ${this.voicePrompts.commandCompleted}`);
                
                field.dispatchEvent(new Event('change', { bubbles: true }));
            } else {
                this.logMessage(`Country "${value}" not found`, 'error');
                this.speak(this.voicePrompts.commandFailed);
            }
        }
    }

    checkBox(fieldName, checked) {
        const field = this.findField(fieldName);
        if (field && field.type === 'checkbox') {
            field.checked = checked;
            this.highlightField(field.closest('label') || field.parentElement || field);
            const action = checked ? 'Checked' : 'Unchecked';
            this.logMessage(`${action} "${fieldName}"`, 'success');
            this.speak(`${action} ${fieldName}. ${this.voicePrompts.commandCompleted}`);
            
            field.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            this.logMessage(`Checkbox "${fieldName}" not found`, 'error');
            this.speak(this.voicePrompts.commandFailed);
        }
    }

    selectRadio(value) {
        const radioButtons = document.querySelectorAll('input[type="radio"][name="ageRange"]');
        const targetRadio = Array.from(radioButtons).find(radio => 
            radio.value.toLowerCase().includes(value.toLowerCase()) ||
            value.toLowerCase().includes(radio.value.toLowerCase())
        );
        
        if (targetRadio) {
            targetRadio.checked = true;
            this.highlightField(targetRadio.closest('label') || targetRadio.parentElement);
            this.logMessage(`Selected age range "${targetRadio.value}"`, 'success');
            this.speak(`Selected age range ${targetRadio.value}. ${this.voicePrompts.commandCompleted}`);
            
            targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            this.logMessage(`Age range "${value}" not found`, 'error');
            this.speak(this.voicePrompts.commandFailed);
        }
    }

    submitForm() {
        const form = document.getElementById('demoForm');
        if (!form) {
            this.logMessage('Form not found', 'error');
            this.speak(this.voicePrompts.commandFailed);
            return;
        }
        
        const nameField = document.getElementById('name');
        if (!nameField || !nameField.value.trim()) {
            this.logMessage('Cannot submit form: Name is required', 'error');
            if (nameField) this.highlightField(nameField);
            this.speak('Cannot submit form. Please fill in the required name field first.');
            return;
        }
        
        form.classList.add('processing');
        this.logMessage('Submitting form...', 'info');
        this.speak('Submitting the form now. Please wait.');
        
        setTimeout(() => {
            form.classList.remove('processing');
            form.classList.add('success-flash');
            this.logMessage('Form submitted successfully!', 'success');
            this.speak('Form submitted successfully! All information has been processed.');
            
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            this.logMessage(`Form data: ${JSON.stringify(data)}`, 'info');
            
            setTimeout(() => {
                form.classList.remove('success-flash');
            }, 600);
        }, 2500);
    }

    navigate(destination) {
        this.logMessage(`Navigation requested to: "${destination}"`, 'info');
        this.speak(`Navigating to ${destination}. This is a demo, so navigation is simulated.`);
    }

    showHelp() {
        this.speak(this.voicePrompts.helpPrompt);
        
        const helpCommands = [
            'Available voice commands:',
            '• "Fill name with [value]"',
            '• "Select [country] from country"', 
            '• "Check newsletter"',
            '• "Submit the form"',
            '• "Stop listening"',
            '• "Help"'
        ];
        
        helpCommands.forEach(cmd => {
            this.logMessage(cmd, 'info');
        });
    }

    findField(fieldName) {
        const normalizedName = fieldName.toLowerCase().replace(/\s+/g, '');
        
        // Try exact ID matches first
        let field = document.getElementById(normalizedName) || document.getElementById(fieldName);
        if (field) return field;
        
        // Try exact name matches
        field = document.querySelector(`[name="${normalizedName}"]`) || 
               document.querySelector(`[name="${fieldName}"]`);
        if (field) return field;
        
        // Try common field mappings
        const fieldMappings = {
            'name': 'name',
            'fullname': 'name',
            'country': 'country',
            'newsletter': 'newsletter',
            'subscription': 'newsletter',
            'comments': 'comments',
            'age': 'ageRange',
            'agerange': 'ageRange'
        };
        
        const mappedName = fieldMappings[normalizedName];
        if (mappedName) {
            return document.querySelector(`[name="${mappedName}"]`) || 
                   document.getElementById(mappedName);
        }
        
        return null;
    }

    highlightField(field) {
        if (!field) return;
        
        this.clearHighlights();
        field.classList.add('highlighted', 'field-highlight');
        
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            field.classList.remove('highlighted', 'field-highlight');
        }, 3000);
    }

    clearHighlights() {
        const highlighted = document.querySelectorAll('.highlighted, .field-highlight');
        highlighted.forEach(el => {
            el.classList.remove('highlighted', 'field-highlight');
        });
    }

    handleFormSubmission() {
        this.logMessage('Form submitted via normal form submission', 'info');
    }

    updateUI() {
        const voiceButton = document.getElementById('voiceButton');
        const statusElement = document.getElementById('assistantStatus');
        const modeElement = document.getElementById('currentMode');
        
        if (!voiceButton || !statusElement || !modeElement) return;
        
        voiceButton.className = 'voice-button';
        const buttonTextElement = voiceButton.querySelector('.voice-button__text');
        if (!buttonTextElement) return;
        
        if (this.isProcessing) {
            voiceButton.classList.add('voice-button--processing');
            buttonTextElement.textContent = 'Processing Command...';
            statusElement.textContent = 'Processing';
            modeElement.textContent = 'Command Processing';
        } else if (this.isCommandMode && this.isActive) {
            voiceButton.classList.add('voice-button--wake-word');
            buttonTextElement.textContent = 'Command Mode';
            statusElement.textContent = 'Command Mode';
            modeElement.textContent = 'Ready for Commands';
        } else if (this.isWakeWordMode && this.isActive) {
            voiceButton.classList.add('voice-button--listening');
            buttonTextElement.textContent = 'Listening for Wake Word';
            statusElement.textContent = 'Listening';
            modeElement.textContent = 'Wake Word Detection';
        } else if (this.isActive) {
            voiceButton.classList.add('voice-button--listening');
            buttonTextElement.textContent = 'Voice Assistant Active';
            statusElement.textContent = 'Active';
            modeElement.textContent = 'Ready';
        } else {
            voiceButton.classList.add('voice-button--inactive');
            buttonTextElement.textContent = 'Start Voice Assistant';
            statusElement.textContent = 'Inactive';
            modeElement.textContent = 'Waiting';
        }
    }

    logMessage(message, type = 'info') {
        const commandLog = document.getElementById('commandLog');
        if (!commandLog) return;
        
        const timestamp = new Date().toLocaleTimeString();
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-entry--${type}`;
        
        // Add speaking indicator for TTS messages
        const speakingIcon = type === 'tts' ? '<span class="speaking-indicator"></span>' : '';
        
        logEntry.innerHTML = `
            <span class="log-timestamp">${timestamp}</span>
            <span class="log-message">${speakingIcon}${message}</span>
        `;
        
        commandLog.appendChild(logEntry);
        commandLog.scrollTop = commandLog.scrollHeight;
        
        // Keep only last 100 entries
        while (commandLog.children.length > 100) {
            commandLog.removeChild(commandLog.firstChild);
        }
    }
}

// Initialize the Enhanced Voice Assistant SDK
document.addEventListener('DOMContentLoaded', () => {
    window.voiceAssistant = new EnhancedVoiceAssistantSDK();
    
    setTimeout(() => {
        if (window.voiceAssistant) {
            window.voiceAssistant.logMessage('Ready! Click "Start Voice Assistant" to begin with voice feedback.', 'info');
        }
    }, 500);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedVoiceAssistantSDK;
}