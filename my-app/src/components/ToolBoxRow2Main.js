import Tree from "./Tree";
import { useSelector } from "react-redux";

function ToolBoxRow2Main({ activeIndex }) {
  const projectname = useSelector((state) => state.global.projectname);
  const filelist = useSelector((state) => state.global.dicomlist);
  const toolboxActiveIndex = useSelector(
    (state) => state.currentFileSys.toolboxActiveIndex
  );
  if (activeIndex === 0) {
    if (projectname) {
      return (
        <div className="overflow-y-auto overflow-x-auto">
          <Tree
            projectName={projectname}
            filenameList={filelist}
            activeIndex={toolboxActiveIndex}
          />
        </div>
      );
    } else {
      return <div>当前没有选择项目</div>;
    }
  }
  return null;
}

export default ToolBoxRow2Main;
