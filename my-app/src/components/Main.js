import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToolboxActiveIndex } from "../features/toolbox/currentFileSysSlice";
import { setDicomInfo } from "../features/global/globalSlice";
import { setRow1MenuIndex } from "../features/toolbox/currentFileSysSlice";
import { setDicomShowIndex } from "../features/global/globalSlice";
import FabricCanvas from "./FabricCanvas";

function Main({ width, height }) {
  // useSelector
  const dicomInfo = useSelector((state) => state.global.dicomInfo);
  const dicom_list = useSelector((state) => state.global.dicomlist);
  const activeIndex = useSelector((state) => state.global.activeIndex);
  const menuHeight = useSelector((state) => state.global.menuHeight);
  const sidebarWidth = useSelector((state) => state.global.sidebarWidth);
  const host = useSelector((state) => state.global.host);
  const api = useSelector((state) => state.global.api);
  const projectname = useSelector((state) => state.global.projectname);
  const toolboxActiveIndex = useSelector(
    (state) => state.currentFileSys.toolboxActiveIndex
  );
  const dicomShowIndex = useSelector((state) => state.global.dicomShowIndex);
  //useState
  const [mainWidth, setMainWidth] = useState(500);
  const [mainHeight, setMainHeight] = useState(500);
  const [operCtx, setOperCtx] = useState({});
  const [operCvs, setOperCvs] = useState({});
  const [imgCtx, setImgCtx] = useState({});
  const [imgCvs, setImgCvs] = useState({});
  const [mouseDownInfo, setMouseDownInfo] = useState({});
  const [isDown, setIsDown] = useState(false);
  const [line, setLine] = useState([]);

  //const data
  const x_del = Math.round((width - mainWidth) / 2) + sidebarWidth;
  const y_del = Math.round((height - mainHeight) / 2) + menuHeight;

  const dispatch = useDispatch();

  //const function
  const showImgOnCanvas = (imgSrc) => {
    let img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      setMainWidth(dicomInfo.width);
      setMainHeight(dicomInfo.height);
      imgCtx.drawImage(
        img,
        Math.round((mainWidth - dicomInfo.width) / 2),
        Math.round((mainHeight - dicomInfo.height) / 2),
        dicomInfo.width,
        dicomInfo.height
      );
    };
  };

  const getUrlFromDicomObj = (fileobj) =>
    `${host}images/dicom_img/${projectname}/${
      fileobj["filename"].split(".")[0]
    }.png`;

  const setOperCanvasEmpty = () => {
    operCtx.clearRect(0, 0, operCvs.width, operCvs.height);
  };

  // useEffect
  useEffect(() => {
    //初始化operCvs、operCtx, imgCvs, imgCtx
    let operCvs = document.querySelector("#operCanvas");
    let operCtx = operCvs.getContext("2d");
    let imgCvs = document.querySelector("#imgCanvas");
    let imgCtx = imgCvs.getContext("2d");
    imgCtx.fillStyle = "#e2e8f0";
    imgCtx.fillRect(0, 0, imgCvs.width, imgCvs.height);
    setOperCvs(operCvs);
    setOperCtx(operCtx);
    setImgCvs(imgCvs);
    setImgCtx(imgCtx);
  }, []);

  useEffect(() => {
    //初始化要操作的图片
    if (dicom_list.length > 0) {
      setOperCanvasEmpty();
      showImgOnCanvas(getUrlFromDicomObj(dicom_list[0]));
      dispatch(setToolboxActiveIndex(0));
      dispatch(setDicomShowIndex(0));
    }
  }, [mainWidth, mainHeight, dicom_list]);

  //当点击画圆的时候
  useEffect(() => {
    if (activeIndex === 1) {
      dispatch(setRow1MenuIndex(1));
    }
  }, [activeIndex]);

  useEffect(() => {
    //更新dicomInfo
    axios
      .post(api + "getDicomJson", {
        projectName: projectname,
        dicomName: dicom_list[dicomShowIndex],
      })
      .then((res) => {
        // console.log(res.data.data);
        let currentData = JSON.parse(JSON.parse(res.data.data));
        dispatch(setDicomInfo(currentData));
      })
      .catch((err) => console.log(err));
  }, [dicomShowIndex, dicom_list]);

  // canvas listener handler
  const contextMenu = (e) => {
    e.preventDefault();
  };

  const mouseMove = (e) => {};

  const mouseDown = (e) => {
    setIsDown(true);
    if (activeIndex === 0 && dicom_list.length !== 0) {
      setMouseDownInfo(e);
    }
  };

  const mouseUp = (e) => {
    if (activeIndex === 0 && dicom_list.length !== 0) {
      if (
        isDown &&
        mouseDownInfo.clientX === e.clientX &&
        mouseDownInfo.clientY === e.clientY
      ) {
        //单击canvas某处
        if (mouseDownInfo.buttons === 1) {
          operCtx.fillStyle = "#08f2e5";
          operCtx.fillRect(
            mouseDownInfo.clientX - x_del,
            mouseDownInfo.clientY - y_del,
            1,
            1
          );
          if (line.length % 2 === 1) {
            let point = line[line.length - 1];
            operCtx.strokeStyle = "#08f2e5";
            operCtx.beginPath();
            operCtx.moveTo(point[0] - x_del, point[1] - y_del);
            operCtx.lineTo(e.clientX - x_del, e.clientY - y_del);
            operCtx.stroke();

            let dis = Math.sqrt(
              (point[0] - e.clientX) *
                (point[0] - e.clientX) *
                dicomInfo.PhysicalDelta[0] *
                dicomInfo.PhysicalDelta[0] +
                (point[1] - e.clientY) *
                  (point[1] - e.clientY) *
                  dicomInfo.PhysicalDelta[1] *
                  dicomInfo.PhysicalDelta[1]
            );
            dis = (dis / 10).toFixed(3);
            let angle = Math.atan(
              (point[1] - e.clientY) / (point[0] - e.clientX)
            ).toFixed(3);
            operCtx.save();
            operCtx.translate(
              Math.round((point[0] + e.clientX) / 2) - x_del,
              Math.round((point[1] + e.clientY) / 2) - y_del
            );
            operCtx.rotate(angle);
            operCtx.textAlign = "center";
            operCtx.font = "1rem serif";
            operCtx.fillStyle = "#08f2e5";
            operCtx.fillText(dis.toString() + "cm", 0, 16);
            operCtx.restore();
          }
          setLine(line.concat([[e.clientX, e.clientY]]));
        } else if (mouseDownInfo.buttons === 2) {
          operCtx.clearRect(0, 0, operCvs.width, operCvs.height);
          setLine([]);
        }
      } else if (isDown) {
        if (mouseDownInfo.buttons === 1) {
          //左键滑动

          if (e.clientX > mouseDownInfo.clientX) {
            if (dicomShowIndex + 1 < dicom_list.length) {
              showImgOnCanvas(
                getUrlFromDicomObj(dicom_list[dicomShowIndex + 1])
              );
              dispatch(setToolboxActiveIndex(toolboxActiveIndex + 1));
              dispatch(setDicomShowIndex(dicomShowIndex + 1));
            }
          } else if (e.clientX < mouseDownInfo.clientX) {
            if (dicomShowIndex - 1 >= 0) {
              showImgOnCanvas(
                getUrlFromDicomObj(dicom_list[dicomShowIndex - 1])
              );
              dispatch(setToolboxActiveIndex(toolboxActiveIndex - 1));
              dispatch(setDicomShowIndex(dicomShowIndex - 1));
            }
          }
        }
      }
    }
    setIsDown(false);
  };

  return (
    <div
      id="Main"
      className="bg-slate-400 dark:bg-slate-700 flex justify-center items-center"
      style={{ width, height }}
    >
      <div className="relative flow-root">
        <div
          className="z-0"
          style={{ width: mainWidth, height: mainHeight }}
        ></div>
        <canvas
          id="imgCanvas"
          className="absolute top-0 left-0 z-10"
          width={mainWidth}
          height={mainHeight}
          onContextMenu={contextMenu}
        ></canvas>

        <canvas
          id="operCanvas"
          width={mainWidth}
          height={mainHeight}
          className={`absolute top-0 left-0 ${
            activeIndex === 0 ? "z-30" : "z-20"
          }`}
          onMouseMove={mouseMove}
          onMouseDown={mouseDown}
          onMouseUp={mouseUp}
          onContextMenu={contextMenu}
        ></canvas>

        <div
          className={`absolute top-0 left-0 ${
            activeIndex === 1 ? "z-30" : "z-20"
          }`}
        >
          <FabricCanvas
            mainWidth={mainWidth}
            mainHeight={mainHeight}
            getUrlFromDicomObj={getUrlFromDicomObj}
          />
        </div>
      </div>
    </div>
  );
}

export default Main;
