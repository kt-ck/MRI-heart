import Tree from "./Tree";
import { useSelector } from "react-redux";

function ToolBoxRow2Main({ activeIndex }) {
  const projectname = useSelector((state) => state.global.projectname);
  const filelist = useSelector((state) => state.global.dicomlist);

  if (activeIndex === 0) {
    if (projectname) {
      return <Tree projectName={projectname} filenameList={filelist} />;
    } else {
      return <div>当前没有选择项目</div>;
    }
  }
  return null;
}

export default ToolBoxRow2Main;
