import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styleCommentItem.css";
import Image from "../../../../../helper/img/Image";
import Picker from "emoji-picker-react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hook";
import { GetMemberProject } from "../../../../../app/reducer/detail-project/DPMemberProject.reducer";
import { userCurrent } from "../../../../../helper/inForUser";
import moment from "moment/moment";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { Popconfirm, Tooltip } from "antd";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";

const ViewEditor = ({ item, reply }) => {
  const listMemberProject = useAppSelector(GetMemberProject);
  const [member, setMember] = useState(null);
  const [checkShowHide, setCheckShowHide] = useState(false);
  const detailTodo = useAppSelector(GetDetailTodo);
  const stompClient = getStompClient();
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const [checkShowFormEditComment, setCheckShowFormEditComment] =
    useState(false);
  const [inputStr, setInputStr] = useState(item.content);
  const [showPicker, setShowPicker] = useState(false);
  const [popupPositionPopupEmoji, setPopupPositionPopupEmoji] = useState({
    top: 0,
    left: 0,
  });
  const [checkBtnComment, setCheckBtnComment] = useState(true);

  useEffect(() => {
    console.log(item);
    if (
      listMemberProject != null &&
      listMemberProject.length > 0 &&
      item != null
    ) {
      loadDataMember();
    }
  }, [listMemberProject, item]);

  const loadDataMember = () => {
    let data = listMemberProject.find((member) => member.id === item.memberId);
    setCheckShowHide(item.memberId === userCurrent.id ? false : true);
    setMember(data);
    console.log(data);
  };

  useEffect(() => {
    if (checkShowFormEditComment) {
      setInputStr(item.content);
    }

    return () => {
      setInputStr("");
    };
  }, [checkShowFormEditComment]);

  const deleteComment = () => {
    let obj = {
      id: item.id,
      memberId: item.memberId,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };

    stompClient.send(
      "/action/delete-comment/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const onEmojiClick = (event, emojiObject) => {
    setInputStr((prevInput) => prevInput.slice(0, -4) + event.emoji + "</p>");
  };

  const handleClickEmoji = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupEmoji({
      top: buttonPosition.top,
      left: buttonPosition.left,
    });
    setShowPicker(!showPicker);
  };

  const handleChangeInput = (e) => {
    if (e !== "" && e !== "<p></p>" && e !== "<p><br></p>") {
      setCheckBtnComment(true);
    } else {
      setCheckBtnComment(false);
    }
    setInputStr(e);
  };

  const saveComment = () => {
    let obj = {
      id: item.id,
      content: inputStr,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
      memberId: item.memberId,
    };
    stompClient.send(
      "/action/update-comment/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    setShowPicker(false);
    setCheckShowFormEditComment(false);
  };

  return (
    <div style={{ marginBottom: "7px" }}>
      {checkShowFormEditComment && (
        <div style={{ marginTop: "10px" }}>
          {showPicker && (
            <Picker
              className="picker_emoji"
              style={popupPositionPopupEmoji}
              autoFocusSearch={false}
              onEmojiClick={onEmojiClick}
            />
          )}
          <div style={{ position: "relative", display: "flex" }}>
            <Image
              url={userCurrent.image}
              picxel={33}
              name={userCurrent.name + " " + userCurrent.code}
            />

            <ReactQuill
              value={inputStr}
              onChange={handleChangeInput}
              autoFocusSearch={true}
              theme="snow"
              placeholder="Viết bình luận..."
              modules={{ toolbar: false }}
              className="form_editor_no_toolbar"
            />
          </div>
          <Tooltip title="Emoji" placement="left">
            <img
              className="emoji-icon"
              src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
              onClick={(e) => {
                handleClickEmoji(e);
              }}
            />
          </Tooltip>
          <Tooltip title="Hủy" placement="right">
            <FontAwesomeIcon
              icon={faTimes}
              className="icon_cancel_form_edit"
              onClick={() => {
                setCheckShowFormEditComment(false);
              }}
            />
          </Tooltip>
          {checkBtnComment && (
            <Tooltip title="Lưu bình luận" placement="right">
              <FontAwesomeIcon
                onClick={saveComment}
                icon={faPaperPlane}
                className="send-icon"
              />
            </Tooltip>
          )}
          {!checkBtnComment && (
            <Tooltip title="Lưu bình luận" placement="right">
              <FontAwesomeIcon
                icon={faPaperPlane}
                className="send-icon-disabled"
              />
            </Tooltip>
          )}
        </div>
      )}
      {!checkShowFormEditComment && (
        <div>
          <div className="view-editor-header">
            <span style={{ fontWeight: "500" }}>
              {member != null ? member.name + " " + member.code : ""}
            </span>

            {item.statusEdit === 1 && (
              <span
                style={{
                  fontSize: "13px",
                  marginLeft: "7px",
                  fontWeight: "500",
                }}
              >
                Đã chỉnh sửa
              </span>
            )}
          </div>
          <div className="box_infor_member_comment">
            {" "}
            <Image
              url={member != null ? member.image : ""}
              name={member != null ? member.name + " " + member.code : ""}
              picxel={35}
            />
            <ReactQuill
              value={item.content}
              readOnly={true}
              theme="snow"
              className="form_view_editor"
              modules={{ toolbar: false }}
            />
          </div>
          <div className="box_action_comment">
            {checkShowHide && (
              <div>
                <span
                  onClick={() => {
                    reply(member.username);
                  }}
                  className="btn_reply_comment"
                >
                  Phản hồi
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    marginLeft: "5px",
                    fontWeight: "500",
                  }}
                >
                  {" "}
                  {moment(item.createdDate).format("DD/MM/YYYY HH:mm:ss")}
                </span>
              </div>
            )}
            {!checkShowHide && (
              <div>
                <span
                  className="btn_edit_comment"
                  onClick={() => {
                    setCheckShowFormEditComment(true);
                  }}
                >
                  Chỉnh sửa
                </span>
                <Popconfirm
                  title="Xóa bình luận"
                  description="Bạn có chắc chắn muốn xóa bình luận này không ?"
                  onConfirm={deleteComment}
                  okText="Có"
                  cancelText="Không"
                >
                  <span className="btn_delete_comment">Xóa</span>
                </Popconfirm>
                <span
                  style={{
                    fontSize: "13px",
                    marginLeft: "5px",
                    fontWeight: "500",
                  }}
                >
                  {" "}
                  {moment(item.createdDate).format("DD/MM/YYYY HH:mm:ss")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// <Tooltip title="Nhắc đến ai đó" placement="right">
// <span className="tag_name_member">@</span>
// </Tooltip>
export default ViewEditor;
