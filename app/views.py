from app import app
from flask import render_template, request, send_file, redirect, jsonify, make_response, send_from_directory, abort
from flask_cors import CORS, cross_origin
import os

# app.config['CORS_HEADERS'] = 'Content-Type'
# CORS(app)

app.config["clip_upload"] = "/Users/Michael_wang/Documents/UM_Winter_2021/EECS441/pocketchoir/app/Projects"

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
            p = os.path.join(app.config["clip_upload"], "TammyProject")
            print(p)
            cming_clip.save(os.path.join(p, "clip1"))
            print("clip saved")
            # return redirect(request.url)
            return {"test":1}
    return {"test":2}

@app.route('/api', methods=["GET"])
@cross_origin(app)
def get_blob():
    p = os.path.join(app.config["clip_upload"], "TammyProject")
    print(p)
    return send_from_directory(p, "clip1", as_attachment=False)