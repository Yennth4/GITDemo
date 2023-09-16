import { Modal, Row, Col, Input } from "antd";
import "./styleModalDetailPeriod.css";
import { useEffect, useState } from "react";
import { PeriodProjectAPI } from "../../../../api/period-project/periodProject.api";
import moment from "moment";

const { TextArea } = Input;

const ModalDetailPeriod = ({ visible, onCancel, idPeriod }) => {
  const [periodDetail, setPeriodDetail] = useState({});

  useEffect(() => {
    if (idPeriod !== null && idPeriod !== "" && visible === true) {
      fetchData();
    }
  }, [idPeriod, visible]);

  const fetchData = () => {
    PeriodProjectAPI.detail(idPeriod).then((response) => {
      setPeriodDetail(response.data.data);
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      width={750}
      footer={null}
      className="modal_show_detail"
    >
      <div style={{ paddingTop: "0", borderBottom: "1px solid black" }}>
        <span style={{ fontSize: "18px" }}>Chi tiết giai đoạn</span>
      </div>
      <div style={{ marginTop: "15px" }}>
        <Row gutter={16} style={{ marginBottom: "15px" }}>
          <Col span={12}>
            <span>Tên giai đoạn:</span> <br />
            <Input value={periodDetail.name} type="text" readOnly />
          </Col>
          <Col span={12}>
            <span>Thời gian bắt đầu:</span> <br />
            <Input
              value={moment(periodDetail.startTime)
                .utcOffset(7)
                .format("YYYY-MM-DDTHH:mm")}
              type="datetime-local"
              readOnly
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: "15px" }}>
          <Col span={12}>
            <span>Tiến độ:</span> <br />
            <Input type="text" value={periodDetail.progress + " %"} readOnly />
          </Col>
          <Col span={12}>
            <span>Thời gian kết thúc:</span> <br />
            <Input
              value={moment(periodDetail.endTime)
                .utcOffset(7)
                .format("YYYY-MM-DDTHH:mm")}
              type="datetime-local"
              readOnly
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: "15px" }}>
          <Col span={12}>
            <span>Mô tả:</span> <br />
            <TextArea rows={4} value={periodDetail.descriptions} readOnly />
          </Col>
          <Col span={12}>
            <span>Mục tiêu:</span> <br />
            <TextArea rows={4} value={periodDetail.target} readOnly />
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default ModalDetailPeriod;
