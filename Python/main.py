# Import all the lib that we need
import time
import sense_hat
from socket import *
from datetime import datetime
from Speed import CalculateSpeed
import json
import datetime

BROADCAST_TO_PORT = 7000

# Initialize classes
cs = CalculateSpeed()
sense = sense_hat.SenseHat()
s = socket(AF_INET, SOCK_DGRAM)

# s.bind(('', 14593))     # (ip, port)
# no explicit bind: will bind to default IP + random port
# set up socket
s.setsockopt(SOL_SOCKET, SO_BROADCAST, 1)

# Initialize variables
x = 0
z = 0
data = ""

# Register user events. Increase speed with right, decrease with left
def user_input(event):
	global x
	global data
	if event.action == sense_hat.ACTION_RELEASED:
		# Ignore releases
		return
	elif event.direction == sense_hat.DIRECTION_RIGHT:
		data = str(cs.fake_data(0.1, 0))

	elif event.direction == sense_hat.DIRECTION_LEFT:
		data = str(cs.fake_data(-0.1, 0))


# Get the pi's serial number
def getserial():
	# Extract serial from cpuinfo file
	cpuserial = "0000000000000000"
	try:
		f = open('/proc/cpuinfo', 'r')
		for line in f:
			if line[0:6] == 'Serial':
				cpuserial = line[10:26]
		f.close()
	except:
		cpuserial = "ERROR000000000"

	return cpuserial


# Create an user
current_user = {
	"speed": data,
	"username": getserial(),
	"date": 0
}

# Dump the user into a new variable as Json
user = json.dumps(current_user)

# Main loop
while True:
	# Look for events
	for event in sense.stick.get_events():
		user_input(event)

	# Set data equals our fake data
	data = cs.fake_data(x, z)

	# Update the user
	current_user["speed"] = data
	current_user["date"] = str(datetime.datetime.now())
	user = json.dumps(current_user)

	# Broadcast the user on port 7000
	s.sendto(bytes(user, "UTF-8"), ('<broadcast>', BROADCAST_TO_PORT))
