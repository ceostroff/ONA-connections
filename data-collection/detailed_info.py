from config import *
import twitter

api = twitter.Api(
    # Set these in config.py
    consumer_key,
    consumer_secret,
    access_token,
    access_token_secret
)


