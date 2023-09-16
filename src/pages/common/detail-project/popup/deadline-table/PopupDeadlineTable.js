import "./stylePopupDeadlineTable.css";
import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Select } from "antd";
import { useAppSelector } from "../../../../../app/hook";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { userCurrent } from "../../../../../helper/inForUser";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import moment from "moment";
import { formatDateToString } from "../../../../../helper/convertDate";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTimes } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

const PopupDeadlineTable = ({ todo, position, onClose }) => {
  const popupRef = useRef(null);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
  const stompClient = getStompClient();
  const [deadline, setDeadline] = useState(null);
  const [reminder, setReminder] = useState("none");

  useEffect(() => {
    if (todo.deadline != null) {
      setDeadline(moment(todo.deadline).format("YYYY-MM-DDTHH:mm"));
    }
    if (todo.reminderTime != null && todo.deadline != null) {
      setReminder(todo.deadline - todo.reminderTime + "");
    }
  }, [todo]);

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
    top: position.top - 20,
    left: position.left - 50,
    zIndex: 2000,
    width: "300px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const saveDeadline = () => {
    if (deadline == null || deadline === "") {
      toast.error("Mời chọn ngày hạn");
      return;
    }

    let obj = {
      idTodoUpdate: todo.id,
      deadline: formatDateToString(deadline),
      reminder: reminder,
      projectId: detailProject.id,
      idUser: userCurrent.id,
      idTodo: todo.id,
      idTodoList: todo.todoListId,
    };

    stompClient.send(
      "/action/update-deadline-todo/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    onClose();
  };

  const deleteDeadline = () => {
    if (todo.deadline == null && todo.reminderTime == null) {
      toast.error("Bạn chưa chọn ngày hạn !");
      return;
    }
    let obj = {
      idTodoDelete: todo.id,
      projectId: detailProject.id,
      idUser: userCurrent.id,
      idTodo: todo.id,
      idTodoList: todo.todoListId,
    };

    stompClient.send(
      "/action/delete-deadline-todo/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    onClose();
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-period">
      <div className="popup-header">
        <h4>
          <FontAwesomeIcon icon={faClock} style={{ marginRight: "5px" }} />
          Ngày hạn
        </h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div style={{ marginTop: "15px", marginBottom: "10px" }}>
        <div></div>{" "}
        <div style={{ marginTop: "7px" }}>
          <span style={{ fontSize: "14px" }}>Thời gian:</span>
        </div>
        <div style={{ marginTop: "7px" }}>
          {" "}
          <Input
            type="datetime-local"
            autoFocus={true}
            value={deadline}
            onChange={(e) => {
              setDeadline(e.target.value);
            }}
            className="date_picker_deadline"
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <span style={{ fontSize: "14px" }}>Đặt nhắc nhở:</span>
        </div>
        <div style={{ marginTop: "8px" }}>
          {" "}
          <Select
            style={{ width: "100%" }}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            value={reminder}
            onChange={(e) => {
              setReminder(e);
            }}
          >
            <Option value="none">None</Option>
            <Option value="0">Tại thời điểm hết hạn</Option>
            <Option value="3600000">Trước 1 giờ</Option>
            <Option value="7200000">Trước 2 giờ</Option>
            <Option value="86400000">Trước 1 ngày</Option>
          </Select>
        </div>
        <div style={{ marginTop: "7px", marginBottom: "7px" }}>
          <span style={{ color: "red", fontSize: "13px" }}>
            (*) Lưu ý: Tất cả các thành viên trong thẻ sẽ nhận được thông báo
          </span>
        </div>
        <div style={{ marginTop: "8px" }}>
          <Button className="btn_save_deadline" onClick={saveDeadline}>
            Lưu
          </Button>
          <Button className="btn_delete_deadline" onClick={deleteDeadline}>
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupDeadlineTable;
