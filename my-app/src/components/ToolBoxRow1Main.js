import React from "react";
import { useSelector } from "react-redux";
import List from "./List";
function ToolBoxRow1Main({ activeIndex }) {
  const dicom_info = useSelector((state) => state.global.dicomInfo);
  const show_info = useSelector((state) => state.currentFileSys.showObj);
  const dicom_list = useSelector((state) => state.global.dicomlist);
  const dicomShowIndex = useSelector((state) => state.global.dicomShowIndex);
  const host = useSelector((state) => state.global.host);
  const projectname = useSelector((state) => state.global.projectname);
  if (activeIndex === 0) {
    return <List listdata={dicom_info} />;
  } else if (activeIndex === 1) {
    if (Object.keys(show_info).length > 0) {
      let centerX = (
        show_info["x"] +
        show_info["radius"] * show_info["scaleX"]
      ).toFixed();
      let centerY = (
        show_info["y"] +
        show_info["radius"] * show_info["scaleY"]
      ).toFixed();
      let width = (show_info["radius"] * show_info["scaleX"]).toFixed();
      let height = (show_info["radius"] * show_info["scaleY"]).toFixed();
      let area =
        show_info["radius"] *
        show_info["scaleX"] *
        show_info["radius"] *
        show_info["scaleY"] *
        Math.PI *
        dicom_info.PhysicalDelta[0] *
        dicom_info.PhysicalDelta[1];
      return (
        <div className="w-full h-full overflow-auto flex flex-col justify-center items-center">
          <div className="w-72 h-72 overflow-hidden relative">
            <svg
              width={show_info["width"]}
              height={show_info["height"]}
              xmlns="http://www.w3.org/2000/svg"
              className="absolute"
              style={{
                left: `${(150 - centerX).toFixed()}px`,
                top: `${(150 - centerY).toFixed()}px`,
              }}
            >
              <clipPath id="ellipse">
                <ellipse cx={centerX} cy={centerY} rx={width} ry={height} />
              </clipPath>

              <image
                width={show_info["width"]}
                height={show_info["height"]}
                href={`${host}images/dicom_img/${projectname}/${
                  dicom_list[dicomShowIndex]["filename"].split(".")[0]
                }.png`}
                style={{ clipPath: "url(#ellipse)" }}
              />
            </svg>
          </div>
          <div className="text-slate-600 dark:text-slate-200">
            S = {area.toFixed(4)}
          </div>
        </div>
      );
    } else {
      return <div className="m-auto">没有要显示的内容</div>;
    }
  }
  return null;
}

export default ToolBoxRow1Main;
