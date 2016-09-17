from flask import Flask, render_template, request, jsonify
from flask_script import Manager
import json
from datetime import datetime

start_time = None

app = Flask(__name__)
manager = Manager(app)

with open('final_connections.json') as data_file:
    data = json.load(data_file)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/about/')
def about():
    return render_template('about.html')

@app.route("/submit-second/", methods=["GET"])
def submit_second():
    first = request.args.get('first')
    second = request.args.get('second')

    path = find_path(data, first, second)

    return jsonify(path)

@app.route("/submit-first/", methods=["GET"])
def submit_first():
    id = request.args.get('id')
    neighbors = get_neighbors(id)
    return jsonify(neighbors);

def get_neighbors(node):
    return data[node]

def find_path(data, start, end):

    q = []

    q.append([start])
    
    while q:
        path = queue.pop(0)

        node = path[-1]
        
        if node == end:
            return path

        for adjacent in data.get(node, []):
        


if __name__ == '__main__':
    manager.run()
