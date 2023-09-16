import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  Modal,
  Popconfirm,
  Spin,
  Tooltip,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTasks,
  faUserPlus,
  faUserTimes,
  faUsers,
  faTags,
  faCalendarAlt,
  faImage,
  faLink,
  faTrashAlt,
  faBars,
  faAngleDoubleUp,
  faAngleDoubleDown,
  faAngleDown,
  faAngleUp,
  faCheck,
  faComment,
  faGrip,
  faTurnUp,
} from "@fortawesome/free-solid-svg-icons";
import "./styleTaskModal.css";
import Image from "../../../../helper/img/Image";
import FormEditor from "../form-editor/FormEditor";
import TodoInCheckList from "./todo-in-checklist/TodoInCheckList";
import { DetailTodoAPI } from "../../../../api/detail-todo/detailTodo.api";
import { useAppDispatch, useAppSelector } from "../../../../app/hook";
import {
  GetDetailTodo,
  SetDetailTodo,
} from "../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { GetAllList } from "../../../../app/reducer/detail-project/DPBoardSlice.reducer";
import { GetMemberProject } from "../../../../app/reducer/detail-project/DPMemberProject.reducer";
import { formatDateTime } from "../../../../helper/convertDate";
import PopupMember from "../popup/member/PopupMember";
import PopupLabel from "../popup/label/PopupLabel";
import { getStompClient } from "../stomp-client-config/StompClientManager";
import { GetPeriodCurrent } from "../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetProject } from "../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import PopupPriority from "../popup/priority/PopupPriority";
import { userCurrent } from "../../../../helper/inForUser";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import CommentForm from "./comment/CommentForm";
import ListActivity from "./activity/ListActivity";
import ViewEditorJodit from "../form-editor/ViewEditorJodit";
import PopupDeadline from "../popup/deadline/PopupDeadline";
import { memo } from "react";
import PopupAttachment from "../popup/attachment/PopupAttachment";
import ListAttachment from "./attachment/ListAttachment";
import PopupImage from "../popup/image/PopupImage";
import ListImage from "./image/ListImage";
import PopupShowDetailImage from "../popup/popup-show-detail-image/PopupShowDetailImage";

