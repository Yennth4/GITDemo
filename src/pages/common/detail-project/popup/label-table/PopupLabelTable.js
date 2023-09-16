import "./stylePopupLabelTable.css";
import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, Input, Popconfirm, Select, Tooltip } from "antd";
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
import { GetLabelProject } from "../../../../../app/reducer/detail-project/DPLabelProject.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlus,
  faTags,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import PopupCreateLabel from "../label/create-label/PopupCreateLabel";
import PopupUpdateLabel from "../label/update-label/PopupUpdateLabel";

const { Option } = Select;

const PopupLabelTable = ({ todo, onClose, isSelected }) => {
  const popupRef = useRef(null);
  const periodCurrent = useAppSelector(GetPeriodCurrent);
  const detailProject = useAppSelector(GetProject);
  const stompClient = getStompClient();
  const listLabelProject = useAppSelector(GetLabelProject);
  const [listLabelTodo, setListLabelTodo] = useState([]);

  useEffect(() => {
    if (todo != null) {
      setListLabelTodo(todo.labels);
    }

    return () => {
      if (todo != null) {
        setListLabelTodo([]);
      }
    };
  }, [isSelected]);

  const checkSelectedLabel = (id) => {
    const check = listLabelTodo.find((item) => item.id === id);
    if (check == null) {
      return false;
    }
    return true;
  };

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
    top: "100px",
    left: "63%",
    zIndex: 999999999,
    width: "300px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const handleChangeSelectedLabel = (event, id) => {
    let obj = {
      idLabel: id,
      idTodoCreateOrDelete: todo.id,
      idTodo: todo.id,
      idTodoList: todo.todoListId,
    };
    if (event.target.checked) {
      stompClient.send(
        "/action/create-label-todo/" +
          detailProject.id +
          "/" +
          periodCurrent.id,
        {},
        JSON.stringify(obj)
      );
      setListLabelTodo([...listLabelTodo, { id }]);
    } else {
      stompClient.send(
        "/action/delete-label-todo/" +
          detailProject.id +
          "/" +
          periodCurrent.id,
        {},
        JSON.stringify(obj)
      );
      setListLabelTodo(listLabelTodo.filter((item) => item.id !== id));
    }
  };

  const handleClickSelectedLabel = debounce((id) => {
    let obj = {
      idLabel: id,
      idTodoCreateOrDelete: todo.id,
      idTodo: todo.id,
      idTodoList: todo.todoListId,
    };

    const check = listLabelTodo.find((item) => item.id === id);

    if (check == null) {
      stompClient.send(
        "/action/create-label-todo/" +
          detailProject.id +
          "/" +
          periodCurrent.id,
        {},
        JSON.stringify(obj)
      );
      setListLabelTodo([...listLabelTodo, { id }]);
    } else {
      stompClient.send(
        "/action/delete-label-todo/" +
          detailProject.id +
          "/" +
          periodCurrent.id,
        {},
        JSON.stringify(obj)
      );
      setListLabelTodo(listLabelTodo.filter((item) => item.id !== id));
    }
  }, 500);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLabels, setFilteredLabels] = useState([]);
  const [errorLabels, setErrorLabels] = useState(false);

  useEffect(() => {
    if (listLabelProject != null && listLabelProject.length > 0) {
      const filteredLabels = listLabelProject.filter((item) => {
        const { name, code } = item;
        const searchValue = searchTerm.toLowerCase();
        return (
          name.toLowerCase().includes(searchValue) ||
          code.toLowerCase().includes(searchValue)
        );
      });

      if (filteredLabels.length === 0) {
        setErrorLabels(true);
      } else {
        setErrorLabels(false);
      }
      setFilteredLabels(filteredLabels);
    }
  }, [listLabelProject]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    const filteredLabels = listLabelProject.filter((item) => {
      const { name, code } = item;
      const searchValue = searchTerm.toLowerCase();
      return (
        name.toLowerCase().includes(searchValue) ||
        code.toLowerCase().includes(searchValue)
      );
    });

    if (filteredLabels.length === 0) {
      setErrorLabels(true);
    } else {
      setErrorLabels(false);
    }
    setFilteredLabels(filteredLabels);
  };

  const [isOpenPopupCreateLabel, setIsOpenPopupCreateLabel] = useState(false);
  const [popupPositionPopupCreateLabel, setPopupPositionPopupCreateLabel] =
    useState({
      top: 0,
      left: 0,
    });

  const openPopupCreateLabel = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setIsOpenPopupCreateLabel(true);
  };

  const closePopupCreateLabel = () => {
    setIsOpenPopupCreateLabel(false);
  };

  const [labelSelected, setLabelSelected] = useState(null);

  const [isOpenPopupUpdateLabel, setIsOpenPopupUpdateLabel] = useState(false);
  const [popupPositionPopupUpdateLabel, setPopupPositionPopupUpdateLabel] =
    useState({
      top: 0,
      left: 0,
    });

  const openPopupUpdateLabel = (event) => {
    const buttonPosition = event.target.getBoundingClientRect();
    setIsOpenPopupUpdateLabel(true);
  };

  const closePopupUpdateLabel = () => {
    setIsOpenPopupUpdateLabel(false);
  };

  const deleteLabel = (id) => {
    let obj = {
      id: id,
      projectId: detailProject.id,
    };

    stompClient.send(
      "/action/delete-label/" + detailProject.id,
      {},
      JSON.stringify(obj)
    );
  };

  const handleClickLabel = (item) => {
    setIsOpenPopupUpdateLabel(true);
    setLabelSelected(item);
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-label">
      <div className="popup-header">
        <h4>
          <FontAwesomeIcon icon={faTags} style={{ marginRight: "5px" }} />
          Danh sách nhãn
        </h4>
        <span onClick={onClose} className="close-button">
          &times;
        </span>
      </div>
      <div style={{ marginTop: "15px" }}>
        <div>
          <span style={{ fontSize: "14px" }}>Tìm kiếm: </span>
          <br />
          <Input
            style={{ marginTop: "5px" }}
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Tìm kiếm theo tên nhãn"
          />
        </div>{" "}
        <div style={{ marginTop: "7px" }}>
          <span style={{ fontSize: "14px" }}>Danh sách nhãn:</span>
        </div>
        <div style={{ marginTop: "10px" }} className="content_label">
          <div>
            {filteredLabels.map((item, index) => (
              <div className="box_label_project" key={index}>
                <Checkbox
                  checked={checkSelectedLabel(item.id)}
                  onChange={(event) =>
                    handleChangeSelectedLabel(event, item.id)
                  }
                />
                <div
                  className="box_label_popup"
                  style={{ backgroundColor: item.colorLabel }}
                  onClick={() => handleClickSelectedLabel(item.id)}
                >
                  <span>
                    <span className="span_dot">&#x2022;</span> {item.name}
                  </span>
                </div>
                <div className="btn_edit_delete">
                  <FontAwesomeIcon
                    icon={faPencil}
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() => {
                      handleClickLabel(item);
                    }}
                  />
                  <Popconfirm
                    title="Xóa nhãn"
                    description="Bạn có chắc chắn muốn xóa nhãn này không ?"
                    onConfirm={() => {
                      deleteLabel(item.id);
                    }}
                    okText="Có"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    cancelText="Không"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{ cursor: "pointer" }}
                    />
                  </Popconfirm>
                </div>
              </div>
            ))}
            {errorLabels && (
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "14px", color: "red" }}>
                  Danh sách trống
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="box_btn_label">
          <Button className="btn_add_label" onClick={openPopupCreateLabel}>
            <FontAwesomeIcon icon={faPlus} style={{ cursor: "pointer" }} />
            Thêm nhãn
          </Button>
        </div>
      </div>
      {isOpenPopupCreateLabel && (
        <PopupCreateLabel
          position={popupPositionPopupCreateLabel}
          onClose={closePopupCreateLabel}
        />
      )}{" "}
      {isOpenPopupUpdateLabel && (
        <PopupUpdateLabel
          position={popupPositionPopupUpdateLabel}
          onClose={closePopupUpdateLabel}
          item={labelSelected}
        />
      )}{" "}
    </div>
  );
};

export default PopupLabelTable;
