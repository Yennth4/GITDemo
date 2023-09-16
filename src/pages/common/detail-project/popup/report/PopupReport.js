import "./stylePopupReport.css";
import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faTurnUp } from "@fortawesome/free-solid-svg-icons";
import { Button, Slider } from "antd";
import { useState } from "react";
import { useAppSelector } from "../../../../../app/hook";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { userCurrent } from "../../../../../helper/inForUser";
import { getStompClient } from "../../stomp-client-config/StompClientManager";

const PopupReport = ({ position, onClose }) => {
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
    width: "300px",
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailTodo = useAppSelector(GetDetailTodo);
  const stompClient = getStompClient();

  const [valueProgress, setValueProgress] = useState(0);

  useEffect(() => {
    if (detailTodo != null) {
      setValueProgress(detailTodo.progress);
    }
  }, [detailTodo]);

  const handleProgressChange = (e) => {
    setValueProgress(e);
  };

  const handleReport = () => {
    let obj = {
      id: detailTodo.id,
      progress: parseInt(valueProgress),
      periodId: periodCurrent.id,
      projectId: detailProject.id,
      idUser: userCurrent.id,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };

    stompClient.send(
      "/action/update-progress-todo/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-priority">
      <div className="popup-header">
        <h4>
          <FontAwesomeIcon icon={faReceipt} style={{ marginRight: "5px" }} />
          Báo cáo
        </h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div style={{ marginTop: "10px" }}>
        <div>
          <span>Hãy báo cáo tiến độ công việc hiện tại:</span>
          <Slider
            min={0}
            max={100}
            value={valueProgress}
            style={{ marginTop: "10px" }}
            onChange={handleProgressChange}
            marks={{
              0: "0%",
              25: "25%",
              50: "50%",
              75: "75%",
              100: "100%",
            }}
            step={1}
            tipFormatter={(value) => `${value}%`}
          />
        </div>
        <div style={{ marginTop: "10px" }} onClick={handleReport}>
          <Button className="btn_report">Báo cáo</Button>
        </div>
      </div>
    </div>
  );
};

export default PopupReport;
