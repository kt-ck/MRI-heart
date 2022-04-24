import { message, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setProjectName, setDicomlist } from "../features/global/globalSlice";
function DropDownItem({ item, btnClick }) {
  const api = useSelector((state) => state.mode.api);
  const dispatch = useDispatch();
  const uploadDicom = (e) => {
    const form = new FormData();
    const files = document.querySelector("#dicomInput").files;
    console.log(files);
    for (let i = 0; i < files.length; ++i) {
      form.append("files[]", files[i]);
    }

    axios
      .post(api + "uploadDicom", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 200) {
          message.success(`${res.data.dirname} create successfully`);
          dispatch(setProjectName(res.data.dirname));
          dispatch(setDicomlist(res.data.filelist));
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (item.id === "open file") {
    return (
      <div className="relative">
        <input
          id="dicomInput"
          name="dicom"
          type="file"
          onChange={uploadDicom}
          multiple
          accept=".dcm"
          className="absolute left-0 top-0 z-10 opacity-0"
        />
        <Button type="text">{item.label}</Button>
      </div>
    );
  }
  return (
    <Button type="text" onClick={(e) => btnClick(e, item.id, item.callback)}>
      {item.label}
    </Button>
  );
}

export default DropDownItem;
