import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const myProjectSlice = createSlice({
  name: "myProject",
  initialState,
  reducers: {
    SetMyProject: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { SetMyProject } = myProjectSlice.actions;

export const GetMyProject = (state) => state.myProject;

export default myProjectSlice.reducer;
