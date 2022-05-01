import { Menu } from "antd";
import DropDownItem from "./DropDownItem";
function DropDownList({ list }) {
  return (
    <Menu>
      {list.map((item) => (
        <Menu.Item key="item.id">
          <DropDownItem item={item} />
        </Menu.Item>
      ))}
    </Menu>
  );
}

export default DropDownList;