const TaskModal = memo(({ open, onCancel, id }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [idTodoList, setIdTodoList] = useState("");
  const [nameTodoList, setNameTodoList] = useState("");
  const [listMemberTodo, setListMemberTodo] = useState([]);
  const [listLabelTodo, setListLabelTodo] = useState([]);
  const [priority, setPriority] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [listAttachment, setListAttachment] = useState(null);
  const [listImage, setListImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [nameFile, setNameFile] = useState(null);
  const [statusDeadline, setStatusDeadline] = useState(false);
  const [completionTime, setCompletionTime] = useState(null);
  const [descriptions, setDescriptions] = useState(null);
  const [typeTodo, setTypeTodo] = useState(null);
  const [isJoin, setIsJoin] = useState(false);

  const listMemberAPI = useAppSelector(GetMemberProject);
  const list = useAppSelector(GetAllList);

  const findNameTodoList = (id) => {
    const foundList = list.find((item) => item.id === id);
    return foundList ? foundList.name : null;
  };
  console.log("modal render");
  const detailTodo = useAppSelector(GetDetailTodo);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
  const stompClient = getStompClient();
  const [showDescriptions, setShowDescriptions] = useState(false);

  const handleStatusDeadline = (e) => {
    setStatusDeadline(e.target.checked);
    let obj = {
      id: detailTodo.id,
      status: detailTodo.completionTime == null ? Number(0) : Number(1),
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
      projectId: detailProject.id,
      periodId: periodCurrent.id,
      idUser: userCurrent.id,
    };
    stompClient.send(
      "/action/update-complete-todo/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  useEffect(() => {
    if (detailTodo != null && detailTodo.todoListId != null) {
      setNameTodoList(findNameTodoList(detailTodo.todoListId));
    }
  }, [detailTodo]);

  useEffect(() => {
    setLoading(true);
    if (id != null && id !== "") {
      DetailTodoAPI.detailTodo(id).then((response) => {
        let obj = response.data.data;
        dispatch(SetDetailTodo(obj));
        setTimeout(() => {
          setLoading(false);
        }, 600);
      });
    }

    return () => {
      cleanup();
    };
  }, [dispatch, id]);

  const cleanup = () => {
    dispatch(SetDetailTodo(null));
    setLoading(false);
    setName(null);
    setIdTodoList(null);
    setNameTodoList(null);
    setListMemberTodo([]);
    setListLabelTodo([]);
    setPriority(null);
    setDeadline(null);
    setCompletionTime(null);
    setDescriptions(null);
    setStatusDeadline(false);
    setIsJoin(false);
    setShowDescriptions(false);
    setListAttachment(null);
    setListImage(null);
    setNameFile(null);
    setImageId(null);
    document.title = detailProject.name + " | Portal-Projects";
  };

  useEffect(() => {
    if (detailTodo != null && detailTodo.todoListId != null) {
      document.title = detailTodo.name + " | " + detailProject.name;
      setName(detailTodo.name);
      setIdTodoList(detailTodo.id);

      const list = listMemberAPI.filter((member) =>
        detailTodo.members.includes(member.id)
      );

      const isUserJoined = detailTodo.members.includes(userCurrent.id);
      setIsJoin(isUserJoined);
      setListMemberTodo(list);
      setListLabelTodo(detailTodo.labels);
      setPriority(detailTodo.priorityLevel);
      setDeadline(detailTodo.deadline);
      if (detailTodo.completionTime != null) {
        setStatusDeadline(true);
      }
      setCompletionTime(detailTodo.completionTime);
      setDescriptions(detailTodo.descriptions);
      setTypeTodo(detailTodo.type);
      setListAttachment(detailTodo.attachments);
      setListImage(detailTodo.images);
      setNameFile(detailTodo.nameFile);
      setImageId(detailTodo.imageId);
    }
  }, [detailTodo]);

  const handleChangeDescription = (e) => {
    setDescriptions(e);
  };

  const [isOpenPopupMember, setIsOpenPopupMember] = useState(false);
  const [popupPositionPopupMember, setPopupPositionPopupMember] = useState({
    top: 0,
    left: 0,
  });

  const openPopupMember = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupMember({
      top: buttonPosition.bottom + 25,
      left: buttonPosition.left + 30,
    });
    setIsOpenPopupMember(true);
  };

  const closePopupMember = () => {
    setIsOpenPopupMember(false);
  };
  //label
  const [isOpenPopupLabel, setIsOpenPopupLabel] = useState(false);
  const [popupPositionPopupLabel, setPopupPositionPopupLabel] = useState({
    top: 0,
    left: 0,
  });

  const openPopupLabel = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupLabel({
      top: buttonPosition.bottom - 100,
      left: buttonPosition.left + 30,
    });
    setIsOpenPopupLabel(true);
  };

  const openPopupLabelCard = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupLabel({
      top: buttonPosition.bottom - 200,
      left: buttonPosition.left + 30,
    });
    setIsOpenPopupLabel(true);
  };

  const closePopupLabel = () => {
    setIsOpenPopupLabel(false);
  };
  //description

  const saveDescriptions = () => {
    if (descriptions == null) {
      return;
    }
    if (descriptions.length > 5000) {
      toast.error("Mô tả không vượt quá 5000 ký tự");
      return;
    }
    let obj = {
      idTodoUpdate: id,
      descriptions: descriptions,
      idTodo: id,
      idTodoList: detailTodo.todoListId,
    };

    stompClient.send(
      "/action/update-descriptions-todo/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    setShowDescriptions(false);
  };

  // priority
  const [isOpenPopupPriority, setIsOpenPopupPriority] = useState(false);
  const [popupPositionPopupPriority, setPopupPositionPopupPriority] = useState({
    top: 0,
    left: 0,
  });

  const openPopupPriority = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupPriority({
      top: buttonPosition.bottom - 70,
      left: buttonPosition.left + 20,
    });
    setIsOpenPopupPriority(true);
  };

  const closePopupPriority = () => {
    setIsOpenPopupPriority(false);
  };

  const handleUpdateTypeTodo = (type) => {
    let obj = {
      id: detailTodo.id,
      type: type,
      periodId: periodCurrent.id,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };

    stompClient.send(
      "/action/update-type-todo/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const handleJoinOutAssign = debounce(() => {
    if (detailTodo != null) {
      let obj = {
        idMember: userCurrent.id,
        nameMember: userCurrent.name,
        email: userCurrent.email,
        idTodoCreateOrDelete: detailTodo.id,
        projectId: detailProject.id,
        idUser: userCurrent.id,
        idTodo: detailTodo.id,
        idTodoList: detailTodo.todoListId,
      };

      if (!isJoin) {
        handleOutAssign(obj);
      } else {
        handleJoinAssign(obj);
      }
    }
  }, 250);

  const handleOutAssign = (obj) => {
    stompClient.send(
      "/action/join-assign/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const handleJoinAssign = (obj) => {
    stompClient.send(
      "/action/out-assign/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  // deadline
  const [isOpenPopupDeadline, setIsOpenPopupDeadline] = useState(false);
  const [popupPositionPopupDeadline, setPopupPositionPopupDeadline] = useState({
    top: 0,
    left: 0,
  });

  const openPopupDeadline = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupDeadline({
      top: buttonPosition.bottom - 70,
      left: buttonPosition.left + 20,
    });
    setIsOpenPopupDeadline(true);
  };

  const closePopupDeadline = () => {
    setIsOpenPopupDeadline(false);
  };

  const [showInput, setShowInput] = useState(false);

  const handleClick = () => {
    setShowInput(true);
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleBlur = () => {
    setShowInput(false);
    let obj = {
      name: name,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };
    stompClient.send(
      "/action/update-name-todo/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const [isOpenPopupAttachment, setIsOpenPopupAttachment] = useState(false);
  const [popupPositionPopupAttachment, setPopupPositionPopupAttachment] =
    useState({
      top: 0,
      left: 0,
    });

  const openPopupAttachment = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupAttachment({
      top: buttonPosition.bottom - 70,
      left: buttonPosition.left + 20,
    });
    setIsOpenPopupAttachment(true);
  };

  const closePopupAttachment = () => {
    setIsOpenPopupAttachment(false);
  };

  const [isOpenPopupImage, setIsOpenPopupImage] = useState(false);
  const [popupPositionPopupImage, setPopupPositionPopupImage] = useState({
    top: 0,
    left: 0,
  });

  const openPopupImage = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupImage({
      top: buttonPosition.bottom - 70,
      left: buttonPosition.left + 20,
    });
    setIsOpenPopupImage(true);
  };

  const closePopupImage = () => {
    setIsOpenPopupImage(false);
  };

  const [isOpenPopupShowDetailImage, setIsOpenPopupShowDetailImage] =
    useState(false);
  const [selectedNameFile, setSelectedNameFile] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const openPopupShowDetailImage = (fileName, imageId) => {
    setIsOpenPopupShowDetailImage(true);
    setSelectedNameFile(fileName);
    setSelectedImageId(imageId);
  };

  const closePopupShowDetailImage = () => {
    setIsOpenPopupShowDetailImage(false);
    setSelectedNameFile(null);
    setSelectedImageId(null);
  };

  const handleDeleteTodo = () => {
    let obj = {
      id: detailTodo.id,
      idPeriod: periodCurrent.id,
      idProject: detailProject.id,
    };

    stompClient.send(
      "/action/delete-todo/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    onCancel();
  };

  return (
    <div className="container_modal_show_detail">
      <Modal
        open={open}
        onCancel={onCancel}
        width={775}
        footer={null}
        style={{ top: "25px" }}
        bodyStyle={{
          display: "grid",
          gridTemplateColumns: "75% 25%",
          gridTemplateRows: "auto 1fr",
          minHeight: "300px",
        }}
        className="modal_show_detail"
      >
        <div style={{ gridColumn: "1 / span 2", marginBottom: "30px" }}>
          {" "}
          {nameFile != null && (
            <div
              style={{ width: "100%", height: "170px", textAlign: "center" }}
              className="box-image-cover"
            >
              <img
                src={nameFile}
                alt="Hình ảnh tiêu đề"
                height="100%"
                onClick={() => {
                  openPopupShowDetailImage(nameFile, imageId);
                }}
              />
            </div>
          )}
          {!showInput && (
            <div onClick={handleClick} className="span_name_detail_todo">
              <FontAwesomeIcon icon={faTasks} size="2x" />{" "}
              <span className="name_detail_todo">{name}</span>
            </div>
          )}
          {showInput && (
            <div>
              <Input
                type="text"
                value={name}
                onChange={handleChange}
                autoFocus={true}
                onBlur={handleBlur}
                style={{
                  width: "90%",
                  fontSize: "18px",
                  fontWeight: "500",
                  marginBottom: "5px",
                  marginLeft: "3px",
                }}
                className="input_change_name_detail_todo"
              />
            </div>
          )}
          <span>
            trong danh sách{" "}
            <span style={{ textDecoration: "underline", cursor: "pointer" }}>
              {nameTodoList}
            </span>
          </span>
        </div>
        {loading ? (
          <div className="loading-overlay">
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ gridColumn: "1" }}>
            <div style={{ height: "100%", borderRight: "1px solid #e8e8e8" }}>
              <div className="box_type_todo">
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      marginRight: "15px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span>Loại thẻ: </span>
                  </div>
                  {typeTodo === 0 && (
                    <div>
                      <Button className="btn_type">
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ marginRight: "5px" }}
                        />
                        Tài liệu
                      </Button>
                      <Button
                        className="btn_type_disabled"
                        onClick={() => {
                          handleUpdateTypeTodo(1);
                        }}
                      >
                        Công việc
                      </Button>
                    </div>
                  )}{" "}
                  {typeTodo === 1 && (
                    <div>
                      <Button
                        className="btn_type_disabled"
                        onClick={() => {
                          handleUpdateTypeTodo(0);
                        }}
                      >
                        Tài liệu
                      </Button>
                      <Button
                        className="btn_type"
                        style={{ backgroundColor: "#398ad6" }}
                      >
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ marginRight: "5px" }}
                        />
                        Công việc
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="box_member_label">
                <div className="box_member">
                  <span>Thành viên</span> <br />
                  <div className="list_member_task">
                    <div className="list_img_member">
                      {listMemberTodo.length > 0 &&
                        listMemberTodo != null &&
                        listMemberTodo.map((member, index) => (
                          <Image
                            marginRight={3}
                            url={member.image}
                            picxel={33}
                            name={member.name + " " + member.code}
                            key={index}
                          />
                        ))}
                    </div>
                    <div className="box_btn_add_list_member">
                      <Button
                        className="btn_add_list_member"
                        onClick={openPopupMember}
                      >
                        +
                      </Button>{" "}
                    </div>
                  </div>
                </div>{" "}
                <div>
                  <span className="box_label">Nhãn</span> <br />
                  <div className="list_label_task">
                    <div className="label_task">
                      {listLabelTodo.length > 0 &&
                        listLabelTodo != null &&
                        listLabelTodo.map((label, index) => (
                          <Tooltip title={`${label.name}`} key={index}>
                            <span
                              className="item_label"
                              key={index}
                              style={{
                                backgroundColor: label.colorLabel,
                                color: "white",
                                cursor: "pointer",
                              }}
                            >
                              <span className="span_dot">&#x2022;</span>
                              <span style={{ marginLeft: "3px" }}>
                                {label.name}
                              </span>
                            </span>
                          </Tooltip>
                        ))}
                      <Button
                        className="btn_add_list_label"
                        onClick={openPopupLabel}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "15px" }}>
                <span onClick={openPopupPriority}>
                  {priority === 0 && (
                    <Tooltip title="Độ ưu tiên: Quan trọng">
                      <span>Độ ưu tiên:</span>
                      <FontAwesomeIcon
                        className="icon_priority"
                        style={{ color: "red" }}
                        icon={faAngleDoubleUp}
                        data-tip="Tooltip Content"
                        data-for="priority-tooltip"
                      />{" "}
                      <span className="priority0">Quan trọng</span>
                    </Tooltip>
                  )}
                  {priority === 1 && (
                    <Tooltip title="Độ ưu tiên: Cao">
                      <span>Độ ưu tiên:</span>
                      <FontAwesomeIcon
                        className="icon_priority"
                        style={{ color: "orange" }}
                        icon={faAngleUp}
                      />{" "}
                      <span className="priority1">Cao</span>
                    </Tooltip>
                  )}
                  {priority === 2 && (
                    <Tooltip title="Độ ưu tiên: Trung bình">
                      <span>Độ ưu tiên:</span>
                      <FontAwesomeIcon
                        className="icon_priority"
                        style={{ color: "#2e7eca" }}
                        icon={faAngleDown}
                      />
                      <span className="priority2">Trung bình</span>
                    </Tooltip>
                  )}
                  {priority === 3 && (
                    <Tooltip title="Độ ưu tiên: Thấp">
                      <span>Độ ưu tiên:</span>
                      <FontAwesomeIcon
                        className="icon_priority"
                        style={{ color: "green" }}
                        icon={faAngleDoubleDown}
                      />
                      <span className="priority3">Thấp</span>
                    </Tooltip>
                  )}
                </span>{" "}
              </div>
              {deadline != null && (
                <div style={{ marginTop: "15px" }}>
                  <span>
                    Ngày hạn:{" "}
                    <Checkbox
                      checked={statusDeadline}
                      value={statusDeadline}
                      onChange={(e) => {
                        handleStatusDeadline(e);
                      }}
                      style={{ marginLeft: "5px" }}
                    />{" "}
                    <span className="deadline_content">
                      {formatDateTime(deadline)}
                    </span>
                  </span>
                </div>
              )}
              <div style={{ marginTop: "15px" }}>
                {completionTime != null && (
                  <span>
                    Ngày hoàn thành:{" "}
                    <span className="completion_content">
                      {formatDateTime(completionTime)}
                    </span>
                    {completionTime != null && completionTime < deadline && (
                      <span
                        className="type_completion"
                        style={{
                          backgroundColor: "rgb(64, 191, 41)",
                          color: "white",
                        }}
                      >
                        Hoàn thành sớm
                      </span>
                    )}
                    {completionTime != null && completionTime > deadline && (
                      <span
                        className="type_completion"
                        style={{
                          backgroundColor: "orange",
                          color: "white",
                        }}
                      >
                        Hoàn thành muộn
                      </span>
                    )}
                    {completionTime == null &&
                      deadline != null &&
                      new Date().getTime() > deadline && (
                        <span
                          className="type_completion"
                          style={{
                            backgroundColor: "red",
                            color: "white",
                          }}
                        >
                          Quá hạn
                        </span>
                      )}
                  </span>
                )}
              </div>
              <div style={{ marginTop: "20px" }}>
                <FontAwesomeIcon icon={faBars} size="2x" />{" "}
                <span className="title_content_detail_task">Mô tả</span> <br />
                {!showDescriptions &&
                  (descriptions === null || descriptions === "<p><br></p>") && (
                    <div
                      className="box_add_description"
                      onClick={() => {
                        setShowDescriptions(true);
                      }}
                    >
                      <span>Thêm mô tả...</span>
                    </div>
                  )}
                {!showDescriptions &&
                  descriptions != null &&
                  descriptions !== "<p><br></p>" && (
                    <div
                      style={{ marginTop: "15px", paddingRight: "8px" }}
                      onClick={() => {
                        setShowDescriptions(true);
                      }}
                    >
                      <ViewEditorJodit value={descriptions} />
                    </div>
                  )}
                {showDescriptions && (
                  <div style={{ marginTop: "15px", paddingRight: "8px" }}>
                    <FormEditor
                      value={descriptions}
                      onChange={handleChangeDescription}
                    />
                    <Button
                      className="btn_save_descriptions"
                      onClick={saveDescriptions}
                    >
                      Lưu mô tả
                    </Button>
                    <Button
                      className="btn_cancel_descriptions"
                      onClick={() => {
                        setShowDescriptions(false);
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </div>

              {listAttachment != null && listAttachment.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                  <FontAwesomeIcon icon={faLink} size="2x" />{" "}
                  <span className="title_content_detail_task">
                    Link đính kèm
                  </span>{" "}
                  <br />
                  <div>
                    <ListAttachment />
                  </div>
                </div>
              )}

              <div style={{ marginTop: "20px" }}>
                <FontAwesomeIcon icon={faTasks} size="2x" />{" "}
                <span className="title_content_detail_task">
                  Những việc cần làm
                </span>{" "}
                <br />
                <div style={{ marginTop: "10px", paddingRight: "8px" }}>
                  <TodoInCheckList />
                </div>
              </div>
              {listImage != null && listImage.length > 0 && (
                <div style={{ marginTop: "15px" }}>
                  <FontAwesomeIcon icon={faImage} size="2x" />{" "}
                  <span className="title_content_detail_task">Hình ảnh</span>{" "}
                  <br />
                  <div>
                    <ListImage />
                  </div>
                </div>
              )}
              <div style={{ marginTop: "20px" }}>
                <FontAwesomeIcon icon={faComment} size="2x" />{" "}
                <span className="title_content_detail_task">Bình luận</span>{" "}
              </div>
              <div style={{ marginTop: "15px" }}>
                <CommentForm />
              </div>
              <div style={{ marginTop: "10px" }}>
                <FontAwesomeIcon icon={faGrip} size="2x" />{" "}
                <span className="title_content_detail_task">Hoạt động</span>{" "}
              </div>
              <div style={{ marginTop: "10px" }}>
                <ListActivity />
              </div>
            </div>
          </div>
        )}
        <div style={{ gridColumn: "2", paddingLeft: "5px" }}>
          <div style={{ height: "100%" }}>
            <div>
              <span>Gợi ý</span> <br />
              <div className="div_suggest">
                {!isJoin && (
                  <Button
                    className="btn_add_card"
                    onClick={handleJoinOutAssign}
                  >
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      style={{ marginRight: "8px" }}
                    />{" "}
                    Tham gia
                  </Button>
                )}
                {isJoin && (
                  <Button
                    className="btn_add_card"
                    onClick={handleJoinOutAssign}
                  >
                    <FontAwesomeIcon
                      icon={faUserTimes}
                      style={{ marginRight: "8px" }}
                    />{" "}
                    Rời khỏi thẻ
                  </Button>
                )}
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <span>Thêm vào thẻ</span>
              <br />
              <div className="div_add_card">
                <Button className="btn_add_card" onClick={openPopupMember}>
                  {" "}
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{ marginRight: "8px" }}
                  />{" "}
                  Thành viên
                </Button>
                <Button className="btn_add_card" onClick={openPopupLabelCard}>
                  {" "}
                  <FontAwesomeIcon
                    icon={faTags}
                    style={{ marginRight: "8px" }}
                  />{" "}
                  Nhãn
                </Button>
                <Button className="btn_add_card" onClick={openPopupPriority}>
                  {" "}
                  <FontAwesomeIcon
                    icon={faTurnUp}
                    style={{ marginRight: "8px" }}
                  />{" "}
                  Độ ưu tiên
                </Button>
                <Button className="btn_add_card" onClick={openPopupDeadline}>
                  {" "}
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    style={{ marginRight: "8px" }}
                  />{" "}
                  Ngày hạn
                </Button>
                <Button className="btn_add_card" onClick={openPopupImage}>
                  {" "}
                  <FontAwesomeIcon
                    icon={faImage}
                    style={{ marginRight: "8px" }}
                  />{" "}
                  Hình ảnh
                </Button>
                <Button className="btn_add_card" onClick={openPopupAttachment}>
                  {" "}
                  <FontAwesomeIcon
                    icon={faLink}
                    style={{ marginRight: "8px" }}
                  />{" "}
                  Link đính kèm
                </Button>
              </div>
            </div>
            <div style={{ marginTop: "10px" }}>
              <span>Hành động</span>
              <br />
              <Popconfirm
                title="Xóa thẻ"
                description="Bạn có chắc chắn muốn xóa vĩnh viễn thẻ này không ?"
                onConfirm={handleDeleteTodo}
                okText="Có"
                cancelText="Không"
              >
                <div className="div_add_card">
                  <Button className="btn_add_card">
                    {" "}
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      style={{ marginRight: "8px" }}
                    />{" "}
                    Xóa thẻ
                  </Button>
                </div>
              </Popconfirm>
            </div>
          </div>
        </div>
      </Modal>
      {isOpenPopupMember && (
        <PopupMember
          position={popupPositionPopupMember}
          onClose={closePopupMember}
        />
      )}
      {isOpenPopupLabel && (
        <PopupLabel
          position={popupPositionPopupLabel}
          onClose={closePopupLabel}
        />
      )}
      {isOpenPopupPriority && (
        <PopupPriority
          position={popupPositionPopupPriority}
          onClose={closePopupPriority}
        />
      )}{" "}
      {isOpenPopupDeadline && (
        <PopupDeadline
          position={popupPositionPopupDeadline}
          onClose={closePopupDeadline}
        />
      )}{" "}
      {isOpenPopupAttachment && (
        <PopupAttachment
          position={popupPositionPopupAttachment}
          onClose={closePopupAttachment}
        />
      )}{" "}
      {isOpenPopupImage && (
        <PopupImage
          position={popupPositionPopupImage}
          onClose={closePopupImage}
        />
      )}{" "}
      {isOpenPopupShowDetailImage && (
        <PopupShowDetailImage
          onClose={closePopupShowDetailImage}
          nameFile={selectedNameFile}
          imageId={imageId}
        />
      )}{" "}
    </div>
  );
});

export default TaskModal;
