import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setToolboxActiveIndex } from "../features/toolbox/currentFileSysSlice";
function Main({ width, height }) {
  //useState
  const [mainWidth, setMainWidth] = useState(500);
  const [mainHeight, setMainHeight] = useState(500);
  const [ctx, setCtx] = useState({});
  const [mouseDownInfo, setMouseDownInfo] = useState({});
  const [isDown, setIsDown] = useState(false);
  const [cvs, setCvs] = useState({});
  const [line, setLine] = useState([]);
  const [dicomShowIndex, setDicomShowIndex] = useState(0);

  // useSelector
  const dicomInfo = useSelector((state) => state.global.dicomInfo);
  const dicom_list = useSelector((state) => state.global.dicomlist);
  const activeIndex = useSelector((state) => state.global.activeIndex);
  const menuHeight = useSelector((state) => state.global.menuHeight);
  const sidebarWidth = useSelector((state) => state.global.sidebarWidth);
  const host = useSelector((state) => state.global.host);
  const projectname = useSelector((state) => state.global.projectname);
  const toolboxActiveIndex = useSelector(
    (state) => state.currentFileSys.toolboxActiveIndex
  );

  //const data
  const x_del = Math.round((width - mainWidth) / 2) + sidebarWidth;
  const y_del = Math.round((height - mainHeight) / 2) + menuHeight;

  const dispatch = useDispatch();

  //const function
  const showImgOnCanvas = (imgSrc) => {
    let img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      ctx.drawImage(
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

  const zoomCanvas = (e) => {
    if (e.deltaY < 0 && mainHeight + 30 < height && mainWidth + 30 < width) {
      setMainHeight(mainHeight + 30);
      setMainWidth(mainWidth + 30);
    } else if (e.deltaY > 0 && mainHeight - 30 > 100 && mainWidth - 30 > 100) {
      setMainHeight(mainHeight - 30);
      setMainWidth(mainWidth - 30);
    }
  };
  const setCanvasEmpty = () => {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
  };

  // useEffect
  useEffect(() => {
    let canvas = document.querySelector("#canvas");
    let tctx = canvas.getContext("2d");
    tctx.fillStyle = "#e2e8f0";
    tctx.fillRect(0, 0, canvas.width, canvas.height);
    setCtx(tctx);
    setCvs(canvas);
  }, [mainHeight, mainWidth]);

  useEffect(() => {
    if (dicom_list.length > 0) {
      setCanvasEmpty();
      showImgOnCanvas(getUrlFromDicomObj(dicom_list[dicomShowIndex]));
      dispatch(setToolboxActiveIndex(0));
      setDicomShowIndex(0);
    }
  }, [mainHeight, mainWidth, ctx, dicom_list]);

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
          ctx.fillStyle = "#08f2e5";
          ctx.fillRect(
            mouseDownInfo.clientX - x_del,
            mouseDownInfo.clientY - y_del,
            1,
            1
          );
          if (line.length % 2 === 1) {
            let point = line[line.length - 1];
            ctx.strokeStyle = "#08f2e5";
            ctx.beginPath();
            ctx.moveTo(point[0] - x_del, point[1] - y_del);
            ctx.lineTo(e.clientX - x_del, e.clientY - y_del);
            ctx.stroke();

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
            dis = dis.toFixed(3);
            let angle = Math.atan(
              (point[1] - e.clientY) / (point[0] - e.clientX)
            ).toFixed(3);
            ctx.save();
            ctx.translate(
              Math.round((point[0] + e.clientX) / 2) - x_del,
              Math.round((point[1] + e.clientY) / 2) - y_del
            );
            ctx.rotate(angle);
            ctx.textAlign = "center";
            ctx.font = "1rem serif";
            ctx.fillStyle = "#08f2e5";
            ctx.fillText(dis.toString(), 0, 16);
            ctx.restore();
          }
          setLine(line.concat([[e.clientX, e.clientY]]));
        } else if (mouseDownInfo.buttons === 2) {
          ctx.clearRect(0, 0, cvs.width, cvs.height);
          ctx.fillStyle = "#e2e8f0";
          ctx.fillRect(0, 0, cvs.width, cvs.height);
          showImgOnCanvas(getUrlFromDicomObj(dicom_list[dicomShowIndex]));
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
              setDicomShowIndex(dicomShowIndex + 1);
            }
          } else if (e.clientX < mouseDownInfo.clientX) {
            if (dicomShowIndex - 1 >= 0) {
              showImgOnCanvas(
                getUrlFromDicomObj(dicom_list[dicomShowIndex - 1])
              );
              dispatch(setToolboxActiveIndex(toolboxActiveIndex - 1));
              setDicomShowIndex(dicomShowIndex - 1);
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
      <canvas
        id="canvas"
        width={mainWidth}
        height={mainHeight}
        onWheel={(e) => zoomCanvas(e)}
        onMouseMove={mouseMove}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onContextMenu={contextMenu}
      ></canvas>
    </div>
  );
}

export default Main;
