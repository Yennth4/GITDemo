import { createSlice } from "@reduxjs/toolkit";
import { convertDateToStringTodo } from "../../../helper/convertDate";

const initialState = {
  lists: [],
  table: [],
  filter: {
    name: "",
    member: [],
    label: [],
    dueDate: [],
  },
  loading: false,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    SetBoard: (state, action) => {
      state.lists = action.payload;
      return state;
    },
    SetFilter: (state, action) => {
      state.filter = action.payload;
      return state;
    },
    SetTable: (state, action) => {
      state.table = action.payload;
      return state;
    },
    SetLoading: (state, action) => {
      state.loading = action.payload;
      return state;
    },
    UpdateListMemberByIdTodo: (state, action) => {
      const { listId, taskId, filteredMembers } = action.payload;

      const list = state.lists.find((list) => list.id === listId);
      if (list != null) {
        const task = list.tasks.find((task) => task.id === taskId);
        if (task != null) {
          task.listMemberByIdTodo = filteredMembers;
        }
      }
      return state;
    },
    reorderList(state, action) {
      const { startIndex, endIndex, listId } = action.payload;
      const removedListIndex = state.lists.findIndex(
        (list) => list.id === listId
      );
      const removedList = state.lists[removedListIndex];

      state.lists.splice(removedListIndex, 1);
      state.lists.splice(endIndex, 0, removedList);

      state.lists.forEach((list, index) => {
        list.indexTodoList = index;
      });
      return state;
    },
    moveTask(state, action) {
      const { idTodoListOld, idTodoListNew, indexTodoNew, draggableId } =
        action.payload;

      const sourceListIndex = state.lists.findIndex(
        (list) => list.id === idTodoListOld
      );
      const destinationListIndex = state.lists.findIndex(
        (list) => list.id === idTodoListNew
      );

      const sourceList = state.lists[sourceListIndex];
      const destinationList = state.lists[destinationListIndex];

      const removedTaskIndex = sourceList.tasks.findIndex(
        (task) => task.id === draggableId
      );
      const removedTask = sourceList.tasks.splice(removedTaskIndex, 1)[0];
      destinationList.tasks.splice(indexTodoNew, 0, removedTask);

      sourceList.tasks.forEach((item, index) => {
        item.indexTodo = index;
      });

      destinationList.tasks.forEach((task, index) => {
        task.indexTodo = index;
      });
      return state;
    },
    AddList(state, action) {
      let data = action.payload;
      let obj = {
        id: data.id,
        code: data.code,
        name: data.name,
        indexTodoList: data.indexTodoList,
        tasks: [],
      };
      state.lists.push(obj);
      return state;
    },
    AddTask(state, action) {
      let data = action.payload;
      const listFind = state.lists.find((list) => list.id === data.todoListId);
      let obj = {
        id: data.id,
        code: data.code,
        name: data.name,
        priorityLevel: null,
        descriptions: null,
        deadline: null,
        completionTime: null,
        indexTodo: data.indexTodo,
        progress: 0,
        imageId: null,
        nameFile: null,
        numberTodoComplete: 0,
        numberTodo: 0,
        progressOfTodo: 0,
        deadlineString: null,
        listMemberByIdTodo: [],
        labels: [],
        list: {},
      };
      listFind.tasks.push(obj);
      return state;
    },
    CreateMemberBoard: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.listMemberByIdTodo.push(obj.member);
      }
      return state;
    },
    DeleteMemberBoard: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.listMemberByIdTodo.forEach((item, index) => {
          if (item.id === obj.memberId) {
            task.listMemberByIdTodo.splice(index, 1);
          }
        });
      }
      return state;
    },
    CreateLabelBoard: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.labels.push(obj.label);
      }
      return state;
    },
    DeleteLabelBoard: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.labels.forEach((item, index) => {
          if (item.id === obj.labelId) {
            task.labels.splice(index, 1);
          }
        });
      }
      return state;
    },
    UpdateDescriptions: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.descriptions = obj.todo.descriptions;
      }
      return state;
    },
    UpdatePriorityLevel: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.priorityLevel = obj.todo.priorityLevel + "";
      }
      return state;
    },
    UpdateTodoInCheckListAndProgress: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.numberTodo = obj.numberTodo;
        task.numberTodoComplete = obj.numberTodoComplete;
        task.progress = obj.progress;
      }
      return state;
    },
    UpdateCountCommentCreate: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.numberCommnets = task.numberCommnets + 1;
      }
      return state;
    },
    UpdateCountCommentDelete: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.numberCommnets = task.numberCommnets - 1;
      }
      return state;
    },
    UpdateDeadline: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.deadline = obj.data.deadline;
        task.reminderTime = obj.data.reminderTime;
        task.statusReminder = obj.data.statusReminder;
        task.deadlineString = convertDateToStringTodo(obj.data.statusReminder);
      }
      return state;
    },
    DeleteDeadline: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.deadline = obj.data.deadline;
        task.reminderTime = obj.data.reminderTime;
        task.statusReminder = obj.data.statusReminder;
        task.deadlineString = obj.data.deadline;
      }
      return state;
    },
    UpdateNameTodoList: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.id);
      if (list) {
        list.name = obj.name;
      }
      return state;
    },
    UpdateNameTask: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.name = obj.data.name;
      }
      return state;
    },
    UpdateCompletion: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.completionTime = obj.data.completionTime;
        task.progress = obj.data.progress;
      }
      return state;
    },
    UpdateCountAttachmentCreate: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.numberAttachments = task.numberAttachments + 1;
      }
      return state;
    },
    UpdateCountAttachmentDelete: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.numberAttachments = task.numberAttachments - 1;
      }
      return state;
    },
    DeleteTodo: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);

      if (list) {
        const taskIndex = list.tasks.findIndex(
          (item) => item.id === obj.idTodo
        );

        if (taskIndex !== -1) {
          list.tasks.splice(taskIndex, 1);
        }
      }
      return state;
    },
    UpdateProgress: (state, action) => {
      const obj = action.payload;
      const list = state.lists.find((item) => item.id === obj.idTodoList);
      const task = list.tasks.find((item) => item.id === obj.idTodo);
      if (task) {
        task.progress = obj.data.progress;
      }
      return state;
    },
    DeleteLabelTask: (state, action) => {
      const data = action.payload;
      state.lists.forEach((list) => {
        list.tasks.forEach((task) => {
          task.labels = task.labels.filter((label) => label.id !== data);
        });
      });
      return state;
    },
    UpdateLabelTask: (state, action) => {
      const data = action.payload;
      state.lists.forEach((list) => {
        list.tasks.forEach((task) => {
          task.labels.forEach((label) => {
            if (label.id === data.id) {
              label.code = data.code;
              label.name = data.name;
              label.colorLabel = data.colorLabel;
            }
          });
        });
      });
      return state;
    },
    DeleteTodoList: (state, action) => {
      const data = action.payload;
      state.lists.forEach((list, index) => {
        if (list.id === data) {
          state.lists.splice(index, 1);
        }
      });
      return state;
    },
    CreateImageCover: (state, action) => {
      const data = action.payload;
      if (data.image.statusImage === "COVER") {
        const list = state.lists.find((item) => item.id === data.idTodoList);
        const task = list.tasks.find((item) => item.id === data.idTodo);
        if (task) {
          task.imageId = data.image.imageId;
          task.nameFile = data.image.nameFile;
        }
      }
    },
    ChangeCoverImage: (state, action) => {
      const data = action.payload;
      const list = state.lists.find((item) => item.id === data.idTodoList);
      const task = list.tasks.find((item) => item.id === data.idTodo);
      if (task) {
        task.imageId = data.todo.imageId;
        task.nameFile = data.todo.nameFile;
      }
    },
    DeleteCoverImage: (state, action) => {
      const data = action.payload;
      if (data.todo.imageId == null) {
        const list = state.lists.find((item) => item.id === data.idTodoList);
        const task = list.tasks.find((item) => item.id === data.idTodo);
        if (task) {
          task.imageId = null;
          task.nameFile = null;
        }
      }
    },
  },
});

export const {
  SetBoard,
  SetFilter,
  SetTable,
  SetLoading,
  UpdateListMemberByIdTodo,
  reorderList,
  moveTask,
  AddList,
  AddTask,
  CreateMemberBoard,
  DeleteMemberBoard,
  CreateLabelBoard,
  DeleteLabelBoard,
  UpdateDescriptions,
  UpdatePriorityLevel,
  UpdateTodoInCheckListAndProgress,
  UpdateCountCommentCreate,
  UpdateCountCommentDelete,
  UpdateDeadline,
  DeleteDeadline,
  UpdateNameTodoList,
  UpdateNameTask,
  UpdateCompletion,
  UpdateCountAttachmentCreate,
  UpdateCountAttachmentDelete,
  DeleteTodo,
  UpdateProgress,
  DeleteLabelTask,
  UpdateLabelTask,
  DeleteTodoList,
  CreateImageCover,
  ChangeCoverImage,
  DeleteCoverImage,
} = boardSlice.actions;

export const GetBoard = (state) => state.board;
export const GetAllList = (state) => state.board.lists;
export const GetListTable = (state) => state.board.table;
export const GetFilter = (state) => state.board.filter;
export const GetLoading = (state) => state.loading;

export default boardSlice.reducer;
