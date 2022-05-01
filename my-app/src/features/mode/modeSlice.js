import { createSlice } from "@reduxjs/toolkit";

export const modeSlice = createSlice({
  name: "mode",
  initialState: {
    mode: 0,
  },
  reducers: {
    change: (state) => {
      state.mode = 1 - state.mode;
    },
  },
});

// Action creators are generated for each case reducer function
export const { change } = modeSlice.actions;

export default modeSlice.reducer;
