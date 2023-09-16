import "./styleModalCreateLabel.css";
import { Modal, Row, Col, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { LabelManagementAPI } from "../../../../api/label-management/labelManagement.api";
import { useAppDispatch } from "../../../../app/hook";
import { CreateLabelManagement } from "../../../../app/reducer/admin/label-management/labelManagementSlice.reducer";
import { toast } from "react-toastify";

const ModalCreateLabel = ({ visible, onCancel }) => {
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [colorLabel, setColorLabel] = useState("");
  const [errorColorLabel, setErrorColorLabel] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (visible === true) {
      return () => {
        setName("");
        setColorLabel("");
        setErrorName("");
        setErrorColorLabel("");
      };
    }
  }, [visible]);

  const listColor = [
    "#089931",
    "#135f8b",
    "#423b19",
    "#5432f6",
    "#b66366",
    "#032c3d",
    "#aa7640",
    "#717f5f",
    "#8f0217",
    "#45657d",
    "#808000", // Olive
    "#8fbc8f", // Dark Sea Green
    "#c0c0c0", // Silver
    "#778899", // Light Slate Gray
    "#d3d3d3", // Light Gray
  ];

  const [hoveredColor, setHoveredColor] = useState(null);

  const handleMouseEnter = (color) => {
    setHoveredColor(color);
    setColorLabel(color);
  };

  const handleMouseLeave = () => {
    setHoveredColor(null);
  };

  const create = () => {
    let check = 0;

    if (name.trim() === "") {
      setErrorName("Tên nhãn không được để trống");
      check++;
    } else {
      setErrorName("");
    }
    if (colorLabel === "") {
      setErrorColorLabel("Hãy chọn màu sắc");
      check++;
    } else {
      setErrorColorLabel("");
    }
    if (check === 0) {
      let obj = {
        code: new Date().getTime(),
        name: name,
        colorLabel: colorLabel,
      };
      LabelManagementAPI.create(obj).then(
        (response) => {
          toast.success("Thêm thành công!");
          dispatch(CreateLabelManagement(response.data.data));
          onCancel();
        },
        (error) => {
          toast.error(error.response.data.message);
        }
      );
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      width={750}
      footer={null}
      className="modal_show_detail"
    >
      {" "}
      <div style={{ paddingTop: "0", borderBottom: "1px solid black" }}>
        <span style={{ fontSize: "18px" }}>Thêm nhãn</span>
      </div>
      <div style={{ marginTop: "15px", borderBottom: "1px solid black" }}>
        <Row gutter={16} style={{ marginBottom: "15px" }}>
          <Col span={24}>
            <span>Tên nhãn:</span> <br />
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
          <Col span={24}>
            <span>Màu:</span> <br />
            <div
              style={{
                width: "100px",
                height: "35px",
                backgroundColor: hoveredColor,
                borderRadius: "5px",
              }}
            ></div>
          </Col>
          <Col span={24}>
            <span>Màu sắc:</span> <br />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 140px)",
                gridGap: "10px",
                marginTop: "10px",
              }}
            >
              {listColor.map((item, index) => (
                <div
                  key={index}
                  style={{
                    width: "100px",
                    height: "50px",
                    backgroundColor: item,
                    borderRadius: "5px",
                    transition: "transform 0.3s ease",
                    transform:
                      hoveredColor === item ? "scale(1.1)" : "scale(1)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMouseEnter(item)}
                ></div>
              ))}
            </div>
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
  );
};

export default ModalCreateLabel;
