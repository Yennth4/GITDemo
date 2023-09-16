import { request } from "../../helper/request.helper";

export class DetailTodoAPI {
  static findMemberByIdTodo = (idTodo) => {
    return request({
      method: "GET",
      url: `/member/assign?idTodo=` + idTodo,
    });
  };

  static detailTodo = (idTodo) => {
    return request({
      method: "GET",
      url: `/member/todo/get-all-detail/` + idTodo,
    });
  };

  static getPageComment = (idTodo, currentPage) => {
    return request({
      method: "GET",
      url: `/member/comment?idTodo=` + idTodo + "&page=" + currentPage,
    });
  };

  static getPageActivity = (idTodo, currentPage) => {
    return request({
      method: "GET",
      url: `/member/activity?idTodo=` + idTodo + "&page=" + currentPage,
    });
  };

  static uploadImage = (file) => {
    return request({
      method: "POST",
      url: `/member/image/upload`,
      data: file,
    });
  };

  static detailImage = (id) => {
    return request({
      method: "GET",
      url: `/member/image/detail/` + id,
    });
  };
}
