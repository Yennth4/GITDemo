import ReactQuill from "react-quill";
import Image from "../../../../../helper/img/Image";
import { userCurrent } from "../../../../../helper/inForUser";
import "./styleCommentForm.css";
import { memo, useEffect, useState } from "react";
import Picker from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { useAppDispatch, useAppSelector } from "../../../../../app/hook";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import {
  GetDetailTodo,
  SetPageCommentDetailTodo,
} from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import ViewEditor from "./CommentItem";
import { DetailTodoAPI } from "../../../../../api/detail-todo/detailTodo.api";
import { current } from "@reduxjs/toolkit";
import { GetMemberProject } from "../../../../../app/reducer/detail-project/DPMemberProject.reducer";
import { DetailProjectAPI } from "../../../../../api/detail-project/detailProject.api";
import PopupTagComment from "../../popup/popup-tag-comment/PopupTagComment";

const CommentForm = memo(() => {
  const [inputStr, setInputStr] = useState("<p></p>");
  const [showPicker, setShowPicker] = useState(false);
  const [popupPositionPopupEmoji, setPopupPositionPopupEmoji] = useState({
    top: 0,
    left: 0,
  });
  const [checkBtnComment, setCheckBtnComment] = useState(false);
  const stompClient = getStompClient();
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailTodo = useAppSelector(GetDetailTodo);
  const [listComment, setListComment] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const memberProject = useAppSelector(GetMemberProject);
  const [totalPages, setTotalPages] = useState(0);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (detailTodo != null) {
      setListComment(detailTodo.comments.data);
      setCurrentPage(detailTodo.comments.currentPage);
      setTotalPages(detailTodo.comments.totalPages);
    }
  }, [detailTodo]);

  const onEmojiClick = (event, emojiObject) => {
    if (inputStr === "<p><br></p>") {
      setInputStr("<p>" + event.emoji + "</p>");
    }
    setInputStr((prevInput) => prevInput.slice(0, -4) + event.emoji + "</p>");
  };

  const onClickTagComment = (value) => {
    if (inputStr === "<p><br></p>") {
      setInputStr("<p>" + "@" + value + "</p>");
    } else {
      setInputStr((prevInput) => prevInput.slice(0, -4) + "@" + value + "</p>");
    }
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

  const findListMemberIdByUsername = (usernames) => {
    const memberIds = [];

    memberProject.forEach((item) => {
      if (usernames.includes(item.username) && item.id !== userCurrent.id) {
        memberIds.push(item.id);
      }
    });

    return memberIds;
  };

  const comment = () => {
    const usernames = inputStr.match(/@(\w+)/g);

    const uniqueUsernames = new Set();
    if (usernames != null) {
      usernames.forEach((username) =>
        uniqueUsernames.add(username.substring(1))
      );
    }

    const cleanedUsernames = Array.from(uniqueUsernames);

    let obj = {
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
      content: inputStr,
      idUser: userCurrent.id,
      mentionedUsernames: cleanedUsernames,
    };

    stompClient.send(
      "/action/create-comment/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );

    if (cleanedUsernames != null && cleanedUsernames.length > 0) {
      let objComment = {
        listMemberId: findListMemberIdByUsername(cleanedUsernames),
        todoId: detailTodo.id,
        url:
          "/detail-project/" +
          detailProject.id +
          "?idPeriod=" +
          periodCurrent.id +
          "&idTodo=" +
          detailTodo.id,
        idUser: userCurrent.id,
        username: userCurrent.username,
      };

      DetailProjectAPI.createNotification(objComment).then((response) => {});
      objComment.listMemberId.forEach((item) => {
        stompClient.send("/action/create-notification/" + item, {}, {});
      });
    }

    setInputStr("<p></p>");
    setShowPicker(false);
  };

  const showMoreComment = () => {
    DetailTodoAPI.getPageComment(detailTodo.id, currentPage + 1).then(
      (response) => {
        dispatch(SetPageCommentDetailTodo(response.data.data));
      }
    );
    setCurrentPage(currentPage + 1);
  };

  const [isOpenPopupTagComment, setIsOpenPopupTagComment] = useState(false);
  const [popupPositionPopupTagComment, setPopupPositionPopupTagComment] =
    useState({
      top: 0,
      left: 0,
    });

  const openPopupTagComment = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupTagComment({
      top: buttonPosition.bottom,
      left: buttonPosition.left,
    });
    setIsOpenPopupTagComment(true);
  };

  const closePopupTagComment = () => {
    setIsOpenPopupTagComment(false);
  };

  const reply = (value) => {
    if (inputStr === "<p><br></p>") {
      setInputStr("<p>" + "@" + value + "</p>");
    } else {
      setInputStr((prevInput) => prevInput.slice(0, -4) + "@" + value + "</p>");
    }
  };

  return (
    <div style={{ position: "relative" }}>
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
          theme="snow"
          placeholder="Viết bình luận..., nhập @ để nhắc tới ai đó"
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
      <Tooltip title="Nhắc đến ai đó" placement="right">
        <span className="tag_name_member" onClick={openPopupTagComment}>
          @
        </span>
      </Tooltip>
      {checkBtnComment && (
        <Tooltip title="Bình luận" placement="right">
          <FontAwesomeIcon
            onClick={comment}
            icon={faPaperPlane}
            className="send-icon"
          />
        </Tooltip>
      )}
      {!checkBtnComment && (
        <Tooltip title="Bình luận" placement="right">
          <FontAwesomeIcon icon={faPaperPlane} className="send-icon-disabled" />
        </Tooltip>
      )}
      <div style={{ marginTop: "2px" }}>
        {listComment.length > 0 &&
          listComment != null &&
          listComment.map((comment, index) => (
            <ViewEditor item={comment} key={index} reply={reply} />
          ))}
      </div>
      {totalPages > 1 && currentPage < totalPages - 1 && (
        <span className="show_more_comments" onClick={showMoreComment}>
          Xem thêm bình luận...
        </span>
      )}
      {isOpenPopupTagComment && (
        <PopupTagComment
          onClick={onClickTagComment}
          position={popupPositionPopupTagComment}
          onClose={closePopupTagComment}
        />
      )}{" "}
    </div>
  );
});

export default CommentForm;
