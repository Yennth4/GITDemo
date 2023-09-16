import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styleMyProject.css";
import {
  faFilter,
  faCogs,
  faEye,
  faCoffee,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Input, Pagination, Select, Space, Table, Tooltip } from "antd";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import {
  GetMyProject,
  SetMyProject,
} from "../../../app/reducer/my-project/myProjectSlice.reducer";
import { MyProjectAPI } from "../../../api/my-project/myProject.api";
import { useEffect, useState } from "react";
import { userCurrent } from "../../../helper/inForUser";
import { MemberProjectAPI } from "../../../api/my-project/memberProject.api";
import { CommonAPI } from "../../../api/commonAPI";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../../helper/loading";
import Image from "../../../helper/img/Image";
import { ProjectOutlined } from "@ant-design/icons";

const { Option } = Select;

const MyProject = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "Dự án của tôi | Portal-Projects";
    fetchData();

    return () => {
      dispatch(SetMyProject([]));
    };
  }, [current]);

  const fetchData = async () => {
    let filter = {
      idUser: userCurrent.id,
      nameProject: name,
      status: status === "" ? null : parseInt(status),
      page: current - 1,
    };
    setIsLoading(true);
    try {
      const response = await MyProjectAPI.fetchAll(filter);
      let listProject = response.data.data.data;

      const responMemberAPI = await CommonAPI.fetchAll();
      const listMemberAPI = responMemberAPI.data;

      const memberPromises = listProject.map((item) => {
        return MemberProjectAPI.fetchAll(item.id).then((resMP) => {
          let listMemberProject = resMP.data.data;
          const memberPromises = listMemberProject.map((lmp) => {
            const member = listMemberAPI.find((m) => m.id === lmp.memberId);
            if (member) {
              let obj = { ...member };
              obj.statusWork = lmp.statusWork;
              obj.role = lmp.role;
              return obj;
            }
            return null;
          });

          return Promise.all(memberPromises).then((members) => {
            item.listMember = members.filter((m) => m !== null);
          });
        });
      });

      await Promise.all(memberPromises);

      dispatch(SetMyProject(listProject));
      setTotal(response.data.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      alert("Lỗi hệ thống, vui lòng ấn F5 để tải lại trang");
    }
  };

  const search = () => {
    fetchData();
  };

  const clear = () => {
    setName("");
    setStatus("");
  };

  const data = useAppSelector(GetMyProject);

  const columns = [
    {
      title: "Tên dự án",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => {
        if (record.backgroundImage) {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={record.backgroundImage}
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
                style={{ backgroundColor: record.backgroundColor }}
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
      width: "15%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status - b.status,
      render: (text) => {
        let statusText = "";
        if (text === 0) {
          statusText = "Đã diễn ra";
          return (
            <span
              className="box_span_status"
              style={{ backgroundColor: "rgb(45, 211, 86)", fontSize: "13px" }}
            >
              {statusText}
            </span>
          );
        } else if (text === 1) {
          statusText = "Đang diễn ra";
          return (
            <span
              className="box_span_status"
              style={{ backgroundColor: "rgb(41, 157, 224)", fontSize: "13px" }}
            >
              {statusText}
            </span>
          );
        } else if (text === 2) {
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
      width: "15%",
    },
    {
      title: "Thành viên",
      dataIndex: "listMember",
      key: "listMember",
      render: (listMember) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {listMember.map((member) => (
            <Image
              url={member.image}
              marginRight={-5}
              picxel={28}
              name={member.name + " " + member.code}
            />
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Link to={`/detail-project/${record.id}`}>
            <Tooltip title="Xem chi tiết dự án">
              <FontAwesomeIcon icon={faEye} size="1x" />
            </Tooltip>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="my_project">
      {isLoading && <LoadingIndicator />}

      <div className="title_my_project">
        {" "}
        <ProjectOutlined style={{ fontSize: "26px" }} />
        <span style={{ marginLeft: "10px" }}>Dự án của tôi</span>
      </div>
      <div className="filter">
        <FontAwesomeIcon icon={faFilter} size="2x" />{" "}
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Bộ lọc</span>
        <hr />
        <div className="content">
          <div className="content-wrapper">
            <div className="content-left">
              Tên dự án:{" "}
              <Input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                style={{ width: "50%", marginLeft: "10px" }}
              />
            </div>
            <div className="content-right">
              Trạng thái:{" "}
              <Select
                value={status}
                onChange={(value) => {
                  setStatus(value);
                }}
                style={{ width: "50%", marginLeft: "10px" }}
              >
                <Option value="">Tất cả</Option>
                <Option value="0">Đã diễn ra</Option>
                <Option value="1">Đang diễn ra</Option>
                <Option value="2">Chưa diễn ra</Option>
              </Select>
            </div>
          </div>
        </div>
        <div className="box_btn_filter">
          <Button className="btn_filter" onClick={search}>
            Tìm kiếm
          </Button>
          <Button className="btn_clear" onClick={clear}>
            Làm mới bộ lọc
          </Button>
        </div>
      </div>
      <div className="table_project">
        <div className="title_my_project">
          {" "}
          <ProjectOutlined style={{ fontSize: "26px" }} />
          <span style={{ fontSize: "18px", fontWeight: "500" }}>
            {" "}
            Danh sách dự án
          </span>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Table
            dataSource={data}
            rowKey="id"
            columns={columns}
            pagination={false}
            className="table_my_project"
          />
          <div className="pagination_box">
            <Pagination
              simple
              current={current}
              onChange={(value) => {
                setCurrent(value);
              }}
              total={total * 10}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProject;
