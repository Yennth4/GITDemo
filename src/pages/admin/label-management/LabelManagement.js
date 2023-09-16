import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styleLabelManagement.css";
import {
  faFilter,
  faCogs,
  faList,
  faEdit,
  faPlus,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Input, Pagination, Table, Tooltip } from "antd";
import { useAppDispatch } from "../../../app/hook";
import LoadingIndicator from "../../../helper/loading";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/hook";
import {
  GetLabelManagement,
  SetLabelManagement,
} from "../../../app/reducer/admin/label-management/labelManagementSlice.reducer";
import { userCurrent } from "../../../helper/inForUser";
import { LabelManagementAPI } from "../../../api/label-management/labelManagement.api";
import ModalCreateLabel from "./modal-create/ModalCreateLabel";
import ModalUpdateLabel from "./modal-update/ModalUpdateLabel";

const LabelManagement = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [colorLabel, setColorLabel] = useState("");
  const [status, setStatus] = useState("");
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [idLabel, setIdLabel] = useState("");
  const { id } = useParams();
  const [label, setLabel] = useState(null);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    fetchData();

    return () => {
      dispatch(SetLabelManagement([]));
    };
  }, [current]);

  const fetchData = async () => {
    let filter = {
      idUser: userCurrent.id,
      nameLabel: name,
      name: searchName,
      status: status === "" ? null : parseInt(status),
      page: current - 1,
    };
    setIsLoading(true);
    try {
      const response = await LabelManagementAPI.fetchAll(filter);
      let listLabelManagement = response.data.data.data;
      dispatch(SetLabelManagement(listLabelManagement));
      setTotal(response.data.data.totalPages);
      setIsLoading(false);
    } catch (error) {
      alert("Lỗi hệ thống, vui lòng ấn F5 để tải lại trang");
    }
  };

  const data = useAppSelector(GetLabelManagement);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tên nhãn",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Màu sắc nhãn",
      dataIndex: "colorLabel",
      key: "colorLabel",
      render: (text, record) => {
        if (record.colorLabel) {
          return (
            <div
              style={{
                backgroundColor: record.colorLabel,
                width: 200,
                height: 30,
                borderRadius: 8,
              }}
            ></div>
          );
        }
      },
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Link>
            <Tooltip title="Chỉnh sửa chi tiết">
              <FontAwesomeIcon
                icon={faEdit}
                size="1x"
                onClick={() => {
                  handleUpdateLabel(record.id, record);
                }}
              />
            </Tooltip>
          </Link>
        </div>
      ),
    },
  ];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleChangeSearch = (e) => {
    setSearchName(e.target.value);
  };

  const handleLabelCreate = () => {
    document.querySelector("body").style.overflowX = "auto";
    setShowCreateModal(true);
    setIdLabel(id);
  };

  const handleModalCreateCancel = () => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowCreateModal(false);
  };

  const handleUpdateLabel = (id, label) => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowUpdateModal(true);
    setIdLabel(id);
    setLabel(label);
  };

  const handleModalUpdateCancel = () => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowUpdateModal(false);
  };

  const handleSearch = () => {
    setCurrent(1);
    fetchData();
  };

  const handleClear = () => {
    setName("");
    setStatus("");
    setSearchName("");
  };

  return (
    <div className="label_management">
      {isLoading && <LoadingIndicator />}

      <div className="title_label_management">
        {" "}
        <FontAwesomeIcon icon={faTags} size="1x" />
        <span style={{ marginLeft: "10px" }}>Quản lý nhãn</span>
      </div>
      <div className="filter">
        <FontAwesomeIcon icon={faFilter} size="2x" />{" "}
        <span style={{ fontSize: "25px", fontWeight: "500" }}>Bộ lọc</span>
        <hr />
        <div className="content">
          <div className="content-wrapper">
            <div className="content-center">
              Tên nhãn:{" "}
              <Input
                type="text"
                value={searchName}
                onChange={handleChangeSearch}
                style={{ width: "50%", marginLeft: "10px" }}
              />
            </div>
          </div>
        </div>
        <div className="box_btn_filter">
          <Button className="btn_filter" onClick={handleSearch}>
            Tìm kiếm
          </Button>
          <Button className="btn_clear" onClick={handleClear}>
            Làm mới bộ lọc
          </Button>
        </div>
      </div>
      <div className="table_label">
        <div className="title_label_management_table">
          <div>
            {" "}
            {<FontAwesomeIcon icon={faList} size="2x" />}
            <span style={{ fontSize: "18px", fontWeight: "500" }}>
              {" "}
              Danh sách nhãn
            </span>
          </div>
          <div>
            <Button
              style={{
                color: "white",
                backgroundColor: "rgb(55, 137, 220)",
              }}
              onClick={handleLabelCreate}
            >
              <FontAwesomeIcon
                icon={faPlus}
                size="1x"
                style={{
                  backgroundColor: "rgb(55, 137, 220)",
                }}
              />{" "}
              Thêm nhãn
            </Button>
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <Table
            className="table_content"
            pagination={false}
            columns={columns}
            rowKey="id"
            dataSource={data}
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
      <ModalCreateLabel
        visible={showCreateModal}
        onCancel={handleModalCreateCancel}
      />
      <ModalUpdateLabel
        visible={showUpdateModal}
        onCancel={handleModalUpdateCancel}
        idLabel={idLabel}
        label={label}
      />
    </div>
  );
};

export default LabelManagement;
