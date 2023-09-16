import { useEffect } from "react";
import {
  AddList,
  AddTask,
  ChangeCoverImage,
  CreateImageCover,
  CreateLabelBoard,
  DeleteCoverImage,
  DeleteDeadline,
  DeleteLabelBoard,
  DeleteLabelTask,
  DeleteMemberBoard,
  DeleteTodo,
  DeleteTodoList,
  GetFilter,
  SetBoard,
  SetLoading,
  UpdateCompletion,
  UpdateCountAttachmentCreate,
  UpdateCountAttachmentDelete,
  UpdateCountCommentCreate,
  UpdateCountCommentDelete,
  UpdateDeadline,
  UpdateDescriptions,
  UpdateLabelTask,
  UpdateNameTask,
  UpdateNameTodoList,
  UpdatePriorityLevel,
  UpdateProgress,
  UpdateTodoInCheckListAndProgress,
  moveTask,
  reorderList,
} from "../../../../app/reducer/detail-project/DPBoardSlice.reducer";
import { GetPeriodCurrent } from "../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import {
  GetProject,
  SetError,
  UpdateBackground,
} from "../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { SetSessionId } from "../../../../app/reducer/detail-project/StompClient.reducer";
import { getStompClient } from "../stomp-client-config/StompClientManager";
import {
  ChangeCoverImageDetailTodo,
  CreateAttachmentDetailTodo,
  CreateCommentDetailTodo,
  CreateImageDetailTodo,
  CreateLabel,
  CreateMember,
  CreateTodoInCheckList,
  DeleteAttachmentDetailTodo,
  DeleteCommentDetailTodo,
  DeleteDeadlineDetailTodo,
  DeleteImageDetailTodo,
  DeleteLabel,
  DeleteLabelTodoDetailTodo,
  DeleteMember,
  DeleteTodoInCheckList,
  GetDetailTodo,
  UpdateAttachmentDetailTodo,
  UpdateCommentDetailTodo,
  UpdateCompletionDetailTodo,
  UpdateDeadlineDetailTodo,
  UpdateDescriptionsDetailTodo,
  UpdateLabelTodoDetailTodo,
  UpdateNameDetailTodo,
  UpdateNameImageDetailTodo,
  UpdatePriorityLevelDetailTodo,
  UpdateProgressDetailTodo,
  UpdateStatusTodoInCheckList,
  UpdateTodoInCheckList,
  UpdateTodoListDetailTodo,
  UpdateTypeDetailTodo,
} from "../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { CreateMemberBoard } from "../../../../app/reducer/detail-project/DPBoardSlice.reducer";
import {
  GetMemberProject,
  SetMemberProject,
  UpdateMemberProject,
} from "../../../../app/reducer/detail-project/DPMemberProject.reducer";
import { useRef } from "react";
import {
  CreateLabelProject,
  DeleteLabelProject,
  GetLabelProject,
  UpdateLabelProject,
} from "../../../../app/reducer/detail-project/DPLabelProject.reducer";
import { DetailProjectAPI } from "../../../../api/detail-project/detailProject.api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseInt } from "lodash";
import { CommonAPI } from "../../../../api/commonAPI";
import { MemberProjectAPI } from "../../../../api/my-project/memberProject.api";
import { userCurrent } from "../../../../helper/inForUser";
import notiCusTom from "../../../../helper/background";
import {
  SetCountNotifications,
  SetCurrentPage,
  SetListNotification,
  SetToTalPages,
} from "../../../../app/reducer/notification/NotificationSlice.reducer";

