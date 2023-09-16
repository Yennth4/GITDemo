import React, { useEffect, useState } from "react";
import { Button, Checkbox, Input, Popconfirm, Tooltip } from "antd";
import "./styleTodo.css"; // Import file CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../../../../app/hook";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";

const Todo = ({ item }) => {
  const [editing, setEditing] = useState(false);
  const [checked, setChecked] = useState(false);
  const detailTodo = useAppSelector(GetDetailTodo);
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const stompClient = getStompClient();
  const [name, setName] = useState(item.name);

  useEffect(() => {
    if (item != null) {
      setChecked(item.statusTodo === 1 ? true : false);
      setName(item.name);
    }
  }, [item]);

  const handleToggleEdit = () => {
    setEditing(!editing);
  };

  const handleDeleteTodo = (id) => {
    let obj = {
      id: id,
      todoId: detailTodo.id,
      periodId: periodCurrent.id,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };

    stompClient.send(
      "/action/delete-todo-checklist/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const handleCheckedStatusTodo = () => {
    let obj = {
      idTodoChange: item.id,
      statusTodo: checked ? 0 : 1,
      periodId: periodCurrent.id,
      todoId: detailTodo.id,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };

    stompClient.send(
      "/action/update-statustodo-todo-checklist/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    setChecked(!checked);
  };

  const handleChangeName = () => {
    setEditing(false);
    let obj = {
      name: name,
      idTodoCreateOrDelete: item.id,
      idTodo: detailTodo.id,
      idTodoList: detailTodo.todoListId,
    };
    stompClient.send(
      "/action/update-todo-checklist/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  return (
    <div className="todo-container">
      {editing ? (
        <div className="edit-form">
          <Input
            autoFocus={true}
            type="text"
            value={name}
            onBlur={handleChangeName}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="edit-input"
          />
        </div>
      ) : (
        <div className="task-container">
          <Checkbox
            className="task-checkbox"
            checked={checked}
            onChange={handleCheckedStatusTodo}
          />
          <span
            onClick={handleToggleEdit}
            className={`task-title ${checked ? "checked" : ""}`}
          >
            {name}
          </span>
          <Popconfirm
            title="Xóa việc cần làm"
            description="Bạn có chắc chắn muốn xóa việc cần làm này không ?"
            onConfirm={() => {
              handleDeleteTodo(item.id);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip title="Xóa" placement="right">
              <div className="box_delete_todo">
                <FontAwesomeIcon icon={faMinus} />
              </div>
            </Tooltip>
          </Popconfirm>
        </div>
      )}
    </div>
  );
};

export default Todo;
