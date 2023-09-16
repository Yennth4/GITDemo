import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../app/hook";
import { GetMemberProject } from "../../../../../app/reducer/detail-project/DPMemberProject.reducer";
import Image from "../../../../../helper/img/Image";
import "./styleActivityComponent.css";
import { formatDateTime } from "../../../../../helper/convertDate";
import PopupDetailImageActivity from "../../popup/popup-show-detail-image/PopupDetailImageActivity";

const ActivityComponent = ({ item }) => {
  const listMemberProject = useAppSelector(GetMemberProject);
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (listMemberProject != null && listMemberProject.length > 0) {
      loadDataMember();
    }
  }, [listMemberProject]);

  const loadDataMember = () => {
    let data = listMemberProject.find(
      (member) => member.id === item.memberCreatedId
    );
    setMember(data);
  };

  const [isOpenPopupShowDetailImage, setIsOpenPopupShowDetailImage] =
    useState(false);

  const openPopupShowDetailImage = () => {
    setIsOpenPopupShowDetailImage(true);
  };

  const closePopupShowDetailImage = () => {
    setIsOpenPopupShowDetailImage(false);
  };

  return (
    <div
      style={{
        marginBottom: "10px",
        flexWrap: "wrap",
        display: "flex",
      }}
    >
      <div>
        <Image
          name={member != null ? member.name + " " + member.code : ""}
          picxel={33}
          url={member != null ? member.image : ""}
        />
      </div>
      <div style={{ width: "90%", marginLeft: "10px" }}>
        <span>
          <b>{member != null ? member.name + " " + member.code : ""}</b>
        </span>{" "}
        <span>{item.contentAction}</span> <br />
        <span>{formatDateTime(item.createdDate)}</span>
        {item != null && item.urlImage != null && (
          <div>
            <img
              width="100%"
              src={item.urlImage}
              alt="Hình ảnh"
              onClick={openPopupShowDetailImage}
              style={{ marginTop: "10px", cursor: "pointer" }}
            />
            {isOpenPopupShowDetailImage && (
              <PopupDetailImageActivity
                onClose={closePopupShowDetailImage}
                item={item}
              />
            )}{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityComponent;
