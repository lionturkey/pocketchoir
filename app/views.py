from app import app
from flask import render_template, request, send_file, redirect, jsonify, make_response, send_from_directory, abort
from flask_cors import CORS, cross_origin
import os
import datetime

# app.config['CORS_HEADERS'] = 'Content-Type'
# CORS(app)

app.config["userData"] = "/home/ubuntu/pocketchoir/app/Projects"
# app.config["userData"] = "/Users/Michael_wang/Documents/UM_Winter_2021/EECS441/pocketchoir/app/Projects"

def nameManager(name, operation):
    # %y%m%d%H%M%S = YYYYMMDD + hour + minute + second, i.e. 20210414181602
    timeStamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    if operation == "add":
        return timeStamp + name
    elif operation == "remove":
        return name[14:]
    raise Exception("nameManager: No operation specified")

# split timename into time, name
def splitTime(nameList):
    time = []
    name = []
    for ele in nameList:
        time.append(ele[:14])
        name.append(ele[14:])
    return time, name

# user provide the name they can see, this is to find what is the file
# name on the server end
def getFileName(projectName, name):
    p = os.path.join(app.config["userData"], projectName)
    nameList = os.listdir(p)
    nameList = MacOSdirClean(nameList)
    timeList, nameList = splitTime(nameList)
    return timeList[nameList.index(name)] + name

# get rid of hidden files
def MacOSdirClean(l):
    newL = []
    for dir in l:
        if dir[0] != '.':
            newL.append(dir)
    return newL

@app.route('/')
def root():
    return app.send_static_file('index.html')

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
            returnList[str(i)] = nameManager(nameList[i], "remove")

        res = make_response(jsonify(returnList), 200)
        return res
    else:
        os.mkdir(p)
        returnList = {}
        returnList["amount"] = "0"
        res = make_response(jsonify(returnList), 200)
        return res



@app.route('/api/upload-clip/<string:projectName>', methods=["GET","POST"])
@cross_origin(app)
def upload_clip(projectName):
    print("ha")
    print(request)
    print(request.files)
    if request.method == "POST":
        if request.files:
            cming_clip = request.files["myBlob"]
            cming_name = nameManager(cming_clip.filename, "add")
            print(cming_clip)
            print(cming_name)
            p = os.path.join(app.config["userData"], projectName)
            print(p)
            cming_clip.save(os.path.join(p, cming_name))
            print("clip", cming_name, "saved")
            # return redirect(request.url)
            res = make_response(jsonify({"test":1}), 200)
            return res
    res = make_response(jsonify({"test": 2}), 200)
    return res

@app.route('/api/get-blob/<string:projectName>/<string:name>', methods=["GET"])
@cross_origin(app)
def get_blob(projectName, name):
    p = os.path.join(app.config["userData"], projectName)
    fileName = getFileName(projectName, name)
    return send_from_directory(p, fileName, as_attachment=False)

@app.route('/api/rename/<string:projectName>/<string:newName>/<string:oldName>')
@cross_origin(app)
def renameClip(projectName, newName, oldName):
    fileName = getFileName(projectName, oldName)
    srcP = os.path.join(app.config["userData"], projectName, fileName)
    dstP = os.path.join(app.config["userData"], projectName, fileName[:14] + newName)
    print(srcP)
    print(dstP)
    os.rename(srcP, dstP)
    print(oldName, " changed to ", newName)
    return ("", 200)

@app.route('/api/delete/<string:projectName>/<string:name>')
@cross_origin(app)
def deleteClip(projectName, name):
    fileName = getFileName(projectName, name)
    p = os.path.join(app.config["userData"], projectName, fileName)
    os.remove(p)
    print(name, "removed")
    return ("", 200)

