import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const AdStakeholderManagement = createSlice({
  name: "adStakeholderManagement",
  initialState,
  reducers: {
    SetAdStakeholderManagement: (state, action) => {
      state = action.payload;
      return state;
    },
    UpdateStakeHolder: (state, action) => {
      const updatedStakeHolder = action.payload;
      const index = state.data.findIndex(
        (product) => product.id === updatedStakeHolder.id,
      );
      if (index >= 0) {
        state.data[index] = updatedStakeHolder;
      }
    },
    
  },
});


export const { 
              SetAdStakeholderManagement,
              UpdateStakeHolder,
            } = AdStakeholderManagement.actions;

export const GetAdStakeholderManagement = (state) => state.adStakeholderManagement;

export default AdStakeholderManagement.reducer;