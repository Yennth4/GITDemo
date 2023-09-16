import { request } from "../../helper/request.helper";

export class PeriodProjectAPI {
  static fetchAllPeriodByIdProject = (idProject, name, status) => {
    return request({
      method: "GET",
      url:
        `/member/period/list-period/` +
        idProject +
        "?namePeriod=" +
        name +
        "&statusPeriod=" +
        status,
    });
  };

  static detail = (idPeriod) => {
    return request({
      method: "GET",
      url: `/member/period/detail/` + idPeriod,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/member/period`,
      data: data,
    });
  };

  static update = (data) => {
    return request({
      method: "PUT",
      url: `/member/period`,
      data: data,
    });
  };

  static delete = (idPeriod, idProject) => {
    return request({
      method: "DELETE",
      url: `/member/period?id=` + idPeriod + "&projectId=" + idProject,
    });
  };
}
