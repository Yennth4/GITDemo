import React, { useRef } from "react";
import JoditEditor from "jodit-react";
import "jodit/build/jodit.min.css";
import { memo } from "react";

const FormEditor = ({ value, onChange }) => {
  const editor = useRef(null);

  return (
    <JoditEditor ref={editor} value={value} tabIndex={1} onBlur={onChange} />
  );
};

export default memo(FormEditor);
