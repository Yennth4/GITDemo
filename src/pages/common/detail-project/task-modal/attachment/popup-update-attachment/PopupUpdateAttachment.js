import { useEffect, useRef, useState } from "react";
import "./stylePopupUpdateAttachment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "antd";
import { useAppSelector } from "../../../../../../app/hook";
import { GetDetailTodo } from "../../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { getStompClient } from "../../../stomp-client-config/StompClientManager";
import { GetProject } from "../../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";

const PopupUpdateAttachment = ({ position, onClose, item }) => {
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
  const detailTodo = useAppSelector(GetDetailTodo);
  const stompClient = getStompClient();
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const [link, setLink] = useState(item.url);
  const [name, setName] = useState(item.name);

  const updateAttachment = () => {
    let obj = {
      id: item.id,
      name: name,
      url: link,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };

    stompClient.send(
      "/action/update-resource/" + detailProject.id + "/" + periodCurrent.id,
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
          Cập nhật
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
            onClick={updateAttachment}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupUpdateAttachment;
