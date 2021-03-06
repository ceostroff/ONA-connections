from config import *
import twitter
import unicodecsv as csv
import datetime
import time

users = []

with open('data/twitter-usernames.csv', 'rb') as csv_in:
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

# Set up CSV writer
csv_out = open('data/connections.csv', 'w') 
writer = csv.writer(csv_out, delimiter=',', encoding='utf_8')

num_in_key = 0

start_time = datetime.datetime.now()

# Get details for each user, add it to an array, and add that array to big array
for index, user in enumerate(users) :
    user_info = api.GetUser(user_id=None, screen_name=user)
    print(user_info.id)
    writer.writerow([str(user_info.id)])

    print(index)

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
