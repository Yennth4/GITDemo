import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFilter,
  faPencil,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./styleCategory.css";
import { Button, Input, Pagination, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useAppSelector, useAppDispatch } from "../../../app/hook";
import {
  SetCategory,
  GetCategory,
} from "../../../app/reducer/admin/category-management/adCategorySlice.reducer";
import { AdCategoryAPI } from "../../../api/admin-category/adCategory.api";
import "react-toastify/dist/ReactToastify.css";
import ModalCreateCategory from "./modal-create/ModalCreateCategory";
import ModalUpdateCategory from "./modal-update/ModalUpdateCategory";
import LoadingIndicator from "../../../helper/loading";

const CategoryManagement = () => {
  const [category, setCategory] = useState(null);
  const [name, setName] = useState("");
  const { id } = useParams();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const dispatch = useAppDispatch();
  const [start, setStart] = useState(0);
  const startIndex = (current - 1) * 10;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [current]);

  const fetchData = () => {
    setLoading(true);
    AdCategoryAPI.fetchAllCategory(name, current).then((response) => {
      dispatch(SetCategory(response.data.data.data));
      setTotal(response.data.data.totalPages);
      setLoading(false);
    });
  };

  const data = useAppSelector(GetCategory);

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      //sorter: (a, b) => a.stt.localeCompare(b.stt),
      render: (text, record, index) => startIndex + index + 1,
    },
    {
      title: "Tên thể loại",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Tooltip title="Cập nhật">
            <FontAwesomeIcon
              onClick={() => {
                buttonUpdate(record);
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

  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);

  const buttonCreate = () => {
    document.querySelector("body").style.overflowX = "hidden";
    setModalCreate(true);
  };

  const buttonCreateCancel = () => {
    document.querySelector("body").style.overflowX = "auto";
    setModalCreate(false);
    setCategory(null);
  };

  const buttonUpdate = (record) => {
    document.querySelector("body").style.overflowX = "hidden";
    setModalUpdate(true);
    setCategory(record);
  };

  const buttonUpdateCancel = () => {
    document.querySelector("body").style.overflowX = "auto";
    setModalUpdate(false);
  };

  const buttonSearch = () => {
    fetchData();
    setCurrent(1);
  };

  const clearData = () => {
    setName("");
  };

  return (
    <div className="category">
      {loading && <LoadingIndicator />}
      <div className="title_my_project">
        {" "}
        <FontAwesomeIcon icon={faFolder} size="1x" />
        <span style={{ marginLeft: "10px" }}>Danh sách thể loại</span>
      </div>
      <div className="filter">
        <FontAwesomeIcon icon={faFilter} size="2x" />{" "}
        <span style={{ fontSize: "18px", fontWeight: "500" }}>Bộ lọc</span>
        <hr />
        <div className="title__search">
          Tên thể loại:{" "}
          <Input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            style={{ width: "300px", marginLeft: "5px" }}
          />
        </div>
        <div className="box_btn_filter">
          <Button className="btn_filter" onClick={buttonSearch}>
            Tìm kiếm
          </Button>
          <Button className="btn__clear" onClick={clearData}>
            Làm mới bộ lọc
          </Button>
        </div>
      </div>

      <div className="table__category">
        <div className="tittle__category">
          <div>
            {" "}
            {<FontAwesomeIcon icon={faFolder} size="2x" />}
            <span style={{ fontSize: "18px", fontWeight: "500" }}>
              {" "}
              Danh sách thể loại
            </span>
          </div>
          <div>
            <Button
              style={{
                color: "white",
                backgroundColor: "rgb(55, 137, 220)",
              }}
              onClick={buttonCreate}
            >
              <FontAwesomeIcon
                icon={faPlus}
                size="1x"
                style={{
                  backgroundColor: "rgb(55, 137, 220)",
                }}
              />{" "}
              Thêm thể loại
            </Button>
          </div>
        </div>
        <br />
        <div>
          <Table
            dataSource={data}
            rowKey="id"
            columns={columns}
            pagination={false}
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
      <ModalCreateCategory
        visible={modalCreate}
        onCancel={buttonCreateCancel}
      />
      <ModalUpdateCategory
        visible={modalUpdate}
        onCancel={buttonUpdateCancel}
        category={category}
      />
    </div>
  );
};

export default CategoryManagement;
