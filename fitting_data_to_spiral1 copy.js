var global_data;

function updateTextInputdeg(val) {
  document.getElementById('textInputdeg').value=val; 
  global_data = global_data.filter(function(d){
        return d.centrality>=val
        })
  console.log(global_data)
}

function updateTextInputbet(val) {
  document.getElementById('textInputbet').value=val; 
}

function updateTextInputeig(val) {
  document.getElementById('textInputeig').value=val; 
}

function updateTextInputclo(val) {
  document.getElementById('textInputclo').value=val; 
}

//reading data
Promise.all([
d3.csv("facebook_data_transformed_new.csv"),
d3.csv("coarse_graph_pos.csv"),
d3.csv("link_data.csv")
]).then(showdata)
//d3.csv("facebook_data.csv").then(showdata)
function show_connectivity(){
  let opa =d3.selectAll("line").attr("stroke-opacity")
  if (opa ==1){
    d3.selectAll("line")
      .attr("stroke-opacity", 0)
  }else{
    d3.selectAll("line")
      .attr("stroke-opacity", 1)

  }

}

function draw_textbox(data){

  var centrality_data = new_data1.map(function(d){return d.centrality})


  var margin = {top: 10, right: 30, bottom: 30, left: 40},
      width = 250 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

  d3.select("#community_textbox").select("svg").remove()

  // append the svg object to the body of the page
  var svg = d3.select("#community_textbox")
      .html("<b>Community: </b>"+ data[0].community +"<br/>" + "<b>Number of Nodes:</b> "+ data.length + "<br/>" +
       "<b>Min Centrality:</b> " + d3.min(centrality_data) + "<br/>" +
       "<b>Max centrality:</b> " + d3.max(centrality_data))
       .style("font-size", "20px")

}


function draw_histogram(centrality_data, width, height){

console.log(centrality_data)

  // Generate a histogram using twenty uniformly-spaced bins.
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 40, bottom: 50, left: 50},
      width = 300 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

  d3.select("#community_histogram").select("svg").remove()

  // append the svg object to the body of the page
  var svg = d3.select("#community_histogram")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // X axis: scale and draw:
    var max = d3.max(centrality_data);
    var min = d3.min(centrality_data);

    var x = d3.scaleLinear()
          .domain([min, max])
          .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .style("font-size", 14)
  .attr("transform", "rotate(-65)");

    // text label for the x axis
    svg.append("text")
        .attr("x", width/2)
        .attr("y", height + margin.top + 40)
         .style("text-anchor", "middle")
         .attr("dx", "1em")
         .attr("fill", "black")
         .style("font-size", 14)
         .text("Degree-centrality");

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function(d) { return d; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(10)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(centrality_data);

    // Y axis: scale and draw:
    var y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    //label y-axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", 14)
        .call(g => g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .attr("fill", "black")
        .text("Number of Nodes"));

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "steelblue")


  ////end of function

}



function draw_spiral_community(new_data1, color){
  console.log(color)
  var width = 400,
    height = 100;

    let centerX = 50,
    centerY = 50,
    radius = 150,
    sides = 2000,
    coils = 25,
    rotation = 0;
    let awayStep = radius/sides
    // How far to rotate around center for each side.
    let aroundStep = coils/sides
    // Convert aroundStep to radians.
    let aroundRadians = aroundStep * 2 * 3.14;
    // Convert rotation to radians.
     rotation *= 2 * 3.14;

     no_of_points_in_community = new_data1.length

     for (i=0; i<no_of_points_in_community;i++){
         //How far away from center
         away = i * awayStep;
         // How far around the center.


         around = i * aroundRadians + rotation;



         new_data1[i]['new_x'] = centerX + Math.cos(around) * (away );
         new_data1[i]['new_y'] = centerY + Math.sin(around) * (away);
     }


d3.select("#community_spiral").select("svg").remove()

var svg = d3.select("#community_spiral").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g");



var circles = svg.selectAll("circle")
                .data(new_data1)
              .enter()
                .append("circle")
                .attr("cx", function (d) { return d.new_x; })
                .attr("cy", function (d) { return d.new_y; })
                .attr("r", 2)
                .style("fill", function(d){ return color; });

//also draw histogram for centrality disrtibution
var centrality_data = new_data1.map(function(d){return d.centrality})

draw_histogram(centrality_data, width,height)
draw_textbox(new_data1)


}


//convert node data from string to integers
function transform_data(data){
  data = data.map(d=> ({
    node : +d.node,
    centrality : +d.centrality,
    community : +d.community,
    density : parseFloat(d.density),
    x : +d.x,
    y: +d.y
  }))
  return data
}

