import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "../task/Task";
import "./list.css";
import { Input, Tooltip } from "antd";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../app/hook";
import { GetPeriodCurrent } from "../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetProject } from "../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { userCurrent } from "../../../../helper/inForUser";
import { getStompClient } from "../stomp-client-config/StompClientManager";
import { useMemo } from "react";
import { UpdateNameTodoList } from "../../../../app/reducer/detail-project/DPBoardSlice.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import PopupListAction from "../popup/menu-list/PopupListAction";
import { useLocation, useNavigate } from "react-router";

const List = ({ list, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [listTitle, setListTitle] = useState(list.name);
  const [showAddForm, setShowAddForm] = useState(false);
  const [taskName, setTaskName] = useState("");
  const taskListRef = useRef(null);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
  const dispatch = useDispatch();
  const stompClient = getStompClient();
  const [idSelected, setIdSelected] = useState(null);
  let titleHistory = list.name;

  const handleEditTitle = (event) => {
    if (event.target.tagName !== "svg" && event.target.tagName !== "path") {
      setIsEditing(true);
    }
  };

  const handleSaveTitle = () => {
    setIsEditing(false);
    if (titleHistory === listTitle) {
      return;
    }
    let obj = {
      idTodoList: list.id,
      name: listTitle,
    };
    stompClient.send(
      "/action/update-name-todo-list/" + detailProject.id,
      {},
      JSON.stringify(obj)
    );
    let data = {
      id: list.id,
      name: listTitle,
    };
    dispatch(UpdateNameTodoList(data));
  };

  const handleInputChange = (e) => {
    setListTitle(e.target.value);
  };

  const handleAddTask = () => {
    setShowAddForm(true);
    setTimeout(() => {
      const taskList = document.querySelectorAll(".task-list")[index];
      taskList.scrollTop = taskList.scrollHeight;
    }, 1);
  };

  const handleTaskNameChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleSaveTask = () => {
    const newTaskTitle = taskName;
    if (newTaskTitle === "") {
      toast.error("Tiêu đề không được để trống");
      return;
    }
    if (periodCurrent == null || Object.keys(periodCurrent).length === 0) {
      toast.error("Bạn chưa tạo giai đoạn");
      return;
    }
    let obj = {
      name: newTaskTitle,
      todoListId: list.id,
      nameTodoList: list.name,
      periodId: periodCurrent.id,
      projectId: detailProject.id,
      idUser: userCurrent.id,
    };
    stompClient.send(
      "/action/create-todo/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    setTaskName("");
    setShowAddForm(false);
  };

  const handleCancelTask = () => {
    setShowAddForm(false);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const handleTaskClick = (event, id) => {
    const targetClassName = event.target.className || "";
    if (
      event.target.className !== "content_deadline" &&
      !targetClassName.toString().includes("box_deadline") &&
      event.target.tagName !== "path" &&
      event.target.tagName !== "svg"
    ) {
      document.querySelector("body").style.overflowX = "hidden";

      const searchParams = new URLSearchParams(location.search);
      searchParams.set("idTodo", id);
      const newSearch = searchParams.toString();
      let newPath = "";
      if (location.pathname.includes("table")) {
        newPath = `${location.pathname.replace(/\/[^/]+$/, "")}/${
          detailProject.id
        }?${newSearch}`;
      } else {
        newPath = `${location.pathname}?${newSearch}`;
      }
      navigate(newPath, { replace: true });
    }
  };

  const [isOpenPopupListAction, setIsOpenPopupListAction] = useState(false);
  const [popupPositionPopupListAction, setPopupPositionPopupListAction] =
    useState({
      top: 0,
      left: 0,
    });

  const openPopupListAction = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupListAction({
      top: buttonPosition.bottom + 25,
      left: buttonPosition.left + 30,
    });
    setIsOpenPopupListAction(true);
    setIdSelected(list);
  };

  const closePopupListAction = () => {
    setIsOpenPopupListAction(false);
    setIdSelected(null);
  };

  const memoizedTaskList = useMemo(() => {
    return list.tasks.map((task, index) => (
      <Task
        key={task.id}
        task={task}
        index={index}
        onClick={(event) => {
          handleTaskClick(event, task.id);
        }}
      />
    ));
  }, [list.tasks]);

  return (
    <Draggable draggableId={list.id} index={index} key={index}>
      {(provided) => (
        <div
          className="list"
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div
            className="list-header"
            {...provided.dragHandleProps}
            onClick={handleEditTitle}
          >
            {isEditing ? (
              <Input
                type="text"
                value={listTitle}
                onChange={handleInputChange}
                className="input_change_list_title"
                onBlur={handleSaveTitle}
                autoFocus
              />
            ) : (
              <>
                <span className="list-title-header">{list.name}</span>
              </>
            )}{" "}
            <Tooltip title="Hành động">
              <div className="menu_list" onClick={openPopupListAction}>
                <FontAwesomeIcon icon={faBars} style={{ fontSize: "14px" }} />
              </div>
            </Tooltip>
          </div>
          <Droppable droppableId={list.id} type="TASK" key={index}>
            {(provided, snapshot) => (
              <div
                className={`task-list ${
                  snapshot.isDraggingOver ? "dragging-over" : ""
                }`}
                ref={(el) => {
                  provided.innerRef(el);
                  taskListRef.current = el;
                }}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {memoizedTaskList}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {showAddForm ? (
            <div className="add-task-form">
              <Input
                type="text"
                value={taskName}
                placeholder="Mời nhập tiêu đề của thẻ"
                onChange={handleTaskNameChange}
                autoFocus
              />
              <button
                className="save-task-button"
                onClick={handleSaveTask}
                disabled={!taskName}
              >
                Thêm thẻ
              </button>
              <button className="cancel-task-button" onClick={handleCancelTask}>
                Hủy
              </button>
            </div>
          ) : (
            <button className="add-task-button" onClick={handleAddTask}>
              + Thêm một thẻ
            </button>
          )}
          {isOpenPopupListAction && (
            <PopupListAction
              position={popupPositionPopupListAction}
              onClose={closePopupListAction}
              list={idSelected}
            />
          )}{" "}
        </div>
      )}
    </Draggable>
  );
};

export default List;
