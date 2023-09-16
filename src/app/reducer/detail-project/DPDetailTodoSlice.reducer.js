import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const DetailTodoSlice = createSlice({
  name: "detailTodo",
  initialState,
  reducers: {
    SetDetailTodo: (state, action) => {
      let data = action.payload;
      state.data = data;
      return state;
    },
    DeleteMember: (state, action) => {
      const id = action.payload;
      state.data.members = state.data.members.filter((item) => item !== id);
      return state;
    },
    CreateMember: (state, action) => {
      let id = action.payload;
      state.data.members.push(id);
      return state;
    },
    DeleteLabel: (state, action) => {
      const id = action.payload;
      state.data.labels.forEach((item, index) => {
        if (item.id === id) {
          state.data.labels.splice(index, 1);
        }
      });
      return state;
    },
    CreateLabel: (state, action) => {
      let data = action.payload;
      state.data.labels.push(data);
      return state;
    },
    UpdateTodoListDetailTodo: (state, action) => {
      let todoListId = action.payload;
      state.data.todoListId = todoListId;
      return state;
    },
    UpdateDescriptionsDetailTodo: (state, action) => {
      let descriptions = action.payload;
      state.data.descriptions = descriptions;
      return state;
    },
    UpdatePriorityLevelDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.priorityLevel = data;
      return state;
    },
    UpdateTypeDetailTodo: (state, action) => {
      let type = action.payload;
      state.data.type = type;
      return state;
    },
    CreateTodoInCheckList: (state, action) => {
      let data = action.payload;
      state.data.listTodos.push(data.todo);
      state.data.progress = data.progress;
      return state;
    },
    UpdateTodoInCheckList: (state, action) => {
      let data = action.payload;
      let todo = state.data.listTodos.find((item) => item.id === data.id);
      if (todo) {
        todo.name = data.name;
      }
    },
    DeleteTodoInCheckList: (state, action) => {
      let data = action.payload;
      state.data.listTodos.forEach((item, index) => {
        if (item.id === data.id) {
          state.data.listTodos.splice(index, 1);
        }
      });
      state.data.progress = data.progress;
    },
    UpdateStatusTodoInCheckList: (state, action) => {
      let data = action.payload;
      let todo = state.data.listTodos.find((item) => item.id === data.id);
      if (todo) {
        todo.statusTodo = data.status === "CHUA_HOAN_THANH" ? 0 : 1;
      }
      state.data.progress = data.progress;
      return state;
    },
    CreateCommentDetailTodo: (state, action) => {
      let data = action.payload;
      let objComment = {
        id: data.comment.id,
        content: data.comment.content,
        memberId: data.comment.memberId,
        statusEdit: data.comment.statusEdit,
        todoId: data.comment.todoId,
        createdDate: data.comment.createdDate,
      };
      if (
        state.data.comments.data.length > 0 &&
        state.data.comments.data.length % 5 === 0
      ) {
        state.data.comments.data.splice(state.data.comments.data.length - 1, 1);
        state.data.comments.totalPages = state.data.comments.totalPages + 1;
      }
      state.data.comments.data.unshift(objComment);
      return state;
    },
    DeleteCommentDetailTodo: (state, action) => {
      let id = action.payload;
      state.data.comments.data.forEach((item, index) => {
        if (item.id === id) {
          state.data.comments.data.splice(index, 1);
        }
      });
      return state;
    },
    UpdateCommentDetailTodo: (state, action) => {
      let data = action.payload;
      let commentFind = state.data.comments.data.find(
        (item) => item.id === data.id
      );
      commentFind.content = data.content;
      commentFind.statusEdit = 1;
      return state;
    },
    SetPageCommentDetailTodo: (state, action) => {
      let data = action.payload;
      data.data.forEach((item) => {
        state.data.comments.data.push(item);
      });
      state.data.comments.totalPages = data.totalPages;
      state.data.comments.currentPage = data.currentPage;
      return state;
    },
    SetPageActivityDetailTodo: (state, action) => {
      let data = action.payload;
      data.data.forEach((item) => {
        state.data.activities.data.push(item);
      });
      state.data.activities.totalPages = data.totalPages;
      state.data.activities.currentPage = data.currentPage;
      return state;
    },
    UpdateDeadlineDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.deadline = data.deadline;
      state.data.reminderTime = data.reminderTime;
      state.data.statusReminder = data.statusReminder;
      return state;
    },
    DeleteDeadlineDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.deadline = data.deadline;
      state.data.reminderTime = data.reminderTime;
      state.data.statusReminder = data.statusReminder;
      state.data.completionTime = data.completionTime;
      return state;
    },
    UpdateNameDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.name = data.name;
      return state;
    },
    UpdateCompletionDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.completionTime = data.completionTime;
      state.data.progress = data.progress;
      return state;
    },
    CreateAttachmentDetailTodo: (state, action) => {
      let data = action.payload;
      let objAttachment = {
        id: data.id,
        name: data.name,
        url: data.url,
        todoId: data.todoId,
        createdDate: data.createdDate,
      };
      state.data.attachments.unshift(objAttachment);
      return state;
    },
    DeleteAttachmentDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.attachments.forEach((item, index) => {
        if (item.id === data) {
          state.data.attachments.splice(index, 1);
        }
      });
      return state;
    },
    UpdateAttachmentDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.attachments.forEach((item) => {
        if (item.id === data.id) {
          item.url = data.url;
          item.name = data.name;
        }
      });
      return state;
    },
    UpdateProgressDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.progress = data.progress;
      return state;
    },
    DeleteLabelTodoDetailTodo: (state, action) => {
      let data = action.payload;
      const index = state.data.labels.findIndex((item) => item.id === data);
      if (index !== -1) {
        state.data.labels.splice(index, 1);
      }
      return state;
    },
    UpdateLabelTodoDetailTodo: (state, action) => {
      let data = action.payload;
      const index = state.data.labels.findIndex((item) => item.id === data.id);
      if (index !== -1) {
        state.data.labels[index].code = data.code;
        state.data.labels[index].name = data.name;
        state.data.labels[index].colorLabel = data.colorLabel;
      }
      return state;
    },
    CreateImageDetailTodo: (state, action) => {
      let data = action.payload;
      let objImage = {
        id: data.image.id,
        nameFile: data.image.nameFile,
        nameImage: data.image.nameImage,
        statusImage: data.image.statusImage === "COVER" ? 0 : 1,
        todoId: data.idTodo,
        createdDate: data.image.createdDate,
      };
      state.data.images.unshift(objImage);
      if (data.image.statusImage === "COVER") {
        state.data.imageId = data.image.id;
        state.data.nameFile = data.image.nameFile;
      }
      return state;
    },
    UpdateNameImageDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.images.forEach((item) => {
        if (item.id === data.id) {
          item.nameImage = data.nameImage;
        }
      });
      return state;
    },
    ChangeCoverImageDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.images.forEach((item) => {
        if (item.id === data.image.id) {
          item.statusImage = data.image.statusImage === "COVER" ? 0 : 1;
        } else {
          item.statusImage =
            data.image.statusImage === "COVER" ? 1 : item.statusImage;
        }
      });

      if (data.image.statusImage === "COVER") {
        state.data.imageId = data.image.id;
        state.data.nameFile = data.image.nameFile;
      } else {
        state.data.imageId = null;
        state.data.nameFile = null;
      }
      return state;
    },
    DeleteImageDetailTodo: (state, action) => {
      let data = action.payload;
      state.data.images.forEach((item, index) => {
        if (item.id === data.idImage) {
          state.data.images.splice(index, 1);
        }
      });
      if (data.todo.imageId == null) {
        state.data.imageId = data.todo.imageId;
        state.data.nameFile = data.todo.nameFile;
      }
      return state;
    },
  },
});

