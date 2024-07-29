import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./Graph.css";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Graph = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  const [categories, setCategories] = useState([]);
  const [distributorCodes, setDistributorCodes] = useState([]);
  const [productCodes, setProductCodes] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [selectedDistributorCode, setSelectedDistributorCode] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPincode, setSelectedPincode] = useState("");
  const [pincodes, setPincodes] = useState([
    "Pincode1",
    "Pincode2",
    "Pincode3",
  ]);
  const [selectedDistance, setSelectedDistance] = useState("");
  const [distances, setDistances] = useState([
    "Distance1",
    "Distance2",
    "Distance3",
  ]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const location = useLocation();

  useEffect(() => {
    console.log("Location useEffect Executed");
    if (location.state && location.state.data) {
      const loadedData = location.state.data;
      // console.log("Data from useLocation hook : ", loadedData);

      loadedData.forEach((d) => {
        d.week_start_date = new Date(d.week_start_date);
        d.QUANTITY_sum = +d.QUANTITY_sum;
      });

      setData(loadedData);
      // Get unique categories
      const categories = Array.from(new Set(loadedData.map((d) => d.Category)));
      setCategories(categories);
      // console.log("Categories : ", categories);

      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      }

      // Filter data by DistributorCode
      const distributorCodes = Array.from(
        new Set(loadedData.map((d) => d.DistributorCode))
      );
      setDistributorCodes(distributorCodes);

      if (distributorCodes.length > 0) {
        setSelectedDistributorCode(distributorCodes[0]);
      }

      // Filter data by ProductCode
      const productCodes = Array.from(
        new Set(loadedData.map((d) => d.ProductCode))
      );
      setProductCodes(productCodes);
      if (productCodes.length > 0) {
        setSelectedProductCode(productCodes[0]);
      }

      // Filter data by City
      const cities = Array.from(new Set(loadedData.map((d) => d.City)));
      setCities(cities);

      if (cities.length > 0) {
        setSelectedCity(cities[0]);
      }

      // Filter data by Pincode
      const pincodes = Array.from(
        new Set(loadedData.map((d) => d.Distributor_PinNo))
      );
      setPincodes(pincodes);

      if (pincodes.length > 0) {
        setSelectedPincode(pincodes[0]);
      }

      // Filter data by Distance
      // Filter data by Distance
      const distances = ["Below 150 km", "150 km and above"];
      setDistances(distances);

      if (distances.length > 0) {
        setSelectedDistance(distances[0]);
      }
    }
  }, [location]);

  // useEffect(() => {
  //   // Load and process the data
  //   d3.csv("ETL_small_dataset.csv").then((data) => {
  //     data.forEach((d) => {
  //       d.week_start_date = new Date(d.week_start_date);
  //       d.QUANTITY_sum = +d.QUANTITY_sum;
  //     });

  //     setData(data);
  //     setAllData(data);

  //     // Get unique categories
  //     const categories = Array.from(new Set(data.map((d) => d.Category)));
  //     setCategories(categories);

  //     if (categories.length > 0) {
  //       setSelectedCategory(categories[0]);
  //     }

  //     // Filter data by DistributorCode
  //     const distributorCodes = Array.from(
  //       new Set(data.map((d) => d.DistributorCode))
  //     );
  //     setDistributorCodes(distributorCodes);

  //     if (distributorCodes.length > 0) {
  //       setSelectedDistributorCode(distributorCodes[0]);
  //     }

  //     // Filter data by ProductCode
  //     const productCodes = Array.from(new Set(data.map((d) => d.ProductCode)));
  //     setProductCodes(productCodes);
  //     if (productCodes.length > 0) {
  //       setSelectedProductCode(productCodes[0]);
  //     }

  //     // Filter data by City
  //     const cities = Array.from(new Set(data.map((d) => d.City)));
  //     setCities(cities);

  //     if (cities.length > 0) {
  //       setSelectedCity(cities[0]);
  //     }
  //   });
  // }, []);

  //   This useEffect is for SelectedCategory
  useEffect(() => {
    if (selectedCategory) {
      const filteredData = data.filter((d) => d.Category === selectedCategory);
      // Transform filteredData into Graph_dataArray
      const Graph_data = filteredData.reduce((acc, obj) => {
        if (!acc[obj.week_start_date]) {
          acc[obj.week_start_date] = {
            week_start_date: obj.week_start_date,
            QUANTITY_sum: 0,
          };
        }
        acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
        return acc;
      }, {});

      const Graph_dataArray = Object.values(Graph_data);
      const graphTitle = { Category: selectedCategory };

      drawGraph(Graph_dataArray, graphTitle, "category-container");
    }
  }, [selectedCategory, data]);

  //   This useEffect is for Selected Distributor Code
  useEffect(() => {
    if (selectedDistributorCode) {
      const filteredData = data.filter(
        (d) => d.DistributorCode === selectedDistributorCode
      );

      // Transform filteredData into Graph_dataArray
      const Graph_data = filteredData.reduce((acc, obj) => {
        if (!acc[obj.week_start_date]) {
          acc[obj.week_start_date] = {
            week_start_date: obj.week_start_date,
            QUANTITY_sum: 0,
          };
        }
        acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
        return acc;
      }, {});

      const Graph_dataArray = Object.values(Graph_data);
      const graphTitle = { DistributorCode: selectedDistributorCode };

      drawGraph(Graph_dataArray, graphTitle, "distributor-code-container");
    }
  }, [selectedDistributorCode, data]);

  // This useEffect is for SelectedProductCode
  useEffect(() => {
    if (selectedProductCode) {
      const filteredData = data.filter(
        (d) => d.ProductCode === selectedProductCode
      );
      // console.log("FilteredData : " ,filteredData);

      // Transform filteredData into Graph_dataArray
      const Graph_data = filteredData.reduce((acc, obj) => {
        if (!acc[obj.week_start_date]) {
          acc[obj.week_start_date] = {
            week_start_date: obj.week_start_date,
            QUANTITY_sum: 0,
          };
        }
        acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
        return acc;
      }, {});

      const Graph_dataArray = Object.values(Graph_data);
      const graphTitle = { ProductCode: selectedProductCode };

      drawGraph(Graph_dataArray, graphTitle, "product-code-container");
      // drawGraph(filteredData, selectedProductCode);
    }
  }, [selectedProductCode, data]);

  // This useEffect is for SelectedCity
  useEffect(() => {
    if (selectedCity) {
      const filteredData = data.filter((d) => d.City === selectedCity);
      // console.log("FilteredData : " ,filteredData);

      // Transform filteredData into Graph_dataArray
      const Graph_data = filteredData.reduce((acc, obj) => {
        if (!acc[obj.week_start_date]) {
          acc[obj.week_start_date] = {
            week_start_date: obj.week_start_date,
            QUANTITY_sum: 0,
          };
        }
        acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
        return acc;
      }, {});

      const Graph_dataArray = Object.values(Graph_data);
      const graphTitle = { City: selectedCity };

      drawGraph(Graph_dataArray, graphTitle, "city-container");
      // drawGraph(filteredData, selectedCity);
    }
  }, [selectedCity, data]);

  // This useEffect is for SelectedPincode
  useEffect(() => {
    if (selectedPincode) {
      const filteredData = data.filter(
        (d) => d.Distributor_PinNo === selectedPincode
      );
      // console.log("FilteredData : " ,filteredData);

      // Transform filteredData into Graph_dataArray
      const Graph_data = filteredData.reduce((acc, obj) => {
        if (!acc[obj.week_start_date]) {
          acc[obj.week_start_date] = {
            week_start_date: obj.week_start_date,
            QUANTITY_sum: 0,
          };
        }
        acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
        return acc;
      }, {});

      const Graph_dataArray = Object.values(Graph_data);
      const graphTitle = { Pincode: selectedPincode };

      drawGraph(Graph_dataArray, graphTitle, "pincode-container");
      // drawGraph(filteredData, selectedPincode);
    }
  }, [selectedPincode, data]);

  // This useEffect is for SelectedDistance
  useEffect(() => {
    if (selectedDistance) {
      const filteredData = data.filter((d) => {
        if (selectedDistance === "Below 150 km") {
          return d.dist_bw_cfa_dist < 150;
        } else if (selectedDistance === "150 km and above") {
          return d.dist_bw_cfa_dist >= 150;
        }
        return false;
      });

      // Transform filteredData into Graph_dataArray
      const Graph_data = filteredData.reduce((acc, obj) => {
        if (!acc[obj.week_start_date]) {
          acc[obj.week_start_date] = {
            week_start_date: obj.week_start_date,
            QUANTITY_sum: 0,
          };
        }
        acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
        return acc;
      }, {});

      const Graph_dataArray = Object.values(Graph_data);
      const graphTitle = { Distance: selectedDistance };

      drawGraph(Graph_dataArray, graphTitle, "distance-container");
      // drawGraph(filteredData, selectedDistance);
    }
  }, [selectedDistance, data]);

  //   Common Function to Draw the Graph week wise Date vs Total Quantity using D3.js
  const drawGraph = (data, graphTitle, graphContainer) => {
    // console.log("Data : ", data);
    // console.log("Graph Title : ", graphTitle);

    // Set dimensions and margins for the chart
    const margin = { top: 70, right: 100, bottom: 50, left: 120 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Remove the existing graph
    d3.select(`#${graphContainer}`).selectAll("*").remove();

    // Set up the x and y scales
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // Create the SVG element and append it to the chart container
    const svg = d3
      .select(`#${graphContainer}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set the domains for the x and y scales
    x.domain(d3.extent(data, (d) => d.week_start_date));
    y.domain([0, d3.max(data, (d) => d.QUANTITY_sum)]);

    // Creating dates array
    let datesArray = data.map((item) => item.week_start_date);

    // Add the x-axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .style("font-size", "14px")
      .call(
        d3
          .axisBottom(x)
          .tickValues(datesArray)
          .tickFormat(d3.timeFormat("%m/%d/%Y"))
      )
      .selectAll(".tick line")
      .style("stroke-opacity", 1);

    svg.selectAll(".tick text").attr("fill", "rgb(16, 75, 75)");

    // Add the y-axis
    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${width})`)
      .style("font-size", "14px")
      .call(d3.axisRight(y).ticks(10).tickFormat(d3.format(".2s")))
      .selectAll(".tick text")
      .style("fill", "rgb(16, 75, 75)");

    // Set up the line generator
    const line = d3
      .line()
      .x((d) => x(d.week_start_date))
      .y((d) => y(d.QUANTITY_sum));

    // Create an area generator
    const area = d3
      .area()
      .x((d) => x(d.week_start_date))
      .y0(height)
      .y1((d) => y(d.QUANTITY_sum));

    // Add the area path
    svg
      .append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "white")
      .style("opacity", 0.5);

    // Add the line path
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#85bb65")
      .attr("stroke-width", 1)
      .attr("d", line);

    // Add dots for each data point
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.week_start_date))
      .attr("cy", (d) => y(d.QUANTITY_sum))
      .attr("r", 5)
      .style("fill", "#65a765");

    // Add tooltip elements and event listeners
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    const circle = svg
      .append("circle")
      .attr("r", 0)
      .attr("fill", "#581845")
      .style("stroke", "white")
      .attr("opacity", 0.7)
      .style("pointer-events", "none");

    const tooltipLineX = svg
      .append("line")
      .attr("class", "tooltip-line")
      .attr("id", "tooltip-line-x")
      .attr("stroke", "#581845")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "2,2");

    const tooltipLineY = svg
      .append("line")
      .attr("class", "tooltip-line")
      .attr("id", "tooltip-line-y")
      .attr("stroke", "#581845")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "2,2");

    const listeningRect = svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all");

    listeningRect.on("mousemove", function (event) {
      const [xCoord] = d3.pointer(event, this);
      const bisectDate = d3.bisector((d) => d.week_start_date).left;
      const x0 = x.invert(xCoord);
      const i = bisectDate(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      const d = x0 - d0.week_start_date > d1.week_start_date - x0 ? d1 : d0;
      const xPos = x(d.week_start_date);
      const yPos = y(d.QUANTITY_sum);

      circle.attr("cx", xPos).attr("cy", yPos);
      circle.transition().duration(50).attr("r", 5);

      tooltipLineX
        .style("display", "block")
        .attr("x1", xPos)
        .attr("x2", xPos)
        .attr("y1", 0)
        .attr("y2", height);
      tooltipLineY
        .style("display", "block")
        .attr("y1", yPos)
        .attr("y2", yPos)
        .attr("x1", 0)
        .attr("x2", width);

      tooltip
        .style("display", "block")
        .style("position", "absolute")
        // .style("left", `${width + 300}px`)
        // .style("top", `${yPos + 180}px`)
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 35}px`)
        .style("opacity", 1)
        .html(
          `Date: ${
            d.week_start_date
              ? new Date(d.week_start_date).toLocaleDateString()
              : "N/A"
          }<br>Quantity: ${
            d.QUANTITY_sum !== undefined ? d.QUANTITY_sum.toFixed(2) : "N/A"
          }`
        );
    });

    listeningRect.on("mouseleave", function () {
      circle.transition().duration(50).attr("r", 0);
      tooltip.style("display", "none");
      tooltipLineX.style("display", "none");
      tooltipLineY.style("display", "none");
    });

    // Add the chart title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", 20)
      .attr("y", -20)
      .style("font-size", "20px")
      .style("font-weight", "bold")
      .style("text-anchor", "middle")
      .style("fill", "rgb(16, 75, 75)")
      .text(
        `${Object.keys(graphTitle)[0]}: ${
          graphTitle[Object.keys(graphTitle)[0]]
        }`
      );

    // Add the y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", width + 50)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "rgb(16, 75, 75)")
      .style("font-weight", "500")
      .text("Quantity");

    // Add the x-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "rgb(16, 75, 75)")
      .style("font-weight", "500")
      .text("Week Start Date");
  };

  // Filter data by selected date range
  const filterDataByDateRange = (
    attribute,
    selectedAttribute,
    graphContainer,
    filterAttr
  ) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    // console.log(attribute);

    if (!startDate) {
      // console.log("Please Select Start Date");
      toast.warning(`Please Select Start Date`, {
        position: "top-right",
        autoClose: 1000,
        className: "toast-success",
      });
    } else if (!endDate) {
      // console.log("Please Select End Date");
      toast.warning(`Please Select End Date`, {
        position: "top-right",
        autoClose: 1000,
        className: "toast-success",
      });
    } else if (startDate > endDate) {
      toast.warning(`Start Date Can't be greater than End Date`, {
        position: "top-right",
        autoClose: 1000,
        className: "toast-success",
      });
    } else {
      let filteredDataByAttr = [];
      if (filterAttr === "dist_bw_cfa_dist") {
        filteredDataByAttr = data.filter((d) => {
          if (selectedDistance === "Below 150 km") {
            return d.dist_bw_cfa_dist < 150;
          } else if (selectedDistance === "150 km and above") {
            return d.dist_bw_cfa_dist >= 150;
          }
          return false;
        });
      } else {
        filteredDataByAttr = data.filter(
          (d) => d[filterAttr] === selectedAttribute
        );
      }
      const filteredData = filteredDataByAttr.filter((d) => {
        const date = new Date(d.week_start_date);
        return date >= start && date <= end;
      });

      // Transform filteredData into Graph_dataArray
      const Graph_data = filteredData.reduce((acc, obj) => {
        if (!acc[obj.week_start_date]) {
          acc[obj.week_start_date] = {
            week_start_date: obj.week_start_date,
            QUANTITY_sum: 0,
          };
        }
        acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
        return acc;
      }, {});

      const Graph_dataArray = Object.values(Graph_data);
      const graphTitle = { [attribute]: selectedAttribute };

      // Update the graph with Graph_dataArray
      drawGraph(Graph_dataArray, graphTitle, graphContainer);
    }
  };

  // Function to get data from the last two weeks
  const getLastTwoWeeksData = (
    attribute,
    selectedAttribute,
    graphContainer,
    filterAttr
  ) => {
    // Get the most recent date in the data
    const mostRecentDate = new Date(
      Math.max.apply(
        null,
        data.map((d) => new Date(d.week_start_date))
      )
    );
    const twoWeeksBefore = new Date(mostRecentDate);
    twoWeeksBefore.setDate(mostRecentDate.getDate() - 7);

    let filteredData = [];
    if (filterAttr === "dist_bw_cfa_dist") {
      filteredData = data.filter((d) => {
        if (selectedDistance === "Below 150 km") {
          return d.dist_bw_cfa_dist < 150;
        } else if (selectedDistance === "150 km and above") {
          return d.dist_bw_cfa_dist >= 150;
        }
        return false;
      });
    } else {
      filteredData = data.filter((d) => d[filterAttr] === selectedAttribute);
    }

    const lastTwoWeeksData = filteredData.filter((d) => {
      return new Date(d.week_start_date) >= twoWeeksBefore;
    });

    // Transform lastTwoWeeksData into Graph_dataArray
    const Graph_dataTwoWeeks = lastTwoWeeksData.reduce((acc, obj) => {
      if (!acc[obj.week_start_date]) {
        acc[obj.week_start_date] = {
          week_start_date: obj.week_start_date,
          QUANTITY_sum: 0,
        };
      }
      acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
      return acc;
    }, {});

    const Graph_dataArrayTwoWeeks = Object.values(Graph_dataTwoWeeks);
    const graphTitleTwoWeeks = { [attribute]: selectedAttribute };

    // Update the graph with lastTwoWeeksData
    drawGraph(Graph_dataArrayTwoWeeks, graphTitleTwoWeeks, graphContainer);
  };

  // Get Last Month data
  const getLastMonthData = (
    attribute,
    selectedAttribute,
    graphContainer,
    filterAttr
  ) => {
    const mostRecentDate = new Date(
      Math.max.apply(
        null,
        data.map((d) => new Date(d.week_start_date))
      )
    );
    const fourWeeksBefore = new Date(mostRecentDate);
    fourWeeksBefore.setDate(mostRecentDate.getDate() - 21); // Subtract 28 days from the most recent date

    let filteredData = [];
    if (filterAttr === "dist_bw_cfa_dist") {
      filteredData = data.filter((d) => {
        if (selectedDistance === "Below 150 km") {
          return d.dist_bw_cfa_dist < 150;
        } else if (selectedDistance === "150 km and above") {
          return d.dist_bw_cfa_dist >= 150;
        }
        return false;
      });
    } else {
      filteredData = data.filter((d) => d[filterAttr] === selectedAttribute);
    }

    const lastMonthData = filteredData.filter((d) => {
      return new Date(d.week_start_date) >= fourWeeksBefore;
    });

    // Transform lastMonthData into Graph_dataArray
    const Graph_data = lastMonthData.reduce((acc, obj) => {
      if (!acc[obj.week_start_date]) {
        acc[obj.week_start_date] = {
          week_start_date: obj.week_start_date,
          QUANTITY_sum: 0,
        };
      }
      acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
      return acc;
    }, {});

    const Graph_dataArray = Object.values(Graph_data);
    const graphTitle = { [attribute]: selectedAttribute };
    // console.log("Graph Title in last Month function : ", graphTitle);

    // Update the graph with lastMonthData
    drawGraph(Graph_dataArray, graphTitle, graphContainer);
  };

  // Function to get data from the last year
  const getLastYearData = (
    attribute,
    selectedAttribute,
    graphContainer,
    filterAttr
  ) => {
    // Get the most recent date in the data
    const mostRecentDate = new Date(
      Math.max.apply(
        null,
        data.map((d) => new Date(d.week_start_date))
      )
    );
    const oneYearBefore = new Date(mostRecentDate);
    oneYearBefore.setFullYear(mostRecentDate.getFullYear() - 1); // Subtract 1 year from the most recent date
    let filteredData = [];
    if (filterAttr === "dist_bw_cfa_dist") {
      filteredData = data.filter((d) => {
        if (selectedDistance === "Below 150 km") {
          return d.dist_bw_cfa_dist < 150;
        } else if (selectedDistance === "150 km and above") {
          return d.dist_bw_cfa_dist >= 150;
        }
        return false;
      });
    } else {
      filteredData = data.filter((d) => d[filterAttr] === selectedAttribute);
    }
    const lastYearData = filteredData.filter((d) => {
      return new Date(d.week_start_date) >= oneYearBefore;
    });

    // Transform lastYearData into Graph_dataArray
    const Graph_dataYear = lastYearData.reduce((acc, obj) => {
      if (!acc[obj.week_start_date]) {
        acc[obj.week_start_date] = {
          week_start_date: obj.week_start_date,
          QUANTITY_sum: 0,
        };
      }
      acc[obj.week_start_date].QUANTITY_sum += obj.QUANTITY_sum;
      return acc;
    }, {});

    const Graph_dataArrayYear = Object.values(Graph_dataYear);
    const graphTitleYear = { [attribute]: selectedAttribute };

    // Update the graph with lastYearData
    drawGraph(Graph_dataArrayYear, graphTitleYear, graphContainer);
  };

  return (
    <div className="graph">
      <div className="all_graphs">
        {/* Category Container */}
        <div className="category-wise">
          <h1>Weekly Quantity Visualization by Category</h1>
          <div>
            <label htmlFor="category-select">Select Category </label>
            <select
              className="select-dropdown"
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="date-range-filters">
            <div className="date-input">
              <label htmlFor="start-date">Start Date </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label htmlFor="end-date">End Date </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn"
              onClick={() =>
                filterDataByDateRange(
                  "Category",
                  selectedCategory,
                  "category-container",
                  "Category"
                )
              }
            >
              Filter
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastTwoWeeksData(
                  "Category",
                  selectedCategory,
                  "category-container",
                  "Category"
                )
              }
            >
              Last Two Weeks
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastMonthData(
                  "Category",
                  selectedCategory,
                  "category-container",
                  "Category"
                )
              }
            >
              Last Month
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastYearData(
                  "Category",
                  selectedCategory,
                  "category-container",
                  "Category"
                )
              }
            >
              Last Year
            </button>
          </div>
          <div id="category-container" />
        </div>

        {/* Distributor Code Container */}

        <div className="distributor-code-wise">
          <h1>Weekly Quantity Visualization by Distributor Code</h1>
          <div>
            <label htmlFor="distributor-code-select">
              Select Distributor Code
            </label>
            <select
              className="select-dropdown"
              id="distributor-code-select"
              value={selectedDistributorCode}
              onChange={(e) => setSelectedDistributorCode(e.target.value)}
            >
              {distributorCodes.map((distributorCode) => (
                <option key={distributorCode} value={distributorCode}>
                  {distributorCode}
                </option>
              ))}
            </select>
          </div>
          <div className="date-range-filters">
            <div className="date-input">
              <label htmlFor="start-date">Start Date </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label htmlFor="end-date">End Date </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn"
              onClick={() =>
                filterDataByDateRange(
                  "DistributorCode",
                  selectedDistributorCode,
                  "distributor-code-container",
                  "DistributorCode"
                )
              }
            >
              Filter
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastTwoWeeksData(
                  "DistributorCode",
                  selectedDistributorCode,
                  "distributor-code-container",
                  "DistributorCode"
                )
              }
            >
              Last Two Weeks
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastMonthData(
                  "DistributorCode",
                  selectedDistributorCode,
                  "distributor-code-container",
                  "DistributorCode"
                )
              }
            >
              Last Month
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastYearData(
                  "DistributorCode",
                  selectedDistributorCode,
                  "distributor-code-container",
                  "DistributorCode"
                )
              }
            >
              Last Year
            </button>
          </div>
          <div id="distributor-code-container" />
        </div>

        {/* Product Code Container */}

        <div className="product-code-wise">
          <h1>Weekly Quantity Visualization by Product Code</h1>
          <div>
            <label htmlFor="product-code-select">Select Product Code </label>
            <select
              className="select-dropdown"
              id="product-code-select"
              value={selectedProductCode}
              onChange={(e) => setSelectedProductCode(e.target.value)}
            >
              {productCodes.map((productCode) => (
                <option key={productCode} value={productCode}>
                  {productCode}
                </option>
              ))}
            </select>
          </div>
          <div className="date-range-filters">
            <div className="date-input">
              <label htmlFor="start-date">Start Date </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label htmlFor="end-date">End Date </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn"
              onClick={() =>
                filterDataByDateRange(
                  "ProductCode",
                  selectedProductCode,
                  "product-code-container",
                  "ProductCode"
                )
              }
            >
              Filter
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastTwoWeeksData(
                  "ProductCode",
                  selectedProductCode,
                  "product-code-container",
                  "ProductCode"
                )
              }
            >
              Last Two Weeks
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastMonthData(
                  "ProductCode",
                  selectedProductCode,
                  "product-code-container",
                  "ProductCode"
                )
              }
            >
              Last Month
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastYearData(
                  "ProductCode",
                  selectedProductCode,
                  "product-code-container",
                  "ProductCode"
                )
              }
            >
              Last Year
            </button>
          </div>
          <div id="product-code-container" />
        </div>

        {/* City Container */}

        <div className="city-wise">
          <h1>Weekly Quantity Visualization by City</h1>
          <div>
            <label htmlFor="city-select">Select City </label>
            <select
              className="select-dropdown"
              id="city-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="date-range-filters">
            <div className="date-input">
              <label htmlFor="start-date">Start Date </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label htmlFor="end-date">End Date </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn"
              onClick={() =>
                filterDataByDateRange(
                  "City",
                  selectedCity,
                  "city-container",
                  "City"
                )
              }
            >
              Filter
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastTwoWeeksData(
                  "City",
                  selectedCity,
                  "city-container",
                  "City"
                )
              }
            >
              Last Two Weeks
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastMonthData("City", selectedCity, "city-container", "City")
              }
            >
              Last Month
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastYearData("City", selectedCity, "city-container", "City")
              }
            >
              Last Year
            </button>
          </div>
          <div id="city-container" />
        </div>

        {/* Pincode Container */}

        <div className="pincode-wise">
          <h1>Weekly Quantity Visualization by Pincode</h1>
          <div>
            <label htmlFor="pincode-select">Select Pincode </label>
            <select
              className="select-dropdown"
              id="pincode-select"
              value={selectedPincode}
              onChange={(e) => setSelectedPincode(e.target.value)}
            >
              {pincodes.map((pincode) => (
                <option key={pincode} value={pincode}>
                  {pincode}
                </option>
              ))}
            </select>
          </div>
          <div className="date-range-filters">
            <div className="date-input">
              <label htmlFor="start-date">Start Date </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label htmlFor="end-date">End Date </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn"
              onClick={() =>
                filterDataByDateRange(
                  "Pincode",
                  selectedPincode,
                  "pincode-container",
                  "Distributor_PinNo"
                )
              }
            >
              Filter
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastTwoWeeksData(
                  "Pincode",
                  selectedPincode,
                  "pincode-container",
                  "Distributor_PinNo"
                )
              }
            >
              Last Two Weeks
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastMonthData(
                  "Pincode",
                  selectedPincode,
                  "pincode-container",
                  "Distributor_PinNo"
                )
              }
            >
              Last Month
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastYearData(
                  "Pincode",
                  selectedPincode,
                  "pincode-container",
                  "Distributor_PinNo"
                )
              }
            >
              Last Year
            </button>
          </div>
          <div id="pincode-container" />
        </div>

        {/* Distance Container */}

        <div className="distance-wise">
          <h1>Weekly Quantity Visualization by Distance</h1>
          <div>
            <label htmlFor="distance-select">Select Distance </label>
            <select
              className="select-dropdown"
              id="distance-select"
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(e.target.value)}
            >
              {distances.map((distance) => (
                <option key={distance} value={distance}>
                  {distance}
                </option>
              ))}
            </select>
          </div>
          <div className="date-range-filters">
            <div className="date-input">
              <label htmlFor="start-date">Start Date </label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="date-input">
              <label htmlFor="end-date">End Date </label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button
              className="btn"
              onClick={() =>
                filterDataByDateRange(
                  "Distance",
                  selectedDistance,
                  "distance-container",
                  "dist_bw_cfa_dist"
                )
              }
            >
              Filter
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastTwoWeeksData(
                  "Distance",
                  selectedDistance,
                  "distance-container",
                  "dist_bw_cfa_dist"
                )
              }
            >
              Last Two Weeks
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastMonthData(
                  "Distance",
                  selectedDistance,
                  "distance-container",
                  "dist_bw_cfa_dist"
                )
              }
            >
              Last Month
            </button>
            <button
              className="btn"
              onClick={() =>
                getLastYearData(
                  "Distance",
                  selectedDistance,
                  "distance-container",
                  "dist_bw_cfa_dist"
                )
              }
            >
              Last Year
            </button>
          </div>
          <div id="distance-container" />
        </div>
      </div>
    </div>
  );
};

export default Graph;
