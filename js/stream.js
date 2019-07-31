//


// <script src="https://d3js.org/d3.v5.min.js"></script>
// <script type="text/javascript">
    var margin = ({
        top: 20,
        right: 30,
        bottom: 30,
        left: 40
    });
    var width = document.body.clientWidth - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    var x, y;

    var stream = d3.select('stream')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    d3.csv('data/data-old.csv').then(function(data) {
        console.log(data);
        data = data.sort(function(a, b) {
            return a.date - b.date;
        })
        var series = d3.stack().keys(data.columns.slice(1))(data)
        // console.log(series)

        let parseDate = d3.timeParse("%Y");


        let color = d3.scaleOrdinal()
    .domain(["value"])
    .range(["#282828"]);


        x = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.date))
            .range([margin.left, width - margin.right])


        y = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.value))
            // .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
            .range([height - margin.bottom, margin.top])

        var area = d3.area()
            .x(d => x(+d.data.date))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]))
            .curve(curveSankey);

        var xAxis = stream.append('g')
            .classed('x axis', true)
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 50).tickSizeOuter(0.0))


        var yAxis = stream.append('g')
            .classed('y axis', true)
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisRight(y))

        stream.append("g").selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", ({
                key
            }) => color(key))
            .attr("d", function(d) {
                return area(d);
            })
            .append("title")
            .text(({
                key
            }) => key);

        d3.select('.x.axis .domain').style('stroke-dasharray', function() {
            var strokeDashArray = '';
            for (var c = 1; c < ((x(1945) - margin.left) - (x(1943) - margin.left)); c += 3) {
                strokeDashArray += '1 2 '
            }
            strokeDashArray += ((x(1960) - margin.left) - (x(1945) - margin.left));

            for (var c = 1; c < ((x(1962) - margin.left) - (x(1960) - margin.left)); c += 3) {
                strokeDashArray += '1 2 '
            }
            strokeDashArray += ((x(1969) - margin.left) - (x(1962) - margin.left));

            for (var c = 1; c < ((x(1971) - margin.left) - (x(1969) - margin.left)); c += 3) {
                strokeDashArray += '1 2 '
            }
            strokeDashArray += ((x(1986) - margin.left) - (x(1971) - margin.left));
            return strokeDashArray


        })
    })

    // interpolation function

    function CurveSankey(context) {
        this._context = context;
    }

    CurveSankey.prototype = {
        areaStart: function() {
            this._line = 0;
        },
        areaEnd: function() {
            this._line = NaN;
        },
        lineStart: function() {
            this._x = this._y = NaN;
            this._point = 0;
        },
        lineEnd: function() {
            if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
            this._line = 1 - this._line;
        },
        point: function(x, y) {
            x = +x, y = +y;
            switch (this._point) {
                case 0:
                    this._point = 1;
                    this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);
                    break;
                case 1:
                    this._point = 2; // proceed
                default:
                    var mx = (x - this._x) / 2 + this._x;
                    this._context.bezierCurveTo(mx, this._y, mx, y, x, y);
                    break;
            }
            this._x = x, this._y = y;
        }
    };

    var curveSankey = function(context) {
        return new CurveSankey(context);
    }



