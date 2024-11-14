import schedule
import time
import threading
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from profiles.models import UserProfile

def check_user_activity():
	print("Checking user activity...")
	now = timezone.now()
	threshold_time = now - timedelta(minutes=5)  # Users who have been inactive for more than 10 minutes

	# Get users who have made a request in the last 10 minutes
	users_with_inactivity = UserProfile.objects.filter(
		status='on',
		UID__last_request__lt=threshold_time  # Check if they have been inactive
	)
 
	for user_profile in users_with_inactivity:
		# Update the user's status to "offline" if inactive
		user_profile.status = 'off'
		user_profile.save()
		print(f"User {user_profile.UID.username} is now offline due to inactivity.")
           
schedule.every(5).minutes.do(check_user_activity)

def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)
        
def start_scheduler():
    scheduler_thread = threading.Thread(target=run_scheduler)
    scheduler_thread.daemon = True
    scheduler_thread.start()