from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
        return 'Hello, World!'

@app.route('/api/blobs/<string:projectname>/')
def get_blobs(projectname):
    #
    # eventually a JSON with a list of urls for each blob
        return 'should be new blobs from {}\n'.format(projectname)