//convert node data from string to integers
function transform_link_data(data){
  data = data.map(d=> ({
    source : +d.source,
    target: +d.target,
    weight: +d.weight
  }))
  return data
}

//convert coarse graph center points from string to integers
function string_to_numbers_graph_centers(data){
  data = data.map(d=> ({
    community : +d.node,
    cx : parseFloat(d.x_pos),
    cy: parseFloat(d.y_pos)
  }))
  return data
}

function transform_graph_centers(data, height, width){
  console.log(height, width)
  //define scales for center positions
    let xExtent_central_pos = d3.extent(data, d=>d.cx)
    let xScale_central_pos = d3.scaleLinear()
                  //.domain(xExtent_central_pos)
                  .domain([-1,1])
                  .range([40,width-40])


    let yExtent_central_pos = d3.extent(data, d=>d.cy)
    //console.log(xExtent_central_pos)
    let yScale_central_pos = d3.scaleLinear()
                  //.domain(yExtent_central_pos)
                  .domain([-1,1])
                  .range([40,height-40])

    data = data.map(d=> ({
      community : +d.community,
      cx : xScale_central_pos(d.cx),
      cy: yScale_central_pos(d.cy)
    }))
    return data
}

function computing_spiral_positions(center_positions_spiral, data_points, height, width) {

  let centerX = 50,
  centerY = 50,
  radius = 150,
  sides = 2000,
  coils = 25,
  rotation = 0;
  let awayStep = radius/sides
  // How far to rotate around center for each side.
  let aroundStep = coils/sides
  // Convert aroundStep to radians.
  let aroundRadians = aroundStep * 2 * 3.14;
  // Convert rotation to radians.
   rotation *= 2 * 3.14;

  let waveangle = 0.314;


newdata1=[]

center_positions_spiral.forEach(function(community_data){
  filtered_community= data_points.filter(function(d){return d.community===community_data.community})
  //console.log(filtered_community)
  no_of_points_in_community = filtered_community.length
  for (i=0; i<no_of_points_in_community;i++){
      //How far away from center
      away = i * awayStep;
      // How far around the center.


      //console.log("hey bahnu")


      around = i * aroundRadians + rotation;

      let no_of_waves_completed = Math.floor(around/waveangle);

      let current_part_of_waveangle = around - (no_of_waves_completed * waveangle);

      let twopie_mapped_current_part_of_waveangle = ((2 * 3.14)/waveangle) * current_part_of_waveangle;

      //let wave_coff =  * Math.sin(twopie_mapped_current_part_of_waveangle)



      filtered_community[i]['x'] = community_data.cx + Math.cos(around) * (away );
      filtered_community[i]['y'] = community_data.cy + Math.sin(around) * (away);
  }
  //console.log("hey")
  newdata1=newdata1.concat(filtered_community)
  //console.log(newdata1.concat(filtered_community))
  //console.log(newdata1)

})
return newdata1
/*
for j in unique_communities:
    x_list=[]
    y_list=[]
    #no. of points of community
    no_of_points_in_community = df.loc[df["community"]==j].shape[0]
    for i in range(1, no_of_points_in_community+1):
        #How far away from center
        away = i * awayStep;
        #// How far around the center.
        around = i * aroundRadians + rotation;

        x = centerX +(j+1)*50 + math.cos(around) * away;
        y = centerY + (j+1)*50+math.sin(around) * away;
        x_list.append(x)
        y_list.append(y)
    full_x_list.extend(x_list)
    full_y_list.extend(y_list)
df["x"]= full_x_list
df["y"]= full_y_list
*/
}

