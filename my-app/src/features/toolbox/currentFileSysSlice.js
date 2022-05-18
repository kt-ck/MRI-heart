import { createSlice } from "@reduxjs/toolkit";

export const currentFileSysSlice = createSlice({
  name: "currentFileSys",
  initialState: {
    // 当前工程中正在显示的dicom文件的index，从0开始
    toolboxActiveIndex: 0,

    //toolbox 第一行导航的下标
    Row1MenuIndex: 0,

    //显示框里的渲染对象
    showObj: {},
  },
  reducers: {
    setToolboxActiveIndex: (state, action) => {
      state.toolboxActiveIndex = action.payload;
    },
    setRow1MenuIndex: (state, action) => {
      state.Row1MenuIndex = action.payload;
    },
    setShowObj: (state, action) => {
      state.showObj = action.payload;
    },
  },
});

export const { setToolboxActiveIndex, setRow1MenuIndex, setShowObj } =
  currentFileSysSlice.actions;

export default currentFileSysSlice.reducer;
