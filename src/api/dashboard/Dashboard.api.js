import { request } from "../../helper/request.helper";

export class DashboardApi {
  static fetchAllTodoList = (idProject) => {
    return request({
      method: "GET",
      url: `/member/todo-list/` + idProject,
    });
  };

  static fetchAllDataDashboardTodoListAllProject = (idProject) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-todo-list-all-project?projectId=` +
        idProject,
    });
  };

  static fetchAllDataDashboardDueDateAllProject = (idProject, statusTodo) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-due-date-all-project?projectId=` +
        idProject +
        "&statusTodo=" +
        statusTodo,
    });
  };

  static fetchAllDataDashboardNoDueDateAllProject = (idProject) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-no-due-date-all-project?projectId=` +
        idProject,
    });
  };

  static fetchAllDataDashboardMemberAllProject = (idProject) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-member-all-project?projectId=` + idProject,
    });
  };

  static fetchAllDataDashboardNoMemberAllProject = (idProject) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-no-member-all-project?projectId=` +
        idProject,
    });
  };

  static fetchAllDataDashboardLabelAllProject = (idProject) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-label-all-project?projectId=` + idProject,
    });
  };

  static fetchAllDataDashboardNoLabelAllProject = (idProject) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-no-label-all-project?projectId=` +
        idProject,
    });
  };

  /////////////////////////////////

  static fetchAllDataDashboardTodoListPeriod = (idProject, idPeriod) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-todo-list-period?projectId=` +
        idProject +
        "&periodId=" +
        idPeriod,
    });
  };

  static fetchAllDataDashboardDueDatePeriod = (
    idProject,
    statusTodo,
    idPeriod
  ) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-due-date-period?projectId=` +
        idProject +
        "&statusTodo=" +
        statusTodo +
        "&periodId=" +
        idPeriod,
    });
  };

  static fetchAllDataDashboardNoDueDatePeriod = (idProject, idPeriod) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-no-due-date-period?projectId=` +
        idProject +
        "&periodId=" +
        idPeriod,
    });
  };

  static fetchAllDataDashboardMemberPeriod = (idProject, idPeriod) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-member-period?projectId=` +
        idProject +
        "&periodId=" +
        idPeriod,
    });
  };

  static fetchAllDataDashboardNoMemberPeriod = (idProject, idPeriod) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-no-member-period?projectId=` +
        idProject +
        "&periodId=" +
        idPeriod,
    });
  };

  static fetchAllDataDashboardLabelPeriod = (idProject, idPeriod) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-label-period?projectId=` +
        idProject +
        "&periodId=" +
        idPeriod,
    });
  };

  static fetchAllDataDashboardNoLabelPeriod = (idProject, idPeriod) => {
    return request({
      method: "GET",
      url:
        `/member/todo/count-todo-by-no-label-period?projectId=` +
        idProject +
        "&periodId=" +
        idPeriod,
    });
  };

  static detailPeriod = (idPeriod) => {
    return request({
      method: "GET",
      url: `/member/period/detail/` + idPeriod,
    });
  };
}
