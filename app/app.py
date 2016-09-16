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
    path = find_shortest_path(data, first, second)

    return jsonify(path)

@app.route("/submit-first/", methods=["GET"])
def submit_first():
    id = request.args.get('id')
    neighbors = get_neighbors(id)
    return jsonify(neighbors);

def get_neighbors(node):
    return data[node]


# def find_path(graph, start, end, path=[]):
#     path = path + [start]
#     if start == end:
#         return path
#     if not graph.has_key(start):
#         return None
#     for node in graph[start]:
#         print('running')
#         if node not in path:
#             newpath = find_path(graph, node, end, path)
#             if newpath: return newpath
#     return None
    
def find_shortest_path(graph, start, end, path=[]):
    path = path + [start]
    if start == end:
        return path
    if not graph.has_key(start):
        return None
    shortest = None


    
    for node in graph[start]:
        current_time = datetime.now()
        print((current_time - start_time).total_seconds());
        if node not in path:
            newpath = find_shortest_path(graph, node, end, path)
            if newpath:
                if not shortest or len(newpath) < len(shortest):
                    shortest = newpath
                if (current_time - start_time).total_seconds() > 10:
                    return shortest

        
            
            


if __name__ == '__main__':
    manager.run()
