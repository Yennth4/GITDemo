import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { faBars, faImage, faPalette } from "@fortawesome/free-solid-svg-icons";
import "./styleMenuRight.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalBackGroundImage from "../popup/background/ModalBackGroundImage";
import ModalBackGroundColor from "../popup/background/ModalBackgroundColor";

const { Sider } = Layout;

const MenuRight = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    // Xử lý đăng xuất
  };

  const [showModalBackgourndImage, setShowModalBackgourndImage] =
    useState(false);

  const handleClickModalBackgroundImage = (id) => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowModalBackgourndImage(true);
  };

  const handleModalBackgourndImageCancel = () => {
    document.querySelector("body").style.overflowX = "auto";
    setShowModalBackgourndImage(false);
  };

  const [showModalBackgourndColor, setShowModalBackgourndColor] =
    useState(false);

  const handleClickModalBackgroundColor = (id) => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowModalBackgourndColor(true);
  };

  const handleModalBackgourndColorCancel = () => {
    document.querySelector("body").style.overflowX = "auto";
    setShowModalBackgourndColor(false);
  };

  return (
    <div className="sidebar-menu">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        width={250}
        theme="dark"
      >
        <div className="title_box">
          <span style={{ fontSize: "18px", fontWeight: "500", color: "black" }}>
            Menu
          </span>
        </div>
        <Menu theme="light" mode="vertical" selectable={false}>
          <Menu.Item key="1" onClick={handleClickModalBackgroundImage}>
            <FontAwesomeIcon icon={faImage} style={{ marginRight: "7px" }} />
            Thay đổi hình nền
          </Menu.Item>
          <Menu.Item key="2" onClick={handleClickModalBackgroundColor}>
            <FontAwesomeIcon icon={faPalette} style={{ marginRight: "7px" }} />
            Thay đổi màu nền
          </Menu.Item>
        </Menu>
        
      </Sider>
      <ModalBackGroundImage
        visible={showModalBackgourndImage}
        onCancel={handleModalBackgourndImageCancel}
      />
      <ModalBackGroundColor
        visible={showModalBackgourndColor}
        onCancel={handleModalBackgourndColorCancel}
      />
    </div>
  );
  // <div className="box_description">
  //         <span style={{ fontSize: "16px", fontWeight: "500", color: "black" }}>
  //           <FontAwesomeIcon icon={faBars} style={{ marginRight: "5px" }} /> Mô
  //           tả dự án
  //         </span>
  //       </div>
};

export default MenuRight;
