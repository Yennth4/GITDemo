import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./stylePopupShowDetailImage.css";
import React, { useEffect, useState } from "react";
import {
  faExternalLinkAlt,
  faImage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "../../../../../helper/convertDate";
import { Link } from "react-router-dom";
import { userCurrent } from "../../../../../helper/inForUser";
import { useAppSelector } from "../../../../../app/hook";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { Popconfirm } from "antd";

const PopupDetailImage = ({ item, onClose }) => {
  const detailTodo = useAppSelector(GetDetailTodo);
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
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

    onClose();
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

    onClose();
  };

  return (
    <div className="fullscreen-popup">
      <div className="popup-content">
        <span className="close-button" onClick={onClose}>
          X
        </span>
        <img
          src={item != null ? item.nameFile : null}
          alt="Large Image"
          className="fullscreen-image"
        />
        <div className="image-info">
          <div className="image-title">
            {item != null ? item.nameImage : null}
          </div>
          <div className="image-detail">
            <div className="detail-line">
              <span style={{ fontSize: "15px" }}>
                Đã được thêm vào lúc:{" "}
                {formatDateTime(item != null ? item.createdDate : null)}
              </span>
            </div>
            <div className="detail-line">
              <Link
                to={item.nameFile}
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
              {item != null && item.statusImage === 0 && (
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
              )}
              {item != null && item.statusImage === 1 && (
                <span
                  style={{ marginRight: "17px" }}
                  onClick={() => {
                    handleChangeCoverImage("1");
                  }}
                >
                  {" "}
                  <FontAwesomeIcon
                    style={{ marginRight: "7px" }}
                    icon={faImage}
                  />
                  Đặt làm ảnh tiêu đề
                </span>
              )}
              <Popconfirm
                title="Xóa hình ảnh"
                description="Bạn có chắc chắn muốn xóa ảnh này không ?"
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

export default PopupDetailImage;
