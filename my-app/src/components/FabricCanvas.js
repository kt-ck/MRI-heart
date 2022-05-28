import { useEffect, useState } from "react";
import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";
import { setShowObj } from "../features/toolbox/currentFileSysSlice";
function FabricCanvas({ mainWidth, mainHeight, getUrlFromDicomObj }) {
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
      height: dicomInfo["height"],
      width: dicomInfo["width"],
    };
    // console.log(dicomShowIndex);
    dispatch(setShowObj(obj));
  };

  const fabricCanvasMouseDoubleClick = (e) => {
    if (circle) {
      cvs.remove(circle);
      setCircle("");
    }
  };

  useEffect(() => {
    if (activeIndex === 1 && dicom_list.length !== 0) {
      if (!cvs) {
        setCvs(new fabric.Canvas("fabricCanvas"), {
          width: mainWidth,
          height: mainHeight,
        });
      } else {
        setCircle(
          new fabric.Circle({
            radius: 20,
            top: 10,
            left: 10,
            fill: "#08f2e5",
            opacity: 0.3,
            cornerSize: 6,
          })
        );
      }
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
          cornerSize: 6,
        })
      );
    }
  }, [cvs]);

  useEffect(() => {
    if (circle && activeIndex === 1 && dicom_list.length !== 0) {
      cvs.add(circle);
      cvs.on("mouse:move", fabricCanvasMouseMove);
      cvs.on("mouse:dblclick", fabricCanvasMouseDoubleClick);
    }
  }, [circle]);
  return (
    <>
      <canvas id="fabricCanvas" width={mainWidth} height={mainHeight}></canvas>
    </>
  );
}

export default FabricCanvas;
