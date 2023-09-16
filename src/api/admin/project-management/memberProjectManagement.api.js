import { request } from "../../../helper/request.helper";

const url = `/admin/member-project`;
export class MemberProjectManagementAPI {
  static fetchAll = (idProject) => {
    return request({
      method: "GET",
      url: url + `/list-member-project/` + idProject,
    });
  };

  static deleteMemberProject = (idMemberProject) => {
    return request({
      method: "DELETE",
      url: url + `/` + idMemberProject,
    });
  };
}
