import { useState } from "react";
import Tab from "./Tab";
import ToolBoxRow2Main from "./ToolBoxRow2Main";
import ToolBoxRow1Main from "./ToolBoxRow1Main";
import { useDispatch, useSelector } from "react-redux";
import { setRow1MenuIndex } from "../features/toolbox/currentFileSysSlice";
function ToolBox({ width }) {
  const [Row2MenuIndex, setRow2MenuIndex] = useState(0);
  const Row1MenuIndex = useSelector(
    (state) => state.currentFileSys.Row1MenuIndex
  );
  const dispatch = useDispatch();
  const Row1Menu = [
    {
      id: "currentInfo",
      label: "属性",
    },
    {
      id: "show",
      label: "显示",
    },
    {
      id: "input",
      label: "参数输入",
    },
    {
      id: "output",
      label: "参数输出",
    },
  ];
  const Row2Menu = [
    {
      id: "explore",
      label: "当前项目",
    },
    {
      id: "projectName",
      label: "项目管理",
    },
  ];

  return (
    <div
      style={{ width }}
      className="h-full bg-slate-100 dark:bg-slate-900 grid grid-cols-5 grid-rows-2 gap-2"
    >
      <div className="col-span-5 flex flex-col">
        <Tab
          list={Row1Menu}
          activeIndex={Row1MenuIndex}
          setactiveIndex={(index) => dispatch(setRow1MenuIndex(index))}
        />

        <ToolBoxRow1Main activeIndex={Row1MenuIndex} />
      </div>
      <div className="col-span-5 flex flex-col">
        <Tab
          list={Row2Menu}
          activeIndex={Row2MenuIndex}
          setactiveIndex={setRow2MenuIndex}
        />
        <ToolBoxRow2Main activeIndex={Row2MenuIndex} />
      </div>
    </div>
  );
}

export default ToolBox;
