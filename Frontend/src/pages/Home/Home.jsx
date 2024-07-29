import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Ensure you include the CSS file
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CONFIG from '../../../config.js'; // Ensure this path is correct

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [startRange, setStartRange] = useState(0);
  const [endRange, setEndRange] = useState(100);
  const [loading, setLoading] = useState(false); // Loader state

  const tables = [
    "ETL_small_dataset_1.csv",
    "ETL_small_dataset_2.csv",
    "ETL_small_dataset_3.csv",
    "ETL_small_dataset_4.csv",
    "ETL_small_dataset_5.csv",
  ];

  useEffect(() => {
    if (selectedTable) {
      setLoading(true); // Show loader
      fetch(`${CONFIG.backendUrl}/records/${selectedTable}`)
        .then((response) => response.json())
        .then((data) => {
          setAllData(data.data);
          setData(data.data);
          setLoading(false); // Hide loader
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          toast.error("Error fetching data", {
            position: "top-right",
            autoClose: 1000,
            className: "toast-error",
          });
          setLoading(false); // Hide loader
        });
    }
  }, [selectedTable]);

  const fetchData = () => {
    if (selectedTable === "" || selectedTable === "Select a table") {
      toast.error("Please select a table", {
        position: "top-right",
        autoClose: 1000,
        className: "toast-error",
      });
    } else {
      const selectedData = data.map((row) => {
        let selectedRow = {};
        for (let col in selectedColumns) {
          if (selectedColumns[col]) {
            selectedRow[col] = row[col];
          }
        }
        return selectedRow;
      });

      setSelectedData(selectedData);
      setFilteredData(selectedData.slice(0, 100));
      setShowTable(true);
    }
  };

  const handleCheckboxChange = (event) => {
    setSelectedColumns({
      ...selectedColumns,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    const newSelectedColumns = {};
    Object.keys(data[0]).forEach((col) => {
      if (!isColumnEmpty(col)) {
        newSelectedColumns[col] = event.target.checked;
      }
    });
    setSelectedColumns(newSelectedColumns);
  };

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
    setSelectedColumns({});
    setShowTable(false);
    setSelectAll(false);
  };

  const isColumnEmpty = (col) => {
    return data.every((row) => !row[col]);
  };

  const handleCheckboxClick = (col) => {
    if (isColumnEmpty(col)) {
      toast.error("This column is empty", {
        position: "top-right",
        autoClose: 1000,
        className: "toast-error",
      });
    } else {
      toast.success(`${col} column is selected`, {
        position: "top-right",
        autoClose: 1000,
        className: "toast-success",
      });
    }
  };

  const visualizeGraphs = () => {
    navigate("/graph", { state: { data: allData } });
  };

  const handleRangeChange = (event) => {
    const { name, value } = event.target;
    if (name === "startRange") {
      setStartRange(Number(value));
    } else {
      setEndRange(Number(value));
    }
  };

  const filterData = () => {
    if (startRange < 0) {
      toast.warning("Start Range can't be less than 0", {
        position: "top-right",
        autoClose: 1000,
        className: "toast-warning",
      });
    } else if (startRange >= selectedData.length) {
      toast.warning("Start Range is greater than Data limit", {
        position: "top-right",
        autoClose: 1000,
        className: "toast-warning",
      });
    } else if (endRange > selectedData.length) {
      toast.warning("End Range is greater than Data limit", {
        position: "top-right",
        autoClose: 1000,
        className: "toast-warning",
      });
    } else if (startRange > endRange) {
      toast.warning("Start Range cannot be greater than End Range", {
        position: "top-right",
        autoClose: 1000,
        className: "toast-warning",
      });
    } else {
      setFilteredData(selectedData.slice(startRange, endRange));
      toast.success("The data was filtered successfully!", {
        position: "top-right",
        autoClose: 1000,
        className: "toast-success",
      });
    }
  };

  return (
    <div className="home-container">
      <h1>Product Analysis</h1>
      <div className="dropdown-container">
        <select
          className="select-dropdown"
          onChange={handleTableChange}
          value={selectedTable}
        >
          <option value="">Select a table</option>
          {tables.map((table, index) => (
            <option key={index} value={table}>
              {table}
            </option>
          ))}
        </select>
        {!loading && selectedTable && (
          <>
            <div className="dropdown-container-checkbox">
              <input
                type="checkbox"
                name="all"
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
              All
            </div>
            {data.length > 0 &&
              Object.keys(data[0]).map((col) => (
                <div
                  key={col}
                  className="dropdown-container-checkbox"
                  onClick={() => handleCheckboxClick(col)}
                >
                  <input
                    type="checkbox"
                    name={col}
                    checked={selectedColumns[col] || false}
                    onChange={handleCheckboxChange}
                    disabled={isColumnEmpty(col)}
                  />
                  {col}
                </div>
              ))}
          </>
        )}
      </div>
      {!loading && <button onClick={fetchData}>Fetch Data</button>}
      {showTable && filteredData.length > 0 && (
        <div className="date-range-filter">
          <div className="data-range-container">
            <div className="start-range">
              <label>Start Range </label>
              <input
                type="number"
                name="startRange"
                value={startRange}
                onChange={handleRangeChange}
                min="0"
                max={endRange - 1}
                onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
              />
            </div>
            <div className="end-range">
              <label>End Range </label>
              <input
                type="number"
                name="endRange"
                value={endRange}
                onChange={handleRangeChange}
                min={startRange + 1}
                onFocus={(e) => e.target.value === "0" && (e.target.value = "")}
              />
            </div>
          </div>
          <button className="filter-data-btn" onClick={filterData}>
            Filter Data
          </button>
        </div>
      )}

      {showTable && filteredData.length > 0 && (
        <div className="data-container">
          <div className="data-table-container">
            {showTable && <h2>Fetched Data</h2>}
            <table>
              <thead>
                <tr>
                  {Object.keys(filteredData[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(row).map((col) => (
                      <td key={col}>{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={visualizeGraphs}>Visualize Graphs</button>
        </div>
      )}
      <ToastContainer />
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
