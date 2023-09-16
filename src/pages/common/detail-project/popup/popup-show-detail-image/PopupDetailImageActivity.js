import "./stylePopupShowDetailImage.css";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../app/hook";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";

const PopupDetailImageActivity = ({ item, onClose }) => {
  const detailTodo = useAppSelector(GetDetailTodo);
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const stompClient = getStompClient();

  return (
    <div className="fullscreen-popup">
      <div className="popup-content">
        <span className="close-button" onClick={onClose}>
          X
        </span>
        <img
          src={item != null ? item.urlImage : null}
          alt="Large Image"
          className="fullscreen-image"
        />
      </div>
    </div>
  );
};

export default PopupDetailImageActivity;
