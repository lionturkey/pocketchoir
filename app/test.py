import os
import datetime

def MacOSdirClean(l):
    newL = []
    for dir in l:
        if dir[0] != '.':
            newL.append(dir)
    return newL

userData = "/Users/Michael_wang/Documents/UM_Winter_2021/EECS441/pocketchoir/app/Projects"
projectIn = "TammyProject"
p = os.path.join(userData, projectIn)
l = os.listdir(p)
l = MacOSdirClean(l)
l.sort()
ts = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
a = "test"
a = ts+a
print(a[:14])





