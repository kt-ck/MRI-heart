import { Menu } from "antd";
import DropDownItem from "./DropDownItem";
function DropDownList({list}) {
  const btnClick = (e, id, callback) => {
      if(id === "open file" && callback === "uploadDicomFile"){
          
      }
  }
  return (
    <Menu>
        {
            list.map((item)=>(
                <Menu.Item key="item.id">
                    <DropDownItem item={item} btnClick={btnClick}/>
                </Menu.Item>
            ))
        }
    </Menu>
  )
}

export default DropDownList