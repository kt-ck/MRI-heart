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
    aThickness: "",
    pThickness: "",
    eddText: "",
    esdText: "",
    dInnerText: "",
    dOuterText: "",
    sInnerText: "",
    sOuterText: "",
    heartRate: "",

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
    setAThickness: (state, action) => {
      state.aThickness = action.payload;
    },
    setPThickness: (state, action) => {
      state.pThickness = action.payload;
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
    setDInnerText: (state, action) => {
      state.dInnerText = action.payload;
    },
    setSInnerText: (state, action) => {
      state.sInnerText = action.payload;
    },
    setDOuterText: (state, action) => {
      state.dOuterText = action.payload;
    },
    setSOuterText: (state, action) => {
      state.sOuterText = action.payload;
    },
  },
});

export const {
  setToolboxActiveIndex,
  setRow1MenuIndex,
  setShowObj,
  setSliceHeight,
  setEddText,
  setEsdText,
  setHeartRate,
  setDInnerText,
  setDOuterText,
  setSInnerText,
  setSOuterText,
  setAThickness,
  setPThickness,
} = currentFileSysSlice.actions;

export default currentFileSysSlice.reducer;
