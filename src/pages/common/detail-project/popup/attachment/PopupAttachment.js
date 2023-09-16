import { useEffect, useRef, useState } from "react";
import "./styleAttachment.css";
import { Button, Input } from "antd";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { useAppSelector } from "../../../../../app/hook";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { userCurrent } from "../../../../../helper/inForUser";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

const PopupAttachment = ({ position, onClose }) => {
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
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const popupRef = useRef(null);
  const [link, setLink] = useState("");
  const [name, setName] = useState("");
  const detailTodo = useAppSelector(GetDetailTodo);
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const stompClient = getStompClient();

  const handleAddAttachment = () => {
    let obj = {
      name: name,
      url: link,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
      projectId: detailProject.id,
      idUser: userCurrent.id,
    };

    stompClient.send(
      "/action/create-resource/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );

    onClose();
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-period">
      <div className="popup-header">
        <h4>
          <FontAwesomeIcon icon={faLink} style={{ marginRight: "5px" }} />
          Link đính kèm
        </h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div style={{ marginTop: "10px", marginBottom: "5px" }}>
        <div
          style={{ marginTop: "10px", marginBottom: "10px", fontSize: "15px" }}
        >
          <span>Link đính kèm:</span> <br />
          <Input
            value={link}
            autoFocus={true}
            onChange={(e) => {
              setLink(e.target.value);
            }}
            type="text"
            placeholder="Dán link đính kém"
          />
        </div>
        <div
          style={{ marginTop: "10px", marginBottom: "10px", fontSize: "15px" }}
        >
          <span>Tên link đính kèm:</span> <br />
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            placeholder="Nhập tên link đính kèm"
          />
        </div>
        <div style={{ marginTop: "7px", fontSize: "15px" }}>
          <Button
            style={{ width: "100%" }}
            className="btn_add_attachment"
            onClick={handleAddAttachment}
          >
            Thêm link đính kèm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupAttachment;
