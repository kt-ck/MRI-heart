import pydicom
import sys
import cv2 as cv
import json
dicom = sys.argv[1]

ds = pydicom.dcmread("uploads/{}".format(dicom))

img = ds.pixel_array
img_bgr = cv.cvtColor(img, cv.COLOR_RGB2BGR)
cv.imwrite("public/images/dicom_img/{}.png".format(dicom), img_bgr)

height, width = img.shape[:2]
data = {
    "height": height,
    "width": width,
    "filename": dicom,
    "PhysicalDelta": list(ds[0x0028, 0x0030].value)
}

data_string = json.dumps(data)

with open("json/{}.json".format(dicom), 'w') as f:
    json.dump(data_string, f)

print("success")
