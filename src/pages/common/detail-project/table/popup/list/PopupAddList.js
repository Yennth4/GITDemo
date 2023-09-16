import { Button, Input } from "antd";
import "./stylePopupAddList.css";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../../../../app/hook";
import { GetProject } from "../../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { getStompClient } from "../../../stomp-client-config/StompClientManager";

const PopupAddList = ({ onClose }) => {
  const popupRef = useRef(null);
  const detailProject = useAppSelector(GetProject);
  const [name, setName] = useState("");
  const stompClient = getStompClient();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !popupRef.current.contains(event.target) &&
        !event.target.className.includes("ant-select-item-option-content")
      ) {
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
    width: "250px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "7px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleAddList = () => {
    let obj = {
      name: name,
      idProject: detailProject.id,
    };

    stompClient.send(
      "/action/create-todo-list/" + detailProject.id,
      {},
      JSON.stringify(obj)
    );
    onClose();
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-period">
      <div className="popup-header">
        <h4>Thêm danh sách</h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div
        style={{ marginTop: "10px", marginBottom: "10px", fontSize: "15px" }}
      >
        <div>
          <span>Tên danh sách:</span>
          <Input
            type="text"
            value={name}
            onChange={handleChangeName}
            autoFocus={true}
            placeholder="Nhập tiêu đề danh sách"
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <Button
            onClick={handleAddList}
            className="btn_add_list_popup"
            disabled={!name}
          >
            Thêm danh sách
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupAddList;
