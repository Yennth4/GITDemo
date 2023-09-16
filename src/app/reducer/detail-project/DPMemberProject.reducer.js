import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const MemberProjectSlice = createSlice({
  name: "memberProject",
  initialState,
  reducers: {
    SetMemberProject: (state, action) => {
      state = action.payload;
      return state;
    },
    UpdateMemberProject: (state, action) => {
      let data = action.payload;
      state.forEach((item) => {
        if (item.id === data.memberId) {
          item.statusWork = data.statusWork === "DANG_LAM" ? 0 + "" : 1 + "";
          item.role =
            data.role === "MANAGER"
              ? 0 + ""
              : data.role === "LEADER"
              ? 1 + ""
              : data.role === "DEV"
              ? 2 + ""
              : 3 + "";
        }
      });
      return state;
    },
  },
});

export const { SetMemberProject, UpdateMemberProject } =
  MemberProjectSlice.actions;

export const GetMemberProject = (state) => state.memberProject;

export default MemberProjectSlice.reducer;
