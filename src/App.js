import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NotFound from "./pages/404";
import NotAuthorized from "./pages/403";
import { AppConfig } from "./AppConfig";
import { Suspense } from "react";
import AuthGuard from "./guard/AuthGuard";
import Dashboard from "./layout/DashBoard";
import DetailProject from "./pages/common/detail-project/DetailProject";
import HeaderComponent from "./component/Header";
import MyProject from "./pages/member/my-project/MyProject";
import ProjectManagement from "./pages/admin/project-management/ProjectManagement";
import CategoryManagement from "./pages/admin/category-management/CategoryManagement";
import LabelManagement from "./pages/admin/label-management/LabelManagement";
import StakeholderManagement from "./pages/admin/stakeholder-management/StakeholderManagement";
import PeriodProject from "./pages/member/period-project/PeriodProject";
import { ToastContainer, toast } from "react-toastify";
import DetailProjectDashBoard from "./pages/common/detail-project-dashboard/DetailProjectDashBoard";
import DashboardGeneral from "./pages/common/dashboard/Dashboard";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import notiCusTom from "./helper/background";
import { userCurrent } from "./helper/inForUser";
import { DetailProjectAPI } from "./api/detail-project/detailProject.api";
import { useAppDispatch } from "./app/hook";
import {
  SetCountNotifications,
  SetCurrentPage,
  SetListNotification,
  SetToTalPages,
} from "./app/reducer/notification/NotificationSlice.reducer";

function App() {
  const dispatch = useAppDispatch();
  const socket = new SockJS(
    "http://localhost:6789/portal-projects-websocket-endpoint"
  );
  let stompClientAll = Stomp.over(socket);

  stompClientAll.onWebSocketClose(() => {
    toast.info("Mất kết nối đến máy chủ !");
  });

  const playNotificationSound = () => {
    const audio = new Audio(notiCusTom);
    audio.play();
  };

  stompClientAll.connect({}, () => {
    stompClientAll.subscribe(
      "/portal-projects/create-notification/" + userCurrent.id,
      (message) => {
        toast.info("Bạn có thông báo mới", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        playNotificationSound();

        DetailProjectAPI.countNotification(userCurrent.id).then((response) => {
          dispatch(SetCountNotifications(response.data.data));
        });

        DetailProjectAPI.fetchAllNotification(userCurrent.id, 0).then(
          (response) => {
            dispatch(SetListNotification(response.data.data.data));
            dispatch(SetCurrentPage(response.data.data.currentPage));
            dispatch(SetToTalPages(response.data.data.totalPages));
          }
        );
      }
    );
  });

  return (
    <div className="App scroll-smooth md:scroll-auto">
      <ToastContainer />
      <BrowserRouter basename={AppConfig.routerBase}>
        <Suspense>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/layout-guard-roles" element={<NotAuthorized />} />

            <Route path="/" element={<Navigate replace to="/my-project" />} />
            <Route
              path="/admin/project-management"
              element={
                <AuthGuard>
                  <Dashboard>
                    <ProjectManagement />
                  </Dashboard>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/category-management"
              element={
                <AuthGuard>
                  <Dashboard>
                    <CategoryManagement />
                  </Dashboard>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/label-management"
              element={
                <AuthGuard>
                  <Dashboard>
                    <LabelManagement />
                  </Dashboard>
                </AuthGuard>
              }
            />
            <Route
              path="/admin/stakeholder-management"
              element={
                <AuthGuard>
                  <Dashboard>
                    <StakeholderManagement />
                  </Dashboard>
                </AuthGuard>
              }
            />
            <Route
              path="/detail-project/:id"
              element={
                <AuthGuard>
                  <HeaderComponent />
                  <DetailProject />
                </AuthGuard>
              }
            />
            <Route
              path="/detail-project/table/:id"
              element={
                <AuthGuard>
                  <HeaderComponent />
                  <DetailProject />
                </AuthGuard>
              }
            />
            <Route
              path="/detail-project/dashboard/:id"
              element={
                <AuthGuard>
                  <Dashboard>
                    <DetailProjectDashBoard />
                  </Dashboard>
                </AuthGuard>
              }
            />
            <Route
              path="/projects/dashboard"
              element={
                <AuthGuard>
                  <Dashboard>
                    <DashboardGeneral />
                  </Dashboard>
                </AuthGuard>
              }
            />
            <Route
              path="/my-project"
              element={
                <AuthGuard>
                  <Dashboard>
                    <MyProject />
                  </Dashboard>
                </AuthGuard>
              }
            />
            <Route
              path="/period-project/:id"
              element={
                <AuthGuard>
                  <Dashboard>
                    <PeriodProject />
                  </Dashboard>
                </AuthGuard>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
