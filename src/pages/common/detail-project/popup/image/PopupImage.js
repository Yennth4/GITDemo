import { useEffect, useRef, useState } from "react";
import "./stylePopupImage.css";
import { Button, Input, Upload } from "antd";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { useAppSelector } from "../../../../../app/hook";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { UploadOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { userCurrent } from "../../../../../helper/inForUser";
import { DetailTodoAPI } from "../../../../../api/detail-todo/detailTodo.api";
import LoadingIndicatorNoOverlay from "../../../../../helper/loadingNoOverlay";

const PopupImage = ({ position, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

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
    top: position.top - 200,
    left: position.left + 50,
    zIndex: 9999,
    width: "300px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const popupRef = useRef(null);
  const detailTodo = useAppSelector(GetDetailTodo);
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const stompClient = getStompClient();

  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageUpload = (info) => {
    setSelectedImage(info.file.originFileObj);
  };

  const handleCreateImage = async () => {
    setIsLoading(true);
    const newImageType = "image/jpeg";
    let nameFileOld = name === "" ? selectedImage.name : name;

    const imageBlob = new Blob([selectedImage], { type: newImageType });
    const updatedImage = new File(
      [imageBlob],
      `${uuidv4() + new Date().getTime()}.jpg`,
      {
        type: newImageType,
      }
    );

    const formData = new FormData();
    formData.append("file", updatedImage);

    const data = await DetailTodoAPI.uploadImage(formData);

    let obj = {
      urlImage: data.data,
      nameFileOld: nameFileOld,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
      projectId: detailProject.id,
      idUser: userCurrent.id,
    };

    stompClient.send(
      "/action/create-image/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    setIsLoading(false);

    onClose();
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-period">
      {isLoading && <LoadingIndicatorNoOverlay />}
      <div className="popup-header">
        <h4>
          <FontAwesomeIcon icon={faImage} style={{ marginRight: "5px" }} />
          Tải ảnh lên
        </h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div
        style={{ marginTop: "10px", marginBottom: "5px" }}
        className="popup-image"
      >
        <div
          style={{ marginTop: "10px", marginBottom: "10px", fontSize: "15px" }}
        >
          <Upload
            listType="picture"
            showUploadList={false}
            onChange={handleImageUpload}
            style={{ width: "100%" }}
            accept="image/*"
          >
            <Button style={{ width: "100%" }} icon={<UploadOutlined />}>
              Chọn ảnh
            </Button>
          </Upload>

          {/* Hiển thị ảnh đã chọn */}
          {selectedImage && (
            <div>
              <h4>Ảnh đã chọn:</h4>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected"
                style={{ maxWidth: "100%", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>
        <div
          style={{ marginTop: "10px", marginBottom: "10px", fontSize: "15px" }}
        >
          <span>Tên ảnh:</span> <br />
          <Input
            type="text"
            placeholder="Nhập tên ảnh"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div style={{ marginTop: "7px", fontSize: "15px" }}>
          <Button
            style={{ width: "100%" }}
            className="btn_add_attachment"
            onClick={handleCreateImage}
          >
            Tải ảnh lên
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopupImage;
