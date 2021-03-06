import { useState } from "react";
import { DownSquareOutlined, RightSquareOutlined } from "@ant-design/icons";
import { Button } from "antd";
function Tree({
  projectName,
  filenameList,
  activeIndex,
  isButton,
  setClickIndex,
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full dark:text-slate-100 px-2 flow-root">
      <div className="w-full" onClick={(e) => setShow(!show)}>
        {show ? <DownSquareOutlined /> : <RightSquareOutlined />}
        <span>{projectName}</span>
      </div>
      <div className="w-full ml-2 pl-2 border-l-2 border-l-slate-800 dark:border-l-slate-400 ">
        {show &&
          filenameList.map((item, index) => (
            <div
              className={
                activeIndex === index
                  ? "border-l-4 border-l-purple-600 "
                  : undefined
              }
              key={item.filename}
            >
              {isButton ? (
                <Button
                  type="text"
                  onClick={() => {
                    setClickIndex(index);
                  }}
                >
                  {item.filename}
                </Button>
              ) : (
                item.filename
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Tree;
