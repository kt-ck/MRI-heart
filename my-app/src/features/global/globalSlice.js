import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    //服务器的host,api
    host: "http://localhost:3000/",

    api: "http://localhost:3000/api/",

    //当前正在显示图片的dicom文件的Info, 包括图片大小，physicalDeltaXY
    dicomInfo: {},

    //左侧Menu除了暗黑模式开关以外的active选项的index，从0开始
    activeIndex: 0,

    // 上侧菜单栏的高度
    menuHeight: 30,
    // 左侧工具栏的宽度
    sidebarWidth: 64,

    //右侧工具栏的宽度
    toolboxWidth: 400,

    //当前打开的工程名
    projectname: "",

    // 当前打开的工程中所有的dicom文件名
    dicomlist: [],
  },
  reducers: {
    setDicomInfo: (state, action) => {
      state.dicomInfo = action.payload;
    },

    setActiveIndex: (state, action) => {
      state.activeIndex = action.payload;
    },
    setProjectName: (state, action) => {
      state.projectname = action.payload;
    },
    setDicomlist: (state, action) => {
      state.dicomlist = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDicomInfo, setActiveIndex, setProjectName, setDicomlist } =
  globalSlice.actions;

export default globalSlice.reducer;
