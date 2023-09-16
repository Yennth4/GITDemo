import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const adCategorySlice = createSlice({
  name: "adCategory",
  initialState,
  reducers: {
    SetCategory: (state, action) => {
      state = action.payload;
      return state;
    },
    CreateCategory: (state, action) => {
      const data = action.payload;
      let newCategory = {
        stt: state.length + 1,
        id: data.id,
        code: data.code,
        name: data.name,
      };
      state.unshift(newCategory);
      return state;
    },
    UpdateCategory: (state, action) => {
      const updateCategory = action.payload;
      const index = state.findIndex(
        (category) => category.id === updateCategory.id
      );
      if (index !== -1) {
        state[index].code = updateCategory.code;
        state[index].name = updateCategory.name;
      }
    },
    
  },
});

export const {
  SetCategory,
  UpdateCategory,
  CreateCategory,
} = adCategorySlice.actions;

export const GetCategory = (state) => state.adCategory;

export default adCategorySlice.reducer;