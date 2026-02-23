import time
from plyer import notification
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
import pyttsx3

# Initialize text-to-speech
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

# Reminder function
def show_reminder(task):
    notification.notify(
        title="Reminder",
        message=task,
        timeout=10
    )
    speak(f"Reminder: {task}")

# Static input
# task = "Drink water"
# remind_after_minutes = 1  # Change this to any number of minutes
# remind_time = datetime.now() + timedelta(minutes=remind_after_minutes)


# Static input
task = "Pranav Please Drink water"
remind_after_seconds = 30
remind_time = datetime.now() + timedelta(seconds=remind_after_seconds)


# Scheduler setup
scheduler = BackgroundScheduler()
scheduler.add_job(show_reminder, 'date', run_date=remind_time, args=[task])
scheduler.start()

# speak(f"Reminder set for: {task} in {remind_after_minutes} minute(s).")
speak(f"Reminder set for: {task} in {remind_after_seconds} seconds.")
time.sleep(1)

# Keep the script running
try:
    while True:
        pass
except (KeyboardInterrupt, SystemExit):
    scheduler.shutdown()
