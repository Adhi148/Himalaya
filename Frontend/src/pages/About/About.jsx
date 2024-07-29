import React, { useEffect } from "react";
import "./About.css";
// import jailData from "./jdi_data_daily.csv"

const About = () => {
  const heros = [
    "Thor",
    "Iron Man",
    "captain America",
    "Natasha Romenoff",
    "hulk",
  ];

  useEffect(() => {
    // Function to generate Random data
    const generateData = () => {
      let data = [];
      let startDate = new Date(2024, 0, 1); // Start date: January 1, 2024

      for (let i = 0; i < 300; i++) {
        // Generate a random value between 1 and 10000
        let value = Math.floor(Math.random() * 10000) + 1 + 10000;

        // Format the date as "yyyy-mm-dd"
        let date = startDate.toISOString().split("T")[0];

        // Add the record to the data array
        data.push({ date: date, value: value });

        // Increment the date by 7 days
        startDate.setDate(startDate.getDate() + 7);
      }

      return data;
    };

    const data = generateData();
    console.log("The generated Dataset is : ", data);

    data.forEach((d) => {
      const parseDate = d3.timeParse("%Y-%m-%d");
      d.date = parseDate(d["date"]);
      d.value = +d["value"];
    });

    console.log("Updated Data : ", data);

    // Selecting elements using D3.js
    d3.select("h2").style("font-size", "20px");
    // d3.select("ul")
    //   .selectAll("li")
    //   .data(heros)
    //   .enter()
    //   .append("li")
    //   .text((hero) => hero + " !");

    let numbers = [20, 30, 50, 30, 10, 90];
    let barHeight = 40;

    d3.select("svg")
      .selectAll("rect")
      .data(numbers)
      .enter()
      .append("rect")
      .attr("width", (d) => d)
      .attr("height", barHeight - 4)
      .attr("transform", (d, i) => `translate(0 , ${50 + i * barHeight})`);

    // Margin and Dimensions for Chart
    const margin = { top: 70, right: 30, bottom: 40, left: 80 };
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Set up the x and y scales
    const x = d3.scaleTime().range([0, width]);

    const y = d3.scaleLinear().range([height, 0]);

    // create the SVG element and append it to the chart container
    const svg = d3
      .select("#chart-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left} , ${margin.top})`);

    //  create tooltip div
    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    // Create a fake dataset
    const dataset = [
      { date: new Date("2024-01-01"), value: 200 },
      { date: new Date("2024-02-01"), value: 250 },
      { date: new Date("2024-03-01"), value: 180 },
      { date: new Date("2024-04-01"), value: 300 },
      { date: new Date("2024-05-01"), value: 280 },
      { date: new Date("2024-06-01"), value: 220 },
      { date: new Date("2024-07-01"), value: 300 },
      { date: new Date("2024-08-01"), value: 450 },
      { date: new Date("2024-09-01"), value: 280 },
      { date: new Date("2024-10-01"), value: 600 },
      { date: new Date("2024-11-01"), value: 250 },
      { date: new Date("2024-12-01"), value: 320 },
    ];

    // Define the x and y domains
    x.domain(d3.extent(data, (d) => d.date));
    y.domain([9500, d3.max(data, (d) => d.value)]);

    // Add the x-axis

    // old code for x-axis
    // svg
    //   .append("g")
    //   .attr("transform", `translate(0 , ${height})`)
    //   .call(
    //     d3
    //       .axisBottom(x)
    //       .ticks(d3.timeMonth.every(6))
    //       .tickFormat(d3.timeFormat("%b %Y"))
    //   );

    // new code for x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .style("font-size", "14px")
      .call(
        d3
          .axisBottom(x)
          .tickValues(x.ticks(d3.timeMonth.every(6)))
          .tickFormat(d3.timeFormat("%b %Y"))
      )
      .call((g) => g.select(".domain").remove())
      .selectAll(".tick line")
      .style("stroke-opacity", 0);
    svg.selectAll(".tick text").attr("fill", "#777");

    // Add the y-axis
    //   svg.append("g")
    //   .call(d3.axisLeft(y)
    //   .ticks((d3.max(data , d => d.value) - 9500)/2000)
    //   .tickFormat(d => {
    //     return `${(d/1000).toFixed(0)}k`
    //   })
    // )

    // new code for y-axis
    svg
      .append("g")
      .style("font-size", "14px")
      .call(
        d3
          .axisLeft(y)
          .ticks((d3.max(data, (d) => d.value) - 9500) / 2000)
          .tickFormat((d) => {
            return `${(d / 1000).toFixed(0)}k`;
          })
          .tickSize(0)
          .tickPadding(10)
      )
      .call((g) => g.select(".domain").remove())
      .selectAll(".tick text")
      .style("fill", "#777")
      .style("visibility", (d, i, nodes) => {
        if (i === 0) {
          return "hidden";
        } else {
          return "visible";
        }
      });

    // Add Vertical grid lines
    svg
      .selectAll("xGrid")
      .data(x.ticks().slice(1))
      .join("line")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5);

    // Add Horizontal grid lines
    svg
      .selectAll("yGrid")
      .data(y.ticks((d3.max(data, (d) => d.value) - 9500) / 2000))
      .join("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5);

    // Add the Chart Title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", margin.left - 115)
      .attr("y", margin.top - 100)
      .style("font-size", "24px")
      .style("font-weight", "bold")
      .style("font-family", "sans-serif")
      .text("Himalaya Data Visualisation Graph Quantity vs Date");

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#777")
      .style("font-family", "sans-serif")
      .text("Quantity");

    // Add x-axis label
    svg
      .append("text")
      .attr("class", "source-credit")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom)
      // .style("text-anchor" , "middle")
      .style("font-size", "14px")
      .style("fill", "#777")
      .style("font-family", "sans-serif")
      .text("Week wise Dates");

    // create the line generator
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    // Add the line path to SVG element
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1)
      .attr("d", line);





       // Add a circle element
  const circle = svg
  .append("circle")
  .attr("r", 0)
  .attr("fill", "steelblue")
  .style("stroke", "white")
  .attr("opacity", 0.7)
  .style("pointer-events", "none");

  
  // Create the SVG element and append it to the chart container
  // create a listening rectangle
  const listeningRect = svg
  .append("rect")
  .attr("width", width)
  .attr("height", height);
  
  // svg.append(listeningRect)



listeningRect.on("mousemove", (event) => {
  const [xCoord] = d3.pointer(event, this);
  const bisectDate = d3.bisector((d) => d.date).left;
  const x0 = x.invert(xCoord);
  const i = bisectDate(data, x0, 1);
  const d0 = data[i - 1];
  const d1 = data[i];
  const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  const xPos = x(d.date);
  const yPos = y(d.value);

  // Update the circle position
  circle.attr("cx", xPos).attr("cy", yPos);

  // console.log(xPos);



  
// Add transition for the circle radius
circle.transition()
.duration(50)
.attr("r" , 5);

// Add in our tooltip
tooltip
.style("display" ,"block")
.style("left", `${xPos + 100}px`)
.style("top" , `${yPos + 600}px`)
.html(`<strong>Date:</strong> ${d.date.toLocaleDateString()}<br><strong>Value:</strong> ${d.value !== undefined ? (d.value / 1000).toFixed(0) + 'k' : 'N/A'}`)
 

});


// listening rectangle mouse leave function

listeningRect.on('mouseleave', ()=>{
  circle.transition()
    .duration(50)
    .attr("r" ,0)
  
  tooltip.style("display", "none")
})




  }, []);

 

  return (
    <>
      <div>
        {" "}
        <h1>About D3 (Data Driven Documents) js</h1>{" "}
      </div>
      <div className="d3js">
        <h2>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et aliquam
          reiciendis fugit! Sint, voluptas? Officiis beatae corporis expedita
          laudantium accusamus, quaerat corrupti totam qui quia. Incidunt
          excepturi impedit ratione cupiditate!
        </h2>
      </div>
      <ul></ul>
      <svg width={"300px"} height={"300px"}></svg>

      <div id="chart-container"></div>
      <div id="slider-range"></div>
    </>
  );
};

export default About;
