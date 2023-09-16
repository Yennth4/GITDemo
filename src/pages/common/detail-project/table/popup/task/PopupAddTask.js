import { Button, Input, Select } from "antd";
import "./stylePopupAddTask.css";
import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../../../../app/hook";
import { GetAllList } from "../../../../../../app/reducer/detail-project/DPBoardSlice.reducer";
import { GetPeriodCurrent } from "../../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetProject } from "../../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { toast } from "react-toastify";
import { userCurrent } from "../../../../../../helper/inForUser";
import { getStompClient } from "../../../stomp-client-config/StompClientManager";

const { Option } = Select;

const PopupAddTask = ({ onClose }) => {
  const popupRef = useRef(null);
  const list = useAppSelector(GetAllList);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
  const [name, setName] = useState("");
  const [valueList, setValueList] = useState("");
  const stompClient = getStompClient();

  useEffect(() => {
    if (list != null) {
      setValueList(list[0].id);
    }
  }, [list]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !popupRef.current &&
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
    zIndex: 100,
    width: "250px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "7px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const handleChange = (value) => {
    setValueList(value);
  };

  const findNameTodoList = (id) => {
    const foundList = list.find((item) => item.id === id);
    return foundList ? foundList.name : null;
  };

  const handleAddTask = () => {
    if (periodCurrent == null || Object.keys(periodCurrent).length === 0) {
      toast.error("Bạn chưa tạo giai đoạn");
      return;
    }
    let obj = {
      name: name,
      todoListId: valueList,
      nameTodoList: findNameTodoList(valueList),
      periodId: periodCurrent.id,
      projectId: detailProject.id,
      idUser: userCurrent.id,
    };
    stompClient.send(
      "/action/create-todo/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    setName("");
    onClose();
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-period">
      <div className="popup-header">
        <h4>Thêm thẻ</h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div
        style={{ marginTop: "10px", marginBottom: "10px", fontSize: "15px" }}
      >
        <div>
          <span>Tên thẻ:</span>
          <Input
            style={{ marginTop: "5px" }}
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            autoFocus={true}
            placeholder="Nhập tiêu đề thẻ"
          />
        </div>
        <div
          style={{ marginTop: "10px", marginBottom: "10px", fontSize: "15px" }}
        >
          <span>Danh sách:</span> <br />
          <Select
            style={{
              width: "100%",
              marginTop: "5px",
            }}
            value={valueList}
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            className="custom-select"
            onChange={handleChange}
          >
            {list.map((option) => (
              <Option key={option.id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ marginTop: "10px" }}>
          <Button
            onClick={handleAddTask}
            className="btn_add_list_popup"
            disabled={!name}
          >
            Thêm thẻ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupAddTask;
