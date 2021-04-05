import os 

from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/api/blobs/<string:projectname>/', methods=['GET'])
def get_blobs(projectname):
    #
    # eventually a JSON with a list of urls for each blob
    return 'should be new blobs from {}\n'.format(projectname)


@app.route('/api/blobs/<projectname>/', methods=['POST'])
def write_blobs(projectname):
    request_info = json.loads(flask.request.data.decode('utf-8'))
    print(request_info)
    new_blob = request_info['new_blob']
    blob_name = request_info['blob_name']
    path_dir = os.path.join('storage/', projectname)
    print('created path_dir:', path_dir) # TODO DELETE

    f = open(blob_name, 'x')
    f.write(new_blob)
    f.close()

    context = {
        "blob_name": blob_name,
        # "owner": logname,
        "blob": new_blob
    }
    return flask.make_response(flask.jsonify(**context), 201)


@app.route('/api/<projectname>/', methods=['POST'])
def make_project(projectname):
    # TODO: check if projectname already exists
    path_dir = os.path.join('storage/', projectname)
    print('created path_dir:', path_dir) # TODO: DELETE
    os.mkdir(path_dir)

    context = {
        "project_name": project_name
        # "owner": logname,
    }
    return context
    # return flask.make_response(flask.jsonify(**context), 201)


if __name__ == "__main__":
    app.run(debug=True)
