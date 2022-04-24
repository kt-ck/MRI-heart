import { Tooltip } from 'antd';
import "../css/iconWithTooltip.css";
import { useSelector} from 'react-redux';
function IconWithTooltip({svg, info, size}) {
  const mode = useSelector((state)=>state.mode.mode)
  return (
    <Tooltip title={info} color="purple">
        <img src={svg} alt={info} width={`${size*4}px`} height={`${size*4}px`} className={`${mode===0?"filter-bright": "filter-dark"} hover:scale-105`}></img>
    </Tooltip>
  )
}

export default IconWithTooltip