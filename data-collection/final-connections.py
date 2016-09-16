from config import *
import json
from pprint import pprint

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
        # Check if a conncetion between them is already logged.
        # If not, create that connection.
        try:
            if not str(user) in connections[str(friend)]:
                connections[user].append(str(friend))
        except KeyError:
            connections[user].append(str(friend))

# Print everything to a JSON
with open('data/final_connections.json', 'w') as json_out:
    json.dump(connections, json_out)
            
    
