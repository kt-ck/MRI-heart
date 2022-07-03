import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import List from "./List";
import {
  setSliceHeight,
  setEddText,
  setEsdText,
  setHeartRate,
  setDInnerText,
  setSInnerText,
  setDOuterText,
  setSOuterText,
  setAThickness,
  setPThickness,
} from "../features/toolbox/currentFileSysSlice";
import axios from "axios";
import { Button, Input } from "antd";
const { TextArea } = Input;
function ToolBoxRow1Main({ activeIndex }) {
  const dispatch = useDispatch();
  const dicom_info = useSelector((state) => state.global.dicomInfo);
  const show_info = useSelector((state) => state.currentFileSys.showObj);
  const eddText = useSelector((state) => state.currentFileSys.eddText);
  const esdText = useSelector((state) => state.currentFileSys.esdText);
  const heartRate = useSelector((state) => state.currentFileSys.heartRate);
  const sliceHeight = useSelector((state) => state.currentFileSys.sliceHeight);
  const aThickness = useSelector((state) => state.currentFileSys.aThickness);
  const pThickness = useSelector((state) => state.currentFileSys.pThickness);
  const dInnerText = useSelector((state) => state.currentFileSys.dInnerText);
  const sInnerText = useSelector((state) => state.currentFileSys.sInnerText);
  const dOuterText = useSelector((state) => state.currentFileSys.dOuterText);
  const sOuterText = useSelector((state) => state.currentFileSys.sOuterText);
  const host = useSelector((state) => state.global.host);
  const api = useSelector((state) => state.global.api);
  const projectname = useSelector((state) => state.global.projectname);
  const [tagState, setTagState] = useState(-1);
  const [outputData, setOutputData] = useState({});
  const upload = (e) => {
    axios
      .post(api + "getReport", {
        eddText,
        esdText,
        sliceHeight,
        heartRate,
        dInnerText,
        sInnerText,
        dOuterText,
        sOuterText,
      })
      .then((res) => {
        setOutputData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (activeIndex === 0) {
    return <List listdata={dicom_info} />;
  } else if (activeIndex === 1) {
    if (Object.keys(show_info).length > 0) {
      return <List listdata={show_info} />;
    } else {
      return (
        <div className="m-auto text-slate-600 dark:text-slate-200">
          没有要显示的内容
        </div>
      );
    }
  } else if (activeIndex === 2) {
    return (
      <div className="overflow-y-auto flex flex-col items-center">
        <Input
          value={aThickness}
          placeholder="Ant.Sep.Wall Thickness(cm)"
          onChange={(e) => dispatch(setAThickness(e.target.value))}
        />
        <Input
          value={pThickness}
          placeholder="Post.Lat.Wall Thickness(cm)"
          onChange={(e) => dispatch(setPThickness(e.target.value))}
        />
        <Input
          value={eddText}
          placeholder="End-Diastolic Dimension(cm)"
          onChange={(e) => dispatch(setEddText(e.target.value))}
        />
        <Input
          value={esdText}
          placeholder="End-Systolic Dimension(cm)"
          onChange={(e) => dispatch(setEsdText(e.target.value))}
        />
        <Input
          value={heartRate}
          placeholder="Heart-Rate(bpm)"
          onChange={(e) => dispatch(setHeartRate(e.target.value))}
        />
        <TextArea
          value={dInnerText}
          onChange={(e) => dispatch(setDInnerText(e.target.value))}
          placeholder="舒张期心室内部各层数据"
        />
        <TextArea
          value={dOuterText}
          onChange={(e) => dispatch(setDOuterText(e.target.value))}
          placeholder="舒张期心室外部各层数据"
        />
        <TextArea
          value={sInnerText}
          onChange={(e) => dispatch(setSInnerText(e.target.value))}
          placeholder="收缩期心室内部各层数据"
        />
        <TextArea
          value={sOuterText}
          onChange={(e) => dispatch(setSOuterText(e.target.value))}
          placeholder="收缩期心室外部各层数据"
        />
        <Input
          value={sliceHeight}
          placeholder="层宽"
          onChange={(e) => dispatch(setSliceHeight(e.target.value))}
        />
        <Button type="primary" ghost onClick={upload}>
          提交
        </Button>
      </div>
    );
  } else if (activeIndex === 3) {
    return Object.keys(outputData).length > 0 ? (
      <List listdata={outputData} />
    ) : (
      <div className="m-auto text-slate-600 dark:text-slate-200">
        没有要显示的内容
      </div>
    );
  }
  return null;
}

export default ToolBoxRow1Main;
