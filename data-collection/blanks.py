from config import *
import json
import unicodecsv as csv
from pprint import pprint

# Open friends JSON file
with open('data/final_connections.json') as json_file:
    data = json.load(json_file)

csv_out = open('data/missing.csv', 'w') 
writer = csv.writer(csv_out, delimiter=',', encoding='utf_8')
    
for key, row in data.items():
    if len(row) == 0:
        writer.writerow(key)
        
    
