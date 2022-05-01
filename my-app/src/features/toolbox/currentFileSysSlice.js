import { createSlice } from "@reduxjs/toolkit";

export const currentFileSysSlice = createSlice({
  name: "currentFileSys",
  initialState: {
    // 当前工程中正在显示的dicom文件的index，从0开始
    toolboxActiveIndex: 0,
  },
  reducers: {
    setToolboxActiveIndex: (state, action) => {
      state.toolboxActiveIndex = action.payload;
    },
  },
});

export const { setToolboxActiveIndex } = currentFileSysSlice.actions;

export default currentFileSysSlice.reducer;