function showdata(data){
  console.log("hi everyone")

//define height and width of svg
  let width = 1400,
  height = 700;

//coarse_graph_data
  coarse_graph_data = data[1]
  center_positions_spiral = string_to_numbers_graph_centers(coarse_graph_data)
//transforming the coordinates
  center_positions_spiral=transform_graph_centers(center_positions_spiral, height, width)
  //transform_link data
  link_data = transform_link_data(data[2])
  //console.log(link_data)

//transform data from strings to integers
  data = transform_data(data[0])



//calculate final x and y position for each point
  data = computing_spiral_positions(center_positions_spiral, data, height, width)
  global_data = data
  console.log(global_data)
  console.log(data)
//assign height and width of svg
  let svg = d3.select("#chart").append("svg")
      .attr("width",width)
      .attr("height", height)
      .append("g");

//define scale
  let xExtent = d3.extent(global_data, d=>d.x)
  let xScale = d3.scaleLinear()
                  .domain(xExtent)
                  .range(xExtent)


  let yExtent = d3.extent(global_data, d=>d.y)
  let yScale = d3.scaleLinear()
                  .domain(yExtent)
                  .range(yExtent)

// Define the div for the tooltip
  var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
//define colorscale
colorscale = d3.scaleSequential(d3.interpolateRdYlGn)
                .domain([0,1]);

//draw nodes
  var node = svg.selectAll("circle")
                  .data(global_data)
//console.log(data)
  var newElements = node.enter()
                  .append("circle")
                  .attr("r", 1.5)
                  .style("fill", function(d){ return colorscale(d.density); })
                  .on("mouseover", function(event,d) {
                                      div.transition()
                                          .duration(200)
                                          .style("opacity", .9);
                                      console.log("hello")
                                      console.log(event)
                                      console.log(d)

                                      div.html("<b>Node:</b> "+ d.node +"<br/>" + "<b>Centrality:</b> "+ d.centrality + "<br/>" +"<b>Community:</b> " +d.community)
                                          .style("left", (event.pageX) + "px")
                                          .style("top", (event.pageY - 28) + "px");
                                      })
                  .on("mouseout", function(d) {
                                      div.transition()
                                          .duration(500)
                                          .style("opacity", 0);
                                  })
                  .on("click", function(event,d) {
                                                    //console.log(d.community)
                                                    new_data1 = global_data.filter(function(client){return client.community==d.community})
                                                    draw_spiral_community(new_data1, colorscale(d.density))
                                                  });

   node.merge(newElements).transition()
                  .attr("cx", function (d) { return xScale(d.x); })
                  .attr("cy", function (d) { return yScale(d.y); })


//zoom functionality
    svg.call(d3.zoom().on("zoom", function(event){
      let newXScale = event.transform.rescaleX(xScale)
      let newYScale = event.transform.rescaleY(yScale)


      node.merge(newElements)
          .attr("cx", d=> newXScale(d.x) )
          .attr("cy", d=> newYScale(d.y) )

    }))
//legend attaching
var legendheight = 200,
    legendwidth = 80,
    margin = {top: 10, right: 60, bottom: 10, left: 2};

var canvas = d3.select("#legend1")
  .style("height", legendheight + "px")
  .style("width", legendwidth + "px")
  .style("position", "relative")
  .append("canvas")
  .attr("height", legendheight - margin.top - margin.bottom)
  .attr("width", 1)
  .style("height", (legendheight - margin.top - margin.bottom) + "px")
  .style("width", (legendwidth - margin.left - margin.right) + "px")
  .style("border", "1px solid #000")
  .style("position", "absolute")
  .style("top", (margin.top) + "px")
  .style("left", (margin.left) + "px")
  .node();

var ctx = canvas.getContext("2d");

var legendscale = d3.scaleLinear()
  .range([1, legendheight - margin.top - margin.bottom])
  .domain(colorscale.domain());

// image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
var image = ctx.createImageData(1, legendheight);
d3.range(legendheight).forEach(function(i) {
  var c = d3.rgb(colorscale(legendscale.invert(i)));
  image.data[4*i] = c.r;
  image.data[4*i + 1] = c.g;
  image.data[4*i + 2] = c.b;
  image.data[4*i + 3] = 255;
});
ctx.putImageData(image, 0, 0);

// A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
// See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
/*
d3.range(legendheight).forEach(function(i) {
  ctx.fillStyle = colorscale(legendscale.invert(i));
  ctx.fillRect(0,i,1,1);
});
*/

var legendaxis = d3.axisRight()
  .scale(legendscale)
  .tickSize(6)
  .ticks(8);

   d3.select("#legend1")
    .attr("height", (legendheight) + "px")
    .attr("width", (legendwidth) + "px")
    .style("position", "absolute")
    .style("left", "15px")
    .style("top", "55px")

svg
  .append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
  .call(legendaxis);

for (let link in link_data){
  console.log(link_data[link].source)
  svg.append('line')
       .style("stroke", "#DCDCDC")
       //.style("stroke-width", 10)
       .attr("x1",center_positions_spiral[link_data[link].source].cx)
       .attr("y1", center_positions_spiral[link_data[link].source].cy)
       .attr("x2", center_positions_spiral[link_data[link].target].cx)
       .attr("y2", center_positions_spiral[link_data[link].target].cy)
       .attr("stroke-opacity", 0);
}

}
