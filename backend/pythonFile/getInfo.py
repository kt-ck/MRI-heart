import pydicom
import sys
import cv2 as cv
import json
import os
import pylab

project = sys.argv[1]
project_dir = "uploads/{}/".format(project)
img_save_path = "public/images/dicom_img/{}/".format(project)
json_save_path = "json/{}/".format(project)
if not os.path.exists(img_save_path):
    os.mkdir(img_save_path)

if not os.path.exists(json_save_path):
    os.mkdir(json_save_path)

for dicom_full in os.listdir(project_dir):
    dicom = dicom_full.split(".")[0]
    ds = pydicom.dcmread(project_dir + dicom_full)

    img = ds.pixel_array
    # img_bgr = cv.cvtColor(img, cv.COLOR_RGB2BGR)

    pylab.imsave(img_save_path + "{}.png".format(dicom),
                 img, cmap=pylab.cm.bone)

    height, width = img.shape[:2]
    data = {
        "height": height,
        "width": width,
        "filename": dicom,
        "PhysicalDelta": list(ds[0x0028, 0x0030].value)
    }

    data_string = json.dumps(data)

    with open(json_save_path + "{}.json".format(dicom), 'w') as f:
        json.dump(data_string, f)

    print("success")
