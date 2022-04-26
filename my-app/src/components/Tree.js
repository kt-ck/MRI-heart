import { useState } from "react";
import { DownSquareOutlined, RightSquareOutlined } from "@ant-design/icons";
function Tree({ projectName, filenameList }) {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full dark:text-slate-100 px-2 flow-root">
      <div className="w-full" onClick={(e) => setShow(!show)}>
        {show ? <DownSquareOutlined /> : <RightSquareOutlined />}
        <span>{projectName}</span>
      </div>
      <div className="w-full ml-2 pl-2 border-l-2 border-l-slate-800 dark:border-l-slate-400 ">
        {show &&
          filenameList.map((item) => (
            <div key={item.filename}>{item.filename}</div>
          ))}
      </div>
    </div>
  );
}

export default Tree;
