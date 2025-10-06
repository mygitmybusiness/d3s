(function () {
  const width = 450, height = 450, margin = 20;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select("#donutchart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const data = { fat: 33, carbs: 20, protein: 47 };

  const radii = {
    fat: { inner: 0.5, outer: 0.8 },
    carbs: { inner: 0.5, outer: 0.7 },
    protein: { inner: 0.5, outer: 0.9 }
  };

  const color = d3.scaleOrdinal()
    .domain(Object.keys(data))
    .range(d3.schemeDark2);

  const pie = d3.pie().sort(null).value(d => d[1]);
  const data_ready = pie(Object.entries(data));

  const arc = d3.arc()
    .innerRadius(d => radius * radii[d.data[0]].inner)
    .outerRadius(d => radius * radii[d.data[0]].outer);

  const labelArc = d3.arc()
    .innerRadius(d => radius * (radii[d.data[0]].outer + 0.06))
    .outerRadius(d => radius * (radii[d.data[0]].outer + 0.06));

  svg.selectAll('path.slice')
    .data(data_ready)
    .join('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('fill', d => color(d.data[0]))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

  svg.selectAll('polyline')
    .data(data_ready)
    .join('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', d => {
        const posA = arc.centroid(d);
        const posB = labelArc.centroid(d);
        const posC = labelArc.centroid(d);
        const mid = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = Math.abs(posC[0]) * (mid < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });

  svg.selectAll('text.label')
    .data(data_ready)
    .join('text')
      .attr('class', 'label')
      .text(d => d.data[0])
      .attr('transform', d => {
        const pos = labelArc.centroid(d);
        const mid = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = Math.abs(pos[0]) * (mid < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .attr('dy', '0.32em')
      .style('text-anchor', d => {
        const mid = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return mid < Math.PI ? 'start' : 'end';
      })
      .style('fill', 'black');
})();
