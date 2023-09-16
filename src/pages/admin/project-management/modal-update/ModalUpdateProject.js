import {
  Modal,
  Row,
  Col,
  Input,
  Button,
  Select,
  Tooltip,
  Space,
  Image,
  Table,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import moment from "moment";
import "./styleModalUpdateProject.css";
import { useAppDispatch, useAppSelector } from "../../../../app/hook";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CommonAPI } from "../../../../api/commonAPI";
import { CategoryProjectManagementAPI } from "../../../../api/admin/project-management/categoryProjectManagement.api";
import { ProjectManagementAPI } from "../../../../api/admin/project-management/projectManagement.api";
import { MemberProjectManagementAPI } from "../../../../api/admin/project-management/memberProjectManagement.api";
import { UpdateProject } from "../../../../app/reducer/admin/project-management/projectManagementSlide.reducer";
import {
  SetCategoryProject,
  GetCategoryProject,
} from "../../../../app/reducer/admin/category-project-management/categoryProjectManagement.reduce";
import {
  SetMemberProject,
  GetMemberProject,
} from "../../../../app/reducer/admin/member-project-management/memberProjectManagement.reduce";
import { SearchOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;
const ModalUpdateProject = ({ visible, onCancel, idProject }) => {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [errorStartTime, setErrorStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorEndTime, setErrorEndTime] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [errorDescriptions, setErrorDescriptions] = useState("");
  const [errorMembers, setErrorMembers] = useState("");
  const [errorCategorys, setErrorCategorys] = useState("");
  const [listCategorys, setListCategorys] = useState([]); //getAll
  const [listCategoryChange, setListCategoryChange] = useState([]); //change
  const [listCategoryProjects, setListCategoryProjects] = useState([]); // add
  const [listCategoryNotJoin, setListCategoryNotJoin] = useState([]);
  const [listCategoryJoin, setListCategoryJoin] = useState([]);
  const [listMember, setListMembers] = useState([]); //getAll
  const [listMemberChange, setListMemberChange] = useState([]); //change
  const [listMemberProjects, setListMemberProjects] = useState([]); //add
  const [listMemberNotJoin, setListMemberNotJoin] = useState([]);
  const [listMemberJoin, setListMemberJoin] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listUpdateMember, setListUpdateMember] = useState([]); // listMemberAll update
  useEffect(() => {
    if (idProject !== null && idProject !== "" && visible === true) {
      setListCategoryChange([]);
      setListMemberChange([]);
      setListUpdateMember([]);
      setListMemberProjects([]);
      fetchData();
    }
  }, [idProject, visible]);

  useEffect(() => {
    featChMultiSelect();
  }, []);

  useEffect(() => {
    if (visible) {
      featMemberAndCaregoryAddProject();
    }
  }, [listCategoryChange, listMemberChange]);

  const cancelUpdateSuccess = () => {
    onCancel.handleCancelModalCreateSusscess();
  };
  const cancelUpdateFaild = () => {
    onCancel.handleCancelModalCreateFaild();
  };

  const handleChangeMembers = (idMember) => {
    setListMemberChange(idMember);
  };
  const handleChangeCategorys = (idCategory) => {
    setListCategoryChange(idCategory);
  };

  const featChMultiSelect = async () => {
    try {
      await CommonAPI.fetchAll().then((respone) => {
        setListMembers(respone.data);
      });
      await CategoryProjectManagementAPI.fetchAllCategory().then((respone) => {
        setListCategorys(respone.data.data);
      });
    } catch (error) {
      alert("Vui lòng load lại trang");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await ProjectManagementAPI.detail(idProject).then((response) => {
        let obj = response.data.data;
        setCode(obj.code);
        setName(obj.name);
        setStartTime(obj.startTime);
        setEndTime(obj.endTime);
        setDescriptions(obj.descriptions);
      });
      const responeListCategoryProject =
        await CategoryProjectManagementAPI.fetchCategoryWithIdProject(
          idProject
        );
      const listCategoryProject = responeListCategoryProject.data.data;
      const listCategoryJoin = listCategorys
        .filter((obj1) =>
          listCategoryProject.some((obj2) => obj2.idCategory === obj1.id)
        )
        .map((obj1) => {
          const matchedItem = listCategoryProject.find(
            (obj2) => obj2.idCategory === obj1.id
          );
          return { ...obj1, ...matchedItem };
        });
      setListCategoryJoin(listCategoryJoin);
      dispatch(SetCategoryProject(listCategoryJoin));
      const listCategoryNotJoin = await listCategorys.filter((obj1) => {
        return !listCategoryJoin.some((obj2) => obj2.idCategory === obj1.id);
      });
      setListCategoryNotJoin(listCategoryNotJoin);

      const responeListMemberProject =
        await MemberProjectManagementAPI.fetchAll(idProject);
      const listMemberProject = await responeListMemberProject.data.data;
      const listMemberJoin = listMember
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
            role: matchedItem.role,
            projectId: matchedItem.projectId,
            statusWork: matchedItem.status,
          };
        });
      setListMemberJoin(listMemberJoin);
      dispatch(SetMemberProject(listMemberJoin));
      const listMemberNotJoin = listMember.filter((obj1) => {
        return !listMemberJoin.some((obj2) => obj2.memberId === obj1.id);
      });
      setListMemberNotJoin(
        listMemberNotJoin.map((obj) => {
          return obj;
        })
      );
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      alert("Lỗi hệ thống, vui lòng ấn F5 để tải lại trang");
    }
  };

  const featMemberAndCaregoryAddProject = async () => {
    try {
      const listMemberJoinCreate = await listMember
        .filter((obj1) => listMemberChange.some((obj2) => obj1.id === obj2))
        .map((obj1) => {
          const matchedItem = listMemberChange.find(
            (obj2) => obj2.id === obj1.id
          );
          return {
            ...obj1,
            memberId: matchedItem,
            role: "0",
            projectId: idProject,
            statusWork: "0",
          };
        });
      const listMemberAdd = listMemberJoinCreate.map((member) => {
        return {
          memberId: member.id,
          email: member.email,
          role: "0",
          statusWork: member.statusWork,
          code: member.code,
          name: member.name,
          image: member.image,
          username: member.username,
          id: member.id,
        };
      });
      setListUpdateMember(listMemberAdd);
      setListMemberProjects(listMemberAdd);
      setListCategoryProjects(listCategoryChange);
    } catch (error) {
      alert("Hệ thống lỗi, vui lòng F5 lại trang");
    }
  };

  const handleRoleChange = (id, value) => {
    let listFindUpdateRole = [...listMemberJoin, ...listUpdateMember];
    let updatedListInfo = listFindUpdateRole.map((record) => {
      if (record.memberId === id) {
        let newData = {
          memberId: record.memberId,
          email: record.email,
          role: value,
          statusWork: record.statusWork,
          code: record.code,
          name: record.name,
          image: record.image,
        };
        return { ...record, ...newData };
      }
      return record;
    });
    setListUpdateMember(updatedListInfo);
  };

  const update = () => {
    let check = 0;
    if (code === "") {
      setErrorCode("Mã không được để trống");
      check++;
    } else {
      setErrorCode("");
    }
    if (name === "") {
      setErrorName("Tên không được để trống");
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
      setErrorStartTime("");
    }
    if (descriptions.trim === "") {
      setErrorDescriptions("Mô tả không được để trống");
      check++;
    } else {
      if (descriptions.length > 1000) {
        setErrorDescriptions("Mô tả không vượt quá 1000 ký tự");
        check++;
      } else {
        setErrorStartTime("");
      }
    }
    if (check === 0) {
      featMemberAndCaregoryAddProject();
      let projectNew = {
        code: code,
        name: name,
        descriptions: descriptions,
        startTime: moment(startTime).valueOf(),
        endTime: moment(endTime).valueOf(),
        listMembers: listUpdateMember,
        listCategorysId: listCategoryChange,
      };
      ProjectManagementAPI.updateProject(projectNew, idProject).then(
        (respone) => {
          toast.success("Cập nhật thành công !");
          let data = respone.data.data;
          dispatch(UpdateProject(data));
          cancelUpdateSuccess();
        },
        (error) => {
          toast.error(error.response.data.message);
        }
      );
    }
  };

  const setStt = (current) => {
    return current;
  };
  const dataCategorys = useAppSelector(GetCategoryProject);
  const columnDataCategory = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: "20%",
    },
    { title: "Tên", dataIndex: "name", key: "name", width: "60%" },
  ];

  const dataMembers = useAppSelector(GetMemberProject);

  const columnDataMembers = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 20,
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 10,
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Thành viên",
      dataIndex: "name",
      key: "name",
      width: "100%",
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
      dataIndex: "role",
      key: "role",
      render: (text, record) => (
        <Select
          style={{ width: "100%" }}
          defaultValue={`${text}`}
          onChange={(value) => handleRoleChange(record.memberId, value)}
        >
          <Option value="0">Quản lý</Option>
          <Option value="1">Trưởng nhóm</Option>
          <Option value="2">Dev</Option>
          <Option value="3">Tester</Option>
        </Select>
      ),
      width: "13%",
    },
  ];

  const columnsMemberAdd = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => index + 1,
      width: "7%",
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
      width: "40%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={confirm}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            className="btn_search_member"
            onClick={confirm}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Tìm
          </Button>
          <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
            Đặt lại
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.email.toLowerCase().includes(value.toLowerCase()),
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: "10%",
      render: (text, record) => (
        <Select
          style={{ width: "100%" }}
          defaultValue={`0`}
          onChange={(value) => handleRoleChange(record.memberId, value)}
        >
          <Option value="0">Quản lý</Option>
          <Option value="1">Trưởng nhóm</Option>
          <Option value="2">Dev</Option>
          <Option value="3">Tester</Option>
        </Select>
      ),
    },
  ];

  return (
    <>
      <Modal
        visible={visible}
        onCancel={cancelUpdateFaild}
        width={750}
        footer={null}
        className="modal_show_detail"
      >
        {" "}
        <div style={{ paddingTop: "0", borderBottom: "1px solid black" }}>
          <span style={{ fontSize: "18px" }}>Cập nhật dự án</span>
        </div>
        <div style={{ marginTop: "15px", borderBottom: "1px solid black" }}>
          <Row gutter={16} style={{ marginBottom: "15px" }}>
            <Col span={12}>
              <span>
                <span className="notBlank">*</span>
                Mã dự án:
              </span>{" "}
              <br />
              <Input
                placeholder="Nhập mã"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
                type="text"
              />
              <span className="error">{errorCode}</span>
            </Col>
            <Col span={12}>
              <span>
                {" "}
                <span className="notBlank">*</span>Tên dự án:
              </span>{" "}
              <br />
              <Input
                placeholder="Nhập tên"
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
              <span>
                {" "}
                <span className="notBlank">*</span>Thời gian bắt đầu:
              </span>{" "}
              <br />
              <Input
                value={moment(startTime).format("YYYY-MM-DD")}
                onChange={(e) => {
                  setStartTime(e.target.value);
                }}
                type="date"
              />
              <span className="error">{errorStartTime}</span>
            </Col>
            <Col span={12}>
              {" "}
              <span className="notBlank">*</span>
              <span>Thời gian kết thúc:</span> <br />
              <Input
                value={moment(endTime).format("YYYY-MM-DD")}
                onChange={(e) => {
                  setEndTime(e.target.value);
                }}
                type="date"
              />
              <span className="error">{errorEndTime}</span>
            </Col>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <div style={{ width: "100%" }}>
              <span>Thể loại:</span>
              {listCategoryNotJoin.length > 0 ? (
                <Select
                  mode="multiple"
                  placeholder="Thêm thể loại"
                  dropdownMatchSelectWidth={false}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  value={listCategoryChange}
                  onChange={handleChangeCategorys}
                  optionLabelProp="label"
                  defaultValue={[]}
                  filterOption={(text, option) =>
                    option.label.toLowerCase().indexOf(text.toLowerCase()) !==
                    -1
                  }
                >
                  {listCategoryNotJoin.map((record) => (
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
                <span> Đã có tất cả thể loại</span>
              )}
              <Table
                dataSource={dataCategorys.map((item, index) => ({
                  ...item,
                  stt: setStt(index + 1),
                }))}
                rowKey="id"
                columns={columnDataCategory}
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                  size: "small",
                }}
                className="table_category_update"
              />
              <span
                className="error"
                style={{ display: "block", marginTop: "2px" }}
              >
                {errorCategorys}
              </span>
            </div>
          </Row>
          <Row style={{ marginBottom: "15px" }}>
            <span style={{ fontSize: "16px", fontWeight: 500 }}>
              Danh sách thành viên đang tham gia dự án:
            </span>

            {loading ? (
              <div className="loading-overlay">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                dataSource={dataMembers.map((item, index) => ({
                  ...item,
                  stt: setStt(index + 1),
                }))}
                rowKey="id"
                columns={columnDataMembers}
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                  size: "small",
                }}
                className="table_member_update"
              />
            )}
            <span
              className="error"
              style={{ display: "block", marginTop: "2px" }}
            >
              {errorMembers}
            </span>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <div style={{ width: "100%" }}>
              {" "}
              {listMemberNotJoin.length > 0 ? (
                <Select
                  mode="multiple"
                  placeholder="Thêm thành viên"
                  dropdownMatchSelectWidth={false}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  value={listMemberChange}
                  onChange={handleChangeMembers}
                  optionLabelProp="label"
                  defaultValue={[]}
                  filterOption={(text, option) =>
                    option.label.toLowerCase().indexOf(text.toLowerCase()) !==
                    -1
                  }
                >
                  {listMemberNotJoin.map((member) => (
                    <Option
                      label={member.email}
                      value={member.id}
                      key={member.id}
                    >
                      <Tooltip title={member.email}>
                        <Space>
                          <Image.PreviewGroup>
                            <Image
                              src={member.image}
                              alt="Avatar"
                              width={25}
                              height={25}
                              className="avatarMember"
                            />
                          </Image.PreviewGroup>
                          {member.name +
                            " " +
                            member.code +
                            " (" +
                            member.email +
                            ")"}
                          {}
                        </Space>
                      </Tooltip>
                    </Option>
                  ))}
                </Select>
              ) : (
                <span> Tất cả thành viên đã tham gia dự án</span>
              )}
            </div>
          </Row>{" "}
          {listMemberProjects.length > 0 && (
            <Row>
              {" "}
              <Col span={24}>
                <Table
                  className="table-member-management"
                  columns={columnsMemberAdd}
                  dataSource={listMemberProjects}
                  rowKey="id"
                />
              </Col>{" "}
            </Row>
          )}
          <Row gutter={16} style={{ marginBottom: "20px" }}>
            {" "}
            <Col span={24}>
              <span className="notBlank">*</span>
              <span>Mô tả:</span> <br />
              <TextArea
                placeholder="Nhập mô tả"
                rows={2}
                value={descriptions}
                onChange={(e) => {
                  setDescriptions(e.target.value);
                }}
              />
              <span className="error">{errorDescriptions}</span>
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
              onClick={update}
            >
              Cập nhật
            </Button>
            <Button
              style={{
                backgroundColor: "red",
                color: "white",
              }}
              onClick={cancelUpdateFaild}
            >
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateProject;
