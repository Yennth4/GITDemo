import { request } from "../../helper/request.helper";

export class AdCategoryAPI {
  static fetchAllCategory = (name,page) => {
    return request({
      method: "GET",
      url:
        `/admin/category/search` +
        "?name=" +
        name
        +
        "&page=" +
        page
        +
        "&size=10" 
        
    });
  };


  static create = (data) => {
    return request({
      method: "POST",
      url: `/admin/category/add`,
      data: data,
    });
  };

  static detail = (idCate) => {
    return request({
      method: "GET",
      url: `/admin/category/detail/` + idCate,
    });
  };


  static update = (idCate,data) => {
    return request({
      method: "PUT",
      url: `/admin/category/` + idCate,
      data: data,
    });
  };

  
}