import { Select } from "antd";
import "./style-notification.css";
import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { GetPeriodCurrent } from "../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetProject } from "../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetDetailTodo } from "../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { GetMemberProject } from "../../app/reducer/detail-project/DPMemberProject.reducer";
import { getStompClient } from "../../pages/common/detail-project/stomp-client-config/StompClientManager";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCheck } from "@fortawesome/free-solid-svg-icons";
import { DetailProjectAPI } from "../../api/detail-project/detailProject.api";
import { userCurrent } from "../../helper/inForUser";
import { useState } from "react";
import { Link } from "react-router-dom";
import { convertTimestampToCustomFormatVer2 } from "../../helper/convertDate";
import {
  ChangeAllStatusNotification,
  ChangeStatusNotification,
  GetCurrentPageNotifications,
  GetListNotification,
  GetTotalPageNotifications,
  SetCurrentPage,
  SetToTalPages,
  ShowMoreNotification,
} from "../../app/reducer/notification/NotificationSlice.reducer";

const { Option } = Select;

const PopupNotification = ({ position, onClose }) => {
  const popupRef = useRef(null);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
  const detailTodo = useAppSelector(GetDetailTodo);
  const listMemberProject = useAppSelector(GetMemberProject);
  const stompClient = getStompClient();

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
    top: position.top,
    left: position.left,
    zIndex: 999999909,
    width: "320px",
    backgroundColor: "white",
    padding: "10px",
    paddingRight: "5px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const listNotifications = useAppSelector(GetListNotification);
  const dispatch = useAppDispatch();

  const clickNotification = (id, status) => {
    if (status === 0) {
      dispatch(ChangeStatusNotification(id));
      DetailProjectAPI.updateStatusNotification(id).then((res) => {});
    }
  };

  const currentPage = useAppSelector(GetCurrentPageNotifications);
  const totalPages = useAppSelector(GetTotalPageNotifications);

  const showMoreNotification = () => {
    DetailProjectAPI.fetchAllNotification(userCurrent.id, currentPage + 1).then(
      (response) => {
        dispatch(ShowMoreNotification(response.data.data.data));
        dispatch(SetCurrentPage(response.data.data.currentPage));
        dispatch(SetToTalPages(response.data.data.totalPages));
      }
    );
  };

  const updateStatusAll = () => {
    dispatch(ChangeAllStatusNotification());
    DetailProjectAPI.updateAllStatusNotification(userCurrent.id).then(
      (response) => {}
    );
  };

  return (
    <div ref={popupRef} style={popupStyle} className="trello-notification">
      <div className="trello-notification-header">
        <div>
          <FontAwesomeIcon
            icon={faBell}
            style={{ marginRight: "5px", color: "#0079bf" }}
          />
          Thông báo
        </div>
        <div
          style={{ fontSize: "13px", cursor: "pointer" }}
          className="box_danh_dau_da_doc"
          onClick={updateStatusAll}
        >
          <FontAwesomeIcon icon={faCheck} style={{ marginRight: "5px" }} />
          Đánh dấu là đã đọc
        </div>
      </div>
      <div className="body-notification">
        {listNotifications != null &&
          listNotifications.length > 0 &&
          listNotifications.map((item) => (
            <Link
              to={item.url}
              style={{ textDecoration: "none" }}
              onClick={() => {
                clickNotification(item.id, item.status);
              }}
            >
              <div
                style={{
                  borderBottom: "1px solid gray",
                  padding: "8px",
                  cursor: "pointer",
                }}
              >
                {item.status === 1 && (
                  <div
                    className="notification-text"
                    style={{ color: "gray", fontWeight: "100" }}
                  >
                    {item.content}
                  </div>
                )}
                {item.status === 0 && (
                  <div
                    className="notification-text"
                    style={{ color: "black", fontWeight: "600" }}
                  >
                    {item.content}
                  </div>
                )}
                <div className="notification-timestamp">
                  {convertTimestampToCustomFormatVer2(
                    parseInt(
                      item.createdDate.substring(
                        0,
                        item.createdDate.length - 3
                      ) + "000"
                    )
                  )}
                </div>
              </div>
            </Link>
          ))}
        {totalPages > 1 && currentPage < totalPages - 1 && (
          <div
            className="show-more-notification"
            onClick={showMoreNotification}
          >
            Xem thêm
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupNotification;
