import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import List from "./List";
import {
  setEdvText,
  setEsvText,
  setSliceHeight,
  setEddText,
  setEsdText,
  setEdevText,
  setEsevText,
  setHeartRate,
} from "../features/toolbox/currentFileSysSlice";
import axios from "axios";
import { Button, Input } from "antd";
const { TextArea } = Input;
function ToolBoxRow1Main({ activeIndex }) {
  const dispatch = useDispatch();
  const dicom_info = useSelector((state) => state.global.dicomInfo);
  const show_info = useSelector((state) => state.currentFileSys.showObj);
  const edvText = useSelector((state) => state.currentFileSys.edvText);
  const esvText = useSelector((state) => state.currentFileSys.esvText);
  const eddText = useSelector((state) => state.currentFileSys.eddText);
  const esdText = useSelector((state) => state.currentFileSys.esdText);
  const heartRate = useSelector((state) => state.currentFileSys.heartRate);
  const esevText = useSelector((state) => state.currentFileSys.esevText);
  const edevText = useSelector((state) => state.currentFileSys.edevText);
  const sliceHeight = useSelector((state) => state.currentFileSys.sliceHeight);
  const host = useSelector((state) => state.global.host);
  const api = useSelector((state) => state.global.api);
  const projectname = useSelector((state) => state.global.projectname);
  const [tagState, setTagState] = useState(-1);
  const [outputData, setOutputData] = useState({});
  const upload = (e) => {
    axios
      .post(api + "getReport", {
        edvText,
        esvText,
        eddText,
        esdText,
        esevText,
        edevText,
        sliceHeight,
        heartRate,
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
          value={eddText}
          placeholder="[EDD]数据用英文逗号隔开"
          onChange={(e) => dispatch(setEddText(e.target.value))}
        />
        <Input
          value={esdText}
          placeholder="[ESD]数据用英文逗号隔开"
          onChange={(e) => dispatch(setEsdText(e.target.value))}
        />
        <Input
          value={heartRate}
          placeholder="[HR]心率"
          onChange={(e) => dispatch(setHeartRate(e.target.value))}
        />
        <TextArea
          value={edevText}
          onChange={(e) => dispatch(setEdevText(e.target.value))}
          placeholder="[EDEV]心脏的每层数据用英文逗号隔开,每个心脏用分号隔开。"
          autoSize={{ minRows: 2 }}
        />
        <TextArea
          value={esevText}
          onChange={(e) => dispatch(setEsevText(e.target.value))}
          placeholder="[ESEV]心脏的每层数据用英文逗号隔开,每个心脏用分号隔开。"
          autoSize={{ minRows: 2 }}
        />
        <TextArea
          value={edvText}
          onChange={(e) => dispatch(setEdvText(e.target.value))}
          placeholder="[EDV]心脏的每层数据用英文逗号隔开,每个心脏用分号隔开。"
          autoSize={{ minRows: 2 }}
        />
        <TextArea
          value={esvText}
          onChange={(e) => dispatch(setEsvText(e.target.value))}
          placeholder="[ESV]心脏的每层数据用英文逗号隔开,每个心脏用分号隔开。"
          autoSize={{ minRows: 2 }}
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
