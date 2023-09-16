import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { Button, Input } from "antd";
import { useAppSelector } from "../../../../../../app/hook";
import { GetDetailTodo } from "../../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { getStompClient } from "../../../stomp-client-config/StompClientManager";
import { GetProject } from "../../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";

const PopupUpdateImage = ({ position, onClose, item }) => {
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
  const stompClient = getStompClient();
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const [name, setName] = useState(item.nameImage);

  const handleUpdateNameImage = () => {
    let obj = {
      id: item.id,
      nameImage: name,
    };

    stompClient.send(
      "/action/update-name-image/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    onClose();
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-period">
      <div className="popup-header">
        <h4>
          <FontAwesomeIcon icon={faImage} style={{ marginRight: "5px" }} />
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
          <span>Tên ảnh:</span> <br />
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            placeholder="Nhập tên ảnh"
          />
        </div>
        <div style={{ marginTop: "7px", fontSize: "15px" }}>
          <Button
            style={{ width: "100%" }}
            className="btn_add_attachment"
            onClick={handleUpdateNameImage}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupUpdateImage;