// chart("data/data-old.csv", "orange");
//
// var datearray = [];
// var colorrange = [];
//
//
// function chart(csvpath, color) {
// if (color == "orange") {
//   colorrange = ["#0000ff", "#FF0000", "#006600", "#FFFF00", "#000"];
// }
// strokecolor = colorrange[4];
//
// var format = d3.time.format("%Y");
//
// var margin = {top: 20, right: 40, bottom: 30, left: 30};
// // var width = document.body.clientWidth - margin.left - margin.right;
// var width = document.body.clientWidth - margin.left - margin.right;
// var height = 500 - margin.top - margin.bottom;
//
// var tooltip = d3.select("body")
//     .append("p")
//     .attr("class", "remove")
//     .style("position", "absolute")
//     .style("z-index", "20")
//     .style("visibility", "visible")
//     // .style("top", "100%")
//     // .style("left", "10%");
//
//
// var x = d3.time.scale()
//     .range([0, width]);
//
// var y = d3.scale.linear()
//     .range([height, 0.0]);
//
// var z = d3.scale.ordinal()
//     .range(colorrange);
//
//
// // // var area = d3.area()
// // //     .x(function(d,i) { return x(d.data.x); })
// // //     .y0(function(d) { return y(d[0]); })
// // //     .y1(function(d) { return y(d[1]); });
//
// var sxAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom")
//     .ticks(20);
//
// var syAxis = d3.svg.axis()
//     .scale(y)
//     .ticks(20);
//
//
// var stack = d3.layout.stack()
//     .offset("Silhouette")
//     .order("None")
//     .values(function(d) { return d.values; })
//     .x(function(d) { return d.date; })
//     .y(function(d) { return d.value; });
//
// var nest = d3.nest()
//     .key(function(d) { return d.key; });
//
// var area = d3.svg.area()
//     .interpolate("basis")
//     .x(function(d) { return x(d.date); })
//     .y0(function(d) { return y(+d.y0); })
//     .y1(function(d) { return y(+d.y0 + d.y); });
//
// var svg = d3.select(".chart").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// var graph = d3.csv(csvpath, function(data) {
//   data.forEach(function(d) {
//     d.date = format.parse(d.date);
//     d.value = +d.value;
//   });
//
//   var layers = stack(nest.entries(data));
//
//   x.domain(d3.extent(data, function(d) { return +d.date; }));
//   y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);
//
//   svg.selectAll(".layer")
//       .data(layers)
//     .enter().append("path")
//       .attr("class", "layer")
//       .attr("d", function(d) { return area(d.values); })
//       .style("fill", function(d, i) { return z(i); });
//
//   //
//   // svg.append("g")
//   //     .attr("class", ".xAxis")
//   //     .attr("transform", "translate(0," + height + ")")
//   //     .call(xAxis);
//   //
//   //
//   // svg.append("g")
//   //     .attr("class", ".yAxis")
//   //     .call(yAxis.orient("left"));
//
//   svg.append("g")
//   .call(dateAxis)
//   .classed("sxAxis", true)
//   .call(sxAxis);
//
//   svg.append("g")
//   .attr("transform","translate(" + ( width - padding ) + ",0)")
//   .classed("syAxis", true)
//   .call(syAxis.orient("left"));
//
//   svg.selectAll(".layer")
//     .attr("opacity", 1)
//     .on("mouseover", function(d, i) {
//       svg.selectAll(".layer").transition()
//       .duration(250)
//       .attr("opacity", function(d, j) {
//         return j != i ? 0.3 : 1;
//     })})
//
//     .on("mousemove", function(d, i) {
//       mousex = d3.mouse(this);
//       mousex = mousex[0];
//       var invertedx = x.invert(mousex);
//       invertedx = invertedx.getYear() + invertedx.getDate();
//       var selected = (d.values);
//       for (var k = 0; k < selected.length; k++) {
//         datearray[k] = selected[k].date
//         datearray[k] = datearray[k].getYear() + datearray[k].getDate();
//       }
//
//       mousedate = datearray.indexOf(invertedx);
//       pro = d.values[mousedate].value;
//
//       d3.select(this)
//       .classed("hover", true)
//       .attr("stroke", strokecolor)
//       .attr("stroke-width", "1px"),
//       tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");
//
//     })
//     .on("mouseout", function(d, i) {
//      svg.selectAll(".layer")
//       .transition()
//       .duration(250)
//       .attr("opacity", "1");
//       d3.select(this)
//       .classed("hover", false)
//       .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");
//   })
//
//   var vertical = d3.select(".chart")
//         .append("div")
//         .attr("class", "remove")
//         .style("position", "absolute")
//         .style("z-index", "19")
//         .style("width", "1px")
//         .style("height", "500px")
//         .style("top", "110px")
//         .style("bottom", "10px")
//         .style("left", "0px")
//         .style("background", "black");
//
//   // d3.select(".chart")
//   //     .on("mousemove", function(){
//   //        mousex = d3.mouse(this);
//   //        mousex = mousex[0] + 5;
//   //        vertical.style("left", mousex + "px" )})
//   //     .on("mouseover", function(){
//   //        mousex = d3.mouse(this);
//   //        mousex = mousex[0] + 5;
//   //        vertical.style("left", mousex + "px")});
//
//
// });
// }