const BoardStompClient = (dispatch, useAppSelector) => {
  const stompClient = getStompClient();
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailTodo = useAppSelector(GetDetailTodo);
  const detailProject = useAppSelector(GetProject);
  const listMemberProject = useAppSelector(GetMemberProject);
  const listLabelProject = useAppSelector(GetLabelProject);
  const filterTodo = useAppSelector(GetFilter);
  const listMemberProjectRef = useRef();
  const filterTodoRef = useRef();
  const detailTodoRef = useRef();
  const periodCurrentRef = useRef();
  const listLabelProjectRef = useRef();

  useEffect(() => {
    listMemberProjectRef.current = listMemberProject;
  }, [listMemberProject]);

  useEffect(() => {
    listLabelProjectRef.current = listLabelProject;
  }, [listLabelProject]);

  useEffect(() => {
    filterTodoRef.current = filterTodo;
  }, [filterTodo]);

  useEffect(() => {
    periodCurrentRef.current = periodCurrent;
  }, [periodCurrent]);

  useEffect(() => {
    detailTodoRef.current = detailTodo;
  }, [detailTodo]);

  useEffect(() => {
    if (
      stompClient != null &&
      detailProject != null &&
      periodCurrent != null &&
      Object.keys(detailProject).length > 0 &&
      Object.keys(periodCurrent).length > 0
    ) {
      stompClient.connect({}, () => {
        let sessionId = loadDataPeriodNotExists(stompClient);
        stompClient.subscribe(
          "/portal-projects/update-index-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let res = JSON.parse(message.body).data.sessionId;
            if (res !== sessionId) {
              let idTodoListOld = JSON.parse(message.body).data.idTodoListOld;
              let data = JSON.parse(message.body).data.data;
              let idTodoListNew = data.todoListId;
              let indexTodoNew = JSON.parse(message.body).data.indexAfter;
              let draggableId = data.id;
              dispatch(
                moveTask({
                  idTodoListOld,
                  idTodoListNew,
                  indexTodoNew,
                  draggableId,
                })
              );

              if (
                detailTodoRef.current != null &&
                detailTodoRef.current.id === data.id
              ) {
                dispatch(UpdateTodoListDetailTodo(idTodoListNew));
              }
            }
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-index-todo-view-table/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let res = JSON.parse(message.body).data.sessionId;
            if (res !== sessionId) {
              let idTodoListOld = JSON.parse(message.body).data.idTodoListOld;
              let data = JSON.parse(message.body).data.data;
              let idTodoListNew = data.todoListId;
              let indexTodoNew = JSON.parse(message.body).data.indexAfter;
              let draggableId = data.id;
              dispatch(
                moveTask({
                  idTodoListOld,
                  idTodoListNew,
                  indexTodoNew,
                  draggableId,
                })
              );

              if (
                detailTodoRef.current != null &&
                detailTodoRef.current.id === data.id
              ) {
                dispatch(UpdateTodoListDetailTodo(idTodoListNew));
              }
            }
          }
        );

        stompClient.subscribe(
          "/portal-projects/create-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let obj = JSON.parse(message.body).data;
            dispatch(AddTask(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/assign/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let obj = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            if (typeof obj === "string") {
              if (
                detailTodoRef.current != null &&
                detailTodoRef.current.id === idTodo
              ) {
                dispatch(DeleteMember(obj));
              }
              let data = {
                idTodo: idTodo,
                idTodoList: idTodoList,
                memberId: obj,
              };
              dispatch(DeleteMemberBoard(data));
            } else {
              if (
                detailTodoRef.current != null &&
                detailTodoRef.current.id === idTodo
              ) {
                dispatch(CreateMember(obj.memberId));
              }

              let data = {
                idTodo: idTodo,
                idTodoList: idTodoList,
                member: listMemberProjectRef.current.find(
                  (item) => item.id === obj.memberId
                ),
              };
              dispatch(CreateMemberBoard(data));
            }
          }
        );

        stompClient.subscribe(
          "/portal-projects/label-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let obj = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;

            if (typeof obj === "string") {
              if (
                detailTodoRef.current != null &&
                detailTodoRef.current.id === idTodo
              ) {
                dispatch(DeleteLabel(obj));
              }
              let data = {
                idTodo: idTodo,
                idTodoList: idTodoList,
                labelId: obj,
              };
              dispatch(DeleteLabelBoard(data));
            } else {
              if (
                detailTodoRef.current != null &&
                detailTodoRef.current.id === idTodo
              ) {
                let data = listLabelProjectRef.current.find(
                  (item) => item.id === obj.labelProjectId
                );
                dispatch(CreateLabel(data));
              }
              let data = {
                idTodo: idTodo,
                idTodoList: idTodoList,
                label: listLabelProjectRef.current.find(
                  (item) => item.id === obj.labelProjectId
                ),
              };
              console.log(data);
              dispatch(CreateLabelBoard(data));
            }
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-descriptions-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            let obj = {
              idTodo: idTodo,
              idTodoList: idTodoList,
              todo: data,
            };

            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdateDescriptionsDetailTodo(data.descriptions));
            }

            dispatch(UpdateDescriptions(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/todo/" + detailProject.id + "/" + periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            data.priorityLevel =
              data.priorityLevel === "QUAN_TRONG"
                ? 0
                : data.priorityLevel === "CAO"
                ? 1
                : data.priorityLevel === "TRUNG_BINH"
                ? 2
                : 3;
            let obj = {
              idTodo: idTodo,
              idTodoList: idTodoList,
              todo: data,
            };
            console.log(data);
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdatePriorityLevelDetailTodo(data.priorityLevel));
            }

            dispatch(UpdatePriorityLevel(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-type-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdateTypeDetailTodo(data.type === "TAI_LIEU" ? 0 : 1));
            }
          }
        );

        stompClient.subscribe(
          "/portal-projects/create-todo-checklist/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            let numberTodo = JSON.parse(message.body).data.numberTodo;
            let numberTodoComplete = JSON.parse(message.body).data
              .numberTodoComplete;
            let progress = parseInt((numberTodoComplete / numberTodo) * 100);
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              let todoInCheckList = {
                todo: {
                  id: data.id,
                  code: data.code,
                  name: data.name,
                  statusTodo: 0,
                },
                progress: progress,
              };
              dispatch(CreateTodoInCheckList(todoInCheckList));
            }
            let dataTask = {
              idTodo: idTodo,
              idTodoList: idTodoList,
              numberTodo: numberTodo,
              numberTodoComplete: numberTodoComplete,
              progress: progress,
            };
            dispatch(UpdateTodoInCheckListAndProgress(dataTask));
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-todo-checklist/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data;
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === data.todoId
            ) {
              dispatch(UpdateTodoInCheckList(data));
            }
          }
        );

        stompClient.subscribe(
          "/portal-projects/delete-todo-checklist/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            let numberTodo = JSON.parse(message.body).data.numberTodo;
            let numberTodoComplete = JSON.parse(message.body).data
              .numberTodoComplete;
            let progress = parseInt((numberTodoComplete / numberTodo) * 100);
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              let obj = {
                id: data,
                progress: progress,
              };
              dispatch(DeleteTodoInCheckList(obj));
            }
            let dataTask = {
              idTodo: idTodo,
              idTodoList: idTodoList,
              numberTodo: numberTodo,
              numberTodoComplete: numberTodoComplete,
              progress: progress,
            };
            dispatch(UpdateTodoInCheckListAndProgress(dataTask));
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-statustodo-todo-checklist/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            let numberTodo = JSON.parse(message.body).data.numberTodo;
            let numberTodoComplete = JSON.parse(message.body).data
              .numberTodoComplete;
            let progress = parseInt((numberTodoComplete / numberTodo) * 100);
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              let obj = {
                id: data.id,
                status: data.statusTodo,
                progress: progress,
              };
              dispatch(UpdateStatusTodoInCheckList(obj));
            }
            let dataTask = {
              idTodo: idTodo,
              idTodoList: idTodoList,
              numberTodo: numberTodo,
              numberTodoComplete: numberTodoComplete,
              progress: progress,
            };
            dispatch(UpdateTodoInCheckListAndProgress(dataTask));
          }
        );

        stompClient.subscribe(
          "/portal-projects/create-comment/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let obj = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              let objComment = {
                comment: obj,
              };
              dispatch(CreateCommentDetailTodo(objComment));
            }
            dispatch(
              UpdateCountCommentCreate({
                idTodo: idTodo,
                idTodoList: idTodoList,
              })
            );
          }
        );

        stompClient.subscribe(
          "/portal-projects/delete-comment/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let idComment = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(DeleteCommentDetailTodo(idComment));
            }
            dispatch(
              UpdateCountCommentDelete({
                idTodo: idTodo,
                idTodoList: idTodoList,
              })
            );
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-comment/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdateCommentDetailTodo(data));
            }
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-deadline-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;

            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdateDeadlineDetailTodo(data));
            }
            let obj = {
              data: data,
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            dispatch(UpdateDeadline(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/delete-deadline-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;

            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(DeleteDeadlineDetailTodo(data));
            }
            let obj = {
              data: data,
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            dispatch(DeleteDeadline(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-name-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;

            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdateNameDetailTodo(data));
            }
            let obj = {
              data: data,
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            dispatch(UpdateNameTask(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/delete-name-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;

            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdateNameDetailTodo(data));
            }
            let obj = {
              data: data,
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            dispatch(UpdateNameTask(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-complete-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;

            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdateCompletionDetailTodo(data));
            }
            let obj = {
              data: data,
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            dispatch(UpdateCompletion(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/create-resource/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;

            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(CreateAttachmentDetailTodo(data));
            }
            let obj = {
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            dispatch(UpdateCountAttachmentCreate(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/delete-resource/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;

            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(DeleteAttachmentDetailTodo(data));
            }
            let obj = {
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            dispatch(UpdateCountAttachmentDelete(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-resource/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;

            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdateAttachmentDetailTodo(data));
            }
          }
        );

        stompClient.subscribe(
          "/portal-projects/delete-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            let obj = {
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            dispatch(DeleteTodo(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-progress-todo/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(UpdateProgressDetailTodo(data));
            }
            let obj = {
              data: data,
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            dispatch(UpdateProgress(obj));
          }
        );

        stompClient.subscribe(
          "/portal-projects/sort-todo-priority/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let idPeriod = JSON.parse(message.body).data;
            fetchDataBoard(idPeriod);
          }
        );

        stompClient.subscribe(
          "/portal-projects/sort-todo-deadline/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let idPeriod = JSON.parse(message.body).data;
            fetchDataBoard(idPeriod);
          }
        );

        stompClient.subscribe(
          "/portal-projects/sort-todo-created-date/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let idPeriod = JSON.parse(message.body).data;
            fetchDataBoard(idPeriod);
          }
        );

        stompClient.subscribe(
          "/portal-projects/sort-todo-name/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let idPeriod = JSON.parse(message.body).data;
            fetchDataBoard(idPeriod);
          }
        );

        stompClient.subscribe(
          "/portal-projects/sort-todo-progress/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let idPeriod = JSON.parse(message.body).data;
            fetchDataBoard(idPeriod);
          }
        );

        stompClient.subscribe(
          "/portal-projects/create-image/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data.data;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            let objDetailTodo = {
              image: data,
              idTodo: idTodo,
              idTodoList: idTodoList,
            };
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              dispatch(CreateImageDetailTodo(objDetailTodo));
            }
            dispatch(CreateImageCover(objDetailTodo));
          }
        );

        stompClient.subscribe(
          "/portal-projects/update-name-image/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let data = JSON.parse(message.body).data;
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === data.todoId
            ) {
              dispatch(UpdateNameImageDetailTodo(data));
            }
          }
        );

        stompClient.subscribe(
          "/portal-projects/change-cover-image/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let todo = JSON.parse(message.body).data.data;
            let image = JSON.parse(message.body).data.dataImage;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              let obj = {
                image: image,
              };
              dispatch(ChangeCoverImageDetailTodo(obj));
            }
            let objBoard = {
              idTodo: idTodo,
              idTodoList: idTodoList,
              todo: todo,
            };
            dispatch(ChangeCoverImage(objBoard));
          }
        );

        stompClient.subscribe(
          "/portal-projects/delete-image/" +
            detailProject.id +
            "/" +
            periodCurrent.id,
          (message) => {
            let todo = JSON.parse(message.body).data.data;
            let idImage = JSON.parse(message.body).data.dataImage;
            let idTodo = JSON.parse(message.body).data.idTodo;
            let idTodoList = JSON.parse(message.body).data.idTodoList;
            if (
              detailTodoRef.current != null &&
              detailTodoRef.current.id === idTodo
            ) {
              let obj = {
                idImage: idImage,
                todo: todo,
              };
              dispatch(DeleteImageDetailTodo(obj));
            }
            let objBoard = {
              idTodo: idTodo,
              idTodoList: idTodoList,
              todo: todo,
            };
            dispatch(DeleteCoverImage(objBoard));
          }
        );
      });
    }
  }, [stompClient, periodCurrent, detailProject]);

  useEffect(() => {
    if (
      stompClient != null &&
      detailProject != null &&
      Object.keys(detailProject).length > 0 &&
      periodCurrent == null
    ) {
      stompClient.connect({}, () => {
        loadDataPeriodNotExists(stompClient);
        fetchDataBoard(null);
      });
    } else if (
      stompClient != null &&
      detailProject != null &&
      Object.keys(detailProject).length > 0 &&
      Object.keys(periodCurrent).length === 0
    ) {
      stompClient.connect({}, () => {
        loadDataPeriodNotExists(stompClient);
        fetchDataBoard(null);
      });
    }
  }, [stompClient, detailProject, periodCurrent]);

  const loadDataPeriodNotExists = (stompC) => {
    let sessionId = /\/([^\/]+)\/websocket/.exec(stompC.ws._transport.url)[1];
    dispatch(SetSessionId(sessionId));
    stompC.subscribe(
      "/portal-projects/update-index-todo-list/" + detailProject.id,
      (message) => {
        let res = JSON.parse(message.body).data.sessionId;
        if (res !== sessionId) {
          let indexBefore = JSON.parse(message.body).data.indexBefore;
          let indexAfter = JSON.parse(message.body).data.indexAfter;
          let idTodoList = JSON.parse(message.body).data.data;
          dispatch(
            reorderList({
              startIndex: indexBefore,
              endIndex: indexAfter,
              listId: idTodoList,
            })
          );
        }
      }
    );
    stompC.subscribe(
      "/portal-projects/create-todo-list/" + detailProject.id,
      (message) => {
        let obj = JSON.parse(message.body).data;
        dispatch(AddList(obj));
      }
    );

    stompC.subscribe("/portal-projects/success/" + sessionId, (message) => {
      let successObject = JSON.parse(message.body);
      toast.success(successObject.successMessage);
    });

    stompC.subscribe("/portal-projects/error/" + sessionId, (message) => {
      var errorObject = JSON.parse(message.body).data;
      toast.error("Lỗi hệ thống");
    });

    stompC.subscribe(
      "/portal-projects/update-background-project/" + detailProject.id,
      (message) => {
        let data = JSON.parse(message.body).data;
        dispatch(UpdateBackground(data));
      }
    );

    stompC.subscribe(
      "/portal-projects/update-name-todo-list/" + detailProject.id,
      (message) => {
        let data = JSON.parse(message.body).data;
        dispatch(UpdateNameTodoList(data));
      }
    );

    stompC.subscribe(
      "/portal-projects/create-label/" + detailProject.id,
      (message) => {
        let data = JSON.parse(message.body).data;
        dispatch(CreateLabelProject(data));
      }
    );

    stompC.subscribe(
      "/portal-projects/delete-label/" + detailProject.id,
      (message) => {
        let data = JSON.parse(message.body).data;
        dispatch(DeleteLabelProject(data));
        dispatch(DeleteLabelTask(data));
        dispatch(DeleteLabelTodoDetailTodo(data));
      }
    );

    stompC.subscribe(
      "/portal-projects/update-label/" + detailProject.id,
      (message) => {
        let data = JSON.parse(message.body).data;
        dispatch(UpdateLabelTask(data));
        dispatch(UpdateLabelProject(data));
        dispatch(UpdateLabelTodoDetailTodo(data));
      }
    );

    stompC.subscribe(
      "/portal-projects/create-member-project/" + detailProject.id,
      (message) => {
        fetchDataMemberProject();
      }
    );

    stompC.subscribe(
      "/portal-projects/delete-todo-list/" + detailProject.id,
      (message) => {
        let id = JSON.parse(message.body).data;
        dispatch(DeleteTodoList(id));
      }
    );

    stompC.subscribe(
      "/portal-projects/update-member-project/" + detailProject.id,
      (message) => {
        dispatch(UpdateMemberProject(JSON.parse(message.body).data));
      }
    );

    return sessionId;
  };

  const fetchDataBoard = async (idPeriod) => {
    try {
      let filter = {
        idPeriod: idPeriod,
        projectId: detailProject.id,
        name: filterTodoRef.current.name,
        member: filterTodoRef.current.member,
        label: filterTodoRef.current.label,
        dueDate: filterTodoRef.current.dueDate,
      };
      const response = await DetailProjectAPI.fetchAllBoard(filter);
      let obj = response.data.data;
      let listMember = listMemberProjectRef.current;

      obj.forEach((list) => {
        list.tasks.forEach((task) => {
          if (
            task.listMemberByIdTodo != null &&
            task.listMemberByIdTodo.length > 0
          ) {
            const filteredMembers = task.listMemberByIdTodo.map((itemId) =>
              listMember.find((member) => member.id === itemId)
            );
            task.listMemberByIdTodo = filteredMembers;
          }
        });
      });
      dispatch(SetBoard(obj));
    } catch (error) {
    } finally {
      dispatch(SetLoading(false));
    }
  };

  const fetchDataMemberProject = async () => {
    try {
      const responMemberAPI = await CommonAPI.fetchAll();
      const listMemberAPI = responMemberAPI.data;

      const resMP = await MemberProjectAPI.fetchAll(detailProject.id);
      const listMemberProject = resMP.data.data;

      const memberPromises = listMemberProject.map((lmp) => {
        const member = listMemberAPI.find((m) => m.id === lmp.memberId);
        if (member) {
          let obj = { ...member };
          obj.statusWork = lmp.statusWork;
          obj.role = lmp.role;
          return obj;
        }
        return null;
      });

      const members = await Promise.all(memberPromises);
      const filteredMembers = members.filter((m) => m !== null);

      dispatch(SetMemberProject(filteredMembers));
    } catch (error) {
      dispatch(SetError("Lỗi hệ thống, vui lòng ấn F5 để tải lại trang"));
    }
  };
};

export default BoardStompClient;
