import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Select, Table, Tooltip } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import "./styleDragDropTable.css";
import { useAppDispatch, useAppSelector } from "../../../../app/hook";
import {
  GetAllList,
  moveTask,
} from "../../../../app/reducer/detail-project/DPBoardSlice.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleDown,
  faAngleDoubleUp,
  faAngleDown,
  faAngleUp,
  faBars,
  faCheck,
  faCheckSquare,
  faClock,
  faComment,
  faLineChart,
  faPlus,
  faTasks,
  faGripLines,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import Image from "../../../../helper/img/Image";
import { memo } from "react";
import { getStompClient } from "../stomp-client-config/StompClientManager";
import { GetSessionId } from "../../../../app/reducer/detail-project/StompClient.reducer";
import { userCurrent } from "../../../../helper/inForUser";
import { GetProject } from "../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetPeriodCurrent } from "../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { formatDateTime } from "../../../../helper/convertDate";
import { useCallback } from "react";
import {
  BarsOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  ProjectOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import PopupGeneral from "./popup/popupGeneral";
import PopupLabelTable from "../popup/label-table/PopupLabelTable";
import PopupMemberTable from "../popup/member-table/PopupMemberTable";
import PopupDeadlineTable from "../popup/deadline-table/PopupDeadlineTable";
import { useLocation, useNavigate } from "react-router";

const { Option } = Select;

const Row = memo(({ children, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style = useMemo(
    () => ({
      ...props.style,
      transform: CSS.Transform.toString(
        transform && {
          ...transform,
          scaleY: 1,
        }
      ),
      transition,
      height: "40px",
      ...(isDragging
        ? {
            position: "relative",
            zIndex: 9999,
          }
        : {}),
    }),
    [props.style, transform, transition, isDragging]
  );

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === "sort") {
          return React.cloneElement(child, {
            children: (
              <FontAwesomeIcon
                icon={faGripLines}
                ref={setActivatorNodeRef}
                style={{
                  touchAction: "none",
                  cursor: "grab",
                }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
});

const TableDragAndDrop = ({ data }) => {
  const [dataSource, setDataSource] = useState([]);
  const listTodoList = useAppSelector(GetAllList);
  const sessionSocket = useAppSelector(GetSessionId);
  const stompClient = getStompClient();
  const detailProject = useAppSelector(GetProject);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const dispatch = useAppDispatch();

  const formatDate = useCallback((date) => {
    const options = { month: "short", day: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);
    return formattedDate;
  }, []);

  useEffect(() => {
    if (data != null) {
      setDataSource(data);
    }
  }, [data]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleTaskClick = (id) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("idTodo", id);
    const newSearch = searchParams.toString();
    let newPath = "";
    if (!location.pathname.includes("/table")) {
      newPath = `${location.pathname.replace(/\/[^/]+$/, "")}/table/${
        detailProject.id
      }?${newSearch}`;
    } else {
      newPath = `${location.pathname}?${newSearch}`;
    }

    navigate(newPath, { replace: true });
  };

  const findNameTodoList = (id) => {
    const foundList = listTodoList.find((item) => item.id === id);
    return foundList ? foundList.name : null;
  };

  const updateIndexTodo = (event, todo) => {
    let obj = {
      idTodo: todo.id,
      idTodoListOld: todo.list.id,
      nameTodoListOld: todo.list.name,
      idTodoListNew: event,
      nameTodoListNew: findNameTodoList(event),
      indexBefore: todo.indexTodo,
      indexAfter: 0,
      periodId: periodCurrent.id,
      projectId: detailProject.id,
      idUser: userCurrent.id,
      sessionId: sessionSocket,
    };
    let idTodoListOld = obj.idTodoListOld;
    let idTodoListNew = obj.idTodoListNew;
    let indexTodoNew = 0;
    let draggableId = obj.idTodo;
    stompClient.send(
      "/action/update-index-todo-view-table/" +
        detailProject.id +
        "/" +
        periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    dispatch(
      moveTask({ idTodoListOld, idTodoListNew, indexTodoNew, draggableId })
    );
  };

  const handleUpdateCompleteTodo = (value, task) => {
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

  const columns = useMemo(
    () => [
      {
        key: "sort",
        width: "2%",
        className: "table-column",
      },
      {
        title: (
          <div>
            <ProjectOutlined style={{ fontSize: "18px" }} /> Thẻ
          </div>
        ),
        dataIndex: "name",
        key: "name",
        className: "table-column",
        render: (text, record) => (
          <div
            className="table-column"
            style={{
              fontWeight: "500",
              fontSize: "15px",
              color:
                record.priorityLevel === "0"
                  ? "red"
                  : record.priorityLevel === "1"
                  ? "orange"
                  : record.priorityLevel === "2"
                  ? "#2e7eca"
                  : record.priorityLevel === "3"
                  ? "rgb(26, 171, 9)"
                  : "",
            }}
            onClick={() => {
              handleTaskClick(record.id);
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: "18px", marginRight: "5px" }}
              icon={faTasks}
            />
            {record.name}
            {record.priorityLevel != null && (
              <FontAwesomeIcon
                style={{ fontSize: "18px", marginLeft: "6px" }}
                icon={
                  record.priorityLevel === "0"
                    ? faAngleDoubleUp
                    : record.priorityLevel === "1"
                    ? faAngleUp
                    : record.priorityLevel === "2"
                    ? faAngleDown
                    : faAngleDoubleDown
                }
              />
            )}
          </div>
        ),
      },
      {
        title: (
          <div>
            <BarsOutlined style={{ fontSize: "18px" }} /> Danh sách
          </div>
        ),
        dataIndex: "list",
        key: "list",
        className: "table-column",
        render: (text, record) => (
          <div className="table-column" style={{ fontWeight: "600" }}>
            <Select
              value={record.list.id}
              style={{
                width: "100%",
                fontWeight: "600",
              }}
              bordered={false}
              onChange={(e) => {
                updateIndexTodo(e, record);
              }}
            >
              {listTodoList.map((option, index) => (
                <Option key={index} value={option.id}>
                  {option.name}
                </Option>
              ))}
            </Select>
          </div>
        ),
        width: "18%",
      },
      {
        title: (
          <div>
            <TagsOutlined style={{ fontSize: "18px" }} /> Nhãn
          </div>
        ),
        dataIndex: "labels",
        key: "labels",
        className: "table-column",
        render: (text, record) => (
          <div
            className="table-column"
            style={{
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "4px",
            }}
            onClick={() => {
              openPopupLabelTable(record);
            }}
          >
            {record.labels != null &&
              record.labels.map((item, index) => (
                <Tooltip title={`${item.name}`} key={index}>
                  <span
                    className="item_label_view_table"
                    style={{ backgroundColor: item.colorLabel }}
                  >
                    <span className="span_dot">&#x2022;</span>
                    {item.name}
                  </span>
                </Tooltip>
              ))}
            {record.labels.length === 0 && <span>-</span>}
          </div>
        ),
        width: "15%",
      },
      {
        title: (
          <div>
            <UserOutlined style={{ fontSize: "18px" }} /> Thành viên
          </div>
        ),
        dataIndex: "member",
        key: "member",
        className: "table-column",
        render: (text, record) => (
          <div
            className="table-column"
            style={{ alignItems: "center", display: "flex" }}
            onClick={(e) => {
              openPopupMemberTable(e, record);
            }}
          >
            {record.listMemberByIdTodo != null &&
              record.listMemberByIdTodo.map((item, index) => (
                <Image
                  picxel={28}
                  marginRight={-3}
                  key={index}
                  url={item != null ? item.image : null}
                  name={item != null ? item.name + " " + item.code : null}
                />
              ))}
            {record.listMemberByIdTodo.length === 0 && <span>-</span>}
          </div>
        ),
        width: "15%",
      },
      {
        title: (
          <div>
            <ClockCircleOutlined style={{ fontSize: "18px" }} /> Ngày hạn |{" "}
            <LineChartOutlined style={{ fontSize: "18px" }} /> Tiến độ
          </div>
        ),
        dataIndex: "dueDate",
        className: "table-column",
        width: "21%",
        render: (text, record, index) => {
          return (
            <div
              className="table-column"
              key={index}
              style={{ marginBottom: "7px", flexWrap: "wrap", zIndex: 10 }}
              onClick={(e) => {
                openPopupDeadlineTable(e, record);
              }}
            >
              <div
                style={{ float: "left", marginRight: "8px", marginTop: "7px" }}
              >
                {record.deadline == null && <span>-</span>}
              </div>
              {record.deadline != null && record.completionTime == null && (
                <Tooltip
                  title={`Ngày hạn của đầu việc là ${formatDateTime(
                    record.deadline
                  )}`}
                >
                  <div
                    className="box_deadline_table"
                    style={{ marginRight: "10px", paddingTop: "1px" }}
                    onClick={() => {
                      handleUpdateCompleteTodo(0, record);
                    }}
                  >
                    <FontAwesomeIcon
                      className="icon_deadline_table"
                      icon={faClock}
                    />
                    <span className="content_deadline_table">
                      {formatDate(record.deadline)}
                    </span>
                  </div>
                </Tooltip>
              )}
              {record.deadline != null &&
                record.completionTime != null &&
                record.completionTime < record.deadline && (
                  <Tooltip
                    title={`Đã hoàn thành công việc trước hạn vào lúc ${formatDateTime(
                      record.completionTime
                    )}`}
                  >
                    <div
                      className="box_deadline_table"
                      style={{
                        backgroundColor: "#37c54a",
                        marginRight: "10px",
                        paddingTop: "1px",
                      }}
                      onClick={() => {
                        handleUpdateCompleteTodo(1, record);
                      }}
                    >
                      <FontAwesomeIcon
                        className="icon_deadline_table"
                        icon={faCheckSquare}
                      />

                      <span className="content_deadline_table">
                        {formatDate(record.deadline)}
                      </span>
                    </div>
                  </Tooltip>
                )}
              {record.deadline != null &&
                record.completionTime != null &&
                record.completionTime > record.deadline && (
                  <Tooltip
                    title={`Đã hoàn thành công việc sau hạn vào lúc ${formatDateTime(
                      record.completionTime
                    )}`}
                  >
                    <div
                      className="box_deadline_table"
                      style={{
                        backgroundColor: "rgb(243, 72, 72)",
                        marginRight: "10px",
                        paddingTop: "1px",
                      }}
                      onClick={() => {
                        handleUpdateCompleteTodo(1, record);
                      }}
                    >
                      <FontAwesomeIcon
                        className="icon_deadline_table"
                        icon={faCheckSquare}
                      />

                      <span className="content_deadline_table">
                        {formatDate(record.deadline)}
                      </span>
                    </div>
                  </Tooltip>
                )}
              {record.descriptions != null &&
                record.descriptions !== "" &&
                record.descriptions !== "<p><br/></p>" && (
                  <Tooltip title="Thẻ có mô tả">
                    <div className="box_icon_description">
                      <FontAwesomeIcon
                        className="icon_description"
                        icon={faBars}
                      />{" "}
                    </div>
                  </Tooltip>
                )}
              {record.numberAttachments > 0 &&
                record.numberAttachments != null && (
                  <Tooltip
                    title={`Thẻ có ${record.numberAttachments} link đính kèm`}
                  >
                    <div className="box_icon_attachment_table">
                      <FontAwesomeIcon
                        className="icon_attachment"
                        icon={faLink}
                      />{" "}
                      <span style={{ fontSize: "12px" }}>
                        {record.numberAttachments}
                      </span>
                    </div>
                  </Tooltip>
                )}
              {record.numberCommnets > 0 && record.numberCommnets != null && (
                <Tooltip title={`Thẻ có ${record.numberCommnets} bình luận`}>
                  <div className="box_icon_comment_table">
                    <FontAwesomeIcon
                      className="icon_comment"
                      icon={faComment}
                    />{" "}
                    <span style={{ fontSize: "12px" }}>
                      {record.numberCommnets}
                    </span>
                  </div>
                </Tooltip>
              )}

              {record.numberTodo != null &&
                record.numberTodo > 0 &&
                record.numberTodo > record.numberTodoComplete && (
                  <Tooltip
                    title={`Đã hoàn thành ${record.numberTodoComplete} công việc trên tổng số ${record.numberTodo} công việc`}
                  >
                    <div
                      className="box_progress_table"
                      style={{
                        paddingTop: "1px",
                        paddingLeft: "3px",
                      }}
                    >
                      <FontAwesomeIcon
                        className="icon_progress"
                        icon={faCheck}
                      />{" "}
                      <span className="numbertodoComplete_numbertodo">
                        {record.numberTodoComplete} / {record.numberTodo}
                      </span>
                    </div>
                  </Tooltip>
                )}
              {record.numberTodo != null &&
                record.numberTodo > 0 &&
                record.numberTodo === record.numberTodoComplete && (
                  <Tooltip title="Đã hoàn thành tất cả đầu việc">
                    <div
                      className="box_progress_table"
                      style={{
                        backgroundColor: "#37c54a",
                        color: "white",
                        paddingTop: "1px",
                        paddingLeft: "3px",
                      }}
                    >
                      <FontAwesomeIcon
                        className="icon_progress"
                        icon={faCheck}
                      />{" "}
                      <span className="numbertodoComplete_numbertodo">
                        {record.numberTodoComplete} / {record.numberTodo}
                      </span>
                    </div>
                  </Tooltip>
                )}
              {record.progress != null &&
                record.progress > 0 &&
                record.progress < 100 && (
                  <Tooltip title={`Tiến độ: ${record.progress}%`}>
                    <div
                      className="box_line_chart_table"
                      style={{
                        paddingTop: "1px",
                        paddingLeft: "3px",
                      }}
                    >
                      <FontAwesomeIcon
                        className="icon_line_chart"
                        icon={faLineChart}
                      />{" "}
                      <span className="number_line_chart">
                        {record.progress}%
                      </span>{" "}
                    </div>
                  </Tooltip>
                )}
              {record.progress != null && record.progress === 100 && (
                <Tooltip title={`Tiến độ: 100%`}>
                  <div
                    className="box_line_chart_table"
                    style={{
                      backgroundColor: "#2e7eca",
                      paddingTop: "1px",
                      paddingLeft: "3px",
                    }}
                  >
                    <FontAwesomeIcon
                      className="icon_line_chart"
                      icon={faLineChart}
                    />{" "}
                    <span className="number_line_chart">
                      {record.progress}%
                    </span>{" "}
                  </div>
                </Tooltip>
              )}
            </div>
          );
        },
      },
    ],
    [dataSource]
  );

  const onDragEnd = ({ active, over }) => {
    if (active == null || over == null) return;

    const draggedElement = dataSource.find((item) => item.id === active.id);
    const droppedList = dataSource.find((item) => item.id === over.id);
    if (draggedElement.id === droppedList.id) return;
    let indexAfter = 0;
    if (draggedElement.list.id === droppedList.list.id) {
      indexAfter = droppedList.indexTodo;
    } else {
      if (
        active.data.current.sortable.index > over.data.current.sortable.index
      ) {
        indexAfter = droppedList.indexTodo;
      } else {
        indexAfter = droppedList.indexTodo + 1;
      }
    }
    let obj = {
      idTodo: draggedElement.id,
      idTodoListOld: draggedElement.list.id,
      nameTodoListOld: draggedElement.list.name,
      idTodoListNew: droppedList.list.id,
      nameTodoListNew: droppedList.list.name,
      indexBefore: draggedElement.indexTodo,
      indexAfter: indexAfter,
      periodId: periodCurrent.id,
      projectId: detailProject.id,
      idUser: userCurrent.id,
      sessionId: sessionSocket,
    };

    let idTodoListOld = obj.idTodoListOld;
    let idTodoListNew = obj.idTodoListNew;
    let indexTodoNew = obj.indexAfter;
    let draggableId = obj.idTodo;
    stompClient.send(
      "/action/update-index-todo/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
    dispatch(
      moveTask({ idTodoListOld, idTodoListNew, indexTodoNew, draggableId })
    );
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.id === active.id);
        const overIndex = prev.findIndex((i) => i.id === over?.id);

        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const [todoSelected, setTodoSelected] = useState(null);

  useEffect(() => {
    if (todoSelected != null && dataSource.length > 0) {
      const foundTodo = dataSource.find((item) => item.id === todoSelected.id);
      if (foundTodo) {
        setTodoSelected(foundTodo);
      } else {
        setTodoSelected(null);
      }
    }
  }, [dataSource, todoSelected]);

  const [isOpenPopupGeneral, setIsOpenPopupGeneral] = useState(false);

  const openPopupGeneral = (event) => {
    setIsOpenPopupGeneral(true);
  };

  const closePopupGeneral = () => {
    setIsOpenPopupGeneral(false);
  };

  const [isOpenPopupLabelTable, setIsOpenPopupLabelTable] = useState(false);

  const openPopupLabelTable = (todo) => {
    setTodoSelected(todo);
    setIsOpenPopupLabelTable(true);
  };

  const closePopupLabelTable = () => {
    setTodoSelected(null);
    setIsOpenPopupLabelTable(false);
  };

  const [isOpenPopupMemberTable, setIsOpenPopupMemberTable] = useState(false);
  const [popupPositionPopupMemberTable, setPopupPositionPopupMemberTable] =
    useState({
      top: 0,
      left: 0,
    });

  const openPopupMemberTable = (event, todo) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setPopupPositionPopupMemberTable({
      top: buttonPosition.bottom + 25,
      left: buttonPosition.left + 30,
    });
    setTodoSelected(todo);
    setIsOpenPopupMemberTable(true);
  };

  const closePopupMemberTable = () => {
    setTodoSelected(null);
    setIsOpenPopupMemberTable(false);
  };

  const [isOpenPopupDeadlineTable, setIsOpenPopupDeadlineTable] =
    useState(false);
  const [popupPositionPopupDeadlineTable, setPopupPositionPopupDeadlineTable] =
    useState({
      top: 0,
      left: 0,
    });

  const openPopupDeadlineTable = (event, todo) => {
    const targetClassName = event.target.className || "";
    if (
      event.target.className !== "content_deadline_table" &&
      !targetClassName.toString().includes("box_deadline_table") &&
      event.target.tagName !== "path" &&
      event.target.tagName !== "svg"
    ) {
      const buttonPosition = event.target.getBoundingClientRect();
      setPopupPositionPopupDeadlineTable({
        top: buttonPosition.bottom + 25,
        left: buttonPosition.left,
      });
      setTodoSelected(todo);
      setIsOpenPopupDeadlineTable(true);
    }
  };

  const closePopupDeadlineTable = () => {
    setTodoSelected(null);
    setIsOpenPopupDeadlineTable(false);
  };

  return (
    <div>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        {useMemo(
          () => (
            <SortableContext
              items={dataSource.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <Table
                components={{
                  body: {
                    row: Row,
                  },
                }}
                rowKey="id"
                scroll={{ y: "calc(100vh - 170px)" }}
                columns={columns}
                pagination={false}
                dataSource={dataSource}
                className="table_view_drag_drop"
                rowClassName={() => "table-row"}
              />
              <Button className="btn_add_table" onClick={openPopupGeneral}>
                <FontAwesomeIcon icon={faPlus} /> Thêm
              </Button>
            </SortableContext>
          ),
          [dataSource]
        )}
      </DndContext>
      {isOpenPopupGeneral && <PopupGeneral onClose={closePopupGeneral} />}
      {isOpenPopupLabelTable && (
        <PopupLabelTable
          todo={todoSelected}
          onClose={closePopupLabelTable}
          isSelected={isOpenPopupLabelTable}
        />
      )}
      {isOpenPopupMemberTable && (
        <PopupMemberTable
          todo={todoSelected}
          onClose={closePopupMemberTable}
          position={popupPositionPopupMemberTable}
        />
      )}
      {isOpenPopupDeadlineTable && (
        <PopupDeadlineTable
          todo={todoSelected}
          onClose={closePopupDeadlineTable}
          position={popupPositionPopupDeadlineTable}
        />
      )}
    </div>
  );
};

export default memo(TableDragAndDrop);
