import { Tooltip } from "antd";
import "./styleImage.css";
import { memo } from "react";

const Image = ({ url, picxel, marginRight, name }) => {
  return (
    <Tooltip title={name}>
      <img
        src={url}
        style={{
          width: picxel + "px",
          height: picxel + "px",
          marginRight: marginRight + "px",
        }}
        className="image_common"
        alt="."
      />
    </Tooltip>
  );
};

export default memo(Image);
