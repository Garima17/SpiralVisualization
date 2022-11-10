let coarse_graph_data;
let center_positions_spiral;
let link_data;
let node_to_node_link_data

//for community size barchart
function showdata_count(data){
  //transform data
  data = data.map(d=> ({
    x : d.community,
    y : parseFloat(d.count)
  }))
  var svg = d3.select("#barchart-no_of_nodes")
  initializeChart(svg),
  draw(data, "Community", "Number_of_nodes", "Number of nodes in each community");
}

//for density barchart
function showdata_density(data){
  //transform data
  data = data.map(d=> ({
    x : d.community,
    y : parseFloat(d.density)
  }))
  var svg = d3.select("#barchart-density")
  initializeChart(svg),
  draw(data, "Community", "Density", "Density of edges in each community");
}

//for max degree barchart
function showdata_hdegree(data){
  //transform data
  data = data.map(d=> ({
    x : d.community,
    y : +d.h_degree
  }))
  var svg = d3.select("#barchart-h_degree")
  initializeChart(svg),
  draw(data, "Community", "Max-Degree", "Max-Degree in each community");
}

//for connection heatmap
function showdata_connectivity_heatmap(data){
  //transform data
  data = data.map(d=> ({
    source : d.source,
    target : d.target,
    weight : +d.weight
  }))
  //theData = data;
  var svg = d3.select("#heatmap-connectivity")
  initializeChart(svg),
  draw_heatmap(data, "Community", "Community", "Community to community connections");
}

function  show_table_data(data){
  // Get every column value
  var columns = Object.keys(data[0])
  .filter(function(d){
    return ((d != "x" && d != "y" && d != "new_x" && d != "new_y"));
  });

  var header = thead.append("tr")
      .selectAll("th")
      .data(columns)
      .enter()
      .append("th")
          .text(function(d){ return d;})
          .on("click", function(d, da){
              rows.sort(function(a, b){
                  return b[da] - a[da];
              })

            });

  var rows = tbody.selectAll("tr")
      .data(data)
      .enter()
      .append("tr")
      .on("mouseover", function(d){
        if (d3.select(this).style("background-color")== "blue")
          d3.select(this)
            .style("background-color", "blue")
        else
          d3.select(this)
              .style("background-color", "orange");
      })
      .on("mouseout", function(d){
        if (d3.select(this).style("background-color")== "blue")
         d3.select(this)
          .style("background-color", "blue")
        else
          d3.select(this)
              .style("background-color","transparent");
      });



  var cells = rows.selectAll("td")
      .data(function(row){
          return columns.map(function(d, i){

              return {i: d, value: row[d]};
          });
      })
      .enter()
      .append("td")
      .html(function(d){ return d.value;});

  //highlight the find_node_data if present
  d3.selectAll("tr").style("background-color", function(d,i){
    if (d!== undefined)
      {
        if (d.node == find_node_id)
        { console.log(d.node, find_node_id)
          return "blue";}

      }})
  }


function showdata_spiral_community_chart(data){

  //define height and width of svg
  //let width = 700,
  //height = 700;

    //assign height and width of svg
    let svg = d3.select("#chart")
    let bounds = svg.node().getBoundingClientRect()
    let width = bounds.width
    let height = bounds.height
    console.log(width, height)
    initializeSpiralChart(svg, height, width)

  //coarse_graph_data
    coarse_graph_data = data[1]
    center_positions_spiral = string_to_numbers_graph_centers(coarse_graph_data)
  //transforming the coordinates
    center_positions_spiral=transform_graph_centers(center_positions_spiral, height, width)
    //transform_link data
    link_data = transform_link_data(data[2])
    //connections list
    connections_list = data[4]
    extent_of_centralities_after_removing_outliers = data[5]
    //console.log(connections_list)
    optimal_no_of_nodes = optimal_no_of_nodes(data[6]) //added by bhanu
    /*
    //all links read here
    node_to_node_link_data = transform_node_to_node_link_data(data[3])
    console.log(node_to_node_link_data)
    */
  //transform data from strings to integers
    data = transform_data(data[0])
    console.log(data)

  //calculate final x and y position for each point
    data = computing_spiral_positions(center_positions_spiral, data, optimal_no_of_nodes, height, width)
    // added one more variable optimal_no_of_nodes by bhanu in computing_spiral_positions function
    global_data = data //changes with interactions
    global_data_unchanged = data
    global_data_sorted = data
    global_data_sorted.sort(function(a,b){return d3.ascending(a.node, b.node)})
    console.log(global_data_sorted)
    global_data = global_data_sorted

    let prepare_data = []
    unique_communities = new Set(global_data_unchanged.map(function(d){return d.community}))
    console.log("updated_version_degree")
    unique_communities.forEach(function(entry) {
      community_data = global_data_unchanged.filter(function(d){ return d.community == entry});
      community_data.sort(function(a,b){return d3.descending(a.centrality,b.centrality)})
      prepare_data.push.apply(prepare_data,community_data)
    })
    console.log(prepare_data)

    prepare_data = computing_spiral_positions(center_positions_spiral, prepare_data,optimal_no_of_nodes, height, width)
    global_data = prepare_data

    //below two lines are removed in latest code need to check with garima
    //let svg = d3.select("#chart")
    //initializeSpiralChart(svg, height, width)

  draw_spiral_community()
  /*var brush = d3.brush()
  .on("brush", function(){
    console.log("i am in brush")
    let coords = d3.brushSelection(this);
    console.log(coords)


  g.selectAll("circle")
      .style("fill", function(){
        let cx = d3.select(this).attr("cx");
        let cy = d3.select(this).attr("cy")
        console.log(cx,cy)


        let selected = isSelected(coords, cx, cy)
        return selected ? "yellow" : "green"
      } )
  })


  g.append("g")
  .attr("class", "brush")
  .call(brush)*/

}

/*function isSelected(brush_coords, cx, cy) {

  var x0 = brush_coords[0][0],
      x1 = brush_coords[1][0],
      y0 = brush_coords[0][1],
      y1 = brush_coords[1][1];

 return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
}
*/




// START!
//d3.select("#barchart_count").on("resize", draw)

//window.addEventListener("resize", draw);


d3.csv("commuity_count.csv").then(showdata_count)
d3.csv("commuity_density.csv").then(showdata_density)
d3.csv("commuity_h_degree.csv").then(showdata_hdegree)
d3.csv("heatmap_data.csv").then(showdata_connectivity_heatmap)
d3.csv("facebook_data_transformed_new.csv").then(show_table_data)

Promise.all([
  d3.csv("facebook_data_transformed_new.csv"),
  d3.csv("coarse_graph_pos.csv"),
  d3.csv("link_data.csv"),
  d3.csv("node_to_node_link_data.csv"),
  d3.json("connection_list.json"),
  d3.json("new_extent_without_outliers_for_colorcoding.json"),
  d3.csv("commuity_count.csv") //added by bhanu
  ]).then(showdata_spiral_community_chart)
