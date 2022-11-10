

  var g = undefined
  var svg1




  const myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
  const myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

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

  function initializeSpiralChart(svg, height, width) {

    svg1 = svg
    g = svg.append("svg")
    .attr("width",width)
    .attr("height", height)
    .append("g")
    .on("dblclick", function(){brushFlag=0
      d3.selectAll(".spiral_edges").style("stroke-opacity", 1)});


  }



  // DRAWING
//g, x, y, svg, thedata
  function draw(theData, xtitle, ytitle, title) {
    x = d3.scaleBand().padding(0.1)
    y = d3.scaleLinear()
    //don
    bounds = svg1.node().getBoundingClientRect()
    width = bounds.width - margin.left - margin.right,
    height = bounds.height - margin.top - margin.bottom;
    console.log(width, height)

    x.rangeRound([0, width]);
    y.rangeRound([height, 0]);

    x.domain(theData.map(function (d, i) { return d.x; }));
    y.domain([0, d3.max(theData, function (d, i) { return d.y; })]);

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 1)
      .attr("dy", "-3em")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .attr("fill", "grey")
      .text(ytitle);

    g.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                          (-10) + ")")
    .style("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("font-weight", "bold")
    .text(title);

    g.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top + 5) + ")")
      .style("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .attr("fill", "grey")
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
      .attr("height", function (d) { return height - y(d.y); })
      .on("mouseover", function(event, d) {
         activeCommunity = d.x
         d3.selectAll("rect")
          .classed("barLight", function(d) {
             if ( d.x == activeCommunity) return true;
             else return false;
          })
          d3.selectAll("rect")
          .classed("strokechange", function(d) {
             if ( d.target == activeCommunity) return true;
             else return false;
          })


          d3.selectAll("circle")
          .attr("opacity", function(d){
            if(d.community == activeCommunity) return 1
            else return .1} )

          all_lines = d3.selectAll("line")
                        .nodes()
          for (each in all_lines){
            if(
            parseInt(all_lines[each].x1.baseVal.value) == parseInt(center_positions_spiral[activeCommunity].cx) &&
            parseInt(all_lines[each].y1.baseVal.value) == parseInt(center_positions_spiral[activeCommunity].cy) ||
            parseInt(all_lines[each].x2.baseVal.value) == parseInt(center_positions_spiral[activeCommunity].cx )&&
            parseInt(all_lines[each].y2.baseVal.value) == parseInt(center_positions_spiral[activeCommunity].cy))
            all_lines[each].style.strokeOpacity = 1
            else
            all_lines[each].style.strokeOpacity = 0;

          }


        })

      .on("mouseout", function() {

        d3.selectAll(".barLight")
        .attr("class", "bar");

        d3.selectAll(".strokechange")
        .attr("class", "heat_map")

        d3.selectAll("circle")
        .attr("opacity", 1)

        d3.selectAll(".spiral_edges").style("stroke-opacity", 1)
        console.log(d3.selectAll(".spiral_edges").style("stroke-opacity"))

      })

    // UPDATE
    bars.attr("x", function (d) { return x(d.x); })
      .attr("y", function (d) { return y(d.y); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return height - y(d.y); });

    // EXIT
    bars.exit()
      .remove();

  }


function draw_heatmap(theData, xtitle, ytitle, title){
  let myGroups = [...new Set(theData.map(item => item.source))]
  let myVars = [...new Set(theData.map(item => item.source))]

  //console.log(unique)
  //console.log(set(community_data))
  x = d3.scaleBand().padding(0.1)
  y = d3.scaleBand().padding(0.1)
  myColor = d3.scaleLinear()

  bounds = svg1.node().getBoundingClientRect(),


  width = bounds.width - margin.left - margin.right,
  height = bounds.height - margin.top - margin.bottom;

  x.rangeRound([0, width]);
  y.rangeRound([height, 0]);
  //myColor.range(["#00FF00", "#006400"])
  myColor.range(["yellow", "red"])

  x.domain(myGroups);
  y.domain(myVars);
  myColor.domain([0, d3.max(theData, function (d) { return d.weight; })]);



  g.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (height + margin.top + 5) + ")")
  .style("text-anchor", "middle")
  .attr("font-size", 10)
  .attr("font-weight", "bold")
  .attr("fill", "grey")
  .text(xtitle);

  g.append("text")
  .attr("transform",
        "translate(" + (width/2) + " ," +
                       (-10) + ")")
  .style("text-anchor", "middle")
  .attr("font-size", 10)
  .attr("font-weight", "bold")
  .text(title);

  g.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 1)
  .attr("dy", "-3em")
  .attr("font-size", 10)
  .attr("font-weight", "bold")
  .attr("text-anchor", "end")
  .attr("fill", "grey")
  .text(ytitle);

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
.attr("class", "heat_map")
.attr("x", function(d) { return x(d.source) })
.attr("y", function(d) { return y(d.target) })
.attr("width", x.bandwidth() )
.attr("height", y.bandwidth() )
.style("fill", function(d) { if (d.weight==0)
                                return 'white'
                              else
                                return myColor(d.weight)} )
.attr("opacity", 1)
.attr("stroke", 'black')
.attr("stroke-width", .02)
.on("mouseover", function(event, d) {
  console.log(d.target)
  activeCommunity = d.target
 d3.selectAll("rect")
  .classed("strokechange", function(d) {
     if ( d.target == activeCommunity) return true;
     else return false;
  })

  d3.selectAll("rect")
  .classed("barLight", function(d) {
     if ( d.x == activeCommunity) return true;
     else return false;
  })

  d3.selectAll("circle")
  .attr("opacity", function(d){
    if(d.community == activeCommunity) return 1
    else return .1} )

    all_lines = d3.selectAll("line")
    .nodes()
    for (each in all_lines){
    if(
    parseInt(all_lines[each].x1.baseVal.value) == parseInt(center_positions_spiral[activeCommunity].cx) &&
    parseInt(all_lines[each].y1.baseVal.value) == parseInt(center_positions_spiral[activeCommunity].cy) ||
    parseInt(all_lines[each].x2.baseVal.value) == parseInt(center_positions_spiral[activeCommunity].cx )&&
    parseInt(all_lines[each].y2.baseVal.value) == parseInt(center_positions_spiral[activeCommunity].cy))
    all_lines[each].style.strokeOpacity = 1
    else
    all_lines[each].style.strokeOpacity = 0;
    }
})
.on("mouseout", function() {

  d3.selectAll(".barLight")
  .attr("class", "bar");

  d3.selectAll(".strokechange")
  .attr("class", "heat_map")

  d3.selectAll("circle")
  .attr("opacity", 1)


  d3.selectAll(".spiral_edges").style("stroke-opacity", 1)
  console.log(d3.selectAll(".spiral_edges").style("stroke-opacity"))


});

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
