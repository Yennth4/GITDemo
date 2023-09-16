import { Modal, Input, Tooltip } from "antd";
import "./styleModalBackgroundColor.css";
import "react-toastify/dist/ReactToastify.css";
import { listBackgroundColor } from "../../../../../helper/background";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../../../../app/hook";
import { getStompClient } from "../../stomp-client-config/StompClientManager";

const { TextArea } = Input;

const ModalBackGroundColor = ({ visible, onCancel }) => {
  const listBackground = listBackgroundColor();
  const detailProject = useAppSelector(GetProject);
  const stompClient = getStompClient();

  const changeBackgroundColor = (name) => {
    let obj = {
      projectId: detailProject.id,
      name: name,
      type: "1",
    };

    stompClient.send(
      "/action/update-background-project/" + detailProject.id,
      {},
      JSON.stringify(obj)
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        width={780}
        footer={null}
        className="modal_show_detail"
      >
        {" "}
        <div style={{ paddingTop: "0", borderBottom: "1px solid black" }}>
          <span style={{ fontSize: "18px" }}>
            <FontAwesomeIcon
              icon={faPaintBrush}
              style={{ marginRight: "7px" }}
            />
            Màu nền
          </span>
        </div>
        <div style={{ marginTop: "15px", position: "relative" }}>
          <div className="div-color-container">
            {listBackground.map((item) => (
              <Tooltip title={item.name}>
                <div
                  style={{ backgroundColor: item.color }}
                  className="div-color"
                  onClick={() => {
                    changeBackgroundColor(item.color);
                  }}
                ></div>
              </Tooltip>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalBackGroundColor;
