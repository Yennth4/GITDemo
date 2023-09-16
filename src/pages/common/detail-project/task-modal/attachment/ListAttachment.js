import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../../app/hook";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import "./styleListAttachment.css";
import Attachment from "./Attachment";

const ListAttachment = () => {
  const detailTodo = useAppSelector(GetDetailTodo);
  const [listAttachment, setListAttachment] = useState([]);

  useEffect(() => {
    if (detailTodo != null) {
      setListAttachment(detailTodo.attachments);
    }
  }, [detailTodo]);

  return (
    <div>
      <div style={{ marginTop: "15px" }}>
        {listAttachment.length > 0 &&
          listAttachment.map((item, index) => (
            <div>
              <Attachment key={item.id} item={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListAttachment;
