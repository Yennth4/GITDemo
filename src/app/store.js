import { configureStore } from "@reduxjs/toolkit";
import boardSliceReducer from "./reducer/detail-project/DPBoardSlice.reducer";
import myProjectSliceReducer from "./reducer/my-project/myProjectSlice.reducer";
import memberProjectSliceReducer from "./reducer/detail-project/DPMemberProject.reducer";
import projectSliceReducer from "./reducer/detail-project/DPProjectSlice.reducer";
import PeriodSliceReducer from "./reducer/detail-project/DPPeriodSlice.reducer";
import periodProjectSliceReducer from "./reducer/member/period-project/periodProjectSlice.reducer";
import StompClientReducer from "./reducer/detail-project/StompClient.reducer";
import DPDetailTodoSliceReducer from "./reducer/detail-project/DPDetailTodoSlice.reducer";
import DPLabelProjectReducer from "./reducer/detail-project/DPLabelProject.reducer";
import adCategorySliceReducer from "./reducer/admin/category-management/adCategorySlice.reducer";
import labelManagementSliceReducer from "./reducer/admin/label-management/labelManagementSlice.reducer";
import projectManagementSlideReducer from "./reducer/admin/project-management/projectManagementSlide.reducer";
import memberProjectManagementReducer from "./reducer/admin/member-project-management/memberProjectManagement.reduce";
import categoryProjectManagementReducer from "./reducer/admin/category-project-management/categoryProjectManagement.reduce";
import StakeholderReducer from "./reducer/admin/stakeholder-management/Stakeholder.reducer";
import NotificationSliceReducer from "./reducer/notification/NotificationSlice.reducer";

export const store = configureStore({
  reducer: {
    board: boardSliceReducer,
    myProject: myProjectSliceReducer,
    memberProject: memberProjectSliceReducer,
    project: projectSliceReducer,
    memberPeriod: PeriodSliceReducer,
    periodProject: periodProjectSliceReducer,
    stompClient: StompClientReducer,
    detailTodo: DPDetailTodoSliceReducer,
    labelProject: DPLabelProjectReducer,
    adStakeholderManagement: StakeholderReducer,
    adCategory: adCategorySliceReducer,
    labelManagement: labelManagementSliceReducer,
    projectManagement: projectManagementSlideReducer,
    memberProjectManagement: memberProjectManagementReducer,
    categoryProjectManagement: categoryProjectManagementReducer,
    notification: NotificationSliceReducer
  },
});

export const dispatch = store.dispatch;
export const getState = store.getState;
