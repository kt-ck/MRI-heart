import { message, Button} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {setDicomSrc, setDicomInfo} from '../features/global/globalSlice'
function DropDownItem({item, btnClick}) {
  const api = useSelector((state)=>state.mode.api)
  const host = useSelector((state)=>state.global.host)
  const dispatch = useDispatch()
  const uploadDicom = (e) => {
    const form = new FormData();
    const files = document.querySelector('#dicomInput').files
    // console.log(files)
    
    form.append('files', files);
    axios.post(api + 'uploadDicom', form,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      if(res.status === 200){
        // message.success(`${file.name} uploaded successfully`);
        // let obj = JSON.parse(res.data)
        // dispatch(setDicomSrc(host+`images/dicom_img/${obj.filename}.png`))
        // dispatch(setDicomInfo(obj))
        // console.log(JSON.parse(res.data))
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  if(item.id === "open file"){
    return (
      <div className='relative'>
        <input id="dicomInput" name="dicom" type="file" onChange={uploadDicom} multiple accept='.dcm' className='absolute left-0 top-0 z-10 opacity-0'/>
        <Button type="text" >{item.label}</Button>
      </div>
    )
  }
  return (
    <Button type="text" onClick={(e)=>btnClick(e, item.id, item.callback)}>{item.label}</Button>
  )
}

export default DropDownItem