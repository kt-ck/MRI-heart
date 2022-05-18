import IconWithTooltip from "./IconWithTooltip";
import SwitchMode from "./SwitchMode";
import light from "../svg/sun-solid.svg";
import dark from "../svg/moon-solid.svg";
import { useDispatch } from "react-redux";
import { setActiveIndex } from "../features/global/globalSlice";
function SideBar({ items, width, activeIndex }) {
  const dispatch = useDispatch();
  return (
    <div
      className="flex flex-col  items-center bg-slate-100 dark:bg-slate-900  h-full"
      style={{ width }}
    >
      <div key="mode" className="my-2">
        <SwitchMode light={light} dark={dark} />
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`my-2  w-full flex justify-center hover:scale-y-105 ${
            index === activeIndex && "border-r-4 border-r-purple-600"
          }`}
          onClick={() => dispatch(setActiveIndex(index))}
        >
          <IconWithTooltip svg={item.path} info={item.info} size={5} />
        </div>
      ))}
    </div>
  );
}

export default SideBar;
