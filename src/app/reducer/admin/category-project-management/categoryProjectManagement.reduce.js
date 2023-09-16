import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const categoryProjectSlide = createSlice({
  name: "categoryProjectManagement",
  initialState,
  reducers: {
    SetCategoryProject: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { SetCategoryProject } = categoryProjectSlide.actions;

export const GetCategoryProject = (state) => state.categoryProjectManagement;

export default categoryProjectSlide.reducer;
