import React, { useState } from "react";
import { Layout, Input, Badge, Avatar, Menu, Dropdown, Switch } from "antd";
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./style-header.css";
import AvtDefault from "../assets/img/328693761_727939795557043_1972102579202651860_n.jpg";
import { userCurrent } from "../helper/inForUser";
import PopupNotification from "./notification/Notification";
import { DetailProjectAPI } from "../api/detail-project/detailProject.api";
import { useAppDispatch, useAppSelector } from "../app/hook";
import {
  GetCountNotification,
  SetCountNotifications,
  SetCurrentPage,
  SetListNotification,
  SetToTalPages,
} from "../app/reducer/notification/NotificationSlice.reducer";
import { useEffect } from "react";

const { Header } = Layout;

const HeaderComponent = ({ collapsed, toggleCollapsed }) => {
  const handleMenuClick = (e) => {
    if (e.key === "3") {
      console.log("Logout clicked");
    }
  };

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="2">Thông tin người dùng</Menu.Item>
      <Menu.Item key="3">Đăng xuất</Menu.Item>
    </Menu>
  );

  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    // const elements = document.querySelectorAll("*");
    // if (checked) {
    //   elements.forEach((element) => {
    //     element.classList.add("dark-mode");
    //     element.classList.remove("light-mode");
    //   });
    // } else {
    //   elements.forEach((element) => {
    //     element.classList.remove("dark-mode");
    //     element.classList.add("light-mode");
    //   });
    // }
  };

  const [isOpenPopupNotification, setIsOpenPopupNotification] = useState(false);
  const [popupPositionPopupNotification, setPopupPositionPopupNotification] =
    useState({
      top: 0,
      left: 0,
    });

  const openPopupNotification = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupNotification({
      top: buttonPosition.bottom + 15,
      left: buttonPosition.left - 130,
    });
    setIsOpenPopupNotification(true);
  };

  const closePopupNotification = () => {
    setIsOpenPopupNotification(false);
  };

  const dispatch = useAppDispatch();

  const loadCountNotification = () => {
    DetailProjectAPI.countNotification(userCurrent.id).then((response) => {
      dispatch(SetCountNotifications(response.data.data));
    });
  };

  const loadDataNotification = () => {
    DetailProjectAPI.fetchAllNotification(userCurrent.id, 0).then(
      (response) => {
        dispatch(SetListNotification(response.data.data.data));
        dispatch(SetCurrentPage(response.data.data.currentPage));
        dispatch(SetToTalPages(response.data.data.totalPages));
      }
    );
  };

  useEffect(() => {
    loadCountNotification();
    loadDataNotification();
  }, []);

  const countNotifications = useAppSelector(GetCountNotification);

  return (
    <div className="sticky-header">
      <Header
        className={collapsed ? "collapsed" : ""}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="title_logo">
            {" "}
            <img
              src="https://raw.githubusercontent.com/FPLHN-FACTORY/udpm-common-resources/main/fpoly-udpm/logo-udpm-3.png"
              className="logo_project"
            />{" "}
            Projects
          </div>
          <div
            className="sidebar-toggle"
            onClick={toggleCollapsed}
            style={{
              cursor: "pointer",
              width: "32px",
              marginRight: "20px",
              height: "32px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgb(226, 179, 87)",
              borderRadius: "50%",
              color: "#fff",
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Badge count={countNotifications} style={{ cursor: "pointer" }}>
            <BellOutlined
              onClick={(e) => {
                openPopupNotification(e);
              }}
              style={{ fontSize: 20, cursor: "pointer" }}
              className="box_notification"
            />
          </Badge>
          <div style={{ marginRight: 16, marginLeft: 25 }}>
            <Switch
              checkedChildren={<BulbOutlined />}
              unCheckedChildren={<PoweroffOutlined />}
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          </div>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Link
              to="/user"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
              style={{ display: "flex", alignItems: "center" }}
            >
              <img
                className="img_avatar"
                src={userCurrent.image}
                alt="User Avatar"
              />
              <span
                className="span-name-usercurrent"
                style={{ marginLeft: 8, fontWeight: 500, color: "#4f4f4f" }}
              >
                {userCurrent.name}
              </span>
            </Link>
          </Dropdown>
        </div>
      </Header>
      {isOpenPopupNotification && (
        <PopupNotification
          position={popupPositionPopupNotification}
          onClose={closePopupNotification}
        />
      )}{" "}
    </div>
  );
};

export default HeaderComponent;
