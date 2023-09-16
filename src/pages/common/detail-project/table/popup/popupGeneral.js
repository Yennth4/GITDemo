import "./stylePopupGeneral.css";
import React, { useEffect, useRef, useState } from "react";
import { BarsOutlined, ProjectOutlined } from "@ant-design/icons";
import PopupAddList from "./list/PopupAddList";
import PopupAddTask from "./task/PopupAddTask";

const PopupGeneral = ({ onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  const popupStyle = {
    position: "fixed",
    bottom: "68px",
    right: "40px",
    zIndex: 9999,
    width: "175px",
    backgroundColor: "white",
    borderRadius: "7px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const [isOpenPopupAddList, setIsOpenPopupAddList] = useState(false);

  const openPopupAddList = (event) => {
    setIsOpenPopupAddList(true);
  };

  const closePopupAddList = () => {
    setIsOpenPopupAddList(false);
  };

  const [isOpenPopupAddTask, setIsOpenPopupAddTask] = useState(false);

  const openPopupAddTask = (event) => {
    setIsOpenPopupAddTask(true);
  };

  const closePopupAddTask = () => {
    setIsOpenPopupAddTask(false);
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-general">
      {" "}
      <div className="add_list_btn" onClick={openPopupAddList}>
        <BarsOutlined style={{ fontSize: "17px", marginRight: "7px" }} />
        Thêm danh sách
      </div>
      <div className="add_task_btn" onClick={openPopupAddTask}>
        <ProjectOutlined style={{ fontSize: "17px", marginRight: "7px" }} />
        Thêm thẻ
      </div>
      {isOpenPopupAddList && <PopupAddList onClose={closePopupAddList} />}
      {isOpenPopupAddTask && <PopupAddTask onClose={closePopupAddTask} />}
    </div>
  );
};

export default PopupGeneral;
