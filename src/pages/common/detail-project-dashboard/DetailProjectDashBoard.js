import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { GetPeriodCurrent } from "../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import {
  GetProject,
  SetProject,
} from "../../../app/reducer/detail-project/DPProjectSlice.reducer";
import "./styleDetailProjectDashBoard.css";
import LoadingIndicator from "../../../helper/loading";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faHome, faLineChart } from "@fortawesome/free-solid-svg-icons";
import { DetailProjectAPI } from "../../../api/detail-project/detailProject.api";
import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Col, Progress, Row, Select } from "antd";
import { DashboardApi } from "../../../api/dashboard/Dashboard.api";

const { Option } = Select;

const DetailProjectDashBoard = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [detailProject, setDetailProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listPeriod, setListPeriod] = useState([]);
  const [progress, setProgress] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [dataDueDate, setDataDueDate] = useState([]);
  const [dataMember, setDataMember] = useState([]);
  const [dataLabel, setDataLabel] = useState([]);
  const [idPeriodChange, setIdPeriodChange] = useState("none");

  useEffect(() => {
    fetchData();
    loadDataPeriod();
    loadDataLineChartAllProject();
  }, []);

  const fetchData = () => {
    DetailProjectAPI.findProjectById(id).then((response) => {
      setDetailProject(response.data.data);
      dispatch(SetProject(response.data.data));
      setProgress(response.data.data.progress);
      document.title = "Thống kê | " + response.data.data.name;
    });
  };

  const loadDataPeriod = () => {
    DetailProjectAPI.findAllPeriodProject(id).then((response) => {
      setListPeriod(response.data.data);
    });
  };

  const loadDataLineChartAllProject = () => {
    setDataList([]);
    setDataDueDate([]);
    setDataMember([]);
    setDataLabel([]);
    setLoading(true);
    if (detailProject != null) {
      setProgress(detailProject.progress);
    }
    DashboardApi.fetchAllDataDashboardTodoListAllProject(id).then(
      (response) => {
        setDataList(response.data.data);
      }
    );

    fetchDataAndSetDataDueDate(0, "Chưa hoàn thành");
    fetchDataAndSetDataDueDate(2, "Hoàn thành sớm");
    fetchDataAndSetDataDueDate(3, "Hoàn thành muộn");
    fetchDataAndSetDataDueDate(4, "Quá hạn");
    fetchDataAndSetDataNoDueDate("Không có ngày hạn");

    DashboardApi.fetchAllDataDashboardMemberAllProject(id).then((response) => {
      let array = response.data.data;

      DashboardApi.fetchAllDataDashboardNoMemberAllProject(id).then(
        (response) => {
          array.push({
            name: "Thẻ không có thành viên",
            member: response.data.data,
          });
          setDataMember(array);
        }
      );
    });

    DashboardApi.fetchAllDataDashboardLabelAllProject(id).then((response) => {
      let array = response.data.data;

      DashboardApi.fetchAllDataDashboardNoLabelAllProject(id).then(
        (response) => {
          array.push({
            name: "Thẻ không có nhãn",
            label: response.data.data,
          });
          setDataLabel(array);
        }
      );
    });
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const fetchDataAndSetDataDueDate = async (status, name) => {
    try {
      const response =
        await DashboardApi.fetchAllDataDashboardDueDateAllProject(id, status);
      const newData = {
        name: name,
        duedate: response.data.data,
      };
      setDataDueDate((prevData) => [...prevData, newData]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataAndSetDataNoDueDate = async (name) => {
    try {
      const response =
        await DashboardApi.fetchAllDataDashboardNoDueDateAllProject(id);
      const newData = {
        name: name,
        duedate: response.data.data,
      };
      setDataDueDate((prevData) => [...prevData, newData]);
    } catch (error) {
      console.error(error);
    }
  };

  const loadDataLineChartPeriod = (idPeriod) => {
    setDataList([]);
    setDataDueDate([]);
    setDataMember([]);
    setDataLabel([]);
    setLoading(true);
    DashboardApi.detailPeriod(idPeriod).then((response) => {
      console.log(response.data.data);
      setProgress(response.data.data.progress);
    });
    DashboardApi.fetchAllDataDashboardTodoListPeriod(id, idPeriod).then(
      (response) => {
        setDataList(response.data.data);
      }
    );

    fetchDataAndSetDataDueDatePeriod(0, "Chưa hoàn thành", idPeriod);
    fetchDataAndSetDataDueDatePeriod(2, "Hoàn thành sớm", idPeriod);
    fetchDataAndSetDataDueDatePeriod(3, "Hoàn thành muộn", idPeriod);
    fetchDataAndSetDataDueDatePeriod(4, "Quá hạn", idPeriod);
    fetchDataAndSetDataNoDueDatePeriod("Không có ngày hạn", idPeriod);

    DashboardApi.fetchAllDataDashboardMemberPeriod(id, idPeriod).then(
      (response) => {
        let array = response.data.data;

        DashboardApi.fetchAllDataDashboardNoMemberPeriod(id, idPeriod).then(
          (response) => {
            array.push({
              name: "Thẻ không có thành viên",
              member: response.data.data,
            });
            setDataMember(array);
          }
        );
      }
    );

    DashboardApi.fetchAllDataDashboardLabelPeriod(id, idPeriod).then(
      (response) => {
        let array = response.data.data;

        DashboardApi.fetchAllDataDashboardNoLabelPeriod(id, idPeriod).then(
          (response) => {
            array.push({
              name: "Thẻ không có nhãn",
              label: response.data.data,
            });
            setDataLabel(array);
          }
        );
      }
    );
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const fetchDataAndSetDataDueDatePeriod = async (status, name, idPeriod) => {
    try {
      const response = await DashboardApi.fetchAllDataDashboardDueDatePeriod(
        id,
        status,
        idPeriod
      );
      const newData = {
        name: name,
        duedate: response.data.data,
      };
      setDataDueDate((prevData) => [...prevData, newData]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDataAndSetDataNoDueDatePeriod = async (name, idPeriod) => {
    try {
      const response = await DashboardApi.fetchAllDataDashboardNoDueDatePeriod(
        id,
        idPeriod
      );
      const newData = {
        name: name,
        duedate: response.data.data,
      };
      setDataDueDate((prevData) => [...prevData, newData]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeIdPeriod = (e) => {
    if (e !== "none") {
      loadDataLineChartPeriod(e);
    } else {
      loadDataLineChartAllProject();
    }
    setIdPeriodChange(e);
  };

  return (
    <div className="my_project">
      {loading && <LoadingIndicator />}
      <div style={{ marginBottom: "15px" }}>
        <Link
          to="/my-project"
          style={{ color: "black", textDecoration: "none" }}
        >
          <FontAwesomeIcon icon={faHome} /> Danh sách dự án{" "}
        </Link>{" "}
        <span style={{ marginLeft: "5px", marginRight: "5px" }}> / </span>{" "}
        <span style={{ color: "black", textDecoration: "none" }}>
          <FontAwesomeIcon icon={faCogs} />
          <Link
            to={`/detail-project/${id}`}
            style={{ color: "black", textDecoration: "none" }}
          >
            {" "}
            {detailProject != null ? detailProject.name : ""}
          </Link>
        </span>
        <span style={{ marginLeft: "5px", marginRight: "5px" }}> / </span>{" "}
        <span style={{ color: "black", textDecoration: "none" }}>
          <FontAwesomeIcon icon={faLineChart} /> Thống kê
        </span>
      </div>

      <div className="table_project">
        <div
          style={{
            borderBottom: "1px solid gray",
            display: "flex",
            alignItems: "center",
            paddingBottom: "10px",
          }}
        >
          <span style={{ fontSize: "18px", fontWeight: "700" }}>
            <FontAwesomeIcon
              icon={faLineChart}
              style={{ marginRight: "7px" }}
            />
            Thống kê
          </span>
        </div>
        <div style={{ marginTop: "30px", marginBottom: "25px" }}>
          <Row>
            <Col
              span={12}
              style={{
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Bộ lọc:</span>
              <Select
                value={idPeriodChange}
                onChange={handleChangeIdPeriod}
                style={{ marginLeft: "10px", width: "250px" }}
              >
                <Option value="none">Tất cả dự án</Option>
                {listPeriod != null &&
                  listPeriod.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </Col>
            <Col
              span={12}
              style={{ textAlign: "center", justifyContent: "center" }}
            >
              {" "}
              <span>Tiến độ chung:</span>
              <Progress
                type="circle"
                percent={progress}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                strokeWidth={6}
                width={100}
                trailColor="#f0f0f0"
                strokeLinecap="round"
                style={{
                  boxShadow: "0 0 10px rgba(82, 196, 26, 0.6)",
                  borderRadius: "50%",
                  marginLeft: "10px",
                }}
              />
            </Col>
          </Row>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <h3>Thống kê thẻ theo danh sách</h3>
          <BarChart width={1150} height={400} data={dataList}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="list" fill="rgb(190, 190, 59)" />
          </BarChart>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <h3>Thống kê thẻ theo ngày hạn</h3>
          <BarChart width={1150} height={400} data={dataDueDate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="duedate" fill="rgb(190, 190, 59)" />
          </BarChart>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <h3>Thống kê thẻ theo thành viên</h3>
          <BarChart width={1150} height={400} data={dataMember}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="member" fill="rgb(190, 190, 59)" />
          </BarChart>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <h3>Thống kê thẻ theo nhãn</h3>
          <BarChart width={1150} height={400} data={dataLabel}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="label" fill="rgb(190, 190, 59)" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default DetailProjectDashBoard;
