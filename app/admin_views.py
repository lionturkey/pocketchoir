from app import app
from flask import render_template

@app.route('/admin')
def hello_world_admin():
        return render_template("admin/dashboard.html")

@app.route('/admin/api/blobs/<string:projectname>/')
def get_blobs_admin(projectname):
    #
    # eventually a JSON with a list of urls for each blob
        return 'admin should be new blobs from {}\n'.format(projectname)