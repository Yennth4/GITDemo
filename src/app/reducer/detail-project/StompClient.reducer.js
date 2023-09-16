import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionId: "",
};

const StompClientSlice = createSlice({
  name: "stompClient",
  initialState,
  reducers: {
    SetSessionId: (state, action) => {
      state.sessionId = action.payload;
    },
  },
});

export const { SetSessionId } = StompClientSlice.actions;
export const GetSessionId = (state) => state.stompClient.sessionId;

export default StompClientSlice.reducer;
