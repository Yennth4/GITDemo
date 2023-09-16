import { Modal, Row, Col, Input, Table, Image, Pagination, Spin } from "antd";
import "./styleModalDetailProject.css";
import { useEffect, useState } from "react";
import { ProjectManagementAPI } from "../../../../api/admin/project-management/projectManagement.api";
import moment from "moment";
import { MemberProjectManagementAPI } from "../../../../api/admin/project-management/memberProjectManagement.api";
import { CategoryProjectManagementAPI } from "../../../../api/admin/project-management/categoryProjectManagement.api";
import { CommonAPI } from "../../../../api/commonAPI";

const { TextArea } = Input;

const ModalDetailProject = ({ visible, onCancel, idProject }) => {
  const [project, setProject] = useState({});
  const [listData, setListData] = useState([]);
  const [listCategoryProjects, setListCategoryProjects] = useState("");
  const [listMemberAll, setListMemberAll] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchListMemberAll();
  }, []);

  useEffect(() => {
    if (idProject !== null && idProject !== "" && visible === true) {
      setListData([]);
      fetchData();
    }
  }, [visible, idProject, onCancel]);

  const fetchListMemberAll = async () => {
    const responeListMemberAll = await CommonAPI.fetchAll();
    setListMemberAll(responeListMemberAll.data);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await ProjectManagementAPI.detail(idProject).then((response) => {
        setProject(response.data.data);
      });
      const responeListCategoryProject =
        await CategoryProjectManagementAPI.fetchCategoryWithIdProject(
          idProject
        );
      let arrayCategory = "";
      let checkCategory = 0;
      await responeListCategoryProject.data.data.map((data) => {
        checkCategory = ++checkCategory;
        if (checkCategory > 1) {
          arrayCategory =
            arrayCategory + ", " + data.nameCategory.toLowerCase();
        } else {
          arrayCategory = data.nameCategory;
        }
        setListCategoryProjects(arrayCategory);
      });

      const responeListMemberProject =
        await MemberProjectManagementAPI.fetchAll(idProject);
      const listMemberProject = await responeListMemberProject.data.data;

      const listMemberJoin = listMemberAll
        .filter((obj1) =>
          listMemberProject.some((obj2) => obj2.memberId === obj1.id)
        )
        .map((obj1) => {
          const matchedItem = listMemberProject.find(
            (obj2) => obj2.memberId === obj1.id
          );
          return {
            ...obj1,
            memberId: matchedItem.memberId,
            roleProject: parseInt(matchedItem.role),
            projectId: matchedItem.projectId,
            statusWork: parseInt(matchedItem.status),
          };
        });

      setListData(listMemberJoin);

      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      alert("Lỗi hệ thống, vui lòng ấn F5 để tải lại trang");
    }
  };

  const setStt = (current) => {
    return current;
  };
  const data = listData;
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 50,
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Thành viên",
      dataIndex: "name",
      key: "name",
      width: 400,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => {
        return (
          <div>
            <Image.PreviewGroup>
              <Image
                src={record.image}
                alt="Avatar"
                width={25}
                height={25}
                marginRight={-5}
                className="avatarMember"
              />
            </Image.PreviewGroup>
            <span style={{ paddingLeft: "8px" }}>{record.name}</span>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 280,
    },
    {
      title: "Vai trò",
      dataIndex: "roleProject",
      key: "roleProject",
      render: (text, record) => {
        switch (record.roleProject) {
          case 0:
            return "Quản lý";
          case 1:
            return "Trưởng nhóm";
          case 2:
            return "Dev";
          default:
            return "Tester";
        }
      },
      width: 150,
    },
  ];
  const rowTable = "row_table";
  return (
    <Modal
      onCancel={onCancel}
      visible={visible}
      width={750}
      footer={null}
      className="modal_project_show_detail"
    >
      <div style={{ paddingTop: "0", borderBottom: "1px solid black" }}>
        <span style={{ fontSize: "18px" }}>Chi tiết dự án</span>
      </div>
      <div style={{ marginTop: "15px" }}>
        <Row gutter={16} style={{ marginBottom: "15px" }}>
          <Col span={12}>
            <span>Mã dự án:</span> <br />
            <Input value={project.code} type="text" readOnly />
          </Col>
          <Col span={12}>
            <span>Tên dự án:</span> <br />
            <Input type="text" value={project.name} readOnly />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: "15px" }}>
          <Col span={24}>
            <span>Thể loại:</span>
            <Input type="text" value={listCategoryProjects} readOnly />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: "15px" }}>
          <Col span={12}>
            <span>Thời gian bắt đầu:</span> <br />
            <Input
              value={moment(project.startTime).format("YYYY-MM-DD")}
              type="date"
              readOnly
            />
          </Col>
          <Col span={12}>
            <span>Thời gian kết thúc:</span> <br />
            <Input
              value={moment(project.endTime).utcOffset(7).format("YYYY-MM-DD")}
              type="date"
              readOnly
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: "15px" }}>
          <Col span={12}>
            <span>Tiến độ: {project.progress + "%"}</span> <br />
            <div className="progress-block">
              <div
                className="progress-bar"
                style={{ width: project.progress + "%" }}
              ></div>
            </div>
          </Col>
          <Col span={12}>
            <span>Trạng thái:</span> <br />
            <Input
              value={
                project.statusProject === "DA_DIEN_RA"
                  ? "Đã diễn ra"
                  : project.statusProject === "DANG_DIEN_RA"
                  ? "Đang diễn ra"
                  : "Chưa diễn ra"
              }
              readOnly
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: "15px" }}>
          <Col span={24}>
            <span>Mô tả:</span> <br />
            <TextArea rows={2} value={project.descriptions} readOnly />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <span>Thành viên:</span>
          </Col>
        </Row>
        <Row>
          {loading ? (
            <div className="loading-overlay">
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={data.map((item, index) => ({
                ...item,
                stt: setStt(index + 1),
              }))}
              rowKey="id"
              columns={columns}
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                size: "small",
              }}
              rowClassName={rowTable}
              className="table_modal_project_management"
            />
          )}
        </Row>
      </div>
    </Modal>
  );
};

export default ModalDetailProject;
