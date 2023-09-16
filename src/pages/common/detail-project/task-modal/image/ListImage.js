import { useEffect } from "react";
import ImageComponent from "./ImageComponent";
import { useAppSelector } from "../../../../../app/hook";
import { GetDetailTodo } from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import { GetPeriodCurrent } from "../../../../../app/reducer/detail-project/DPPeriodSlice.reducer";
import { GetProject } from "../../../../../app/reducer/detail-project/DPProjectSlice.reducer";
import { useState } from "react";

const ListImage = () => {
  const detailTodo = useAppSelector(GetDetailTodo);
  const [listImage, setListImage] = useState([]);

  useEffect(() => {
    if (detailTodo != null) {
      setListImage(detailTodo.images);
    }
  }, [detailTodo]);

  return (
    <div>
      <div style={{ marginTop: "15px" }}>
        {listImage.length > 0 &&
          listImage.map((item, index) => (
            <div>
              <ImageComponent key={item.id} item={item} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListImage;

