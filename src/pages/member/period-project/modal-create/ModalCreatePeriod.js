import { Modal, Row, Col, Input, Button } from "antd";
import "./styleModalCreatePeriod.css";
import { useEffect, useState } from "react";
import { PeriodProjectAPI } from "../../../../api/period-project/periodProject.api";
import moment from "moment";
import { useAppSelector } from "../../../../app/hook";
import { GetProject } from "../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../../../app/hook";
import {
  CreatePeriodProject,
  UpdatePeriodProject,
} from "../../../../app/reducer/member/period-project/periodProjectSlice.reducer";

const { TextArea } = Input;

const ModalCreatePeriod = ({ visible, onCancel }) => {
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [errorStartTime, setErrorStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorEndTime, setErrorEndTime] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [errorDescriptions, setErrorDescriptions] = useState("");
  const [target, setTarget] = useState("");
  const [errorTarget, setErrorTarget] = useState("");
  const detailProject = useAppSelector(GetProject);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      setName("");
      setStartTime("");
      setEndTime("");
      setDescriptions("");
      setTarget("");
      setErrorDescriptions("");
      setErrorEndTime("");
      setErrorTarget("");
      setErrorStartTime("");
      setErrorName();
    };
  }, [visible]);

  const create = () => {
    let check = 0;
    if (name.trim() === "") {
      setErrorName("Tên giai đoạn không được để trống");
      check++;
    } else {
      setErrorName("");
    }
    if (startTime === "") {
      setErrorStartTime("Thời gian bắt đầu không được để trống");
      check++;
    } else {
      setErrorStartTime("");
    }
    if (endTime === "") {
      setErrorEndTime("Thời gian kết thúc không được để trống");
      check++;
    } else {
      setErrorEndTime("");
    }
    if (new Date(startTime) > new Date(endTime)) {
      setErrorStartTime(
        "Thời gian bắt đầu không được lớn hơn thời gian kết thúc"
      );
      check++;
    } else {
      if (startTime === "") {
        setErrorStartTime("Thời gian bắt đầu không được để trống");
        check++;
      } else {
        setErrorStartTime("");
      }
    }
    if (descriptions.length > 1000) {
      setErrorDescriptions("Mô tả không vượt quá 1000 ký tự");
      check++;
    } else {
      setErrorDescriptions("");
    }
    if (target.length > 1000) {
      setErrorTarget("Mục tiêu không vượt quá 1000 ký tự");
      check++;
    } else {
      setErrorTarget("");
    }
    if (check === 0) {
      let obj = {
        name: name,
        descriptions: descriptions,
        startTime: moment(startTime, moment.ISO_8601).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        endTime: moment(endTime, moment.ISO_8601).format("YYYY-MM-DD HH:mm:ss"),
        target: target,
        projectId: detailProject.id,
      };

      PeriodProjectAPI.create(obj).then(
        (response) => {
          toast.success("Thêm thành công!");
          dispatch(CreatePeriodProject(response.data.data));
          onCancel();
        },
        (error) => {
          toast.error(error.response.data.message);
        }
      );
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        width={750}
        footer={null}
        className="modal_show_detail"
      >
        {" "}
        <div style={{ paddingTop: "0", borderBottom: "1px solid black" }}>
          <span style={{ fontSize: "18px" }}>Cập nhật giai đoạn</span>
        </div>
        <div style={{ marginTop: "15px", borderBottom: "1px solid black" }}>
          <Row gutter={16} style={{ marginBottom: "15px" }}>
            <Col span={24}>
              <span>Tên giai đoạn:</span> <br />
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                type="text"
              />
              <span className="error">{errorName}</span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: "15px" }}>
            <Col span={12}>
              <span>Thời gian bắt đầu:</span> <br />
              <Input
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                }}
                type="datetime-local"
              />
              <span className="error">{errorStartTime}</span>
            </Col>
            <Col span={12}>
              <span>Thời gian kết thúc:</span> <br />
              <Input
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                }}
                type="datetime-local"
              />
              <span className="error">{errorEndTime}</span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: "20px" }}>
            {" "}
            <Col span={12}>
              <span>Mô tả:</span> <br />
              <TextArea
                rows={4}
                value={descriptions}
                onChange={(e) => {
                  setDescriptions(e.target.value);
                }}
              />
              <span className="error">{errorDescriptions}</span>
            </Col>
            <Col span={12}>
              <span>Mục tiêu:</span> <br />
              <TextArea
                rows={4}
                value={target}
                onChange={(e) => {
                  setTarget(e.target.value);
                }}
              />
              <span className="error">{errorTarget}</span>
            </Col>
          </Row>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ paddingTop: "15px" }}>
            <Button
              style={{
                marginRight: "5px",
                backgroundColor: "rgb(61, 139, 227)",
                color: "white",
              }}
              onClick={create}
            >
              Thêm
            </Button>
            <Button
              style={{
                backgroundColor: "red",
                color: "white",
              }}
              onClick={onCancel}
            >
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalCreatePeriod;
