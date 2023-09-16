import { Popconfirm } from "antd";
import "./styleImageComponent.css";
import { formatDateTime } from "../../../../../helper/convertDate";
import PopupUpdateImage from "./popup-update-image/PopupUpdateImage";
import { useState } from "react";
import { useAppSelector } from "../../../../../app/hook";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { userCurrent } from "../../../../../helper/inForUser";
import PopupDetailImage from "../../popup/popup-show-detail-image/PopupDetailImage";

const ImageComponent = ({ item }) => {
  const [image, setImage] = useState(null);
  const [isOpenPopupUpdateImage, setIsOpenPopupUpdateImage] = useState(false);
  const [popupPositionPopupUpdateImage, setPopupPositionPopupUpdateImage] =
    useState({
      top: 0,
      left: 0,
    });

  const openPopupUpdateImage = (event) => {
    setImage(item);
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupUpdateImage({
      top: buttonPosition.bottom - 50,
      left: buttonPosition.left + 65,
    });
    setIsOpenPopupUpdateImage(true);
  };

  const closePopupUpdateImage = () => {
    setIsOpenPopupUpdateImage(false);
    setImage(null);
  };

  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailTodo = useAppSelector(GetDetailTodo);
  const stompClient = getStompClient();

  const handleChangeCoverImage = (status) => {
    let obj = {
      idTodo: detailTodo.id,
      idImage: item.id,
      nameFile: item.nameFile,
      idTodoList: detailTodo.todoListId,
      status: status,
    };

    stompClient.send(
      "/action/change-cover-image/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const handleDeleteImage = () => {
    let obj = {
      id: item.id,
      nameFile: item.nameFile,
      nameImage: item.nameImage,
      statusImage: item.statusImage + "",
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
      projectId: detailProject.id,
      idUser: userCurrent.id,
    };

    stompClient.send(
      "/action/delete-image/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const [isOpenPopupShowDetailImage, setIsOpenPopupShowDetailImage] =
    useState(false);

  const openPopupShowDetailImage = () => {
    setIsOpenPopupShowDetailImage(true);
  };

  const closePopupShowDetailImage = () => {
    setIsOpenPopupShowDetailImage(false);
  };

  return (
    <div className="image">
      <div className="box_icon_link" onClick={openPopupShowDetailImage}>
        <img
          src={item.nameFile}
          alt="Hình ảnh"
          className="img-value-component"
        />
      </div>
      <div className="box_info_link">
        <div
          style={{
            fontSize: "16px",
            fontWeight: "500",
            maxWidth: "80%",
          }}
        >
          <span>
            {item.nameImage != null && item.nameImage !== ""
              ? item.nameImage
              : ""}
          </span>
        </div>
        <div style={{ marginTop: "3px" }}>
          Ngày tạo: {formatDateTime(item.createdDate)}
        </div>
        <div style={{ marginTop: "3px" }}>
          <span
            style={{ marginRight: "8px" }}
            className="update_image"
            onClick={openPopupUpdateImage}
          >
            Chỉnh sửa
          </span>
          <span style={{ marginRight: "10px" }}> | </span>
          <Popconfirm
            title="Xóa hình ảnh"
            description="Bạn có chắc chắn muốn xóa ảnh này không ?"
            okText="Có"
            onConfirm={handleDeleteImage}
            cancelText="Không"
          >
            <span className="delete_image">Xóa</span>{" "}
          </Popconfirm>
          <span style={{ marginLeft: "10px" }}> | </span>
          {item.statusImage === 0 ? (
            <span
              className="delete_cover"
              onClick={() => {
                handleChangeCoverImage("0");
              }}
            >
              Xóa khỏi ảnh tiêu đề
            </span>
          ) : (
            <span
              className="set_cover"
              onClick={() => {
                handleChangeCoverImage("1");
              }}
            >
              Đặt làm ảnh tiêu đề
            </span>
          )}{" "}
        </div>
      </div>
      {isOpenPopupUpdateImage && (
        <PopupUpdateImage
          position={popupPositionPopupUpdateImage}
          onClose={closePopupUpdateImage}
          item={image}
        />
      )}
      {isOpenPopupShowDetailImage && (
        <PopupDetailImage onClose={closePopupShowDetailImage} item={item} />
      )}{" "}
    </div>
  );
};

export default ImageComponent;
