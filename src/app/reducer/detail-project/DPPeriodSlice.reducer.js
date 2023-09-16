import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listPeriod: [],
  periodCurrent: {},
};

const MemberPeriodSlice = createSlice({
  name: "memberPeriod",
  initialState,
  reducers: {
    SetMemberPeriod: (state, action) => {
      state.listPeriod = action.payload;
      return state;
    },
    SetPeriodCurrent: (state, action) => {
      state.periodCurrent = action.payload;
      return state;
    },
  },
});

export const { SetMemberPeriod, SetPeriodCurrent } = MemberPeriodSlice.actions;

export const GetMemberPeriod = (state) => state.memberPeriod.listPeriod;
export const GetPeriodCurrent = (state) => state.memberPeriod.periodCurrent;

export default MemberPeriodSlice.reducer;
