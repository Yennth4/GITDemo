import { request } from "../../helper/request.helper";

export class MyProjectAPI {

  static fetchAll = (filter) => {
    return request({
      method: "GET",
      url: `/member/project`,
      params: filter,
    });
  };

  static create = (data) => {
    return request({
      method: "POST",
      url: `/${this.COMPONENT_NAME}`,
      data: data,
    });
  };

  static update = (data, id) => {
    return request({
      method: "PUT",
      url: `/${this.COMPONENT_NAME}/${id}`,
      data: data,
    });
  };

  static delete = (id) => {
    return request({
      method: "DELETE",
      url: `/${this.COMPONENT_NAME}/${id}`,
    });
  };
}
