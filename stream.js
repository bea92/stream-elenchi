
chart("data-old.csv", "orange");

var datearray = [];
var colorrange = [];


function chart(csvpath, color) {
if (color == "orange") {
  colorrange = ["deeppink", "greenyellow", "aquamarine", "gold", "#000"];
}
strokecolor = colorrange[4];

var format = d3.time.format("%Y");

var margin = {top: 20, right: 40, bottom: 30, left: 30};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "remove")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "visible")
    .style("top", "400px")
    .style("left", "50px");


var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0.0]);

var z = d3.scale.ordinal()
    .range(colorrange);


// // var area = d3.area()
// //     .x(function(d,i) { return x(d.data.x); })
// //     .y0(function(d) { return y(d[0]); })
// //     .y1(function(d) { return y(d[1]); });

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(20);

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(20);


var stack = d3.layout.stack()
    .offset("Silhouette")
    .order("None")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; });

var nest = d3.nest()
    .key(function(d) { return d.key; });

var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(+d.y0); })
    .y1(function(d) { return y(+d.y0 + d.y); });

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var graph = d3.csv(csvpath, function(data) {
  data.forEach(function(d) {
    d.date = format.parse(d.date);
    d.value = +d.value;
  });

  var layers = stack(nest.entries(data));

  x.domain(d3.extent(data, function(d) { return +d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) { return z(i); });


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // svg.append("g")
  //     .attr("class", "y axis")
  //     .attr("transform", "translate(" + width + ", 0)")
  //     .call(yAxis.orient("right"));

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis.orient("left"));

  svg.selectAll(".layer")
    .attr("opacity", 1)
    .on("mouseover", function(d, i) {
      svg.selectAll(".layer").transition()
      .duration(250)
      .attr("opacity", function(d, j) {
        return j != i ? 0.6 : 1;
    })})

    .on("mousemove", function(d, i) {
      mousex = d3.mouse(this);
      mousex = mousex[0];
      var invertedx = x.invert(mousex);
      invertedx = invertedx.getYear() + invertedx.getDate();
      var selected = (d.values);
      for (var k = 0; k < selected.length; k++) {
        datearray[k] = selected[k].date
        datearray[k] = datearray[k].getYear() + datearray[k].getDate();
      }

      mousedate = datearray.indexOf(invertedx);
      pro = d.values[mousedate].value;

      d3.select(this)
      .classed("hover", true)
      .attr("stroke", strokecolor)
      .attr("stroke-width", "1px"),
      tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");

    })
    .on("mouseout", function(d, i) {
     svg.selectAll(".layer")
      .transition()
      .duration(250)
      .attr("opacity", "1");
      d3.select(this)
      .classed("hover", false)
      .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
  })

  var vertical = d3.select(".chart")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "1px")
        .style("height", "500px")
        .style("top", "110px")
        .style("bottom", "10px")
        .style("left", "0px")
        .style("background", "black");

  d3.select(".chart")
      .on("mousemove", function(){
         mousex = d3.mouse(this);
         mousex = mousex[0] + 5;
         vertical.style("left", mousex + "px" )})
      .on("mouseover", function(){
         mousex = d3.mouse(this);
         mousex = mousex[0] + 5;
         vertical.style("left", mousex + "px")});


      // Handmade legend
svg.append("text").attr("x", 10).attr("y", 30).text("How to read").style("font-size", "18px").attr("alignment-baseline","middle")
svg.append("circle").attr("cx",20).attr("cy",60).attr("r", 6).style("fill", "gold")
svg.append("circle").attr("cx",20).attr("cy",90).attr("r", 6).style("fill", "aquamarine")
svg.append("circle").attr("cx",20).attr("cy",120).attr("r", 6).style("fill", "greenyellow")
svg.append("circle").attr("cx",20).attr("cy",150).attr("r", 6).style("fill", "deeppink")
svg.append("text").attr("x", 40).attr("y", 60).text("sintagmi").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 40).attr("y", 90).text("parole").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 40).attr("y", 120).text("misto").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 40).attr("y", 150).text("frasi").style("font-size", "15px").attr("alignment-baseline","middle")
});
}
