from app import app
from flask import render_template, request, send_file, redirect, jsonify, make_response, send_from_directory, abort
from flask_cors import CORS, cross_origin
import os

# app.config['CORS_HEADERS'] = 'Content-Type'
# CORS(app)

app.config["userData"] = "/Users/Michael_wang/Documents/UM_Winter_2021/EECS441/pocketchoir/app/Projects"

# get rid of hidden files
def MacOSdirClean(l):
    newL = []
    for dir in l:
        if dir[0] != '.':
            newL.append(dir)
    return newL

@app.route('/api/get-info/<string:projectName>', methods=["GET"])
@cross_origin(app)
def get_info(projectName):
    p = os.path.join(app.config["userData"], projectName)
    if os.path.isdir(p):
        # get names of each clips within this project folder
        nameList = os.listdir(p)
        nameList = MacOSdirClean(nameList)
        nameList.sort()
        # list contain info in the form of:
        # {amount:2, 1:clipName1, 2:clipName2}
        returnList = {}
        returnList["amount"] = len(nameList)
        for i in range(len(nameList)):
            returnList[str(i)] = nameList[i]

        res = make_response(jsonify(returnList), 200)
        return res
    else:
        returnList = {}
        returnList["amount"] = "0"
        res = make_response(jsonify(returnList), 200)
        return res



@app.route('/api/upload-clip/', methods=["GET","POST"])
@cross_origin(app)
def upload_clip():
    print("ha")
    print(request)
    print(request.files)
    if request.method == "POST":
        if request.files:
            cming_clip = request.files["file"]
            clip_name = request.files["cname"]
            print(cming_clip)
            print(clip_name)
            p = os.path.join(app.config["userData"], "TammyProject")
            print(p)
            cming_clip.save(os.path.join(p, "clip1"))
            print("clip saved")
            # return redirect(request.url)
            return {"test":1}
    return {"test":2}

@app.route('/api/get-blob/<string:name>', methods=["GET"])
@cross_origin(app)
def get_blob(name):
    p = os.path.join(app.config["userData"], "TammyProject")
    print(p)
    return send_from_directory(p, "clip1", as_attachment=False)
