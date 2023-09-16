import "./stylePopupPriority.css";
import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, Radio, Select, Tooltip } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../../app/hook";
import {
  GetMemberPeriod,
  GetPeriodCurrent,
  SetPeriodCurrent,
} from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { Link } from "react-router-dom";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetMemberProject } from "../../../../../app/reducer/detail-project/DPMemberProject.reducer";
import Image from "../../../../../helper/img/Image";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { userCurrent } from "../../../../../helper/inForUser";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import debounce from "lodash/debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleDown,
  faAngleUp,
  faTurnUp,
} from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

const PopupPriority = ({ position, onClose }) => {
  const popupRef = useRef(null);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
  const detailTodo = useAppSelector(GetDetailTodo);
  const listMemberProject = useAppSelector(GetMemberProject);
  const stompClient = getStompClient();
  const [value, setValue] = useState();

  useEffect(() => {
    if (detailTodo != null) {
      setValue(detailTodo.priorityLevel);
    }
  }, [detailTodo]);

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
    width: "250px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    let obj = {
      idTodoChange: detailTodo.id,
      priorityLevel: e.target.value,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };
    stompClient.send(
      "/action/update-priority-todo/" +
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
          <FontAwesomeIcon icon={faTurnUp} style={{ marginRight: "5px" }} />
          Độ ưu tiên
        </h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div style={{ marginTop: "15px", marginBottom: "10px" }}>
        <div style={{ marginLeft: "12px" }}>
          <Radio.Group onChange={handleChange} value={value}>
            <div style={{ marginBottom: "10px" }}>
              <Radio value={0}>
                <FontAwesomeIcon
                  className="icon_priority_popup"
                  icon={faAngleDoubleUp}
                  style={{ marginRight: "8px", color: "red" }}
                />
                <span
                  style={{ fontWeight: "500", color: "red", fontSize: "15px" }}
                >
                  Quan trọng
                </span>
              </Radio>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <Radio value={1}>
                <FontAwesomeIcon
                  className="icon_priority_popup"
                  icon={faAngleUp}
                  style={{ marginRight: "8px", color: "orange" }}
                />
                <span
                  style={{
                    fontWeight: "500",
                    fontSize: "15px",
                    color: "orange",
                  }}
                >
                  Cao
                </span>
              </Radio>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <Radio value={2}>
                <FontAwesomeIcon
                  className="icon_priority_popup"
                  icon={faAngleDown}
                  style={{ marginRight: "8px", color: "#2e7eca" }}
                />
                <span
                  style={{
                    fontWeight: "500",
                    fontSize: "15px",
                    color: "#2e7eca",
                  }}
                >
                  Trung bình
                </span>
              </Radio>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <Radio value={3}>
                <FontAwesomeIcon
                  className="icon_priority_popup"
                  icon={faAngleDoubleDown}
                  style={{ marginRight: "8px", color: "green" }}
                />
                <span
                  style={{
                    fontWeight: "500",
                    fontSize: "15px",
                    color: "green",
                  }}
                >
                  Thấp
                </span>
              </Radio>
            </div>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
};

export default PopupPriority;
