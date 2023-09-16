import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const projectManagementSlide = createSlice({
  name: "projectManagement",
  initialState,
  reducers: {
    SetProjectManagement: (state, action) => {
      state = action.payload;
      return state;
    },
    CreateProject: (state, action) => {
      const data = action.payload;
      let newProject = {
        id: data.id,
        name: data.name,
        progress: data.progress,
        backGroundImage: data.backgroundImage,
        backGroundColor: data.backgroundColor,
        code: data.code,
        descriptions: data.descriptions,
        startTime: data.startTime,
        endTime: data.endTime,
        statusProject:
          data.statusProject === "DA_DIEN_RA"
            ? "0"
            : data.statusProject === "DANG_DIEN_RA"
            ? "1"
            : "2",
      };
      state.unshift(newProject);
      return state;
    },
    UpdateProject: (state, action) => {
      const project = action.payload;
      const index = state.findIndex((item) => item.id === project.id);
      console.log(state[index]);
      if (index !== -1) {
        let projectUpdate = state[index];
        projectUpdate.code = project.code;
        projectUpdate.name = project.name;
        projectUpdate.progress = project.progress;
        projectUpdate.statusProject = project.statusProject;
      }
    },
  },
});

export const { SetProjectManagement, CreateProject, UpdateProject } =
  projectManagementSlide.actions;

export const GetProjectManagement = (state) => state.projectManagement;

export default projectManagementSlide.reducer;
