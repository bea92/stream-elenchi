let margin = {top: 20, right: 10, bottom: 10, left: 10};

let padding = {top: 20, right: 10, bottom: 20, left: 10};


let stream = d3.select("#my_dataviz").append("svg")
.attr("width", 1000)
.attr("height", 500);



let g = stream.append("g")

let parseTimeline = d3.timeParse("%Y");

let formatTime = d3.timeFormat("%Y");
//
let timeline = d3.scaleTime()
.range([0,800]);

d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  // console.log(data)

  data.forEach(function(d) {
    d.year = +d.year;
    d.f = +d.f;
    d.m = +d.m;
    d.s = +d.s;
    d.p = +d.p;
  });

  let keys = (["f", "m", "s", "p"]);

  let stack = d3.stack()
  .keys(keys)

  .order(d3.stackOrderNone)
  .offset(d3.stackOffsetZero);

  let series = stack(data);

  let timeline = d3.scaleTime()
  .domain(d3.extent(data, function(d) {
    d.year = parseTimeline(d.year);
    d.year = +d.year;
    return d.year;
  }))
  .range([0,1000]);

  let xAxis = d3.axisBottom(timeline).ticks(20)
  .tickFormat(d3.timeFormat("%Y"))
  .tickSize(5);

  let y = d3.scaleLinear()
  .domain([0, d3.max(series, function(layer) {
    return d3.max(layer, function(d) {
      return d[0], d[1];
    });
  })])
  .range([300,0]);

  // console.log(y.domain())

  let yAxis = d3.axisRight(y).tickSize(5).tickPadding(10);

  let z = d3.scaleOrdinal()
  .range(["deeppink", "greenyellow", "aquamarine", "gold", "black"]);

  strokecolor = z[4];

  let area = d3.area()
  .x(function(d) {
    // console.info('in area function', d);
    // console.log(d.data.year);
    return timeline(d.data.year);
  })
  .y0(function(d) {
    return y(d[0]);
  })
  .y1(function(d) {
    return y(d[1]);
  })
  .curve(d3.curveCatmullRom);


  //append the paths and fill in the areas
  g.selectAll("path")
  .data(series)
  .enter().append("path")
  .attr("d", area)
  .style("fill", function() {
    return z(Math.random());
  });

    //insert tooltips

  // let tooltip = d3.select("body")
  //     .append("div")
  //     .attr("class", "remove")
  //     .style("position", "absolute")
  //     .style("z-index", "20")
  //     .style("visibility", "visible")
  //     .style("top", "400px")
  //     .style("left", "50px");

  let div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // d3.select(this)
    // .classed("hover", true)
    // .attr("stroke", strokecolor)
    // .attr("stroke-width", "1px");

    console.log(series);

    g.selectAll("path")
          .data(series)
        //   // .attr("cy", function(d) { return y(d.value); })
          .on("mouseover", function(d) {
            console.log(d);
            // div.transition()
            //   .duration(200)
            //   .style("opacity", .9)
            //   .style("stroke", strokecolor)
            //   .style("stroke-width", "1px")
            // div.html(formatTime(d.year))
            //   .style("left", (d3.event.pageX) + "px")
            //   .style("top", (d3.event.pageY - 28) + "px");
            })
          .on("mouseout", function(d) {
            div.transition()
              .duration(500)
              .style("opacity", 0);
            });

  //append the x axis
  g.append("g")
  .call(xAxis)
  .attr("transform", "translate(0, " + 300 + ")")
  // .classed("timelineAxis", true);

  //append the x axis
  g.append("g")
  .call(yAxis)
  // .attr("transform", "translate(" + (500) + ",0)")
  // .classed("bloodAxis", true);

})
