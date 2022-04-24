import { createSlice } from "@reduxjs/toolkit";

export const globalSlice = createSlice({
  name: "global",
  initialState: {
    dicomSrc: "",
    host: "http://localhost:3000/",
    dicomInfo: {},
    activeIndex: 0,
    menuHeight: 30,
    sidebarWidth: 64,
    toolboxWidth: 400,
    projectname: "undefined",
    dicomlist: [],
  },
  reducers: {
    setDicomSrc: (state, action) => {
      state.dicomSrc = action.payload;
    },

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
export const {
  setDicomSrc,
  setDicomInfo,
  setActiveIndex,
  setProjectName,
  setDicomlist,
} = globalSlice.actions;

export default globalSlice.reducer;
