import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../app/hook";
import {
  GetDetailTodo,
  SetPageActivityDetailTodo,
} from "../../../../../app/reducer/detail-project/DPDetailTodoSlice.reducer";
import "./styleListActivity.css";
import ActivityComponent from "./ActivityComponent";
import { DetailTodoAPI } from "../../../../../api/detail-todo/detailTodo.api";

const ListActivity = () => {
  const detailTodo = useAppSelector(GetDetailTodo);
  const [listActivity, setListActivity] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const dispatch = useAppDispatch();
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (detailTodo != null) {
      setListActivity(detailTodo.activities.data);
      setTotalPages(detailTodo.activities.totalPages);
    }
  }, [detailTodo]);

  const showMoreActivity = () => {
    console.log(currentPage + 1);
    DetailTodoAPI.getPageActivity(detailTodo.id, currentPage + 1).then(
      (response) => {
        dispatch(SetPageActivityDetailTodo(response.data.data));
      }
    );
    setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <div>
        {listActivity != null &&
          listActivity.length > 0 &&
          listActivity.map((item, index) => (
            <ActivityComponent item={item} key={index} />
          ))}
      </div>
      {totalPages > 1 && currentPage < totalPages - 1 && (
        <span className="show_more_activities" onClick={showMoreActivity}>
          Xem thêm hoạt động...
        </span>
      )}
    </div>
  );
};

export default ListActivity;
