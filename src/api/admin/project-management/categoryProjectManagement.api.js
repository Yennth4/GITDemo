import { request } from "../../../helper/request.helper";

const url = `/admin/project-category`;
export class CategoryProjectManagementAPI {
  static fetchCategoryWithIdProject = (idProject) => {
    return request({
      method: "GET",
      url: url + `/list-category-project/` + idProject,
    });
  };
  static fetchAllCategory = () => {
    return request({
      method: "GET",
      url: `/admin/category/list`,
    });
  };
  static addAllCategorysProject = (data) => {
    return request({
      method: "POST",
      url: url,
      data: data,
    });
  };
}
