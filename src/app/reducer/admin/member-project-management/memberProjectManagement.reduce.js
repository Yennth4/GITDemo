import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const memberProjectManagementSlide = createSlice({
  name: "memberProjectManagement",
  initialState,
  reducers: {
    SetMemberProject: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { SetMemberProject, CreateMemberProject } =
  memberProjectManagementSlide.actions;

export const GetMemberProject = (state) => state.memberProjectManagement;

export default memberProjectManagementSlide.reducer;
