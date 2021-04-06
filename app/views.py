from app import app
from flask import render_template, request, send_file, redirect, jsonify, make_response, send_from_directory, abort
from flask_cors import CORS, cross_origin
import os

# app.config['CORS_HEADERS'] = 'Content-Type'
# CORS(app)

@app.route('/')
def hello_world():
    return render_template("public/index.html")
    # return render_template("app/templates/admin/dashboard.html")



@app.route('/api/blobs/<string:projectname>/')
def get_blobs(projectname):
    #
    # eventually a JSON with a list of urls for each blob
    return 'should be new blobs from {}\n'.format(projectname)

app.config["image_upload"] = "/Users/Michael_wang/PycharmProjects/441try/app/static/img"
app.config["clip_upload"] = "/Users/Michael_wang/PycharmProjects/441try/app/static/clip"

@app.route('/upload-image', methods=["GET","POST"])
def upload_image():
    print(request)
    print(request.files)

    if request.method == "POST":
        if request.files:
            cming_img = request.files["inFile"]
            print(cming_img)
            cming_img.save(os.path.join(app.config["image_upload"], cming_img.filename))
            print("image saved")
            # return redirect(request.url)
            return {"test":1}
    # return ('', 204)
    return {"test":2}
    # return render_template("admin/dashboard.html")

@app.route('/api/upload-clip', methods=["GET","POST"])
@cross_origin(app)
def upload_clip():
    print("ha")
    print(request)
    print(request.files)
    if request.method == "POST":
        if request.files:
            cming_clip = request.files["file"]
            # clip_name = request.files["name"]
            print(cming_clip)
            # print(clip_name)
            cming_clip.save(os.path.join(app.config["clip_upload"], "clip_name"))
            print("clip saved")
            # return redirect(request.url)
            return {"test":1}
    # return ('', 204)
    return {"test":2}
    # return render_template("admin/dashboard.html")


# @app.route('/get-image/<string:name>/', method=["GET","POST"])
@app.route('/get-image', methods=["GET"])
@cross_origin(app)
def get_image():
    # req = request.get_json()
    # print(req)
    # response = jsonify({'some': 'data'})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    p = os.path.join(app.config["clip_upload"], "upload-clip")
    print(p)
    return send_from_directory(p, "merge.png", as_attachment=False)

@app.route('/get-image2', methods=["GET"])
@cross_origin(app)
def get_image2():
    # req = request.get_json()
    # print(req)
    response = jsonify({'some': 'data'})
    return response
    # # response.headers.add('Access-Control-Allow-Origin', '*')
    # p = os.path.join(app.config["clip_upload"], "upload-clip")
    # print(p)
    # return send_from_directory(p, "clip_name", as_attachment=False)

# @app.route('/api/<string:projectName>', methods=["GET"])
# @cross_origin(app)
# def get_blob(projectName):
#     p = os.path.join(app.config["clip_upload"], projectName)
#     print(p)
#     return send_from_directory(p, "clip_name", as_attachment=True)


@app.route('/api', methods=["GET"])
@cross_origin(app)
def get_blob():
    # p = os.path.join(app.config["clip_upload"], "upload-clip")
    # print(p)
    return send_from_directory(app.config["clip_upload"], "clip_name", as_attachment=False)
    # return send_from_directory(app.config["clip_upload"], "clip_name", as_attachment=False)


# @app.route('/get-image/<string:imageName>/', methods=['GET', 'POST'])
# def get_image(imageName):
#     # GET request
#     if request.method == 'GET':
#         message = {'greeting': 'Hello from Flask!' + imageName}
#         print(message)
#         return jsonify(message)  # serialize and use JSON headers
#     # POST request
#     if request.method == 'POST':
#         print(request.get_json())  # parse as JSON
#         return 'Sucesss', 200
#
#     return jsonify({'a': 'b'})

# @app.route('/get-image/<string:imageName>/')
# def get_image(imageName):
#
#     try:
#         print(app.config["image_upload"] + imageName)
#         # return ziqiw@umich.edu(
#         #     app.config["image_upload"], filename=imageName, as_attachment=False
#         # )
#         m = {"add":app.config["image_upload"] + imageName}
#         return jsonify(m)
#     except FileNotFoundError:
#         abort(404)
#
#     return ('',204)

