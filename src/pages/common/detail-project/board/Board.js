import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import List from "../list/List";
import {
  reorderList,
  moveTask,
  SetBoard,
  SetLoading,
  GetAllList,
  SetTable,
  GetFilter,
} from "../../../../app/reducer/detail-project/DPBoardSlice.reducer";
import "./board.css";
import { Input } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../app/hook";
import { DetailProjectAPI } from "../../../../api/detail-project/detailProject.api";
import {
  GetMemberPeriod,
  GetPeriodCurrent,
} from "../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetProject } from "../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import LoadingIndicator from "../../../../helper/loading";
import { GetMemberProject } from "../../../../app/reducer/detail-project/DPMemberProject.reducer";
import { userCurrent } from "../../../../helper/inForUser";
import { GetSessionId } from "../../../../app/reducer/detail-project/StompClient.reducer";
import { getStompClient } from "../stomp-client-config/StompClientManager";
import BoardStompClient from "./BoardStompClient";
import { toast } from "react-toastify";

const Board = () => {
  const dispatch = useAppDispatch();
  BoardStompClient(dispatch, useAppSelector);
  const board = useAppSelector((state) => state.board);
  const [newListTitle, setNewListTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const [isLoading, setIsLoading] = useState(false);
  const detailProject = useAppSelector(GetProject);
  const listMemberProject = useAppSelector(GetMemberProject);
  const sessionSocket = useAppSelector(GetSessionId);
  const listPeriodProject = useAppSelector(GetMemberPeriod);
  const stompClient = getStompClient();
  const list = useAppSelector(GetAllList);
  const filterTodo = useAppSelector(GetFilter);
  const findNameTodoList = (id) => {
    const foundList = list.find((item) => item.id === id);
    return foundList ? foundList.name : null;
  };

  useEffect(() => {
    if (periodCurrent != null && Object.keys(periodCurrent).length > 0) {
      setIsLoading(true);
    }
  }, [periodCurrent]);

  useEffect(() => {
    dispatch(SetLoading(true));
    if (
      listMemberProject != null &&
      listMemberProject !== undefined &&
      listMemberProject.length > 0 &&
      listPeriodProject.length > 0 &&
      periodCurrent != null &&
      Object.keys(periodCurrent).length > 0
    ) {
      fetchDataBoard(periodCurrent.id);
    }
  }, [listMemberProject, listPeriodProject, periodCurrent, filterTodo]);

  const fetchDataBoard = async (idPeriod) => {
    try {
      let filter = {
        idPeriod: idPeriod,
        projectId: detailProject.id,
        name: filterTodo.name,
        member: filterTodo.member,
        label: filterTodo.label,
        dueDate: filterTodo.dueDate,
      };
      const response = await DetailProjectAPI.fetchAllBoard(filter);
      let obj = response.data.data;

      obj.forEach((list) => {
        list.tasks.forEach((task) => {
          if (task.listMemberByIdTodo && task.listMemberByIdTodo.length > 0) {
            const filteredMembers = task.listMemberByIdTodo.map((itemId) =>
              listMemberProject.find((member) => member.id === itemId)
            );
            task.listMemberByIdTodo = filteredMembers;
          }
        });
      });
      dispatch(SetBoard(obj));
    } catch (error) {
    } finally {
      setIsLoading(false);
      dispatch(SetLoading(false));
    }
  };

  const loadDataViewTable = (obj) => {
    const newListTaskViewTable = obj.flatMap((list) =>
      list.tasks.map((task) => ({
        ...task,
        list: {
          id: list.id,
          name: list.name,
          code: list.code,
          indexTodoList: list.indexTodoList,
        },
      }))
    );
    newListTaskViewTable.sort((a, b) => {
      if (a.list.indexTodoList !== b.list.indexTodoList) {
        return a.list.indexTodoList - b.list.indexTodoList;
      } else {
        return a.indexTodo - b.indexTodo;
      }
    });
    dispatch(SetTable(newListTaskViewTable));
  };

  useEffect(() => {
    if (board.lists != null && board.lists.length > 0) {
      loadDataViewTable(board.lists);
    }
  }, [board.lists]);

  const onDragEnd = (result) => {
    console.log(result);
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (result.type === "COLUMN") {
      let obj = {
        idTodoList: result.draggableId,
        idProject: detailProject.id,
        indexBefore: result.source.index,
        indexAfter: result.destination.index,
        sessionId: sessionSocket,
      };
      if (stompClient) {
        dispatch(
          reorderList({
            startIndex: source.index,
            endIndex: destination.index,
            listId: result.draggableId,
          })
        );
        stompClient.send(
          "/action/update-index-todo-list/" + detailProject.id,
          {},
          JSON.stringify(obj)
        );
      }
    } else if (result.type === "TASK") {
      let obj = {
        idTodo: result.draggableId,
        idTodoListOld: result.source.droppableId,
        nameTodoListOld: findNameTodoList(result.source.droppableId),
        idTodoListNew: result.destination.droppableId,
        nameTodoListNew: findNameTodoList(result.destination.droppableId),
        indexBefore: result.source.index,
        indexAfter: result.destination.index,
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
        "/action/update-index-todo/" +
          detailProject.id +
          "/" +
          periodCurrent.id,
        {},
        JSON.stringify(obj)
      );
      dispatch(
        moveTask({ idTodoListOld, idTodoListNew, indexTodoNew, draggableId })
      );
    }
  };

  const handleAddList = () => {
    if (newListTitle === "") {
      toast.error("Tên danh sách không được để trống");
      return;
    }
    let obj = {
      name: newListTitle,
      idProject: detailProject.id,
    };
    stompClient.send(
      "/action/create-todo-list/" + detailProject.id,
      {},
      JSON.stringify(obj)
    );
    setIsAddingList(false);
    setNewListTitle("");
  };

  const memoizedLists = useMemo(
    () =>
      board.lists.map((list, index) => (
        <List key={list.id} list={list} index={index} />
      )),
    [board.lists]
  );
  console.log("board render");
  return (
    <div>
      {isLoading && <LoadingIndicator />}
      <DragDropContext onDragEnd={onDragEnd} className="board-style">
        <Droppable droppableId="board" direction="horizontal" type="COLUMN">
          {(provided) => (
            <div
              className="board"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {memoizedLists}
              {provided.placeholder}

              {!isAddingList ? (
                <button
                  className="add-list-button"
                  onClick={() => setIsAddingList(true)}
                >
                  + Thêm danh sách
                </button>
              ) : (
                <div className="add-list-form">
                  <Input
                    type="text"
                    placeholder="Nhập tiêu đề của danh sách"
                    className="input-add-list-form"
                    value={newListTitle}
                    autoFocus={true}
                    onChange={(e) => setNewListTitle(e.target.value)}
                  />
                  <button
                    className="btn-add-list-form"
                    disabled={!newListTitle}
                    onClick={handleAddList}
                  >
                    Thêm danh sách
                  </button>
                  <button
                    className="btn-cancel-list-form"
                    onClick={() => setIsAddingList(false)}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Board;
