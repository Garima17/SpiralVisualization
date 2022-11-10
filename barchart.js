

  var g = undefined
  var svg1

  function initializeChart(svg) {
    margin = { top: 20, right: 20, bottom: 30, left: 40 },

    svg1 = svg
    g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    g.append("g")
      .attr("class", "`axis` axis--x");
    g.append("g")
      .attr("class", "axis axis--y");


  }

  // DRAWING
//g, x, y, svg, thedata
  function draw(theData, xtitle, ytitle) {
    x = d3.scaleBand().padding(0.1)
    y = d3.scaleLinear()
    //don
    bounds = svg1.node().getBoundingClientRect()
        //bounds_den = svg_den.node().getBoundingClientRect()
    //console.log(bounds, bounds_den)
      width = bounds.width - margin.left - margin.right,
      height = bounds.height - margin.top - margin.bottom;

    x.rangeRound([0, width]);
    y.rangeRound([height, 0]);

    x.domain(theData.map(function (d, i) { return d.x; }));
    y.domain([0, d3.max(theData, function (d, i) { return d.y; })]);

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text(ytitle);
    g.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 10) + ")")
      .style("text-anchor", "middle")
      .text(xtitle);

    g.select(".axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.select(".axis--y")
      .call(d3.axisLeft(y).ticks(10));

    var bars = g.selectAll(".bar")
      .data(theData);

    // ENTER
    bars
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x(d.x); })
      .attr("y", function (d) { return y(d.y); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.y); });

    // UPDATE
    bars.attr("x", function (d) { return x(d.x); })
      .attr("y", function (d) { return y(d.y); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.y); });

    // EXIT
    bars.exit()
      .remove();

  }


function draw_heatmap(theData, xtitle, ytitle){
  x = d3.scaleBand().padding(0.1)
  y = d3.scaleBand().padding(0.1)
  myColor = d3.scaleLinear()

  bounds = svg_heatmap.node().getBoundingClientRect(),
        
    
  width = bounds.width - margin.left - margin.right,
  height = bounds.height - margin.top - margin.bottom;

  x.rangeRound([0, width]);
  y.rangeRound([height, 0]);
  myColor.range(["#00FF00", "#006400"])
  
  x.domain(myGroups);
  y.domain(myVars);
  myColor.domain([0, d3.max(theData, function (d) { return d.weight; })]);

  g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text(ytitle));

  g.append("text")             
  .attr("transform",
        "translate( 0  ," + 
                       (height + margin.top + 10) + ")")
  .style("text-anchor", "middle")
  .text(xtitle);

g.select(".axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  g.select(".axis--y")
    .call(d3.axisLeft(y));

var bars = g.selectAll("rect")
.data(theData, function(d) {return d.source+':'+d.target;});

// ENTER
bars
.enter()
.append("rect")
.attr("class", "bar")
.attr("x", function(d) { return x(d.source) })
.attr("y", function(d) { return y(d.target) })
.attr("width", x.bandwidth() )
.attr("height", y.bandwidth() )
.style("fill", function(d) { return myColor(d.weight)} );

// UPDATE
bars.attr("x", function(d) { return x(d.source) })
.attr("y", function(d) { return y(d.target) })
.attr("width", x.bandwidth() )
.attr("height", y.bandwidth() )
.style("fill", function(d) { return myColor(d.weight)} );

// EXIT
bars.exit()
  .remove();

}