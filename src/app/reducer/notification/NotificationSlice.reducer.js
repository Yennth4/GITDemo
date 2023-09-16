import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  countNotifications: 0,
  listNotifications: [],
  totalPages: 0,
  currentPage: 0,
};

const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    SetCountNotifications: (state, action) => {
      state.countNotifications = action.payload;
      return state;
    },
    SetListNotification: (state, action) => {
      state.listNotifications = action.payload;
      return state;
    },
    ShowMoreNotification: (state, action) => {
      let data = action.payload;
      data.forEach((item) => {
        state.listNotifications.push(item);
      });
      return state;
    },
    ChangeStatusNotification: (state, action) => {
      let id = action.payload;
      state.listNotifications.forEach((item) => {
        if (item.id === id) {
          item.status = 1;
        }
      });
      state.countNotifications = state.countNotifications - 1;
      return state;
    },
    ChangeAllStatusNotification: (state, action) => {
      state.listNotifications.forEach((item) => {
        item.status = 1;
      });
      state.countNotifications = 0;
      return state;
    },
    SetCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      return state;
    },
    SetToTalPages: (state, action) => {
      state.totalPages = action.payload;
      return state;
    },
  },
});

export const {
  SetCountNotifications,
  SetListNotification,
  SetCurrentPage,
  SetToTalPages,
  ChangeStatusNotification,
  ChangeAllStatusNotification,
  ShowMoreNotification,
} = NotificationSlice.actions;

export const GetCountNotification = (state) =>
  state.notification.countNotifications;
export const GetListNotification = (state) =>
  state.notification.listNotifications;
export const GetCurrentPageNotifications = (state) =>
  state.notification.currentPage;
export const GetTotalPageNotifications = (state) =>
  state.notification.totalPages;
export default NotificationSlice.reducer;
