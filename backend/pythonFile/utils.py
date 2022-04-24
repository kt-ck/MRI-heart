import cv2 as cv
import pydicom
from pydicom.data import get_testdata_file
from pydicom.pixel_data_handlers.util import apply_voi_lut

ds = pydicom.dcmread("IMG-0001-00003.dcm")
print(ds.pixel_array.shape)
print(ds[0x0028, 0x0030].value)
# print(ds.PhysicalDeltaY)


img = ds.pixel_array
img_bgr = cv.cvtColor(img, cv.COLOR_RGB2BGR)

# cv.namedWindow("frame")
# cv.imshow("frame", img_bgr)
# cv.waitKey(0)
# cv.destroyAllWindows()
cv.imwrite("test.png", img_bgr)
