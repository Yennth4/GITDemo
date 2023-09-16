import "./stylePopupSort.css";
import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faFilter,
  faLineChart,
  faSort,
  faTrash,
  faTurnDown,
  faTurnUp,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { Popconfirm } from "antd";
import { ProjectOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../../../app/hook";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";

const PopupSort = ({ position, onClose }) => {
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
    top: position.top,
    left: position.left + 45,
    zIndex: 9999,
    paddingBottom: "7px",
    width: "285px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
  const stompClient = getStompClient();

  const sortPriority = (type) => {
    let obj = {
      idPeriod: periodCurrent.id,
      type: type,
    };

    stompClient.send(
      "/action/sort-todo-priority/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const sortDeadline = (type) => {
    let obj = {
      idPeriod: periodCurrent.id,
      type: type,
    };

    stompClient.send(
      "/action/sort-todo-deadline/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const sortCreatedDate = (type) => {
    let obj = {
      idPeriod: periodCurrent.id,
      type: type,
    };

    stompClient.send(
      "/action/sort-todo-created-date/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const sortName = (type) => {
    let obj = {
      idPeriod: periodCurrent.id,
      type: type,
    };

    stompClient.send(
      "/action/sort-todo-name/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const sortProgress = (type) => {
    let obj = {
      idPeriod: periodCurrent.id,
      type: type,
    };

    stompClient.send(
      "/action/sort-todo-progress/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-general">
      {" "}
      <div className="header_list_action">
        {" "}
        <FontAwesomeIcon icon={faSort} style={{ marginRight: "7px" }} />
        Sắp xếp
      </div>
      <div
        className="add_list_btn"
        onClick={() => {
          sortPriority(0);
        }}
      >
        <FontAwesomeIcon
          icon={faTurnDown}
          style={{ fontSize: "16px", marginRight: "7px" }}
        />
        Sắp xếp theo độ ưu tiên giảm dần
      </div>
      <div
        className="add_task_btn"
        onClick={() => {
          sortPriority(1);
        }}
      >
        <FontAwesomeIcon
          icon={faTurnUp}
          style={{ fontSize: "16px", marginRight: "7px" }}
        />
        Sắp xếp theo độ ưu tiên tăng dần
      </div>
      <hr />
      <div
        className="add_list_btn"
        onClick={() => {
          sortDeadline(1);
        }}
      >
        <FontAwesomeIcon
          icon={faClock}
          style={{ fontSize: "16px", marginRight: "7px" }}
        />
        Sắp xếp theo ngày hạn giảm dần
      </div>
      <div
        className="add_task_btn"
        onClick={() => {
          sortDeadline(0);
        }}
      >
        <FontAwesomeIcon
          icon={faClock}
          style={{ fontSize: "16px", marginRight: "7px" }}
        />
        Sắp xếp theo ngày hạn tăng dần
      </div>
      <hr />
      <div
        className="add_list_btn"
        onClick={() => {
          sortProgress(1);
        }}
      >
        <FontAwesomeIcon
          icon={faLineChart}
          style={{ fontSize: "16px", marginRight: "7px" }}
        />
        Sắp xếp theo tiến độ giảm dần
      </div>
      <div
        className="add_task_btn"
        onClick={() => {
          sortProgress(0);
        }}
      >
        <FontAwesomeIcon
          icon={faLineChart}
          style={{ fontSize: "16px", marginRight: "7px" }}
        />
        Sắp xếp theo tiến độ tăng dần
      </div>{" "}
      <hr />
      <div
        className="add_list_btn"
        onClick={() => {
          sortCreatedDate(1);
        }}
      >
        <FontAwesomeIcon
          icon={faClock}
          style={{ fontSize: "16px", marginRight: "7px" }}
        />
        Sắp xếp theo ngày tạo mới nhất
      </div>
      <div
        className="add_task_btn"
        onClick={() => {
          sortCreatedDate(0);
        }}
      >
        <FontAwesomeIcon
          icon={faClock}
          style={{ fontSize: "16px", marginRight: "7px" }}
        />
        Sắp xếp theo ngày tạo lâu nhất
      </div>{" "}
      <hr />{" "}
      <div
        className="add_list_btn"
        onClick={() => {
          sortName(1);
        }}
      >
        <ProjectOutlined style={{ fontSize: "16px", marginRight: "7px" }} />
        Sắp xếp theo tên thẻ giảm dần
      </div>
      <div
        className="add_task_btn"
        onClick={() => {
          sortName(0);
        }}
      >
        <ProjectOutlined style={{ fontSize: "16px", marginRight: "7px" }} />
        Sắp xếp theo tên thẻ tăng dần
      </div>{" "}
    </div>
  );
};

export default PopupSort;
