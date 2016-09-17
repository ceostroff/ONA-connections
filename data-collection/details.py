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

csv_out = open('data/details.csv', 'w') 
writer = csv.writer(csv_out, delimiter=',', encoding='utf_8')

num_in_key = 0

for index, user in enumerate(users):

    print("Getting details for user #" + str(index))
    
    num_in_key += 1
    
    try:
        user_details = api.GetUser(user_id=int(user))
        image = user_details.profile_image_url
        name = user_details.name
        screen_name = user_details.screen_name
        url = user_details.url
        bio = user_details.description

        writer.writerow([user, image, name, screen_name, url, bio])

    except twitter.error.TwitterError, e:
        print('\nERROR\n')
        pass
    except IOError:
        print('\nERROR\n')
        pass

    if (num_in_key > 140):
        num_in_key = 0
        
        if (api_key_set < keys_length):
            api_key_set += 1
        else:
            api_key_set = 0

        api = def_api(api_key_set)

        
