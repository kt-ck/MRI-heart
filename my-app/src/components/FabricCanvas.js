import { useEffect, useState } from "react";
import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";
import { setShowObj } from "../features/toolbox/currentFileSysSlice";
function FabricCanvas({
  mainWidth,
  mainHeight,
  getUrlFromDicomObj,
  dicomShowIndex,
}) {
  const dicomInfo = useSelector((state) => state.global.dicomInfo);
  const dicom_list = useSelector((state) => state.global.dicomlist);
  const activeIndex = useSelector((state) => state.global.activeIndex);
  const dispatch = useDispatch();
  const [cvs, setCvs] = useState("");
  const [circle, setCircle] = useState("");

  const fabricCanvasMouseMove = (event) => {
    let obj = {
      scaleX: circle.get("scaleX"),
      scaleY: circle.get("scaleY"),
      x: circle.get("left"),
      y: circle.get("top"),
      radius: circle.get("radius"),
      dicom_img: getUrlFromDicomObj(dicom_list[dicomShowIndex]),
      height: dicomInfo["height"],
      width: dicomInfo["width"],
    };
    dispatch(setShowObj(obj));
  };
  useEffect(() => {
    if (activeIndex === 1 && dicom_list.length !== 0 && !cvs) {
      setCvs(new fabric.Canvas("fabricCanvas"), {
        width: mainWidth,
        height: mainHeight,
      });
    }
  }, [activeIndex]);
  useEffect(() => {
    if (cvs && dicom_list.length !== 0) {
      setCircle(
        new fabric.Circle({
          radius: 20,
          top: 10,
          left: 10,
          fill: "#08f2e5",
          opacity: 0.3,
        })
      );
    }
  }, [cvs]);

  useEffect(() => {
    if (circle && activeIndex === 1 && dicom_list.length !== 0) {
      cvs.add(circle);
      cvs.on("mouse:move", fabricCanvasMouseMove);
    }
  }, [circle]);
  return (
    <canvas id="fabricCanvas" width={mainWidth} height={mainHeight}></canvas>
  );
}

export default FabricCanvas;
