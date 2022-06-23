import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menuList: [
      {
        id: "File",
        label: "File",
        subLabel: [
          {
            id: "open file",
            label: "打开DICOM文件",
            callback: "uploadDicomFile",
          },
        ],
      },
      {
        id: "Edit",
        label: "Edit",
        subLabel: [
          {
            id: "calculate V",
            label: "体积计算",
            callback: "calV",
          },
        ],
      },
    ],
  },
  reducers: {},
});

// Action creators are generated for each case reducer function
// export const { change } = modeSlice.actions

export default menuSlice.reducer;
