import { createSlice } from '@reduxjs/toolkit'

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    dicomSrc: '',
    host: 'http://localhost:3000/',
    dicomInfo: {},
    activeIndex: 0,
    menuHeight: 30,
    sidebarWidth : 64,
    toolboxWidth : 400,
  },
  reducers: {
    setDicomSrc: (state, action) => {
        state.dicomSrc = action.payload
    },

    setDicomInfo: (state, action) => {
        state.dicomInfo = action.payload
    },

    setActiveIndex: (state, action) =>{
        state.activeIndex = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setDicomSrc,setDicomInfo,setActiveIndex} = globalSlice.actions

export default globalSlice.reducer