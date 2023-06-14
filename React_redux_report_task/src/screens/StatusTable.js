import React, { useMemo, useRef, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { useSelector, useDispatch } from "react-redux";
import { getStatuses } from "../actions/statusSlice.js";
import "./CSS/StatusTablebutton.css";
import "./CSS/EditButton.css";
import { CSVLink } from "react-csv";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

export default function App() {
  const dispatch = useDispatch();
  const statuses = useSelector((state) => state.status.statuses);
  const statusError = useSelector((state) => state.status.error);
  
  // Initial pagination state
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 3,
  });

  const [exportData, setExportData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [exportDisabled, setExportDisabled] = useState(true);
  const tableInstanceRef = useRef(null);

  useEffect(() => {
    dispatch(getStatuses(pagination));
    setExportData(statuses); // Update exportData with the latest data
  }, [dispatch, pagination, statuses]);

  useEffect(() => {
    const rowIds = Object.keys(rowSelection);
    const hasSelectedRows = rowIds.some((id) => rowSelection[id]);

    setExportDisabled(!hasSelectedRows);
    setExportData(hasSelectedRows ? rowIds.map((id) => statuses[id]) : []);
  }, [rowSelection, statuses]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "taskName",
        header: "Task Name",
        muiTableHeadCellProps: { sx: { color: "green" } },
        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
      },
      {
        accessorKey: "date",
        header: "Date",
        muiTableHeadCellProps: { sx: { color: "green" } },
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue());
          const formattedDate = `${date.getDate()}/${date.toLocaleString("en", {
            month: "long",
          })}/${date.getFullYear()}`;

          return <span>{formattedDate}</span>;
        },
      },

      {
        accessorKey: "time",
        header: "Time",
        muiTableHeadCellProps: { sx: { color: "green" } },
        Cell: ({ cell }) => {
          const { hours, minutes } = cell.row.original;
          const formattedTime = `${hours}:${
            minutes < 10 ? "0" + minutes : minutes
          }`;
          return <span>{formattedTime}</span>;
        },
      },
      {
        accessorKey: "success",
        header: "Success",
        muiTableHeadCellProps: { sx: { color: "green", width: "80%" } },
        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
        width: 200,
      },
      {
        accessorKey: "obstacle",
        header: "Obstacle",
        muiTableHeadCellProps: { sx: { color: "green" } },
        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
      },
      {
        accessorKey: "nextDayPlan",
        header: "Next Day Plan",
        muiTableHeadCellProps: { sx: { color: "green", width: "20%" } },
        Cell: ({ cell }) => <span>{cell.getValue()}</span>,
        width: 300,
      },
      {
        accessorKey: "status",
        header: "Status",
        muiTableHeadCellProps: { sx: { color: "green" } },
        Cell: ({ cell }) => {
          let color;
          let fontWeight;
          let fontSize;
          const cellValue = String(cell.getValue()).toLowerCase().trim();

          switch (cellValue) {
            case "pending":
              color = "darkred";
              fontWeight = "bold";
              fontSize = "1.5em"; // Adjust this as needed
              break;
            case "approved":
              color = "darkgreen";
              fontWeight = "bold";
              fontSize = "1.5em"; // Adjust this as needed
              break;
            case "disabled":
              color = "darkgrey";
              fontWeight = "bold";
              fontSize = "1.5em"; // Adjust this as needed
              break;
            default:
              color = "black";
              fontWeight = "normal";
              fontSize = "1em"; // Default font size
          }
          return (
            <span style={{ color, fontWeight, fontSize }}>
              {cell.getValue()}
            </span>
          );
        },
      },
      {
        header: "Actions",
        Cell: ({ row }) => (
          <button className="btn">
            Edit
            <svg className="svg" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
            </svg>
          </button>
        ),
      },
    ],
    []
  );

 

  if (statusError) {
    return <div>Error: {statusError.message}</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button className="col-1 p-3 m-3 custom-btn">Add Status</button>
        <div
          className="col-3"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <CSVLink
            data={exportData}
            filename="status_data.csv"
            style={{ pointerEvents: exportDisabled ? "none" : "auto" }}
            onClick={() => setExportDisabled(true)}
          >
            <button
              className="your-button-styles"
              style={{
                whiteSpace: "nowrap",
                width: "200px",
                backgroundColor: "red",
                opacity: exportDisabled ? 0.5 : 1,
              }}
              disabled={exportDisabled}
            >
              <FontAwesomeIcon icon={faFileExcel} bounce />
              Export Selected Data
            </button>
          </CSVLink>
        </div>
        <div style={{ margin: "10px" }}>
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </div>
      </div>

      <MaterialReactTable
        columns={columns}
        data={statuses}
        enableColumnOrdering
        enableRowSelection
        enablePagination={false}
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        tableInstanceRef={tableInstanceRef}
      />

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <button
          className="btn-pagination btn-info col-2 p-1 m-1"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageNumber: prev.pageNumber - 1,
            }))
          }
        >
          Previous Page
        </button>
        <button
          className="btn-pagination btn-secondary col-2 p-1 m-1"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageNumber: prev.pageNumber + 1,
            }))
          }
        >
          Next Page
        </button>
      </div>
    </div>
  );
}
