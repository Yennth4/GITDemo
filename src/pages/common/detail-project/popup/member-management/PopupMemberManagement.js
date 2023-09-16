import "./stylePopupMemberManagement.css";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faFilter,
  faPencilAlt,
  faPencilRuler,
  faPencilSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "../../../../../app/hook";
import { GetMemberProject } from "../../../../../app/reducer/detail-project/DPMemberProject.reducer";
import { Button, Col, Input, Row, Select, Table } from "antd";
import Image from "../../../../../helper/img/Image";
import { SearchOutlined } from "@ant-design/icons";
import { CommonAPI } from "../../../../../api/commonAPI";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { getStompClient } from "../../stomp-client-config/StompClientManager";

const { Option } = Select;

const PopupMemberManagement = ({ position, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !popupRef.current.contains(event.target) &&
        !event.target.className.includes("btn_search_member") &&
        !event.target.className.includes("ant") &&
        !event.target.tagName.includes("SPAN") &&
        !event.target.className.includes("image_common") &&
        !event.target.className.includes("div_option_member_management")
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  const popupStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999999999,
    paddingBottom: "7px",
    width: "68%",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999999998,
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: "23%",
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
        record.name.toLowerCase().includes(value.toLowerCase()),
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image
            url={record.image}
            picxel={30}
            marginRight={8}
            name={record.name + " " + record.code}
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Mã số",
      dataIndex: "code",
      key: "code",
      width: "10%",
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
        record.code.toLowerCase().includes(value.toLowerCase()),
      sorter: (a, b) => a.code.localeCompare(b.code),
      sortDirections: ["ascend", "descend"],
      render: (text) => text,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "25%",
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
      width: "12%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Tìm kiếm"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            onPressEnter={confirm}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          >
            <Option value="0">Quản lý</Option>
            <Option value="1">Trưởng nhóm</Option>
            <Option value="2">Dev</Option>
            <Option value="3">Tester</Option>
          </Select>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={confirm}
              size="small"
              style={{ marginRight: 8 }}
            >
              Tìm
            </Button>
            <Button onClick={clearFilters} size="small">
              Đặt lại
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => record.role === value,
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <Select
          style={{ width: "100%" }}
          value={record.role}
          onChange={(value) => handleRoleChange(record, value)}
        >
          <Option value="0">Quản lý</Option>
          <Option value="1">Trưởng nhóm</Option>
          <Option value="2">Dev</Option>
          <Option value="3">Tester</Option>
        </Select>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "statusWork",
      key: "statusWork",
      width: "12%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Tìm kiếm"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            onPressEnter={confirm}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          >
            <Option value="0">Đang làm</Option>
            <Option value="1">Nghỉ việc</Option>
          </Select>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={confirm}
              size="small"
              style={{ marginRight: 8 }}
            >
              Tìm
            </Button>
            <Button onClick={clearFilters} size="small">
              Đặt lại
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => record.statusWork === value,
      sorter: (a, b) => a.statusWork.localeCompare(b.statusWork),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <Select
          style={{ width: "100%" }}
          value={record.statusWork}
          onChange={(value) => handleStatusChange(record, value)}
        >
          <Option value="0">Đang làm</Option>
          <Option value="1">Nghỉ việc</Option>
        </Select>
      ),
    },
  ];

  const [valueMultiMember, setValueMultiMember] = useState([]);
  const [memberAll, setMemberAll] = useState([]);
  const memberProject = useAppSelector(GetMemberProject);
  const [listMemberNoJoinProject, setListMemberNoJoinProject] = useState([]);
  const [listMemberAdd, setListMemberAdd] = useState([]);

  const handleRoleChange = (item, value) => {
    let obj = {
      idMember: item.id,
      idProject: detailProject.id,
      statusWork: parseInt(item.statusWork),
      role: parseInt(value),
    };

    console.log(obj);

    stompClient.send(
      "/action/update-member-project/" + detailProject.id,
      {},
      JSON.stringify(obj)
    );
  };

  const handleStatusChange = (item, value) => {
    let obj = {
      idMember: item.id,
      idProject: detailProject.id,
      statusWork: parseInt(value),
      role: parseInt(item.role),
    };

    stompClient.send(
      "/action/update-member-project/" + detailProject.id,
      {},
      JSON.stringify(obj)
    );
  };

  const handleChangeValueMultiMember = (e) => {
    setValueMultiMember(e);
  };

  const loadDataMemberAll = () => {
    CommonAPI.fetchAll().then((response) => {
      setMemberAll(response.data);
      fetchListMemberNoJoinProject(response.data);
    });
  };

  useEffect(() => {
    loadDataMemberAll();
  }, []);

  const fetchListMemberNoJoinProject = (allMember) => {
    const memberProjectIds = memberProject.map((member) => member.id);

    const membersNotInProject = allMember.filter(
      (member) => !memberProjectIds.includes(member.id)
    );
    setListMemberNoJoinProject(membersNotInProject);
  };

  const detailProject = useAppSelector(GetProject);

  const fetchLoadListMemberAdd = () => {
    const listData = memberAll
      .filter((member) => valueMultiMember.includes(member.id))
      .map((member) => ({
        memberId: member.id,
        email: member.email,
        projectId: detailProject.id,
        role: 0,
      }));

    setListMemberAdd(listData);
  };

  useEffect(() => {
    fetchLoadListMemberAdd();
  }, [valueMultiMember]);

  const columnsTableAddMember = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, record, index) => index + 1,
      width: "7%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "25%",
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
      width: "12%",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Tìm kiếm"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [value] : [])}
            onPressEnter={confirm}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          >
            <Option value="0">Quản lý</Option>
            <Option value="1">Trưởng nhóm</Option>
            <Option value="2">Dev</Option>
            <Option value="3">Tester</Option>
          </Select>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={confirm}
              size="small"
              style={{ marginRight: 8 }}
            >
              Tìm
            </Button>
            <Button onClick={clearFilters} size="small">
              Đặt lại
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) => record.role === value,
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortDirections: ["ascend", "descend"],
      render: (text, record) => (
        <Select
          style={{ width: "100%" }}
          value={record.role + ""}
          onChange={(value) => handleRoleChangeAdd(record.memberId, value)}
        >
          <Option value="0">Quản lý</Option>
          <Option value="1">Trưởng nhóm</Option>
          <Option value="2">Dev</Option>
          <Option value="3">Tester</Option>
        </Select>
      ),
    },
  ];

  const handleRoleChangeAdd = (id, value) => {
    let updatedListInfo = listMemberAdd.map((record) => {
      if (record.memberId === id) {
        let newData = {
          memberId: record.memberId,
          email: record.email,
          projectId: detailProject.id,
          role: parseInt(value),
        };
        return { ...record, ...newData };
      }
      return record;
    });

    setListMemberAdd(updatedListInfo);
  };

  const stompClient = getStompClient();

  const handleClickAddMemberProject = () => {
    let obj = {
      listMemberProject: listMemberAdd,
    };
    stompClient.send(
      "/action/create-member-project/" + detailProject.id,
      {},
      JSON.stringify(obj)
    );
    onClose();
  };

  return (
    <div>
      <div style={overlayStyle} className="overlay"></div>
      <div
        ref={popupRef}
        style={popupStyle}
        className="popup-member-management"
      >
        {" "}
        <div className="header-member-management">
          {" "}
          <FontAwesomeIcon icon={faCogs} style={{ marginRight: "7px" }} />
          Quản lý thành viên trong dự án
        </div>
        <div
          style={{ padding: "10px", overflowY: "auto" }}
          className="box-member-management"
        >
          <div className="box_add_member">
            <span style={{ fontSize: "15px" }}>Thêm thành viên: </span> <br />
            <div style={{ display: "flex", alignItems: "center" }}>
              <Select
                value={valueMultiMember}
                onChange={handleChangeValueMultiMember}
                mode="multiple"
                placeholder="Chọn thành viên"
                style={{ width: "85%" }}
                filterOption={(input, option) => {
                  const name = option.children.props.children[1].toLowerCase();
                  const email = option.children.props.children[3].toLowerCase();
                  const inputValue = input.toLowerCase();

                  return (
                    name.includes(inputValue) || email.includes(inputValue)
                  );
                }}
              >
                {listMemberNoJoinProject.map((item) => (
                  <Option value={item.id} key={item.id}>
                    <div
                      className="div_option_member_management"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Image
                        picxel={28}
                        url={item.image}
                        marginRight={5}
                        key={item.id}
                      />
                      {item.name} ({item.email})
                    </div>
                  </Option>
                ))}
              </Select>
              <Button
                style={{ marginLeft: "15px" }}
                onClick={handleClickAddMemberProject}
              >
                Thêm thành viên
              </Button>
            </div>
          </div>
          {listMemberAdd.length > 0 && (
            <Row>
              {" "}
              <Col span={24}>
                <Table
                  className="table-member-management"
                  columns={columnsTableAddMember}
                  dataSource={listMemberAdd}
                  rowKey="memberId"
                />
              </Col>{" "}
            </Row>
          )}
          <div className="box-table">
            {" "}
            <div style={{ fontSize: "15px" }}>
              Danh sách thành viên đang tham gia dự án:{" "}
            </div>{" "}
            <br />
            <Table
              className="table-member-management"
              columns={columns}
              dataSource={memberProject}
              rowKey="id"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupMemberManagement;
