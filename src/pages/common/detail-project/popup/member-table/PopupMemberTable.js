import "./stylePopupMemberTable.css";
import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, Select, Tooltip } from "antd";
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
import { userCurrent } from "../../../../../helper/inForUser";
import { getStompClient } from "../../stomp-client-config/StompClientManager";
import debounce from "lodash/debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

const { Option } = Select;

const PopupMemberTable = ({ todo, position, onClose }) => {
  const popupRef = useRef(null);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
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
    top: position.top - 20,
    left: position.left,
    zIndex: 9999,
    width: "300px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const checkMemberExists = (id) => {
    if (todo != null && todo.listMemberByIdTodo.length > 0) {
      const isInListMemberTodo = todo.listMemberByIdTodo.some(
        (member) => member.id === id
      );
      return isInListMemberTodo;
    }
  };

  const clickChangeAssign = debounce((check, item) => {
    if (todo != null) {
      let obj = {
        idMember: item.id,
        nameMember: item.name,
        email: item.email,
        idTodoCreateOrDelete: todo.id,
        projectId: detailProject.id,
        idUser: userCurrent.id,
        idTodo: todo.id,
        idTodoList: todo.todoListId,
      };

      if (check) {
        deleteAssign(obj);
      } else {
        createAssign(obj);
      }
    }
  }, 350);

  const deleteAssign = (obj) => {
    stompClient.send(
      "/action/delete-assign/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const createAssign = (obj) => {
    stompClient.send(
      "/action/create-assign/" + detailProject.id + "/" + periodCurrent.id,
      {},
      JSON.stringify(obj)
    );
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMembers, setFilteredMembers] = useState(listMemberProject);
  const [errorMembers, setErrorMembers] = useState(false);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    const filteredMembers = listMemberProject.filter((item) => {
      const { name, code } = item;
      const searchValue = searchTerm.toLowerCase();
      return (
        name.toLowerCase().includes(searchValue) ||
        code.toLowerCase().includes(searchValue)
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
      <div style={{ marginTop: "15px", marginBottom: "10px" }}>
        <div>
          <span style={{ fontSize: "14px" }}>Tìm kiếm: </span>
          <br />
          <Input
            style={{ marginTop: "5px" }}
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo tên, mã SV"
          />
        </div>{" "}
        <div style={{ marginTop: "7px" }}>
          <span style={{ fontSize: "14px" }}>Danh sách thành viên:</span>
        </div>
        <div style={{ marginTop: "10px" }}>
          {filteredMembers.map((item, index) => (
            <div
              style={{ float: "left", position: "relative" }}
              onClick={() => {
                clickChangeAssign(checkMemberExists(item.id), item);
              }}
              key={index}
            >
              <div>
                <Image
                  url={item.image}
                  key={index}
                  marginRight={5}
                  picxel={35}
                  name={item.name + " " + item.code}
                />
              </div>
              {checkMemberExists(item.id) && (
                <Tooltip title={item.name + " " + item.code}>
                  <div className="✓style">
                    <span>✓</span>
                  </div>
                </Tooltip>
              )}
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

export default PopupMemberTable;
