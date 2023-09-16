import { request } from "../../../helper/request.helper";

const url = `/admin/project`;
export class ProjectManagementAPI {
  static featchAll = (filter) => {
    return request({
      method: "GET",
      url:
        url +
        `?page=` +
        filter.page +
        `&size=` +
        filter.size +
        `&code=` +
        filter.code +
        `&name=` +
        filter.name +
        `&startTime=` +
        filter.startTime +
        `&endTime=` +
        filter.endTime +
        `&statusProject=` +
        filter.statusProject +
        `&idCategory=` +
        filter.idCategory,
    });
  };

  static detail = (id) => {
    return request({
      method: "GET",
      url: url + `/` + id,
    });
  };

  static createWithId = () => {
    return request({
      method: "POST",
      url: url + `/id`,
    });
  };

  static createProject = (data) => {
    return request({
      method: "POST",
      url: url,
      data: data,
    });
  };

  static updateProject = (data, idProject) => {
    return request({
      method: "PUT",
      url: url + `/` + idProject,
      data: data,
    });
  };

  static deleteById = (id) => {
    return request({
      method: "DELETE",
      url: url + `/` + id,
    });
  };
}
