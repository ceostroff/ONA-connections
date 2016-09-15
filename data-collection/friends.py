from config import *
import twitter
import unicodecsv as csv
import datetime
import time
import json

users = []

# Get usernames from CSV
with open('data/ids.csv', 'rb') as csv_in:
    for row in csv_in:
        users.append(row.rstrip())

# Set up twitter API
api =  None
api_key_set = 0

keys_length = len(consumer_keys) - 1

# Set API keys based on current key in cycle
def def_api(i):   
    return twitter.Api(
        # Set these in config.py
        consumer_key = consumer_keys[i],
        consumer_secret = consumer_secrets[i],
        access_token_key = access_tokens[i],
        access_token_secret = access_token_secrets[i]
    )

api = def_api(api_key_set)

connections = {}

num_in_key = 0

for index, user in enumerate(users):
    connections[user] = []
    user_friends = api.GetFriendIDs(user_id=user)

    print(str(index) + '\n')
    print(user_friends)
    print('\n')
    
    for friend in user_friends:
        if friend in users:
            connections[user].append(friend)

    num_in_key += 1

    if (num_in_key > 14):
        num_in_key = 0
        
        if (api_key_set < keys_length):
            api_key_set += 1
        else:
            end_time = datetime.datetime.now()
            time_dif = (start_time - end_time).total_seconds()

            if (time_dif < 900):
                time.sleep(900 - time_dif + 20)
                
            api_key_set = 0

        api = def_api(api_key_set)
    
with open('data/friends.json', 'w') as json_out:
    json.dump(connections, json_out)
