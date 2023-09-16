import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import {
  faFilter,
  faEye,
  faPenToSquare,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./styleProjectManagement.css";
import { ProjectOutlined, UnorderedListOutlined } from "@ant-design/icons";
import {
  Button,
  Pagination,
  Table,
  Tooltip,
  Input,
  Select,
  Row,
  Col,
} from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import {
  GetProjectManagement,
  SetProjectManagement,
} from "../../../app/reducer/admin/project-management/projectManagementSlide.reducer";
import { ProjectManagementAPI } from "../../../api/admin/project-management/projectManagement.api";
import { CategoryProjectManagementAPI } from "../../../api/admin/project-management/categoryProjectManagement.api";
import ModalDetailProject from "../project-management/modal-detail/ModalDetailProject";
import ModalCreateProject from "../project-management/modal-create/ModalCreateProject";
import ModalUpdateProject from "../project-management/modal-update/ModalUpdateProject";
import LoadingIndicator from "../../../helper/loading";
import moment from "moment";
import { toast } from "react-toastify";

const { Option } = Select;
const ProjectManagement = () => {
  const dispatch = useAppDispatch();
  const [current, setCurrent] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [idProject, setIdProject] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [checkAdd, setCheckAdd] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [startTimeSearch, setStartTimeSearch] = useState(null);
  const [endTimeSearch, setEndTimeSearch] = useState(null);
  const [statusProjectSearch, setStatusProjectSearch] = useState("");
  const [idCategorySearch, setIdCategorySearch] = useState("");
  const [listCategorySearch, setListCategorySearch] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Quản lý dự án | Portal-Projects";
    featchData();
    return () => {
      dispatch(SetProjectManagement([]));
    };
  }, [current]);

  useEffect(() => {
    if (checkAdd) {
      featchData();
      setCheckAdd(false);
    }
  }, [checkAdd]);

  useEffect(() => {
    document.title = "Quản lý dự án | Portal-Projects";
    setCodeSearch("");
    setNameSearch("");
    setStartTimeSearch("");
    setEndTimeSearch("");
    setStatusProjectSearch("");
    setIdCategorySearch("");
    fetchDataSearch();
  }, []);

  const fetchDataSearch = async () => {
    const responeGetAllCategory =
      await CategoryProjectManagementAPI.fetchAllCategory();
    setListCategorySearch(responeGetAllCategory.data.data);
  };

  const featchData = async () => {
    try {
      setLoading(true);
      let filter = {
        code: codeSearch,
        name: nameSearch,
        startTime:
          startTimeSearch != null &&
          startTimeSearch !== "null" &&
          startTimeSearch !== "undefined"
            ? moment(startTimeSearch, moment.ISO_8601).format("YYYY-MM-DD")
            : null,
        endTime:
          endTimeSearch != null &&
          endTimeSearch !== "null" &&
          endTimeSearch !== "undefined"
            ? moment(endTimeSearch, moment.ISO_8601).format("YYYY-MM-DD")
            : null,
        statusProject: statusProjectSearch,
        idCategory: idCategorySearch,
        page: current,
        size: 5,
      };
      await ProjectManagementAPI.featchAll(filter).then(async (response) => {
        setDataTable(response.data.data.data);
        setTotalPages(parseInt(response.data.data.totalPages));
        dispatch(SetProjectManagement(response.data.data.data));
        setLoading(false);
      });
    } catch (error) {
      alert("Lỗi hệ thống, vui lòng F5 lại trang");
    }
  };

  const handleSearch = async () => {
    setCurrent(1);
    try {
      setLoading(true);
      let filter = {
        code: codeSearch,
        name: nameSearch,
        startTime:
          startTimeSearch != null &&
          startTimeSearch !== "null" &&
          startTimeSearch !== "undefined"
            ? moment(startTimeSearch, moment.ISO_8601).format("YYYY-MM-DD")
            : null,
        endTime:
          endTimeSearch != null &&
          endTimeSearch !== "null" &&
          endTimeSearch !== "undefined"
            ? moment(endTimeSearch, moment.ISO_8601).format("YYYY-MM-DD")
            : null,
        statusProject: statusProjectSearch,
        idCategory: idCategorySearch,
        page: current,
        size: 5,
      };

      const response = await ProjectManagementAPI.featchAll(filter);
      const responseData = response.data.data;
      setDataTable(responseData.data);
      setTotalPages(parseInt(responseData.totalPages));
      dispatch(SetProjectManagement(responseData.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Lỗi hệ thống, vui lòng F5 lại trang");
    }
  };

  const handleClear = async () => {
    setCodeSearch("");
    setNameSearch("");
    setStartTimeSearch("");
    setEndTimeSearch("");
    setStatusProjectSearch("");
    setIdCategorySearch("");
    setCurrent(1);
    await featchData();
    toast.success("Hủy bỏ bộ lọc thành công !");
  };

  const handleCancelModalCreateSusscess = () => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setCheckAdd(true);
  };
  const handleCancelModalCreateFaild = () => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowCreateModal(false);
    setShowUpdateModal(false);
    setCheckAdd(false);
  };
  const handleCancelCreate = {
    handleCancelModalCreateSusscess,
    handleCancelModalCreateFaild,
  };

  const handleUpdateProject = (id) => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowUpdateModal(true);
    setIdProject(id);
  };

  const handleDetailProject = async (id) => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowDetailModal(true);
    setIdProject(id);
  };

  const handleModalDetailCancel = () => {
    document.querySelector("body").style.overflowX = "hidden";
    setIdProject("");
    setShowDetailModal(false);
  };

  const data = useAppSelector(GetProjectManagement);
  const startIndex = (current - 1) * 5;
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      sorter: (a, b) => a.stt - b.stt,
      render: (text, record, index) => startIndex + (index + 1),
      width: "20px",
    },

    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
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
      title: "Thể loại",
      dataIndex: "nameCategorys",
      key: "nameCategorys",
      width: "17%",
    },
    {
      title: "Tiến độ",
      dataIndex: "progress",
      key: "progress",
      sorter: (a, b) => a.progress - b.progress,
      render: (text, record) => {
        return <span>{record.progress}%</span>;
      },
      width: "9%",
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
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <>
          <div>
            <Tooltip title="Xem chi tiết dự án">
              <FontAwesomeIcon
                icon={faEye}
                className="icon"
                style={{ paddingRight: 8 }}
                onClick={() => {
                  handleDetailProject(record.id);
                }}
              />
            </Tooltip>
            <Tooltip title="Cập nhật">
              <FontAwesomeIcon
                className="icon"
                icon={faPenToSquare}
                onClick={() => {
                  handleUpdateProject(record.id);
                }}
              />
            </Tooltip>
          </div>
        </>
      ),
      width: "105px",
    },
  ];

  return (
    <div className="project_management">
      {loading && <LoadingIndicator />}{" "}
      <div className="title_project_management_box">
        {" "}
        <ProjectOutlined style={{ fontSize: "26px" }} />
        <span style={{ marginLeft: "10px" }}>Quản lý dự án</span>
      </div>
      <div className="filter_project_management">
        <FontAwesomeIcon
          icon={faFilter}
          size="2px"
          style={{ fontSize: "26px" }}
        />{" "}
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Bộ lọc</span>
        <hr />
        <Row gutter={16} style={{ marginBottom: "15px", paddingTop: "20px" }}>
          <Col span={8}>
            <span>Mã:</span>{" "}
            <Input
              type="text"
              value={codeSearch}
              onChange={(e) => {
                setCodeSearch(e.target.value);
              }}
            />
          </Col>
          <Col span={8}>
            <span>Tên:</span>
            <Input
              type="text"
              value={nameSearch}
              onChange={(e) => {
                setNameSearch(e.target.value);
              }}
            />
          </Col>
          <Col span={8}>
            <span>Thể loại:</span>
            {""}
            <Select
              value={idCategorySearch}
              onChange={(value) => {
                setIdCategorySearch(value);
              }}
              style={{ width: "100%", marginRight: "10px" }}
            >
              <Option value="">Tất cả</Option>
              {listCategorySearch.map((item) => {
                return <Option value={item.id}>{item.name}</Option>;
              })}
            </Select>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginBottom: "15px" }}>
          <Col span={8}>
            <span>Thời gian bắt đầu:</span>
            {""}
            <Input
              value={startTimeSearch}
              onChange={(e) => {
                setStartTimeSearch(e.target.value);
              }}
              type="date"
            />
          </Col>
          <Col span={8}>
            <span>Thời gian kết thúc:</span> {""}
            <Input
              value={endTimeSearch}
              onChange={(e) => {
                setEndTimeSearch(e.target.value);
              }}
              type="date"
            />
          </Col>
          <Col span={8}>
            <span>Trạng thái:</span>
            {""}
            <Select
              value={statusProjectSearch}
              onChange={(value) => {
                setStatusProjectSearch(value);
              }}
              style={{
                width: "100%",
                fontSize: "13px",
              }}
            >
              <Option
                value=""
                style={{
                  backgroundColor: "#DB6C6C",
                  fontSize: "13px",
                  color: "white",
                }}
              >
                Tất cả
              </Option>
              <Option
                value="0"
                style={{
                  backgroundColor: "rgb(45, 211, 86)",
                  fontSize: "13px",
                  color: "white",
                }}
              >
                Đã diễn ra
              </Option>
              <Option
                value="1"
                style={{
                  backgroundColor: "rgb(41, 157, 224)",
                  fontSize: "13px",
                  color: "white",
                }}
              >
                Đang diễn ra
              </Option>
              <Option
                value="2"
                style={{
                  backgroundColor: "rgb(238, 162, 48)",
                  fontSize: "13px",
                  color: "white",
                }}
              >
                Chưa diễn ra
              </Option>
            </Select>
          </Col>
        </Row>
        <div className="box_btn_filter">
          <Button className="btn_filter" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button className="btn_clear" onClick={handleClear}>
            Làm mới bộ lọc
          </Button>
        </div>
      </div>
      <div className="table_project_management">
        <div className="title_project_management">
          <div>
            {" "}
            <span style={{ fontSize: "18px", fontWeight: "500" }}>
              {" "}
              <ProjectOutlined
                style={{ marginRight: "7px", fontSize: "26px" }}
              />
              Danh sách dự án
            </span>
          </div>
          <div>
            <Button
              style={{
                color: "white",
                backgroundColor: "rgb(55, 137, 220)",
              }}
              onClick={() => {
                setShowCreateModal(true);
              }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                size="1x"
                style={{
                  backgroundColor: "rgb(55, 137, 220)",
                  paddingRight: "8px",
                }}
              />{" "}
              Thêm dự án
            </Button>
          </div>
        </div>
        <div>
          <Table
            dataSource={data}
            rowKey="id"
            columns={columns}
            pagination={false}
            className="table_project_management"
          />
          <div className="pagination_box">
            <Pagination
              simple
              current={current}
              onChange={(value) => {
                setCurrent(value);
              }}
              total={totalPages * 10}
            />
          </div>
        </div>
        <ModalDetailProject
          visible={showDetailModal}
          onCancel={handleModalDetailCancel}
          idProject={idProject}
        />
        <ModalCreateProject
          visible={showCreateModal}
          onCancel={handleCancelCreate}
        />
        <ModalUpdateProject
          visible={showUpdateModal}
          onCancel={handleCancelCreate}
          idProject={idProject}
        />
      </div>
    </div>
  );
};

export default ProjectManagement;
