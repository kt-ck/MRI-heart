import { configureStore } from "@reduxjs/toolkit";
import modeSlice from "../features/mode/modeSlice";
import menuSlice from "../features/Menu/menuSlice";
import globalSlice from "../features/global/globalSlice";
import currentFileSysSlice from "../features/toolbox/currentFileSysSlice";

export default configureStore({
  reducer: {
    mode: modeSlice,
    menu: menuSlice,
    global: globalSlice,
    currentFileSys: currentFileSysSlice,
  },
});
