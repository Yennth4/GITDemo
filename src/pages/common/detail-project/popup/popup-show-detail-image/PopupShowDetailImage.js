import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./stylePopupShowDetailImage.css";
import React, { useEffect, useState } from "react";
import {
  faExternalLinkAlt,
  faImage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { DetailTodoAPI } from "../../../../../api/detail-todo/detailTodo.api";
import { formatDateTime } from "../../../../../helper/convertDate";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../../../app/hook";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { userCurrent } from "../../../../../helper/inForUser";
import { Popconfirm } from "antd";

const PopupShowDetailImage = ({ imageId, nameFile, onClose }) => {
  const [imageDetail, setImageDetail] = useState(null);

  useEffect(() => {
    if (imageId != null) {
      loadData();
    }

    return () => {
      setImageDetail(null);
    };
  }, []);

  const loadData = () => {
    DetailTodoAPI.detailImage(imageId).then((response) => {
      setImageDetail(response.data.data);
    });
  };

  const detailTodo = useAppSelector(GetDetailTodo);
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const stompClient = getStompClient();

  const handleChangeCoverImage = (status) => {
    let obj = {
      idTodo: detailTodo.id,
      idImage: imageDetail.id,
      nameFile: imageDetail.nameFile,
      idTodoList: detailTodo.todoListId,
      status: status,
    };

    stompClient.send(
      "/action/change-cover-image/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );

    onClose();
  };

  const handleDeleteImage = () => {
    let obj = {
      id: imageDetail.id,
      nameFile: imageDetail.nameFile,
      nameImage: imageDetail.nameImage,
      statusImage: imageDetail.statusImage === "COVER" ? "0" : "1",
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

    onClose();
  };

  return (
    <div className="fullscreen-popup">
      <div className="popup-content">
        <span className="close-button" onClick={onClose}>
          X
        </span>
        <img src={nameFile} alt="Large Image" className="fullscreen-image" />
        <div className="image-info">
          <div className="image-title">
            {imageDetail != null ? imageDetail.nameImage : null}
          </div>
          <div className="image-detail">
            <div className="detail-line">
              <span style={{ fontSize: "15px" }}>
                Đã được thêm vào lúc:{" "}
                {formatDateTime(
                  imageDetail != null ? imageDetail.createdDate : null
                )}
              </span>
            </div>
            <div className="detail-line">
              <Link
                to={nameFile}
                target="_blank"
                style={{ textDecoration: "none", color: "white" }}
              >
                <span style={{ marginRight: "17px" }}>
                  <FontAwesomeIcon
                    style={{ marginRight: "7px" }}
                    icon={faExternalLinkAlt}
                  />
                  Mở ở tab mới
                </span>
              </Link>
              <span
                style={{ marginRight: "17px" }}
                onClick={() => {
                  handleChangeCoverImage("0");
                }}
              >
                <FontAwesomeIcon
                  style={{ marginRight: "7px" }}
                  icon={faImage}
                />
                Xóa khỏi ảnh tiêu đề
              </span>
              <Popconfirm
                title="Xóa hình ảnh"
                description="Bạn có chắc chắn muốn xóa ảnh tiêu đề này không ?"
                okText="Có"
                onConfirm={handleDeleteImage}
                cancelText="Không"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <span>
                  <FontAwesomeIcon
                    style={{ marginRight: "7px" }}
                    icon={faTrash}
                  />
                  Xóa ảnh
                </span>
              </Popconfirm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupShowDetailImage;
