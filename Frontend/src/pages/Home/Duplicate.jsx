import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import * as d3 from "d3";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [startRange, setStartRange] = useState(0);
  const [endRange, setEndRange] = useState(100);
  const [filteredData, setFilteredData] = useState(data);

  // List of tables (CSV files)
  const tables = [
    "ETL_small_dataset_1.csv",
    "ETL_small_dataset_2.csv",
    "ETL_small_dataset_3.csv",
    "ETL_small_dataset_4.csv",
    "ETL_small_dataset_5.csv",
  ];

  // Loading the data from a csv file
  useEffect(() => {
    if (selectedTable) {
      d3.csv(`./ETL_Data/${selectedTable}`).then((loadedData) => {
        setAllData(loadedData);
        setData(loadedData.slice(0, 100));
        // console.log(loadedData);
      });
    }
  }, [selectedTable]);

  const fetchData = () => {
    console.log("Fetching the data...");
    const selectedData = data.map((row) => {
      let selectedRow = {};
      for (let col in selectedColumns) {
        if (selectedColumns[col]) {
          selectedRow[col] = row[col];
        }
      }
      return selectedRow;
    });
    // console.log("Selected Data : ", selectedData);
    setSelectedData(selectedData);
    setShowTable(true);
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
    // console.log("current col : ", col);
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
    console.log("Filter Data Function called");
    setFilteredData(selectedData.slice(startRange, endRange));
  };

  return (
    <div className="home-container">
      <h1>Product Analysis</h1>
      <div className="dropdown-container">
        <select className="select-dropdown" onChange={handleTableChange} value={selectedTable}>
          <option value="">Select a table</option>
          {tables.map((table, index) => (
            <option key={index} value={table}>
              {table}
            </option>
          ))}
        </select>
        {selectedTable && (
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
      <button onClick={fetchData}>Fetch Data</button>
      {showTable && (
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
              />
            </div>
          </div>
            <button className="filter-data-btn" onClick={filterData}>
              Filter Data
            </button>
        </div>
      )}

      {showTable && selectedData.length > 0 && (
        <div className="data-container">
          <div className="data-table-container">
          {showTable && <h2>Fetched Data</h2>}
          <table>
            <thead>
              <tr>
                {Object.keys(selectedData[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedData.map((row, index) => (
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
    </div>
  );
};

export default Home;
