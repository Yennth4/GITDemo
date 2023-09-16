import { requestCommon } from "../helper/request.helper";
import { requestCommonStakeHolder } from "../helper/request.helper";

export class CommonAPI {
  static fetchAll = () => {
    return requestCommon({
      method: "GET",
      url: ``,
    });
  };

  static findById = (id) => {
    return requestCommon({
      method: "GET",
      url: `/` + id,
    });
  };
}
export class CommonStakeHolderAPI {
  static fetchAll = () => {
    return requestCommonStakeHolder({
      method: "GET",
      url: ``,
    });
  };
}
