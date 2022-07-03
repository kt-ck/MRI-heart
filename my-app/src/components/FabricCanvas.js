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
  let isDown = false;
  let line = [];

  const calcPolygonArea = (vertices) => {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i][0];
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1][1];
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1][0];
      var subY = vertices[i][1];

      total += addX * addY * 0.5;
      total -= subX * subY * 0.5;
    }

    return Math.abs(total);
  };

  const fabricCanvasMouseMove = (event) => {
    if (isDown) {
      line.push([event.e.x, event.e.y]);
      // console.log(line);
    }

    // let obj = {
    //   scaleX: circle.get("scaleX"),
    //   scaleY: circle.get("scaleY"),
    //   x: circle.get("left"),
    //   y: circle.get("top"),
    //   radius: circle.get("radius"),
    //   height: dicomInfo["height"],
    //   width: dicomInfo["width"],
    // };
    // console.log(dicomShowIndex);
    // dispatch(setShowObj(obj));
  };

  const fabricCanvasMouseDoubleClick = (e) => {
    cvs.clear();
  };

  const fabicMouseDown = (e) => {
    isDown = true;
  };

  const fabricMouseUp = (e) => {
    isDown = false;
    let pixelArea = calcPolygonArea(line);
    let scale = dicomInfo["PhysicalDelta"];
    dispatch(
      setShowObj({ area: (pixelArea / (scale[0] * scale[1])).toFixed(2) })
    );
    line = [];
  };

  useEffect(() => {
    if (activeIndex === 1 && dicom_list.length !== 0) {
      if (!cvs) {
        setCvs(new fabric.Canvas("fabricCanvas"), {
          width: mainWidth,
          height: mainHeight,
        });
      }
    }
  }, [activeIndex]);
  useEffect(() => {
    if (cvs && dicom_list.length !== 0) {
      cvs.isDrawingMode = true;
      cvs.freeDrawingBrush.color = "#08f2e5";
      cvs.on("mouse:down", fabicMouseDown);
      cvs.on("mouse:move", fabricCanvasMouseMove);
      cvs.on("mouse:up", fabricMouseUp);
      cvs.on("mouse:dblclick", fabricCanvasMouseDoubleClick);
    }
  }, [cvs]);
  return (
    <>
      <canvas id="fabricCanvas" width={mainWidth} height={mainHeight}></canvas>
    </>
  );
}

export default FabricCanvas;
