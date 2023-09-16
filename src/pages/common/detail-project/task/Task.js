import React, { memo, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import "./task.css";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hook";
import { GetProject } from "../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleUp,
  faAngleDoubleDown,
  faBars,
  faAngleUp,
  faCheck,
  faLineChart,
  faClock,
  faLink,
  faComment,
  faCheckSquare,
  faAngleDown,
  faCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Image from "../../../../helper/img/Image";
import { Tooltip } from "antd";
import { formatDateTime } from "../../../../helper/convertDate";
import { getStompClient } from "../stomp-client-config/StompClientManager";
import { userCurrent } from "../../../../helper/inForUser";

const Task = ({ task, index, onClick }) => {
  const dispatch = useAppDispatch();
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const [isHovered, setIsHovered] = useState(false);
  const stompClient = getStompClient();

  const formatDate = (date) => {
    const options = { month: "short", day: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    return formattedDate;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleUpdateCompleteTodo = (value) => {
    let obj = {
      id: task.id,
      status: Number(value),
      idTodo: task.id,
      idTodoList: task.todoListId,
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
  console.log("task render");
  return (
    <Draggable draggableId={task.id} index={index} key={index}>
      {(provided) => (
        <div
          className="task"
          onClick={onClick}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.nameFile != null && (
            <div style={{ width: "100%" }}>
              <img
                src={task.nameFile}
                alt="Hình ảnh"
                width="100%"
                style={{ borderRadius: "15px" }}
              />
            </div>
          )}

          <div className="list_label">
            {task.labels != null &&
              task.labels.length > 0 &&
              task.labels.map((lb, index) => (
                <Tooltip
                  title={`${lb != null ? lb.name : null}`}
                  key={lb != null ? lb.id : null}
                >
                  <span
                    className="item_label_todo"
                    key={lb != null ? lb.id : null}
                    style={{
                      backgroundColor: lb != null ? lb.colorLabel : null,
                    }}
                  >
                    <span className="span_dot">&#x2022;</span>{" "}
                    {lb != null ? lb.name : null}
                  </span>
                </Tooltip>
              ))}
          </div>
          <div>
            <span className="link_todo">
              {task.name}
              <Link
                to={`/detail-project/${detailProject.id}?idPeriod=${periodCurrent.id}&idTodo=${task.id}`}
                className="link_todo"
              ></Link>
            </span>
          </div>
          <div className="box_info_todo">
            <div className="left_box_info_todo">
              <div className="box_icon_priority">
                {task.priorityLevel === "0" && (
                  <Tooltip title="Độ ưu tiên: Quan trọng">
                    <FontAwesomeIcon
                      className="icon_priority"
                      style={{ color: "red" }}
                      icon={faAngleDoubleUp}
                      data-tip="Tooltip Content"
                      data-for="priority-tooltip"
                    />
                  </Tooltip>
                )}
                {task.priorityLevel === "1" && (
                  <Tooltip title="Độ ưu tiên: Cao">
                    <FontAwesomeIcon
                      className="icon_priority"
                      style={{ color: "orange" }}
                      icon={faAngleUp}
                    />
                  </Tooltip>
                )}
                {task.priorityLevel === "2" && (
                  <Tooltip title="Độ ưu tiên: Trung bình">
                    <FontAwesomeIcon
                      className="icon_priority"
                      style={{ color: "#2e7eca" }}
                      icon={faAngleDown}
                    />
                  </Tooltip>
                )}
                {task.priorityLevel === "3" && (
                  <Tooltip title="Độ ưu tiên: Thấp">
                    <FontAwesomeIcon
                      className="icon_priority"
                      style={{ color: "green" }}
                      icon={faAngleDoubleDown}
                    />
                  </Tooltip>
                )}
              </div>
              {task.descriptions != null &&
                task.descriptions !== "" &&
                task.descriptions !== "<p><br/></p>" && (
                  <Tooltip title="Thẻ có mô tả">
                    <div className="box_icon_description">
                      <FontAwesomeIcon
                        className="icon_description"
                        icon={faBars}
                      />{" "}
                    </div>
                  </Tooltip>
                )}
              {task.numberAttachments > 0 && task.numberAttachments != null && (
                <Tooltip
                  title={`Thẻ có ${task.numberAttachments} link đính kèm`}
                >
                  <div className="box_icon_attachment">
                    <FontAwesomeIcon
                      className="icon_attachment"
                      icon={faLink}
                    />{" "}
                    <span style={{ fontSize: "11px" }}>
                      {task.numberAttachments}
                    </span>
                  </div>
                </Tooltip>
              )}
              {task.numberCommnets > 0 && task.numberCommnets != null && (
                <Tooltip title={`Thẻ có ${task.numberCommnets} bình luận`}>
                  <div className="box_icon_comment">
                    <FontAwesomeIcon
                      className="icon_comment"
                      icon={faComment}
                    />{" "}
                    <span style={{ fontSize: "11px" }}>
                      {task.numberCommnets}
                    </span>
                  </div>
                </Tooltip>
              )}

              {task.numberTodo != null &&
                task.numberTodo > 0 &&
                task.numberTodo > task.numberTodoComplete && (
                  <Tooltip
                    title={`Đã hoàn thành ${task.numberTodoComplete} công việc trên tổng số ${task.numberTodo} công việc`}
                  >
                    <div className="box_progress">
                      <FontAwesomeIcon
                        className="icon_progress"
                        icon={faCheck}
                      />{" "}
                      <span className="numbertodoComplete_numbertodo">
                        {task.numberTodoComplete} / {task.numberTodo}
                      </span>
                    </div>
                  </Tooltip>
                )}
              {task.numberTodo != null &&
                task.numberTodo > 0 &&
                task.numberTodo === task.numberTodoComplete && (
                  <Tooltip title="Đã hoàn thành tất cả đầu việc">
                    <div
                      className="box_progress"
                      style={{ backgroundColor: "#37c54a", color: "white" }}
                    >
                      <FontAwesomeIcon
                        className="icon_progress"
                        icon={faCheck}
                      />{" "}
                      <span className="numbertodoComplete_numbertodo">
                        {task.numberTodoComplete} / {task.numberTodo}
                      </span>
                    </div>
                  </Tooltip>
                )}
              {task.progress != null &&
                task.progress > 0 &&
                task.progress < 100 && (
                  <Tooltip title={`Tiến độ: ${task.progress}%`}>
                    <div className="box_line_chart">
                      <FontAwesomeIcon
                        className="icon_line_chart"
                        icon={faLineChart}
                      />{" "}
                      <span className="number_line_chart">
                        {task.progress}%
                      </span>{" "}
                    </div>
                  </Tooltip>
                )}
              {task.progress != null && task.progress === 100 && (
                <Tooltip title={`Tiến độ: 100%`}>
                  <div
                    className="box_line_chart"
                    style={{ backgroundColor: "#2e7eca" }}
                  >
                    <FontAwesomeIcon
                      className="icon_line_chart"
                      icon={faLineChart}
                    />{" "}
                    <span className="number_line_chart">{task.progress}%</span>{" "}
                  </div>
                </Tooltip>
              )}
              {task.deadline != null && task.completionTime == null && (
                <Tooltip
                  title={`Ngày hạn của đầu việc là ${formatDateTime(
                    task.deadline
                  )}`}
                >
                  <div
                    onClick={() => {
                      handleUpdateCompleteTodo(0);
                    }}
                    className="box_deadline"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {isHovered ? (
                      <FontAwesomeIcon
                        className="icon_deadline"
                        icon={faCircle}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="icon_deadline"
                        icon={faClock}
                      />
                    )}{" "}
                    <span className="content_deadline">
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                </Tooltip>
              )}
              {task.deadline != null &&
                task.completionTime != null &&
                task.completionTime < task.deadline && (
                  <Tooltip
                    title={`Đã hoàn thành công việc trước hạn vào lúc ${formatDateTime(
                      task.completionTime
                    )}`}
                  >
                    <div
                      className="box_deadline"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => {
                        handleUpdateCompleteTodo(1);
                      }}
                      style={{ backgroundColor: "#37c54a" }}
                    >
                      {isHovered ? (
                        <FontAwesomeIcon
                          className="icon_deadline"
                          icon={faCheckCircle}
                        />
                      ) : (
                        <FontAwesomeIcon
                          className="icon_deadline"
                          icon={faCheckSquare}
                        />
                      )}{" "}
                      <span className="content_deadline">
                        {formatDate(task.deadline)}
                      </span>
                    </div>
                  </Tooltip>
                )}
              {task.deadline != null &&
                task.completionTime != null &&
                task.completionTime > task.deadline && (
                  <Tooltip
                    title={`Đã hoàn thành công việc sau hạn vào lúc ${formatDateTime(
                      task.completionTime
                    )}`}
                  >
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => {
                        handleUpdateCompleteTodo(1);
                      }}
                      className="box_deadline"
                      style={{ backgroundColor: "rgb(243, 72, 72)" }}
                    >
                      {isHovered ? (
                        <FontAwesomeIcon
                          className="icon_deadline"
                          icon={faCheckCircle}
                        />
                      ) : (
                        <FontAwesomeIcon
                          className="icon_deadline"
                          icon={faCheckSquare}
                        />
                      )}{" "}
                      <span className="content_deadline">
                        {formatDate(task.deadline)}
                      </span>
                    </div>
                  </Tooltip>
                )}
            </div>
            <div className="right_box_info_todo">
              {task.listMemberByIdTodo != null &&
                task.listMemberByIdTodo.length > 0 &&
                task.listMemberByIdTodo.map((item, index) => (
                  <Image
                    marginRight={-3}
                    picxel={25}
                    key={index}
                    url={item == null ? "" : item.image}
                    name={item == null ? "" : item.name + " " + item.code}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
