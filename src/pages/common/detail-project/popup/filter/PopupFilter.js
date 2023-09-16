import "./stylePopupFilter.css";
import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartGantt,
  faCheckCircle,
  faClock,
  faClockFour,
  faExclamationCircle,
  faFilter,
  faSort,
  faTags,
  faTimesCircle,
  faTrash,
  faUserCog,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Input, Popconfirm, Select } from "antd";
import Image from "../../../../../helper/img/Image";
import { userCurrent } from "../../../../../helper/inForUser";
import { useAppDispatch, useAppSelector } from "../../../../../app/hook";
import { GetMemberProject } from "../../../../../app/reducer/detail-project/DPMemberProject.reducer";
import { useState } from "react";
import { GetLabelProject } from "../../../../../app/reducer/detail-project/DPLabelProject.reducer";
import {
  GetFilter,
  SetFilter,
} from "../../../../../app/reducer/detail-project/DPBoardSlice.reducer";
import { debounce } from "lodash";
import useDebounce from "../../../../../custom-hook/useDebounce";

const { Option } = Select;

const PopupFilter = ({ position, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target != null &&
        event.target.className != null &&
        !popupRef.current.contains(event.target) &&
        !String(event.target.className)
          .split(" ")
          .includes("ant-select-item-option-content") &&
        !String(event.target.className).split(" ").includes("image_common") &&
        !String(event.target.className)
          .split(" ")
          .includes("item_label_filter") &&
        !String(event.target.className)
          .split(" ")
          .includes("ant-select-item") &&
        !String(event.target.className)
          .split(" ")
          .includes("item_member_filter") &&
        !String(event.target.className).split(" ").includes("item_label_filter")
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
    top: position.top,
    left: position.left,
    zIndex: 9999999999,
    paddingBottom: "7px",
    width: "400px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
  };

  const memberProject = useAppSelector(GetMemberProject);
  const labelProject = useAppSelector(GetLabelProject);
  const [listMemberNoUserCurrent, setListMemberNoUserCurrent] = useState([]);
  const [valueMultiMember, setValueMultiMember] = useState([]);
  const [valueMultiLabel, setValueMultiLabel] = useState([]);
  const dispatch = useAppDispatch();
  const filterTodo = useAppSelector(GetFilter);
  const [isCheckedNoMember, setIsCheckedNoMember] = useState(false);
  const [isCheckedNoLabel, setIsCheckedNoLabel] = useState(false);
  const [isCheckedNoDueDate, setIsCheckedNoDueDate] = useState(false);
  const [isCheckedOverDueDate, setIsCheckedOverDueDate] = useState(false);
  const [isCheckedNotComplete, setIsCheckedNotComplete] = useState(false);
  const [isCheckedCompleteSoon, setIsCheckedCompleteSoon] = useState(false);
  const [isCheckedCompleteLate, setIsCheckedCompleteLate] = useState(false);
  const [valueName, setValueName] = useState("");
  const [isCheckedMe, setIsCheckedMe] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isAllMember, setIsAllMember] = useState(false);
  const [isAllLabel, setIsAllLabel] = useState(false);

  useEffect(() => {
    if (filterTodo?.name != null) {
      setValueName(filterTodo.name);
    }
  }, []);

  useEffect(() => {
    if (filterTodo?.member != null) {
      setIsCheckedNoMember(filterTodo.member.includes("none"));
      setIsCheckedMe(filterTodo.member.includes(userCurrent.id));

      let listMemberAfter = filterTodo.member.filter(
        (member) => member !== "none" && member !== userCurrent.id
      );
      setValueMultiMember(listMemberAfter);
    }
  }, [filterTodo?.member, userCurrent.id]);

  useEffect(() => {
    if (filterTodo?.label != null) {
      setIsCheckedNoLabel(filterTodo.label.includes("none"));

      let listLabelAfter = filterTodo.label.filter((label) => label !== "none");
      setValueMultiLabel(listLabelAfter);
    }
  }, [filterTodo?.label]);

  useEffect(() => {
    if (filterTodo?.dueDate != null) {
      setIsCheckedNoDueDate(filterTodo.dueDate.includes("noDueDate"));
      setIsCheckedOverDueDate(filterTodo.dueDate.includes("overDueDate"));
      setIsCheckedNotComplete(filterTodo.dueDate.includes("notComplete"));
      setIsCheckedCompleteSoon(filterTodo.dueDate.includes("completeSoon"));
      setIsCheckedCompleteLate(filterTodo.dueDate.includes("completeLate"));
    }
  }, [filterTodo?.dueDate]);

  const debouncedNameValue = useDebounce(valueName, 650);

  const handleUserInteraction = () => {
    setUserInteracted(!userInteracted);
  };

  const handleChangeValueName = (e) => {
    setValueName(e.target.value);
  };

  const handleClickNoMember = () => {
    handleUserInteraction();
    setIsCheckedNoMember(!isCheckedNoMember);
  };

  const handleClickNoLabel = () => {
    handleUserInteraction();
    setIsCheckedNoLabel(!isCheckedNoLabel);
  };

  const handleClickNoDueDate = () => {
    handleUserInteraction();
    setIsCheckedNoDueDate(!isCheckedNoDueDate);
  };

  const handleClickOverDueDate = () => {
    handleUserInteraction();
    setIsCheckedOverDueDate(!isCheckedOverDueDate);
  };

  const handleClickNotComplete = () => {
    handleUserInteraction();
    setIsCheckedNotComplete(!isCheckedNotComplete);
  };

  const handleClickCompleteSoon = () => {
    handleUserInteraction();
    setIsCheckedCompleteSoon(!isCheckedCompleteSoon);
  };

  const handleClickCompleteLate = () => {
    handleUserInteraction();
    setIsCheckedCompleteLate(!isCheckedCompleteLate);
  };

  const handleClickMe = () => {
    handleUserInteraction();
    setIsCheckedMe(!isCheckedMe);
  };

  const handleChangeValueMultiMember = (e) => {
    handleUserInteraction();
    setValueMultiMember(e);
  };

  const handleChangeLabelFilter = (e) => {
    handleUserInteraction();
    setValueMultiLabel(e);
  };

  useEffect(() => {
    setListMemberNoUserCurrent(
      memberProject.filter((item) => item.id !== userCurrent.id)
    );
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      loadFilter();
    }
  }, [userInteracted]);

  const isFirstRenderDebounce = useRef(true);

  useEffect(() => {
    if (isFirstRenderDebounce.current) {
      isFirstRenderDebounce.current = false;
    } else {
      handleUserInteraction();
    }
  }, [debouncedNameValue]);

  useEffect(() => {
    if (filterTodo != null) {
      setValueName(filterTodo.name);
      setIsCheckedNoMember(filterTodo.member.includes("none"));
      setIsCheckedMe(filterTodo.member.includes(userCurrent.id));
      setIsCheckedNoLabel(filterTodo.label.includes("none"));
      setIsCheckedNoDueDate(filterTodo.dueDate.includes("noDueDate"));
      setIsCheckedOverDueDate(filterTodo.dueDate.includes("overDueDate"));
      setIsCheckedNotComplete(filterTodo.dueDate.includes("notComplete"));
      setIsCheckedCompleteSoon(filterTodo.dueDate.includes("completeSoon"));
      setIsCheckedCompleteLate(filterTodo.dueDate.includes("completeLate"));
      let listMemberAfter = filterTodo.member.filter(
        (member) => member !== "none" && member !== userCurrent.id
      );
      setValueMultiMember(listMemberAfter);
      let listLabelAfter = filterTodo.label.filter((label) => label !== "none");
      setValueMultiLabel(listLabelAfter);
    }
  }, []);

  const loadFilter = () => {
    let filter = {
      name: debouncedNameValue,
      member: [],
      label: [],
      dueDate: [],
    };

    if (isCheckedNoMember) {
      filter.member = [...valueMultiMember, "none"];
    } else {
      filter.member = valueMultiMember.filter((member) => member !== "none");
    }

    if (isCheckedNoLabel) {
      filter.label = [...valueMultiLabel, "none"];
    } else {
      filter.label = valueMultiLabel.filter((label) => label !== "none");
    }

    if (isCheckedMe) {
      filter.member.push(userCurrent.id);
    } else {
      filter.member = filter.member.filter(
        (member) => member !== userCurrent.id
      );
    }

    const dueDateOptions = [
      { option: isCheckedNoDueDate, value: "noDueDate" },
      { option: isCheckedOverDueDate, value: "overDueDate" },
      { option: isCheckedNotComplete, value: "notComplete" },
      { option: isCheckedCompleteSoon, value: "completeSoon" },
      { option: isCheckedCompleteLate, value: "completeLate" },
    ];

    filter.dueDate = dueDateOptions
      .filter(({ option }) => option)
      .map(({ value }) => value);

    dispatch(SetFilter(filter));
  };

  const handleClickAllMember = () => {
    if (!isAllMember) {
      const memberIdList = listMemberNoUserCurrent
        .filter((member) => member !== userCurrent.id)
        .map((member) => member.id);

      setValueMultiMember(memberIdList);
    } else {
      setValueMultiMember([]);
    }
    handleUserInteraction();
    setIsAllMember(!isAllMember);
  };

  useEffect(() => {
    if (
      labelProject != null &&
      valueMultiLabel.length === labelProject.length
    ) {
      setIsAllLabel(true);
    }
  }, [valueMultiLabel]);

  useEffect(() => {
    if (
      memberProject != null &&
      valueMultiMember.length === memberProject.length - 1
    ) {
      setIsAllMember(true);
    }
  }, [valueMultiMember]);

  const handleClickAllLabel = () => {
    if (!isAllLabel) {
      const labelIdList = labelProject.map((label) => label.id);

      setValueMultiLabel(labelIdList);
    } else {
      setValueMultiLabel([]);
    }
    handleUserInteraction();
    setIsAllLabel(!isAllLabel);
  };

  return (
    <div ref={popupRef} style={popupStyle} className="popup-general">
      {" "}
      <div className="header_filter">
        {" "}
        <FontAwesomeIcon icon={faFilter} style={{ marginRight: "7px" }} />
        Bộ lọc
      </div>
      <div
        style={{ padding: "10px", overflowY: "auto" }}
        className="box_filter"
      >
        <div>
          <span style={{ fontSize: "14px" }}>
            <FontAwesomeIcon icon={faFilter} style={{ marginRight: "7px" }} />
            Tìm kiếm:
          </span>{" "}
          <br />
          <Input
            type="text"
            value={valueName}
            onChange={(e) => {
              handleChangeValueName(e);
            }}
            placeholder="Tìm kiếm ..."
            style={{ marginTop: "3px" }}
          />
          <div style={{ marginTop: "5px" }}>
            <span style={{ fontSize: "13px", color: "red", marginTop: "5px" }}>
              Tìm kiếm theo tên thẻ
            </span>
          </div>
        </div>
        <div style={{ marginTop: "12px" }}>
          <span style={{ fontSize: "14px" }}>
            <FontAwesomeIcon
              icon={faUserGroup}
              style={{ marginRight: "7px" }}
            />
            Thành viên:
          </span>{" "}
          <br />
          <div className="content_member_filter">
            <div className="box_general" onClick={handleClickNoMember}>
              <div>
                <Checkbox
                  checked={isCheckedNoMember}
                  onChange={handleClickNoMember}
                />{" "}
              </div>
              <div className="content_right" style={{ marginLeft: "20px" }}>
                <span>
                  <FontAwesomeIcon
                    icon={faUserCog}
                    style={{ marginRight: "7px" }}
                  />
                  <span style={{ fontSize: "14px" }}>
                    Thẻ không có thành viên
                  </span>
                </span>
              </div>
            </div>
            <div className="box_general" onClick={handleClickMe}>
              <div>
                <Checkbox checked={isCheckedMe} onChange={handleClickMe} />{" "}
              </div>
              <div className="content_right">
                <Image
                  url={userCurrent.image}
                  picxel={30}
                  marginRight={8}
                  name={userCurrent.name + " " + userCurrent.code}
                />
                <span style={{ fontSize: "14px" }}>Thẻ giao cho tôi</span>
              </div>
            </div>
            <div className="box_general">
              <div>
                <Checkbox
                  checked={isAllMember}
                  onChange={handleClickAllMember}
                />
              </div>
              <div className="content_right">
                {" "}
                <Select
                  value={valueMultiMember}
                  onChange={handleChangeValueMultiMember}
                  mode="multiple"
                  placeholder="Chọn thành viên"
                  style={{ width: "320px" }}
                  filterOption={(input, option) => {
                    const name =
                      option.children.props.children[1].toLowerCase();
                    const email =
                      option.children.props.children[3].toLowerCase();
                    const inputValue = input.toLowerCase();

                    return (
                      name.includes(inputValue) || email.includes(inputValue)
                    );
                  }}
                >
                  {listMemberNoUserCurrent.map((item) => (
                    <Option
                      value={item.id}
                      key={item.id}
                      className="item_member_filter_option"
                    >
                      <div
                        style={{ display: "flex", alignItems: "center" }}
                        className="item_member_filter"
                      >
                        <Image picxel={28} url={item.image} marginRight={5} />
                        {item.name} ({item.email})
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "12px" }}>
          <span style={{ fontSize: "14px" }}>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: "7px" }} />
            Ngày hạn:
          </span>{" "}
          <br />
          <div className="box_deadline_filter">
            <div
              className="box_general"
              style={{ marginTop: "10px" }}
              onClick={handleClickNoDueDate}
            >
              <div>
                <Checkbox
                  checked={isCheckedNoDueDate}
                  onChange={handleClickNoDueDate}
                />{" "}
              </div>
              <div className="content_right">
                <span>
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    style={{ marginRight: "7px", fontSize: "18px" }}
                  />
                  <span style={{ fontSize: "14px" }}>
                    Thẻ không có ngày hạn
                  </span>
                </span>
              </div>
            </div>
            <div className="box_general" onClick={handleClickOverDueDate}>
              <div>
                <Checkbox
                  checked={isCheckedOverDueDate}
                  onChange={handleClickOverDueDate}
                />{" "}
              </div>
              <div className="content_right">
                <span>
                  <FontAwesomeIcon
                    icon={faClock}
                    style={{
                      marginRight: "7px",
                      fontSize: "18px",
                      color: "red",
                    }}
                  />
                  <span style={{ fontSize: "14px" }}>Thẻ quá hạn</span>
                </span>
              </div>
            </div>
            <div className="box_general" onClick={handleClickNotComplete}>
              <div>
                <Checkbox
                  checked={isCheckedNotComplete}
                  onChange={handleClickNotComplete}
                />{" "}
              </div>
              <div className="content_right">
                <span>
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    style={{
                      marginRight: "7px",
                      fontSize: "18px",
                      color: "orange",
                    }}
                  />
                  <span style={{ fontSize: "14px" }}>Thẻ chưa hoàn thành</span>
                </span>
              </div>
            </div>
            <div className="box_general" onClick={handleClickCompleteSoon}>
              <div>
                <Checkbox
                  checked={isCheckedCompleteSoon}
                  onChange={handleClickCompleteSoon}
                />{" "}
              </div>
              <div className="content_right">
                <span>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{
                      marginRight: "7px",
                      fontSize: "18px",
                      color: "rgb(65, 219, 88)",
                    }}
                  />
                  <span style={{ fontSize: "14px" }}>
                    Thẻ đã hoàn thành (sớm)
                  </span>
                </span>
              </div>
            </div>
            <div className="box_general" onClick={handleClickCompleteLate}>
              <div>
                <Checkbox
                  checked={isCheckedCompleteLate}
                  onChange={handleClickCompleteLate}
                />{" "}
              </div>
              <div className="content_right">
                <span>
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    style={{
                      marginRight: "7px",
                      fontSize: "18px",
                      color: "red",
                    }}
                  />
                  <span style={{ fontSize: "14px" }}>
                    Thẻ đã hoàn thành (muộn)
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "12px" }}>
          <span style={{ fontSize: "14px" }}>
            <FontAwesomeIcon icon={faTags} style={{ marginRight: "7px" }} />
            Nhãn:
          </span>{" "}
          <br />
          <div className="box_label_filter">
            <div className="box_general" onClick={handleClickNoLabel}>
              <div>
                <Checkbox
                  checked={isCheckedNoLabel}
                  onChange={handleClickNoLabel}
                />{" "}
              </div>
              <div className="content_right">
                <span>
                  <FontAwesomeIcon
                    icon={faTags}
                    style={{ marginRight: "7px" }}
                  />
                  <span style={{ fontSize: "14px" }}>Thẻ không có nhãn</span>
                </span>
              </div>
            </div>
            <div className="box_general">
              <div>
                <Checkbox checked={isAllLabel} onChange={handleClickAllLabel} />{" "}
              </div>
              <div className="content_right">
                <Select
                  value={valueMultiLabel}
                  onChange={handleChangeLabelFilter}
                  mode="multiple"
                  placeholder="Chọn nhãn"
                  style={{ width: "320px" }}
                  filterOption={(input, option) =>
                    option.props.children.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {labelProject.map((item) => (
                    <Option
                      value={item.id}
                      key={item.id}
                      className="item_label_filter_option"
                    >
                      <div
                        style={{
                          backgroundColor: item.colorLabel,
                          borderRadius: "7px",
                        }}
                        className="item_label_filter"
                      >
                        {item.name}
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupFilter;
