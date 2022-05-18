import React from "react";
import { useSelector } from "react-redux";
import List from "./List";
function ToolBoxRow1Main({ activeIndex }) {
  const dicom_info = useSelector((state) => state.global.dicomInfo);
  const show_info = useSelector((state) => state.currentFileSys.showObj);

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
      return (
        <div className="w-full h-full overflow-auto">
          <svg width={500} height={500} xmlns="http://www.w3.org/2000/svg">
            <clipPath id="ellipse">
              <ellipse cx={centerX} cy={centerY} rx={width} ry={height} />
            </clipPath>

            <image
              width={show_info["width"]}
              height={show_info["height"]}
              href={show_info["dicom_img"]}
              style={{ clipPath: "url(#ellipse)" }}
            />
          </svg>
        </div>
      );
    } else {
      return <div className="m-auto">没有要显示的内容</div>;
    }
  }
  return null;
}

export default ToolBoxRow1Main;
