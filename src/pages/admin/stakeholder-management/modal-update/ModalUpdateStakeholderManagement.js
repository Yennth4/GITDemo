import {
  Modal,
  Row,
  Col,
  Input,
  Button,
  Table,
  Tooltip,
  Space,
  Select,
  Pagination,
  Spin,
} from "antd";
import "./stydeModalUpdateStakeholderManagement.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "../../../../app/hook";
import { CommonStakeHolderAPI } from "../../../../api/commonAPI";
import { PeriodProjectAPI } from "../../../../api/stakeholder-management/stakeholder.api";
import LoadingIndicator from "../../../../helper/loading";

const ModalUpdateStakeholderManagement = ({
  visible,
  onCancel,
  idStakeHolder,
}) => {
  const { Option } = Select;
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailFPT, setEmailFPT] = useState("");
  const [projects, setProjects] = useState([]);
  const [stakeHolder, setDataStakeHolder] = useState([]);
  const [listProjectNotJoin, setListProjectNotJoin] = useState([]);
  const [listProjectAll, setlistProjectAll] = useState([]); //getAll
  const [listProjectChange, setListProjectChange] = useState([]); //change
  const [listUpdateProject, setListUpdateProject] = useState([]); // listMemberAll update
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchData(idStakeHolder);
    if (idStakeHolder !== null && idStakeHolder !== "" && visible === true) {
      setListProjectChange([]);
      setListUpdateProject([]);

      const stakeholder = stakeHolder.find((item) => item.id === idStakeHolder);
      if (stakeholder) {
        setName(stakeholder.name);
        setUsername(stakeholder.username);
        setPhoneNumber(stakeholder.phoneNumber);
        setEmailFPT(stakeholder.emailFPT);
      }
    }

    return () => {
      if (idStakeHolder !== null && idStakeHolder !== "" && visible === true) {
        setListProjectChange([]);
        setListUpdateProject([]);
        setListProjectNotJoin([]);
        setProjects([]);
      }
    };
  }, [idStakeHolder, visible]);

  const handleChangeProject = (idPerio) => {
    setListProjectChange(idPerio);
    setListUpdateProject(idPerio);
  };

  const handleUpdate = async () => {
    try {
      let projectNew = {
        id: idStakeHolder,
        listProject: listUpdateProject,
      };
      if (projectNew.listProject.toString("")) {
        PeriodProjectAPI.updateProjectByIdStake(projectNew, idStakeHolder);
        toast.success("Cập nhật thành công");
        onCancel();
      }
      if (projectNew.listProject == "") {
        toast.error("Cập nhật thất bại");
      }
    } catch (error) {
      toast.error("Cập nhật thất bại");
    }
  };
  const fetchData = async (idPeriodPre) => {
    try {
      const response = await CommonStakeHolderAPI.fetchAll();
      const data = response.data;
      setDataStakeHolder(data);
      const responseProject =
        await PeriodProjectAPI.fetchAllProjectByIdStakeHolder(idPeriodPre);
      const p = responseProject.data;
      setProjects(p.data);

      const responseProjectAll =
        await PeriodProjectAPI.fetchAllProjectByIdStakeHolderNull();
      const listProjectAll = responseProjectAll.data;
      setlistProjectAll(listProjectAll.data); //All Project

      const ListProjectNotJoin = responseProjectAll.data.data.filter((obj1) => {
        return !p.data.some((obj2) => obj2.id === obj1.id);
      });
      setListProjectNotJoin(ListProjectNotJoin);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.stt.localeCompare(b.stt),
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => {
        if (record.backGroundImage) {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={record.backGroundImage}
                alt="Background"
                className="backgroundImageTable"
              />
              <span>{text}</span>
            </div>
          );
        } else {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{ backgroundColor: record.backGroundColor }}
                className="box_backgroundColor"
              ></div>
              <span>{text}</span>
            </div>
          );
        }
      },
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      sorter: (a, b) => a.progress - b.progress,
      render: (text, record) => {
        return <span>{record.progress}%</span>;
      },
      width: "10%",
    },
    {
      title: "Thời gian",
      dataIndex: "startTimeAndEndTime",
      key: "startTimeAndEndTime",
      render: (text, record) => {
        const startTime = new Date(record.startTime);
        const endTime = new Date(record.endTime);

        const formattedStartTime = `${startTime.getDate()}/${
          startTime.getMonth() + 1
        }/${startTime.getFullYear()}`;
        const formattedEndTime = `${endTime.getDate()}/${
          endTime.getMonth() + 1
        }/${endTime.getFullYear()}`;

        return (
          <span>
            {formattedStartTime} - {formattedEndTime}
          </span>
        );
      },
      width: "175px",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusProject",
      key: "statusProject",
      sorter: (a, b) => a.statusProject - b.statusProject,
      render: (text) => {
        let statusText = "";
        if (text === "0") {
          statusText = "Đã diễn ra";
          return (
            <span
              className="box_span_status"
              style={{ backgroundColor: "rgb(45, 211, 86)", fontSize: "13px" }}
            >
              {statusText}
            </span>
          );
        } else if (text === "1") {
          statusText = "Đang diễn ra";
          return (
            <span
              className="box_span_status"
              style={{ backgroundColor: "rgb(41, 157, 224)", fontSize: "13px" }}
            >
              {statusText}
            </span>
          );
        } else {
          statusText = "Chưa diễn ra";
          return (
            <span
              className="box_span_status"
              style={{ backgroundColor: "rgb(238, 162, 48)", fontSize: "13px" }}
            >
              {statusText}
            </span>
          );
        }
      },
      width: "130px",
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        onCancel={onCancel}
        width={950}
        footer={null}
        className="modal_show_detail"
      >
        <div>
          <div style={{ paddingTop: "0", borderBottom: "1px solid black" }}>
            <span style={{ fontSize: "18px" }}>Cập nhật giai đoạn</span>
          </div>
          <div style={{ marginTop: "15px", borderBottom: "1px solid black" }}>
            <Row gutter={16} style={{ marginBottom: "15px" }}>
              <Col span={10} style={{ marginRight: "150px" }}>
                <span>Tên</span> <br />
                <Input
                  readOnly
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  type="text"
                />
              </Col>
              <Col span={10}>
                <span>Tên tài khoản</span> <br />
                <Input
                  readOnly
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  type="text"
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginBottom: "15px" }}>
              <Col span={10} style={{ marginRight: "150px" }}>
                <span>Số điện thoại</span> <br />
                <Input
                  readOnly
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                  type="text"
                />
              </Col>
              <Col span={10}>
                <span>EmailFPT:</span> <br />
                <Input
                  readOnly
                  value={emailFPT}
                  onChange={(e) => {
                    setEmailFPT(e.target.value);
                  }}
                  type="text"
                />
              </Col>
            </Row>
          </div>
          <Row style={{ marginBottom: "15px", marginTop: "15px" }}>
            <div style={{ width: "100%" }}>
              <span>Dự Án:</span>
              {listProjectNotJoin.length > 0 ? (
                <Select
                  mode="multiple"
                  placeholder="Thêm dự án"
                  dropdownMatchSelectWidth={false}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  value={listProjectChange}
                  onChange={handleChangeProject}
                  optionLabelProp="label"
                  defaultValue={[]}
                  filterOption={(text, option) =>
                    option.label.toLowerCase().indexOf(text.toLowerCase()) !==
                    -1
                  }
                >
                  {listProjectNotJoin.map((record) => (
                    <Option
                      label={record.name}
                      value={record.id}
                      key={record.id}
                    >
                      <Tooltip title={record.name}>
                        <Space>{record.name}</Space>
                      </Tooltip>
                    </Option>
                  ))}
                </Select>
              ) : (
                <span className="tip_project_full"> Đã theo dõi tất cả dự án</span>
              )}
            </div>
          </Row>
          {isLoading ? (
            <div className="loading-overlay">
              <Spin size="large" />
            </div>
          ) : (
            <div>
              <div className="title_my_project">
                {" "}
                <span style={{ fontSize: "16px", fontWeight: "500" }}>
                  {" "}
                  Danh sách dự án đang theo dõi
                </span>
              </div>
              <div style={{ marginTop: "5px", marginRight: "5px" }}>
                <Table
                  dataSource={projects}
                  rowKey="id"
                  columns={columns}
                  className="table_my_project"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    size: "small",
                  }}
                />
              </div>
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            <div style={{ paddingTop: "15px" }}>
              <Button
                style={{
                  marginRight: "5px",
                  backgroundColor: "rgb(61, 139, 227)",
                  color: "white",
                }}
                onClick={handleUpdate}
              >
                Cập nhật
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
        </div>
      </Modal>
    </>
  );
};
export default ModalUpdateStakeholderManagement;
