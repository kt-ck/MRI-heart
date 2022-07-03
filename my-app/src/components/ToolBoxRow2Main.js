import Tree from "./Tree";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { Radio } from "antd";
import {
  setProjectName,
  setDicomlist,
  setDicomInfo,
  setDicomShowIndex,
} from "../features/global/globalSlice";

function ToolBoxRow2Main({ activeIndex }) {
  const projectname = useSelector((state) => state.global.projectname);
  const filelist = useSelector((state) => state.global.dicomlist);
  const api = useSelector((state) => state.global.api);
  const dicomShowIndex = useSelector((state) => state.global.dicomShowIndex);

  const dispatch = useDispatch();
  const [project, setProject] = useState({});
  const [selectProjectName, setSelectProjectName] = useState("");
  const selectProject = (name) => {
    setSelectProjectName(name);
    axios
      .post(api + "openProject", {
        name,
      })
      .then((res) => {
        console.log(res.data);
        dispatch(setProjectName(res.data.dirname));
        dispatch(setDicomlist(res.data.filelist));
        let firstData = JSON.parse(JSON.parse(res.data.firstData));
        console.log(firstData, typeof firstData);

        dispatch(setDicomInfo(firstData));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    axios
      .get(api + "getExistProject")
      .then((res) => {
        setProject(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (activeIndex === 0) {
    if (projectname) {
      return (
        <div className="overflow-y-auto overflow-x-auto">
          <Tree
            projectName={projectname}
            filenameList={filelist}
            activeIndex={dicomShowIndex}
            isButton={true}
            setClickIndex={(index) => {
              dispatch(setDicomShowIndex(index));
            }}
          />
        </div>
      );
    } else {
      return <div className="m-auto text-slate-400 ">当前没有选择项目</div>;
    }
  } else if (activeIndex === 1) {
    return (
      <div className="overflow-y-auto overflow-x-auto">
        {Object.keys(project)
          .sort()
          .map((name) => (
            <div className="flex" key={name}>
              <Tree
                projectName={name}
                filenameList={project[name].map((file) => {
                  return { filename: file };
                })}
                activeIndex={-1}
                isButton={false}
              />
              <Radio
                value={name}
                onChange={() => {
                  selectProject(name);
                }}
                checked={name === selectProjectName}
              />
            </div>
          ))}
      </div>
    );
  }
  return null;
}

export default ToolBoxRow2Main;
