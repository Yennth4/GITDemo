import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const periodProjectSlice = createSlice({
  name: "periodProject",
  initialState,
  reducers: {
    SetPeriodProject: (state, action) => {
      state = action.payload;
      return state;
    },
    CreatePeriodProject: (state, action) => {
      const data = action.payload;
      let newPeriod = {
        stt: state.length + 1,
        id: data.id,
        code: data.code,
        name: data.name,
        progress: data.progress,
        target: data.target,
        startTime: data.startTime,
        endTime: data.endTime,
        descriptions: data.descriptions,
        status:
          data.statusPeriod === "DA_DIEN_RA"
            ? 0
            : data.statusPeriod === "DANG_DIEN_RA"
            ? 1
            : 2,
      };
      state.unshift(newPeriod);
      return state;
    },
    UpdatePeriodProject: (state, action) => {
      const updatedProject = action.payload;
      const index = state.findIndex(
        (period) => period.id === updatedProject.id
      );
      if (index !== -1) {
        state[index].name = updatedProject.name;
        state[index].descriptions = updatedProject.descriptions;
        state[index].target = updatedProject.target;
        state[index].startTime = updatedProject.startTime;
        state[index].endTime = updatedProject.endTime;
      }
    },
    DeletePeriodProject: (state, action) => {
      const idPeriod = action.payload;
      const index = state.findIndex((period) => period.id === idPeriod);
      state.splice(index, 1);
    },
  },
});

export const {
  SetPeriodProject,
  UpdatePeriodProject,
  DeletePeriodProject,
  CreatePeriodProject,
} = periodProjectSlice.actions;

export const GetPeriodProject = (state) => state.periodProject;

export default periodProjectSlice.reducer;
