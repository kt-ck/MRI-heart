import { Dropdown, Button } from 'antd';
import DropDownList from './DropDownList';
function Menu({height, list}) {

  return (
    <div style={{height}} className="flex flex-row items-center bg-slate-200 dark:bg-slate-500 text-slate-900 dark:text-slate-50">
        {
            list.map((item)=>(
                <Dropdown key={item.id} overlay={
                  <DropDownList list={item.subLabel}/>}
                >
                  <Button type='text' className='text-inherit' >{item.label}</Button>
                </Dropdown>
            
            ))
        }
           
    </div>
  )
}

export default Menu