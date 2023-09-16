import "./stylePopupListAction.css";
import React, { useEffect, useRef } from "react";
import { BarsOutlined, ProjectOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartGantt,
  faFilter,
  faPlus,
  faSort,
  faTrash,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Popconfirm } from "antd";
import { useAppSelector } from "../../../../../app/hook";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { toast } from "react-toastify";

const PopupListAction = ({ position, onClose, list }) => {
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
    top: position.top - 53,
    left: position.left,
    zIndex: 9999,
    paddingBottom: "7px",
    width: "265px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const detailProject = useAppSelector(GetProject);
  const stompClient = getStompClient();

  const deleteTodoList = () => {
    if (list.tasks.length > 0) {
      toast.error("Không thể xóa danh sách đang có thẻ");
      return;
    }
    let obj = {
      id: list.id,
      projectId: detailProject.id,
    };

    stompClient.send(
      "/action/delete-todo-list/" + detailProject.id,
      {},
      JSON.stringify(obj)
    );
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-general">
      {" "}
      <div className="header_list_action">
        {" "}
        <FontAwesomeIcon icon={faWaveSquare} style={{ marginRight: "7px" }} />
        Hành động
      </div>
      <Popconfirm
        title="Xóa danh sách"
        description="Bạn có chắc chắn muốn xóa danh sách này không ?"
        onConfirm={() => {
          deleteTodoList();
        }}
        okText="Có"
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        style={{ zIndex: 99999999 }}
        cancelText="Không"
      >
        <div className="add_list_btn">
          <FontAwesomeIcon
            icon={faTrash}
            style={{ fontSize: "17px", marginRight: "7px" }}
          />
          Xóa danh sách
        </div>
      </Popconfirm>
    </div>
  );
};

export default PopupListAction;

/*
<div className="add_task_btn">
        <FontAwesomeIcon
          icon={faSort}
          style={{ fontSize: "17px", marginRight: "7px" }}
        />
        Sắp xếp theo...
      </div>
      <div className="add_task_btn">
        <FontAwesomeIcon
          icon={faFilter}
          style={{ fontSize: "17px", marginRight: "7px" }}
        />
        Tìm kiếm theo...
      </div>
*/
