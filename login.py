"""
URLs include.

/project/login*
"""
import os
import flask

@app.route('/project/login/', methods=['POST'])
def login():
    """Log in"""
    new_project = False
    if flask.request.method == 'POST':
        username = flask.request.form['username']
        project_name = flask.request.form['projectName']
        if not os.path.exists('storage/project_name'):
            os.makedirs('storage/project_name')
            new_project = True
        flask.session['username'] = flask.request.form['username']
        flask.session['projectName'] = flask.request.form['projectName']
    response = {
        'username': username,
        'projectName': project_name,
        'newProject': new_project,
    }
    return flask.redirect(flask.url_for('show_project'))
