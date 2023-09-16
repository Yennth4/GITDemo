import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./stylePopupPeriod.css";
import { Button, Select } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../../app/hook";
import {
  GetMemberPeriod,
  GetPeriodCurrent,
  SetPeriodCurrent,
} from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { Link } from "react-router-dom";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";

const { Option } = Select;

const PopupPeriod = ({ position, onClose }) => {
  const popupRef = useRef(null);
  const [period, setPeriod] = useState("");
  const dispatch = useAppDispatch();
  const listPeriod = useAppSelector(GetMemberPeriod);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);

  useEffect(() => {
    loadDataPeriodCurrent();
  }, [periodCurrent]);

  const loadDataPeriodCurrent = () => {
    if (periodCurrent != null) {
      setPeriod(periodCurrent.id);
    }
  };

  const handleChangePeriod = (value) => {
    setPeriod(value);
    const itemWithStatusOne = listPeriod.find((item) => item.id === value);
    dispatch(SetPeriodCurrent(itemWithStatusOne));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !popupRef.current.contains(event.target) &&
        !event.target.className.includes("ant-select-item-option-content")
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
    position: "absolute",
    top: position.top - 53,
    left: position.left,
    zIndex: 99999999,
    width: "300px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-period">
      <div className="popup-header">
        <h4>Giai đoạn của dự án</h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div style={{ marginTop: "20px", marginBottom: "10px" }}>
        <Select
          value={period}
          onChange={handleChangePeriod}
          style={{ width: "100%" }}
        >
          {listPeriod.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
        <Link to={`/period-project/${detailProject.id}`}>
          <Button
            style={{
              marginTop: "15px",
              width: "100%",
              backgroundColor: "rgb(49, 140, 214)",
            }}
            className="btn_detail_period"
          >
            Xem chi tiết các giai đoạn
          </Button>
        </Link>
        <Button style={{ marginTop: "15px", width: "100%" }}>
          Giai đoạn đang diễn ra
        </Button>
      </div>
    </div>
  );
};

export default PopupPeriod;
