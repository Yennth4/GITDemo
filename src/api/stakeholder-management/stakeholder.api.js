import { request } from "../../helper/request.helper";

export class PeriodProjectAPI {
  static fetchAllProjectByIdStakeHolder = (idStake) => {
    return request({
      method: "GET",
      url: `/stakeholder/` + idStake,
    });
  };
  static fetchAllProjectByIdStakeHolderNull = () => {
    return request({
      method: "GET",
      url: `/stakeholder/projectbystakeIdNull`,
    });
  };
  static updateProjectByIdStake = (data, idStake) => {
    return request({
      method: "PUT",
      url: `/stakeholder/updateStakeHolderByIdNull/` + idStake,
      data: data,
    });
  };
}
