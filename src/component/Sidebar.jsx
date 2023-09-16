import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faTags,
  faChartLine,
  faUsers,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";

import "./style-sidebar.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

const SidebarComponent = ({ collapsed, toggleCollapsed }) => {
  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      theme="light"
      className="sidebar"
      width={250}
      style={{
        overflow: "auto",
        position: "fixed",
        left: 0,
      }}
    >
      <Menu theme="light" mode="inline">
        <Menu.Item
          key="1"
          className="menu_custom"
          icon={
            <FontAwesomeIcon
              icon={faCogs}
              style={{ color: "rgb(226, 179, 87)" }}
            />
          }
        >
          <Link to="/admin/project-management">Quản lý dự án</Link>
        </Menu.Item>
        <Menu.Item
          key="2"
          className="menu_custom"
          icon={
            <FontAwesomeIcon
              icon={faFolder}
              style={{ color: "rgb(226, 179, 87)" }}
            />
          }
        >
          <Link to="/admin/category-management">Quản lý thể loại</Link>
        </Menu.Item>
        <Menu.Item
          key="3"
          className="menu_custom"
          icon={
            <FontAwesomeIcon
              icon={faTags}
              style={{ color: "rgb(226, 179, 87)" }}
            />
          }
        >
          <Link to="/admin/label-management">Quản lý nhãn</Link>
        </Menu.Item>

        <Menu.Item
          key="4"
          className="menu_custom"
          icon={
            <FontAwesomeIcon
              icon={faUsers}
              style={{ color: "rgb(226, 179, 87)" }}
            />
          }
        >
          <Link to="/admin/stakeholder-management">Quản lý bên liên quan</Link>
        </Menu.Item>
        <Menu.Item
          key="5"
          className="menu_custom"
          icon={
            <FontAwesomeIcon
              icon={faCogs}
              style={{ color: "rgb(226, 179, 87)" }}
            />
          }
        >
          <Link to="/my-project">Dự án của tôi</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;

/*
<Menu.Item
          key="6"
          className="menu_custom"
          icon={
            <FontAwesomeIcon
              icon={faChartLine}
              style={{ color: "rgb(226, 179, 87)" }}
            />
          }
        >
          <Link to="/projects/dashboard">Thống kê</Link>
        </Menu.Item>
        <Menu.Item
          key="7"
          className="menu_custom"
          icon={
            <FontAwesomeIcon
              icon={faCogs}
              style={{ color: "rgb(226, 179, 87)" }}
            />
          }
        >
          <Link to="/option6">Dự án đang theo dõi</Link>
        </Menu.Item>
*/
