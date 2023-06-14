import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { fetchUsers, deleteUser, updateUser } from "../actions/userSlice.js";
import { CSVLink } from "react-csv";
import "./CSS/UserData.css";
import { fetchDepartments, fetchRoles } from "../actions/authSlice.js";
import Modal from "react-modal";
import Swal from "sweetalert2";

const UserData = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const departments = useSelector((state) => state.auth.departments);
  const roles = useSelector((state) => state.auth.roles);
  const loading = useSelector((state) => state.user.isLoading);

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [clearSelected, setClearSelected] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [processedUsers, setProcessedUsers] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userBeingEdited, setUserBeingEdited] = useState(null);

  useEffect(() => {
    // Set isDownloaded back to false whenever selectedRows changes
    setIsDownloaded(false);
  }, [selectedRows]);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDepartments());
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (clearSelected) {
      setClearSelected(false);
    }
  }, [clearSelected]);

  // The useEffect where you process users
  useEffect(() => {
    if (users.length && departments.length && roles.length) {
      const usersWithNames = users.map((user) => {
        const departmentName = departments.find(
          (dept) => dept.id === user.department_Id
        )?.department_Name;
        const roleName = roles.find(
          (role) => role.id === user.role_Id
        )?.role_Name;

        return {
          ...user,
          departmentName,
          roleName,
        };
      });
      setProcessedUsers(usersWithNames);
      setFilteredUsers(usersWithNames);
    }
  }, [users, departments, roles]);

  const handleEdit = (user) => {
    setUserBeingEdited(user);
    setEditModalVisible(true);
  };

  const handleUpdate = () => {
    console.log(userBeingEdited);
    dispatch(updateUser({ userData: userBeingEdited }))
      .then(() => {       
        console.log("Update successful!");
        Swal.fire(
          "Updated!",
          "The user has been updated successfully.",
          "success"
        );
      })
      .catch((error) => {
        console.log("Update failed:", error);
        Swal.fire(
          "Failed!",
          "The user update failed.",
          "error"
        );
      })
      .finally(() => {
        setEditModalVisible(false);
        setUserBeingEdited(null);
      });
  };

  const handleDownload = () => {
    if (!isDownloaded && selectedRows.length > 0) {
      setIsDownloaded(true);
      setClearSelected(true);
    }
  };

  // The handleFilter function
  const handleFilter = (e) => {
    const keyword = e.target.value.toLowerCase();
    if (keyword.trim() === "") {
      setFilteredUsers(processedUsers);
    } else {
      const filteredData = processedUsers.filter((user) =>
        user.name.toLowerCase().includes(keyword)
      );
      setFilteredUsers(filteredData);
    }
  };

  const handleRowSelected = (rows) => {
    setSelectedRows(rows.selectedRows);
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length > 0) {
      const selectedIds = selectedRows.map((row) => row.id);
      dispatch(deleteUser(selectedIds))
        .then(() => {
          // Handle the success case
          console.log("Deletion successful!");
          Swal.fire({
            title: "Deleted!",
            text: "The selected users have been deleted successfully.",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        })
        .catch((error) => {
          // Handle the error case
          console.log("Deletion failed:", error);
          Swal.fire(
            "Failed!",
            "The deletion failed.",
            "error"
          );
        })
        .finally(() => {
          setSelectedRows([]);
        });
    }
  };


  const handleExportCSV = () => {
    //setClearSelected(true);
    const csvData = selectedRows.map((user) => ({
      Name: user.name,
      Email: user.email,
      Address: user.address,
      Username: user.username,
      Email_Registered: user.email_Register_Date,
      Department: user.department_Id,
      Role: user.role_Id,
      Is_Deleted: String(user.is_Deleted),
      Password_Change_Status: String(user.passwordChangeStatus),
    }));
    return csvData;
  };

  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Address",
      selector: "address",
      sortable: true,
    },
    {
      name: "Username",
      selector: "username",
      sortable: true,
    },
    {
      name: "Email Registered",
      selector: "email_Register_Date",
      sortable: true,
    },
    {
      name: "Password",
      selector: "password",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Department",
      selector: "departmentName",
      sortable: true,
    },
    {
      name: "Role",
      selector: "roleName",
      sortable: true,
    },
    {
      name: "Is_Deleted",
      selector: "is_Deleted",
      sortable: true,
      // Add a cell renderer to convert the boolean value to a string
      cell: (row) => String(row.is_Deleted),
    },
    {
      name: "Password Change Status",
      selector: "passwordChangeStatus",
      sortable: true,
      // Add a cell renderer to convert the boolean value to a string
      cell: (row) => String(row.passwordChangeStatus),
    },

    {
      name: "Action",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="btn btn-success m-2"
            onClick={() => handleEdit(row)}
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="data-table-container">
      <h2 className="users-title">Users Data</h2>
      <div className="table-toolbar">
        <div className="filter-export-container">
          <input
            className="col-2 text-center"
            type="text"
            placeholder="Filter by name"
            onChange={handleFilter}
          />
          <CSVLink
            data={handleExportCSV()} // Call the function here
            filename="users.csv"
            className={`btn btn-warning col-2 m-2 ${
              selectedRows.length && !isDownloaded ? "" : "disabled"
            }`}
            onClick={handleDownload} // Updated the onClick handler
          >
            Export Your Selected Data
          </CSVLink>
          <button
            className="btn btn-danger m-2 col-1"
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
          >
            Delete Selected
          </button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredUsers.length ? filteredUsers : users}
        selectableRows
        clearSelectedRows={clearSelected}
        onSelectedRowsChange={handleRowSelected}
        selectableRowsComponentProps={{
          selectAllRows: selectAll,
          selectAllRowsOnPage: selectAll,
          onChange: handleSelectAll,
        }}
        pagination
        persistTableHead
      />
      <Modal
        isOpen={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
        contentLabel="Edit User"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "30%", // Change width
            height: "60%", // Change height
          },
        }}
      >
        <h2>Edit User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <label
            className="form-control text-danger"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Name:
            <input
              type="text"
              value={userBeingEdited?.name || ""}
              onChange={(e) =>
                setUserBeingEdited({ ...userBeingEdited, name: e.target.value })
              }
            />
          </label>
          <label
            className="form-control text-danger"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Address:
            <input
              type="text"
              value={userBeingEdited?.address || ""}
              onChange={(e) =>
                setUserBeingEdited({
                  ...userBeingEdited,
                  address: e.target.value,
                })
              }
            />
          </label>
          <label
            className="form-control text-danger"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Username:
            <input
              type="text"
              value={userBeingEdited?.username || ""}
              onChange={(e) =>
                setUserBeingEdited({
                  ...userBeingEdited,
                  username: e.target.value,
                })
              }
            />
          </label>
          <label
            className="form-control text-danger"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Email:
            <input
              type="text"
              value={userBeingEdited?.email || ""}
              onChange={(e) =>
                setUserBeingEdited({
                  ...userBeingEdited,
                  email: e.target.value,
                })
              }
            />
          </label>
          <label>
            Department:
            <select
              value={userBeingEdited?.department_Id || ""}
              onChange={(e) =>
                setUserBeingEdited({
                  ...userBeingEdited,
                  department_Id: parseInt(e.target.value),
                })
              }
            >
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.department_Name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Role:
            <select
              value={userBeingEdited?.role_Id || ""}
              onChange={(e) =>
                setUserBeingEdited({
                  ...userBeingEdited,
                  role_Id: parseInt(e.target.value),
                })
              }
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_Name}
                </option>
              ))}
            </select>
          </label>

          <label
            className="form-control text-danger"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Is_Deleted:
            <select
              value={userBeingEdited?.is_Deleted || ""}
              onChange={(e) =>
                setUserBeingEdited({
                  ...userBeingEdited,
                  is_Deleted: JSON.parse(e.target.value),
                })
              }
            >
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </label>

          <label
            className="form-control text-danger"
            style={{ color: "black", fontWeight: "bold" }}
          >
            Password_Change_Status:
            <select
              value={userBeingEdited?.passwordChangeStatus || ""}
              onChange={(e) =>
                setUserBeingEdited({
                  ...userBeingEdited,
                  passwordChangeStatus: JSON.parse(e.target.value),
                })
              }
            >
              <option value={true}>True</option>
              <option value={false}>False</option>
            </select>
          </label>

          {/* Add more fields as needed */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <button type="submit" className="m-2">
              Update
            </button>
            <button
              type="button"
              className="m-2 btn btn-danger"
              onClick={() => setEditModalVisible(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserData;
