import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  loading: false,
  error: null,
};

const ProjectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    SetProject: (state, action) => {
      state.data = action.payload;
    },
    SetLoading: (state, action) => {
      state.loading = action.payload;
    },
    SetError: (state, action) => {
      state.error = action.payload;
    },
    UpdateBackground: (state, action) => {
      let data = action.payload;
      state.data.backgroundColor = data.backgroundColor;
      state.data.backgroundImage = data.backgroundImage;
      return state;
    },
  },
});

export const { SetProject, SetLoading, SetError, UpdateBackground } =
  ProjectSlice.actions;

export const GetProject = (state) => state.project.data;
export const GetLoading = (state) => state.project.loading;

export default ProjectSlice.reducer;
