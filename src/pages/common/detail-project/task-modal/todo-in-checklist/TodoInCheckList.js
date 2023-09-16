import React, { useEffect, useState } from "react";
import { Button, Input, Progress } from "antd";
import Todo from "./Todo";
import "./styleTodoInCheckList.css";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { useAppSelector } from "../../../../../app/hook";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import PopupReport from "../../popup/report/PopupReport";

const TodoInCheckList = () => {
  const [showForm, setShowForm] = useState(false);
  const [progress, setProgress] = useState(0);
  const [listTodos, setListTodos] = useState([]);
  const detailTodo = useAppSelector(GetDetailTodo);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const [name, setName] = useState("");
  const [checkListTodos, setCheckListTodos] = useState(false);
  const detailProject = useAppSelector(GetProject);
  const stompClient = getStompClient();

  useEffect(() => {
    if (detailTodo != null) {
      loadData();
    }
  }, [detailTodo]);

  const loadData = () => {
    setProgress(detailTodo.progress);
    setListTodos(detailTodo.listTodos);
    setCheckListTodos(detailTodo.listTodos.length > 0 ? false : true);
  };

  const handleAddTodo = () => {
    setName("");
    setShowForm(true);
  };

  const handleSaveTodo = () => {
    let obj = {
      periodId: periodCurrent.id,
      name: name,
      idTodoCreateOrDelete: detailTodo.id,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };

    stompClient.send(
      "/action/create-todo-checklist/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    setShowForm(false);
  };

  const handleCancelAdd = () => {
    setName("");
    setShowForm(false);
  };

  const [isOpenPopupReport, setIsOpenPopupReport] = useState(false);
  const [popupPositionPopupReport, setPopupPositionPopupReport] = useState({
    top: 0,
    left: 0,
  });

  const openPopupReport = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupReport({
      top: buttonPosition.bottom - 70,
      left: buttonPosition.left + 20,
    });
    setIsOpenPopupReport(true);
  };

  const closePopupReport = () => {
    setIsOpenPopupReport(false);
  };

  return (
    <div>
      <div>
        <Progress percent={progress} />
        {listTodos.map((todo, index) => (
          <Todo item={todo} key={index} />
        ))}
        {showForm ? (
          <div className="form-container">
            <Input
              placeholder="Nhập tên đầu việc"
              type="text"
              value={name}
              autoFocus={true}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="edit-input"
            />
            <Button
              disabled={!name}
              onClick={handleSaveTodo}
              className="edit-button save-button"
              style={{ marginTop: "8    px" }}
            >
              Thêm
            </Button>
            <Button
              style={{ marginTop: "8px" }}
              onClick={handleCancelAdd}
              className="edit-button cancel-button"
            >
              Hủy
            </Button>
          </div>
        ) : (
          <div>
            <Button
              onClick={handleAddTodo}
              style={{ backgroundColor: "rgb(47, 142, 219)", color: "white" }}
              className="btn_add_todo_check_list"
            >
              Thêm đầu việc
            </Button>
            {checkListTodos && (
              <Button
                style={{
                  backgroundColor: "rgb(47, 142, 219)",
                  color: "white",
                  float: "right",
                }}
                className="btn_add_todo_check_list"
                onClick={openPopupReport}
              >
                Báo cáo
              </Button>
            )}
          </div>
        )}
      </div>
      {isOpenPopupReport && (
        <PopupReport
          position={popupPositionPopupReport}
          onClose={closePopupReport}
        />
      )}{" "}
    </div>
  );
};

export default TodoInCheckList;
