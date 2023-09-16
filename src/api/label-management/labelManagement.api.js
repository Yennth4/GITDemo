import { request } from "../../helper/request.helper";

export class LabelManagementAPI {

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/admin/label`,
      params: filter,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/label`,
      data: data,
    });
  };

  static update = (data) => {
    return request({
      method: "PUT",
      url: `/admin/label/${data.id}`,
      data: data,
    });
  };

  static getOne = (idLabel) => {
    return request({
      method: "GET",
      url: `/admin/label` + idLabel,
    });
  };
}

