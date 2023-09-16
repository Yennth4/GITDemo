import moment from "moment";

export const formatDateTime = (date) => {
  const options = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = new Date(date).toLocaleDateString("en-US", options);
  return formattedDate;
};

export const formatDateToString = (timeString) => {
  let timeStr = new Date(timeString);
  let yearTimeStr = timeStr.getFullYear();
  let monthTimeStr = String(timeStr.getMonth() + 1).padStart(2, "0");
  let dateTimeStr = String(timeStr.getDate()).padStart(2, "0");
  let hoursTimeStr = String(timeStr.getHours()).padStart(2, "0");
  let minutesTimeStr = String(timeStr.getMinutes()).padStart(2, "0");
  let secondsTimeStr = String(timeStr.getSeconds()).padStart(2, "0");

  return `${yearTimeStr}-${monthTimeStr}-${dateTimeStr} ${hoursTimeStr}:${minutesTimeStr}:${secondsTimeStr}`;
};

export const convertDateToStringTodo = (timestamp) => {
  const date = moment(timestamp);
  const formattedTime = date.format("MMM DD");
  return formattedTime;
};

export const convertTimestampToCustomFormat = (timestamp) => {
  const date = moment(timestamp);
  const formattedTime = date.format("DD/MM/YYYY hh:mm A");
  return formattedTime;
};

export const convertTimestampToCustomFormatVer2 = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};
