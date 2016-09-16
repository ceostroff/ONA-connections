from flask import Flask, render_template
from flask_script import Manager

app = Flask(__name__)
manager = Manager(app)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/about/')
def about():
    return render_template('about.html')

@app.route("/submit", methods=["POST"])
def submit_handler():
    return {user_network}



if __name__ == '__main__':
    manager.run()
