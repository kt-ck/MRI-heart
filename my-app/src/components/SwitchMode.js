import IconWithTooltip from "./IconWithTooltip";
import { useSelector, useDispatch } from 'react-redux';
import { change } from "../features/mode/modeSlice";
import { useEffect } from "react";

function SwitchMode({light, dark}) {
  const mode = useSelector((state) => state.mode.mode)
  const dispatch = useDispatch();
  useEffect(()=>{
    if(mode === 0){
        document.querySelector('html').setAttribute("class", "")
    }else{
        document.querySelector('html').setAttribute("class", "dark")
    }
  },[mode])

  return (
    <div onClick={()=>dispatch(change())}>
        <IconWithTooltip svg={mode === 0 ?light:dark} info={mode === 0 ?"light模式":"dark模式"} size={7}/>
    </div>
  )
}

export default SwitchMode