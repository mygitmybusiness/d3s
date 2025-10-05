(function () {
    // Set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 60, left: 60 }, // ← increased bottom
          width = 460 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;
  
    // Append the SVG object to the container
    const svg = d3.select("#barchart-container")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // === DATA: last 7 days + 2 subgroups (norm / used) ===
    const today = new Date();
    const start = d3.timeDay.offset(today, -6);
    const days = d3.timeDay.range(start, d3.timeDay.offset(today, 1));
  
    const fmtKey = d3.timeFormat("%Y-%m-%d");    // key for data lookup
    const fmtLabel = d3.timeFormat("%a %d.%m");  // e.g. Mon 05.10
  
    // Example dataset
    const data = days.map(d => ({
      group: fmtKey(d),          // internal group key
      label: fmtLabel(d),        // label for X axis
      norm: 2500,                // daily norm value
      used: Math.floor(1800 + Math.random() * 2000) // simulated actual usage
    }));
  
    const subgroups = ["norm", "used"];
    const groups = data.map(d => d.group);
  
    // === SCALES ===
    // X scale: 7 groups (last 7 days)
    const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding(0.2);
  
    // Add X axis with custom labels
    const xAxis = svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x)
        .tickFormat(d => data.find(dd => dd.group === d)?.label ?? d)
      ).selectAll("text")
      .attr("fill", "black");
  
    xAxis.selectAll("text")
      .attr("transform", "rotate(-30)")  // ← rotate for readability
      .style("text-anchor", "end")       // ← align to end so they don't clip
      .style("font-size", "11px");
  
    // Y scale: calories 0..5000 with step 1000
    const y = d3.scaleLinear()
      .domain([0, 5000])
      .range([height, 0]);
  
    svg.append("g")
      .call(
        d3.axisLeft(y)
          .tickValues(d3.range(0, 5000 + 1, 1000)) // 0, 1000, ..., 5000
      ).selectAll("text")
      .attr("fill", "black");
  
    // Inner scale for subgroups (norm / used)
    const xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding(0.05);
  
    // Color palette for bars
    const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(["#ededed", "#30c73a"]); // norm, used
  
    // === DRAW BARS ===
    svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("transform", d => `translate(${x(d.group)},0)`)
      .selectAll("rect")
      .data(d => subgroups.map(key => ({ key, value: +d[key] })))
      .join("rect")
        .attr("x", d => xSubgroup(d.key))
        .attr("y", d => y(d.value))
        .attr("width", xSubgroup.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", d => color(d.key));
  
    // === OPTIONAL LEGEND ===
    const legend = svg.append("g").attr("transform", `translate(${width - 120}, 0)`);
  
    ["norm", "used"].forEach((k, i) => {
      legend.append("rect")
        .attr("x", 0).attr("y", i * 18)
        .attr("width", 12).attr("height", 12)
        .attr("fill", color(k));
      legend.append("text")
        .attr("x", 18).attr("y", i * 18 + 10)
        .text(k === "norm" ? "Norm" : "Used")
        .style("font-size", "12px");
    });
  })();
  