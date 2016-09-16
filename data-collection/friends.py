from config import *
import twitter
import unicodecsv as csv
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
        access_token_secret = access_token_secrets[i],
        sleep_on_rate_limit=True
    )

api = def_api(api_key_set)

connections = {}

num_in_key = 0
            
for index, user in enumerate(users[700:1500]):

    
    
    connections[user] = []
    try:
        user_friends = api.GetFriendIDs(user_id=user)
        
        print('Getting friends of user #' + str(index))
        
        for friend in user_friends:
            if str(friend) in users:
                connections[user].append(friend)
                
    except twitter.error.TwitterError, e:
        print(e)
    except IOError:
        pass
    
    num_in_key += 1

    with open('data/friends_2.json', 'w') as json_out:
        json.dump(connections, json_out)

    if (num_in_key > 13):
        num_in_key = 0
        
        if (api_key_set < keys_length):
            api_key_set += 1
        else:
            api_key_set = 0

        api = def_api(api_key_set)

