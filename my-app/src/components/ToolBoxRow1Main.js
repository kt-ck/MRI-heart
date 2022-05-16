import React from "react";
import { useSelector } from "react-redux";
import List from "./List";
function ToolBoxRow1Main({ activeIndex }) {
  const dicom_info = useSelector((state) => state.global.dicomInfo);
  if (activeIndex === 0) {
    return <List listdata={dicom_info} />;
  }
  return null;
}

export default ToolBoxRow1Main;
