import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const LabelProjectSlice = createSlice({
  name: "labelProject",
  initialState,
  reducers: {
    SetLabelProject: (state, action) => {
      state = action.payload;
      return state;
    },
    UpdateLabelProject: (state, action) => {
      let data = action.payload;
      let labelProject = state.find((item) => item.id === data.id);
      if (labelProject) {
        labelProject.id = data.id;
        labelProject.name = data.name;
        labelProject.colorLabel = data.colorLabel;
        labelProject.code = data.code;
      }
      return state;
    },
    CreateLabelProject: (state, action) => {
      let data = action.payload;
      let obj = {
        name: data.name,
        id: data.id,
        code: data.code,
        colorLabel: data.colorLabel,
      };
      state.unshift(obj);
      return state;
    },
    DeleteLabelProject: (state, action) => {
      let data = action.payload;
      const index = state.findIndex((item) => item.id === data);
      state.splice(index, 1);
      return state;
    },
  },
});

export const {
  SetLabelProject,
  UpdateLabelProject,
  CreateLabelProject,
  DeleteLabelProject,
} = LabelProjectSlice.actions;

export const GetLabelProject = (state) => state.labelProject;

export default LabelProjectSlice.reducer;
