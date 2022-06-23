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

    //输入框中的面积数据
    edvText: "",
    esvText: "",
    eddText: "",
    esdText: "",

    heartRate: "",
    edevText: "",
    esevText: "",

    //层宽
    sliceHeight: "",
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
    setEdvText: (state, action) => {
      state.edvText = action.payload;
    },
    setEsvText: (state, action) => {
      state.esvText = action.payload;
    },
    setSliceHeight: (state, action) => {
      state.sliceHeight = action.payload;
    },
    setEddText: (state, action) => {
      state.eddText = action.payload;
    },
    setEsdText: (state, action) => {
      state.esdText = action.payload;
    },
    setHeartRate: (state, action) => {
      state.heartRate = action.payload;
    },
    setEdevText: (state, action) => {
      state.edevText = action.payload;
    },
    setEsevText: (state, action) => {
      state.esevText = action.payload;
    },
  },
});

export const {
  setToolboxActiveIndex,
  setRow1MenuIndex,
  setShowObj,
  setEdvText,
  setEsvText,
  setSliceHeight,
  setEddText,
  setEsdText,
  setHeartRate,
  setEsevText,
  setEdevText,
} = currentFileSysSlice.actions;

export default currentFileSysSlice.reducer;
