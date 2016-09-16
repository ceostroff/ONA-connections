from config import *
import json
from pprint import pprint

print('running')

# Open friends JSON file
with open('data/friends.json') as json_file:
    data = json.load(json_file)
    
# Create dict to hold final connections
connections = {}

# Iterate through users in original connections
for user, friends in data.items():
    
    # Create an entry for that user in the final conncetions dict
    connections[user] = []

    # For each person that user follows...
    for friend in friends:
        connections[user].append(str(friend))

# Print everything to a JSON
with open('data/final_connections.json', 'w') as json_out:
    json.dump(connections, json_out)
            
    
