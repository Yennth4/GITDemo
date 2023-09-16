import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styleStakeholderManagement.css";
import {
  faFilter,
  faCogs,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import {
  GetAdStakeholderManagement,
  SetAdStakeholderManagement,
  
} from "../../../app/reducer/admin/stakeholder-management/Stakeholder.reducer";

import {
  Button,
  Input,
  Pagination,
  Table,
  Tooltip,
} from "antd";
import ModalUpdateStakeholderManagement from "../stakeholder-management/modal-update/ModalUpdateStakeholderManagement";

import { CommonStakeHolderAPI } from "../../../api/commonAPI";
import { useEffect, useState } from "react";
import LoadingIndicator from "../../../helper/loading";

const StakeholderManagement = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [idStakeHolder, setIdStakeHolder] = useState("");
  const [current, setCurrent] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const clear = async () => {
    setName("");
    setUserName("");
    try{
    await CommonStakeHolderAPI.fetchAll().then((re) => {
      dispatch(SetAdStakeholderManagement(re.data));
    });
  }
  
  catch(error){
    alert("Lỗi hệ thống, vui lòng ấn F5 để tải lại trang");

  }
  };
  useEffect(() => {
    fetchData();
    return () => {
      dispatch(SetAdStakeholderManagement([]));
    };
    

  }, []);
  const fetchData = async () => {
    setIsLoading(true);
    try{
    await CommonStakeHolderAPI.fetchAll().then((re) => {
      dispatch(SetAdStakeholderManagement(re.data));
    });
    setIsLoading(false);
  }
  
  catch(error){
    alert("Lỗi hệ thống, vui lòng ấn F5 để tải lại trang");

  }
  };
  const data = useAppSelector(GetAdStakeholderManagement);
  const handleSearch = () => {

    const searchResult = data.filter((item) =>
      item.name.toLowerCase().includes(name.toLowerCase())
      
    );
    const searchResultUser = data.filter((item) =>
      item.username.toLowerCase().includes(username.toLowerCase())
    );
    
    // dispatch(SetAdStakeholderManagement(searchResult));
    // dispatch(SetAdStakeholderManagement(searchResultUser));
    Promise.all([
      dispatch(SetAdStakeholderManagement(searchResult)),
      dispatch(SetAdStakeholderManagement(searchResultUser)),
    ]).then(() => {
      console.log("okokokok");
    });

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
    },
    {
      title: "Tên tài  khoản",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "EmailFPT",
      dataIndex: "emailFPT",
      key: "emailFPT",
      sorter: (a, b) => a.emailFPT.localeCompare(b.emailFPT),
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
      
      render: (text,record) => (
        <div>
          <Tooltip title="Cập nhật">
            <FontAwesomeIcon
              onClick={() => {
                handlePeriodUpdate(record.id);
              }}
              style={{ marginRight: "15px", cursor: "pointer" }}
              icon={faPencil}
              size="1x"
            />
          </Tooltip>
        </div>
      ),
    },
  ];
  
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleModalUpdateCancel = () => {
    document.querySelector("body").style.overflowX = "auto";
    setShowUpdateModal(false);
  };
  const handlePeriodUpdate = (id) => {
    document.querySelector("body").style.overflowX = "hidden";
    setShowUpdateModal(true);
    setIdStakeHolder(id);

  };
  return (
    <div className="stakeholder_management">
            {isLoading && <LoadingIndicator />}

      <div className="title_stakeholder_management">
        {" "}
        <FontAwesomeIcon icon={faCogs} size="1x" />
        <span style={{ marginLeft: "10px" }}>Quản lý bên liên quan</span>
      </div>
      <div className="filter">
        <FontAwesomeIcon icon={faFilter} size="2x" />{" "}
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Bộ lọc</span>
        <hr />
        <div className="content">
          <div className="content-wrapper">
            <div className="content-left">
              Tên:{" "}
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
              Tên tài Khoản:{" "}
              <Input
                type="text"
                value={username}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                style={{ width: "50%", marginLeft: "10px" }}
              />
            </div>
          </div>
        </div>
        
        <div className="box_btn_filter">
          <Button
            className="btn_filter"
              onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
          <Button
            className="btn_clear"
              onClick={clear}
          >
            Làm mới bộ lọc
          </Button>
        </div>
      </div>

      <div className="table_Allstakeholder_management">
        <div className="title_stakeholder_management">
          {" "}
          <FontAwesomeIcon icon={faCogs} size="1x" />
          <span style={{ fontSize: "18px", fontWeight: "500" }}>
            {" "}
            Danh sách bên liên quan
          </span>
        </div>
        <div style={{ marginTop: "25px" }}>
          <Table
            dataSource={data}
            rowKey="id"
            columns={columns}
            className="table_stakeholder_management"
            pagination={{
              pageSize: 3,
              showSizeChanger: false,
              size: "small",
            }}
          />
        </div>
          
      </div>
      <ModalUpdateStakeholderManagement
        visible={showUpdateModal}
        onCancel={handleModalUpdateCancel}
        idStakeHolder={idStakeHolder}
      />
    </div>
  );
};
export default StakeholderManagement;