export const {
  SetDetailTodo,
  CreateMember,
  DeleteMember,
  DeleteLabel,
  CreateLabel,
  UpdateTodoListDetailTodo,
  UpdateDescriptionsDetailTodo,
  UpdatePriorityLevelDetailTodo,
  UpdateTypeDetailTodo,
  CreateTodoInCheckList,
  UpdateTodoInCheckList,
  DeleteTodoInCheckList,
  UpdateStatusTodoInCheckList,
  CreateCommentDetailTodo,
  DeleteCommentDetailTodo,
  UpdateCommentDetailTodo,
  SetPageCommentDetailTodo,
  SetPageActivityDetailTodo,
  UpdateDeadlineDetailTodo,
  UpdateNameDetailTodo,
  DeleteDeadlineDetailTodo,
  UpdateCompletionDetailTodo,
  CreateAttachmentDetailTodo,
  DeleteAttachmentDetailTodo,
  UpdateAttachmentDetailTodo,
  UpdateProgressDetailTodo,
  DeleteLabelTodoDetailTodo,
  UpdateLabelTodoDetailTodo,
  CreateImageDetailTodo,
  UpdateNameImageDetailTodo,
  ChangeCoverImageDetailTodo,
  DeleteImageDetailTodo,
} = DetailTodoSlice.actions;

export const GetDetailTodo = (state) => state.detailTodo.data;

export default DetailTodoSlice.reducer;
