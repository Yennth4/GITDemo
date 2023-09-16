import { Modal, Row, Col, Input, Button } from "antd";
import { useEffect, useState } from "react";
import { AdCategoryAPI } from "../../../../api/admin-category/adCategory.api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../../../app/hook";
import { CreateCategory } from "../../../../app/reducer/admin/category-management/adCategorySlice.reducer";

const ModalCreateCategory = ({ visible, onCancel }) => {
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      setName("");
      setErrorName();
    };
  }, [visible]);

  const create = () => {
    let check = 0;
    if (name.trim() === "") {
      setErrorName("Tên thể loại không được để trống");
      check++;
    } else if (name.trim().length > 100) {
      setErrorName("Tên thể loại không được > 100 ký tự");
      check++;
    } else {
      setErrorName("");
    }

    if (check === 0) {
      let obj = {
        name: name,
      };

      AdCategoryAPI.create(obj).then(
        (response) => {
          toast.success("Thêm thành công!");
          dispatch(CreateCategory(response.data.data));
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
        width={500}
        footer={null}
        className="modal_show_detail"
      >
        {" "}
        <div style={{ paddingTop: "0", borderBottom: "1px solid black" }}>
          <span style={{ fontSize: "18px" }}>Thêm mới thể loại</span>
        </div>
        <div style={{ marginTop: "15px", borderBottom: "1px solid black" }}>
          <Row gutter={16} style={{ marginBottom: "15px" }}>
            <Col span={24}>
              <span>Tên thể loại:</span> <br />
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

export default ModalCreateCategory;
