import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "../../../../../app/hook";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import "./styleAttachment.css";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../../../../helper/convertDate";
import { Popconfirm } from "antd";
import { userCurrent } from "../../../../../helper/inForUser";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { useState } from "react";
import PopupUpdateAttachment from "./popup-update-attachment/PopupUpdateAttachment";

const Attachment = ({ item }) => {
  const detailTodo = useAppSelector(GetDetailTodo);
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const stompClient = getStompClient();
  const [attachment, setAttachment] = useState(null);

  const handleDeleteAttachment = () => {
    let obj = {
      id: item.id,
      url: item.url,
      name: item.name,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
      projectId: detailProject.id,
      idUser: userCurrent.id,
    };

    stompClient.send(
      "/action/delete-resource/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const [isOpenPopupUpdateAttachment, setIsOpenPopupUpdateAttachment] =
    useState(false);
  const [
    popupPositionPopupUpdateAttachment,
    setPopupPositionPopupUpdateAttachment,
  ] = useState({
    top: 0,
    left: 0,
  });

  const openPopupUpdateAttachment = (event) => {
    setAttachment(item);
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupUpdateAttachment({
      top: buttonPosition.bottom - 50,
      left: buttonPosition.left + 65,
    });
    setIsOpenPopupUpdateAttachment(true);
  };

  const closePopupUpdateAttachment = () => {
    setIsOpenPopupUpdateAttachment(false);
    setAttachment(null);
  };

  return (
    <div className="attachment">
      <Link to={item.url} target="_blank">
        <div className="box_icon_link">
          <FontAwesomeIcon icon={faLink} style={{ fontSize: "18px" }} />
        </div>
      </Link>
      <div className="box_info_link">
        <div style={{ fontSize: "16px", fontWeight: "500" }}>
          {item.name != null && item.name !== "" ? item.name : item.url}
        </div>
        <div style={{ marginTop: "3px" }}>
          Ngày tạo: {formatDateTime(item.createdDate)}
        </div>
        <div style={{ marginTop: "3px" }}>
          <span
            style={{ marginRight: "8px" }}
            className="update_attachment"
            onClick={openPopupUpdateAttachment}
          >
            Chỉnh sửa
          </span>
          <span style={{ marginRight: "10px" }}> | </span>
          <Popconfirm
            title="Xóa link đính kèm"
            description="Bạn có chắc chắn muốn xóa link đính kém này không ?"
            onConfirm={handleDeleteAttachment}
            okText="Có"
            cancelText="Không"
          >
            <span className="delete_attachment">Xóa</span>{" "}
          </Popconfirm>
        </div>
        {isOpenPopupUpdateAttachment && (
          <PopupUpdateAttachment
            position={popupPositionPopupUpdateAttachment}
            onClose={closePopupUpdateAttachment}
            item={attachment}
          />
        )}
      </div>
    </div>
  );
};

export default Attachment;
