import { request } from "../../helper/request.helper";

export class DetailProjectAPI {
  static findProjectById = (idProject) => {
    return request({
      method: "GET",
      url: `/member/project/detail-project/` + idProject,
    });
  };

  static findAllPeriodProject = (idProject) => {
    return request({
      method: "GET",
      url: `/member/period/` + idProject,
    });
  };

  static fetchAllBoard = (filter) => {
    return request({
      method: "POST",
      url: "/member/todo",
      data: filter,
    });
  };

  static fetchAllLabelProject = (idProject) => {
    return request({
      method: "GET",
      url: `/member/label/list?idProject=` + idProject,
    });
  };

  static fetchAllNotification = (memberId, page) => {
    return request({
      method: "GET",
      url: `/member/notification-member?memberId=` + memberId + "&page=" + page,
    });
  };

  static countNotification = (memberId) => {
    return request({
      method: "GET",
      url: `/member/notification-member/count?memberId=` + memberId,
    });
  };

  static updateStatusNotification = (idNotificationMember) => {
    return request({
      method: "PUT",
      url:
        `/member/notification-member/update-status?idNotificationMember=` +
        idNotificationMember,
    });
  };

  static updateAllStatusNotification = (memberId) => {
    return request({
      method: "PUT",
      url: `/member/notification-member/update-all-status?memberId=` + memberId,
    });
  };

  static createNotification = (obj) => {
    return request({
      method: "POST",
      url: `/member/notification`,
      data: obj
    });
  };
}
