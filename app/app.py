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

    start_time = datetime.now()
    path = bfs(data, first, second)

    return jsonify(path)

@app.route("/submit-first/", methods=["GET"])
def submit_first():
    id = request.args.get('id')
    neighbors = get_neighbors(id)
    return jsonify(neighbors);

def get_neighbors(node):
    return data[node]

def bfs(graph, start, end):
    # maintain a queue of paths
    queue = []
    # push the first path into the queue
    queue.append([start])
    while queue:
        # get the first path from the queue
        path = queue.pop(0)
        # get the last node from the path
        node = path[-1]
        # path found
        if node == end:
            return path
        # enumerate all adjacent nodes, construct a new path and push it into the queue
        for adjacent in graph.get(node, []):
            new_path = list(path)
            new_path.append(adjacent)
            queue.append(new_path)



if __name__ == '__main__':
    manager.run()
