from flask import Flask, render_template, request, jsonify
import json
from datetime import datetime

app = Flask(__name__)

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

    path = bfs(data, first, second)


    if type(path) is str:
        return jsonify(path)

    connections = {}

    total_nodes = []
    total_edges = []

    try:
        for node in path:
            if not node in total_nodes:
                total_nodes.append(node)
            neighbors = get_neighbors(node)
            for neighbor in neighbors:
                if neighbor in path:
                    total_edges.append([node, neighbor])
    except TypeError:
        return jsonify(path)

    for node in get_neighbors(first):
        if not node in total_nodes:
            total_nodes.append(node)
            total_edges.append([first, node])


    for node in get_neighbors(second):
        if not node in total_nodes:
            total_nodes.append(node)
            total_edges.append([second, node])

    print total_nodes

    d3_nodes = []
    d3_edges = []

    for node in total_nodes:
        d3_nodes.append({'id': node})

    for edge in total_edges:
        d3_edges.append({'source': total_nodes.index(edge[0]), 'target': total_nodes.index(edge[1])})

    d3_return = {
        'length': len(path),
        'nodes': d3_nodes,
        'edges': d3_edges
    }

    return jsonify(d3_return)

@app.route("/submit-first/", methods=["GET"])
def submit_first():
    id = request.args.get('id')
    neighbors = get_neighbors(id)

    if not neighbors == None:
        total_nodes = [id]
        total_edges = []

        nodes = [{'id': id}]
        edges = []

        for neighbor in neighbors:
            total_nodes.append(neighbor)
            nodes.append({'id': neighbor})

        for neighbor in neighbors:
            edges.append({'source': total_nodes.index(id), 'target': total_nodes.index(neighbor)})

        d3_return = {
            'nodes': nodes,
            'edges': edges
        }

        return jsonify(d3_return);
    else:
        return "Uh oh! We couldn't find any friends for that user. It's probably our fault -- this tool was built in 48 hours and is still under construction. Bear with us!"

def get_neighbors(node):
    try:
        return data[node]
    except:
        return None

def bfs(graph, start, end):
    start_time = datetime.now()
    # maintain a queue of paths
    queue = []
    # push the first path into the queue
    queue.append([start])
    while queue:
        current_time = datetime.now()
        if (current_time - start_time).total_seconds() > 10:
            return 'Looks like that person is too far away for us to calculate a connection.'
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
    app.run()
