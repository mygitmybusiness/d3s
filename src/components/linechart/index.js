(function () {
    const margin = { top: 70, right: 30, bottom: 40, left: 80 };
    const width = 1024 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // === Define Gradient ===
    const defs = svg.append("defs");

    const gradient = defs.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("x1", "0%") 
        .attr("y1", "0%") 
        .attr("x2", "100%") 
        .attr("y2", "0%") 

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "steelblue")
        .attr("stop-opacity", 0.7);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "white")
        .attr("stop-opacity", 0);

    // Dataset
    const dataset = [
        { date: new Date("2022-01-01"), value: 88 },
        { date: new Date("2022-02-01"), value: 75 },
        { date: new Date("2022-03-01"), value: 70 },
        { date: new Date("2022-04-01"), value: 55 },
        { date: new Date("2022-05-01"), value: 50 },
        { date: new Date("2022-06-01"), value: 45 },
        { date: new Date("2022-07-01"), value: 50 },
        { date: new Date("2022-08-01"), value: 40 },
    ];

    x.domain(d3.extent(dataset, d => d.date));
    y.domain([0, d3.max(dataset, d => d.value)]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
            d3.axisBottom(x)
                .ticks(d3.timeMonth.every(1))
                .tickFormat(d3.timeFormat("%b %Y"))
        )
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("fill", "black");

    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("fill", "black");

    // === Area with gradient fill ===
    const area = d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.value));

    svg.append("path")
        .datum(dataset)
        .attr("fill", "url(#line-gradient)")
        .attr("stroke", "none")
        .attr("d", area);

    // === Line ===
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.value));

    svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", line);

    // === Dots ===
    svg.selectAll(".dot")
        .data(dataset)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.date))
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", "black");
})();
