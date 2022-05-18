import "./css/app.css";
import SideBar from "./components/SideBar";
import oper1 from "./svg/arrow-pointer-solid.svg";
import oper2 from "./svg/eye-dropper-solid.svg";
import Menu from "./components/Menu";
import { useEffect, useState } from "react";
import Main from "./components/Main";
import ToolBox from "./components/ToolBox";
import { useSelector } from "react-redux";
function App() {
  const items = [
    {
      id: "arrow",
      path: oper1,
      info: "选择",
    },
    {
      id: "Draw",
      path: oper2,
      info: "绘制",
    },
  ];
  const menuList = useSelector((state) => state.menu.menuList);
  const activeIndex = useSelector((state) => state.global.activeIndex);
  const [winHeight, setWinHeight] = useState(0);
  const [winWidth, setWinWidth] = useState(0);
  const menuHeight = useSelector((state) => state.global.menuHeight);
  const sidebarWidth = useSelector((state) => state.global.sidebarWidth);
  const toolboxWidth = useSelector((state) => state.global.toolboxWidth);
  useEffect(() => {
    setWinHeight(window.innerHeight);
    setWinWidth(window.innerWidth);
  }, []);
  return (
    <div className="dark:bg-slate-600 h-screen">
      <Menu height={menuHeight} list={menuList} />
      <div className="flex flex-row" style={{ height: winHeight - menuHeight }}>
        <SideBar items={items} width={sidebarWidth} activeIndex={activeIndex} />
        <Main
          width={winWidth - sidebarWidth - toolboxWidth}
          height={winHeight - menuHeight}
        />
        <ToolBox width={toolboxWidth} />
      </div>
    </div>
  );
}

export default App;
