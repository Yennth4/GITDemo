import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Col, Input, Row, Select, Tooltip } from "antd";
import { useAppDispatch, useAppSelector } from "../../../../../app/hook";
import {
  GetMemberPeriod,
  GetPeriodCurrent,
  SetPeriodCurrent,
} from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { Link } from "react-router-dom";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { GetMemberProject } from "../../../../../app/reducer/detail-project/DPMemberProject.reducer";
import Image from "../../../../../helper/img/Image";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { userCurrent } from "../../../../../helper/inForUser";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import debounce from "lodash/debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import "./popup-tag-comment.css";

const { Option } = Select;

const PopupTagComment = ({ position, onClose, onClick }) => {
  const popupRef = useRef(null);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
  const detailTodo = useAppSelector(GetDetailTodo);
  const listMemberProject = useAppSelector(GetMemberProject);
  const stompClient = getStompClient();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!popupRef.current.contains(event.target)) {
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
    top: position.top,
    left: position.left,
    zIndex: 9999,
    width: "300px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(listMemberProject);
  const [errorMembers, setErrorMembers] = useState(false);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    const filteredMembers = listMemberProject.filter((item) => {
      const { name, code, username } = item;
      const searchValue = searchTerm.toLowerCase();
      return (
        name.toLowerCase().includes(searchValue) ||
        code.toLowerCase().includes(searchValue) ||
        username.toLowerCase().includes(searchValue)
      );
    });

    if (filteredMembers.length === 0) {
      setErrorMembers(true);
    } else {
      setErrorMembers(false);
    }

    setFilteredMembers(filteredMembers);
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-period">
      <div className="popup-header">
        <h4>
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: "5px" }} />
          Thành viên trong dự án
        </h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div style={{ marginTop: "5px", marginBottom: "10px" }}>
        <div>
          <span style={{ fontSize: "14px" }}>Tìm kiếm: </span>
          <br />
          <Input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo tên, mã SV"
          />
        </div>{" "}
        <div style={{ marginTop: "7px" }}>
          <span style={{ fontSize: "14px" }}>Danh sách thành viên:</span>
        </div>
        <div style={{ marginTop: "10px" }} className="body-tag-name">
          {filteredMembers.map((item, index) => (
            <div style={{ float: "left", position: "relative" }} key={index}>
              <Row>
                <Col
                  onClick={() => {
                    onClick(item.username);
                  }}
                  span={24}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "3px",
                    cursor: "pointer",
                  }}
                  className="col-tag-comment"
                >
                  <Image
                    url={item.image}
                    key={index}
                    marginRight={10}
                    picxel={35}
                    name={item.name + " " + item.code}
                  />{" "}
                  <span>{item.name + " " + item.code}</span>
                </Col>
              </Row>
            </div>
          ))}
          {errorMembers && (
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: "14px", color: "red" }}>
                Danh sách trống
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupTagComment;
