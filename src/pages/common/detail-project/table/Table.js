import { useEffect } from "react";
import { useAppSelector } from "../../../../app/hook";
import {
  GetBoard,
  GetListTable,
} from "../../../../app/reducer/detail-project/DPBoardSlice.reducer";
import { useState } from "react";
import LoadingIndicator from "../../../../helper/loading";
import TableDragAndDrop from "./TableDragAndDrop";
import { memo } from "react";

const Table = () => {
  const data = useAppSelector(GetListTable);
  const board = useAppSelector(GetBoard);
  const [listViewTable, setListViewTable] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (board.lists.length > 0) {
      setListViewTable(data);
      setLoading(false);
    }
  }, [board]);

  return (
    <div>
      <TableDragAndDrop data={listViewTable} />
      {loading && <LoadingIndicator />}
    </div>
  );
};

export default memo(Table);
