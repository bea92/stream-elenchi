let bees = document.getElementById("bees");

let width = d3.selectAll("#bees").node().getBoundingClientRect().width,
height = 700,
padding = window.innerWidth * 0.08;

    let svg = d3.select('#bees').append('svg')
    .attr('width', width)
    .attr('height', height)

    // parse values in dataset
    let parseDate = d3.timeParse("%Y");
    let formatDate = d3.timeFormat("%Y");

    // various scales, could be optimized
    let colors = d3.scaleOrdinal()
    .domain(["misto", "frasi", "sintagmi", "parole"])
    .range(["greenyellow","deeppink","gold","aquamarine"]);
    // let colors = d3.scaleOrdinal()
    // .domain(data.map(function(d) {
    //   return d.type
    // })

    let x = d3.scaleTime()
    .range([0 + padding, width - padding]);

    let x1 = d3.scaleLinear()
    .range([0 + padding, width - padding]);

    let x2 = d3.scaleLog()
    .range([0 + padding, width - padding]);


    let y0 = d3.scalePoint()
    .domain( function(d) {
      console.log(d.data)
      return d.data } )

    let y = d3.scaleLinear()
    .range([0 + padding, height - 5]);

    let y2 = d3.scalePoint()
    .domain(["misto","frasi","sintagmi","parole"])
    .range([0 + 50, height - 50]);
    //
    // let y3 = d3.scalePoint()
    // .domain(["Yes","No","Unclear","Unknown"])
    // .range([0 + 50, height - 50]);
    //
    // let y4 = d3.scalePoint()
    // .domain(["Male","Female","Male/Female","Unknown"])
    // .range([0 + 50, height - 50]);
    //
    // let y5 = d3.scalePoint()
    // .domain(["White","Asian","Asian American","Black","Latino","Native","Other","Unknown"])
    // .range([0 + 50, height - 50]);

    let size = d3.scaleLinear()
    .range([5,30]);

    // Assi
    let killAxis = d3.axisBottom(x2).tickFormat(d3.format(".0s")).tickSize(height - 20);
    let ageAxis = d3.axisBottom(x1)
    .tickSize(height - 20);
    let dateAxis = d3.axisBottom(x).ticks(10)
    .tickFormat(d3.timeFormat("%Y"))
    .tickSize(height - 20);

    // let locationAxis = d3.axisLeft(y2).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);
    let typeAxis = d3.axisLeft(y2).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);
    // let genderAxis = d3.axisLeft(y4).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);
    // let raceAxis = d3.axisLeft(y5).ticks().tickSize(width - window.innerWidth * 0.15).tickPadding(10);

    // starting visualization with:
    let data_set = "type";
    let data_setX = "value";

    // Parse dataset

    d3.csv("data/elenchi.csv", function(error, data) {
      if (error) throw error;

      x.domain(d3.extent(data, function(d) {
        d.value = parseDate(d.value);
        d.value = +d.value;
        return d.value;
      }));

      // x1.domain(d3.extent(data, function(d) {
      //   d.age = +d.age;
      //   return d.age;
      // }));

      // x2.domain(d3.extent(data, function(d) {
      //   d.count = +d.count;
      //   return d.count;
      // }));

      // // console.log(JSON.stringify(data, null, "\t"));

      // y.domain(d3.extent(data, function(d) {
      //   d.lat = +d.lat;
      //   return d.lat; }

      //   ));

      size.domain(d3.extent(data, function(d) {

        return +d.count; }

        ));

      // start ticks for animations and transitions

      function tick(){

        d3.selectAll('.circ')
        .attr('cx', function(d){return d.x})
        .attr('cy', function(d){return d.y})

      };


      // Draw axes

      svg.append("g")
      .call(dateAxis)
      .classed("xAxis", true);

      svg.append("g")
      .attr("transform","translate(" + ( width - padding ) + ",0)")
      .classed("yAxis", true);

      // Draw circles

      svg.selectAll('.circ')
      .data(data)
      .enter()
      .filter(function(d) { return d.count })
      .append('circle').classed('circ', true)
      .attr('r', function(d) { return size(d.count) })
      .attr('cx', function(d){ return x(d.value); })
      .attr('cy', function(){ return height/2; })
      .attr("fill", function(d) { return colors(d.type); })
      // .attr("stroke", "rgba(0,0,0,.2)")
      // .attr("stroke-width", 1)

      // Start force layout
      let simulation = d3.forceSimulation(data)
      .force('many', d3.forceManyBody().strength(-0.5))
      .force('x', d3.forceX( function(d){
        return x(d[data_setX])
      }))
      .force('y', d3.forceY( height / 2 ))

      .force('collide', d3.forceCollide(function(d) {
        return size(d.count) + 1
      }).iterations(1))
      // .alphaDecay(0)
      .alpha(1)
      .on('tick', tick)

      let init_decay;
      init_decay = setTimeout(function(){
        console.log('init alpha decay')
        // simulation.alphaDecay(0.1);
      }, 5000);

    // tooltip
    d3.selectAll('.circ').on("mouseenter", function(d){


      d3.selectAll(".circ").style("opacity", 0.2)
      d3.select(this).style("opacity", 1)

      // tooltip

      let tooltip = d3.select("#tooltip").style("opacity", 1)

      tooltip.append("p")
      .classed("info", true)
      .classed("date", true)
      .text(formatDate(d.value))

       tooltip.append("p")
      .classed("info", true)
      .text(" " +d.title + ",")
      .attr("transform", "translate(0, " + 24 + ")")

      tooltip.append("p")
      .classed("info", true)
      .text(d.count + " " + d.type)
      .attr("transform", "translate(0, " + 12 + ")")


      // tooltip.append("p")
      // .classed("info", true)
      // .text("by a " + d.age + " years old")
      // .attr("transform", "translate(0, " + 58 + ")")

      // tooltip.append("p")
      // .classed("info", true)
      // .text(d.race + " " + d.gender + ", ")
      // .attr("transform", "translate(0, " + 70 + ")")

      // tooltip.append("p")
      // .classed("info", true)
      // .text("mental illness: " + d.type)
      // .attr("transform", "translate(0, " + 46 + ")")
    })

    d3.selectAll('.circ').on("mouseleave", function(d){

      d3.selectAll(".circ").style("opacity", 1)
      d3.select("#tooltip").style("opacity", 0)
      d3.selectAll("#tooltip p").remove()
    })

    // Draw UI buttons

    let yButtons = d3.select('#bees-ui').append('div').classed('buttons', true);
    yButtons.append('p').text('divide by').classed("button-label", true)
    yButtons.append('button').text('type').attr('value', 'type').classed('d_sel', true)
    // yButtons.append('button').text('location type').attr('value', 'location').classed('d_sel', true)
    // yButtons.append('button').text('gender').attr('value', 'gender').classed('d_sel', true)
    // yButtons.append('button').text('race').attr('value', 'race').classed('d_sel', true)

    yButtons.append('button').text('X').classed('d_del', true).classed("disabled", true)

    // let xButtons = d3.select('#killingbees-ui').append('div').classed('buttons', true);
    // xButtons.append('p').text('place by').classed("button-label", true)
    // xButtons.append('button').text('perpetrator age').attr('value', 'age').classed('b_sel', true)
    // xButtons.append('button').text('total victims').attr('value', 'count').classed('b_sel', true)
    // xButtons.append('button').text("date").attr('value', 'value').classed('b_sel', true).style('background','#0A0101').style("color", "white")

    // make buttons interactive, vertical categories
    d3.selectAll('.d_sel').on('click', function(){

      yButtons.selectAll('.d_del').style('opacity', 1).classed("disabled", false)
      d3.selectAll('.d_del').on('click', function(){

        let axisSelection = d3.select(".yAxis")
        .selectAll("*").remove()
        .classed("yAxis", true);

        simulation.force('y', d3.forceY( height / 2 ).iterations(2))

        simulation
        // .alphaDecay(0.01)
        .alpha(1)
        .restart()

        d3.selectAll('.d_sel').classed('selected', false).style('background','transparent')
        yButtons.selectAll('.d_del').style('opacity', 0).classed("disabled", true)
      })

      d3.selectAll('.d_sel').classed('selected', false).style('background','transparent')
      d3.select(this).classed('selected', true).style('background','#000')

      data_set = this.value;

      console.log(data_set)

      if (data_set === "type") {
        d3.selectAll(".spaceY").text("Tipo di elenco")
        let axisSelection = d3.select(".yAxis")
        .call(typeAxis)
        .classed(".yAxis", true);

        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "misto":
            return "Misto";
            break;
            case "frasi":
            return "Frasi";
            break;
            case "parole":
            return "Parole";
            break;
            case "sintagmi":
            return "Sintagmi";
            break;
          }
        })
      } else if(data_set === "location") {
        d3.selectAll(".spaceY").text("Tipologia di luogo dell'attentato")
        let axisSelection = d3.select(".yAxis")
        .call(locationAxis)
        .classed("yAxis", true);
        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "Open":
            return "Open";
            break;
            case "Open+Close":
            return "Open and close";
            break;
            case "Close":
            return "Close";
            break;
            case "na":
            return "Not Available";
            break;
          }
        })
      }else if(data_set === "gender") {
        d3.selectAll(".spaceY").text("Genere dell'attentatore")
        let axisSelection = d3.select(".yAxis")
        .call(genderAxis)
        .classed("yAxis", true);

        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "Male":
            return "Male";
            break;
            case "Female":
            return "Female";
            break;
            case "Male/Female":
            return "Both";
            break;
            case "Unknown":
            return "Not Available";
            break;
          }
        })
      }else {
        d3.selectAll(".spaceY").text("Etnia dell'attentatore")
        let axisSelection = d3.select(".yAxis")
        .call(raceAxis)
        .classed("yAxis", true);

        axisSelection.selectAll('.tick text')
        .text(function(d){
          switch(d){
            case "White":
            return "White";
            break;
            case "Asian":
            return "Asian";
            break;
            case "Asian American":
            return "Asian American";
            break;
            case "Black":
            return "Black";
            break;
            case "Latino":
            return "Latino";
            break;
            case "Native":
            return "Native";
            break;
            case "Other":
            return "Other";
            break;
            case "Unknown":
            return "Not Available";
            break;
          }
        })
      }

      simulation.force('y', d3.forceY(function(d){

        if (data_set === "type"){
          return y2(d[data_set])
        }else if(data_set === "location"){
          return y3(d[data_set])
        }else if(data_set === "gender"){
          return y4(d[data_set])
        }else {
          return y5(d[data_set])
        }
      }))

      simulation.force('collide', d3.forceCollide(function(d) {
        return size(d.count) + 1
      }).iterations(8))

      simulation
      // .alphaDecay(0)
      .alpha(1)
      .restart()

    })

    // make buttons interactive, horizontal values
    d3.selectAll('.b_sel').on('click', function(){

      d3.selectAll('.b_sel').classed('selected', false).style('background','transparent').style("color", "#000")
      d3.select(this).classed('selected', true).style('background','#000').style("color", "white")

      data_setX = this.value;

      console.log(data_setX)

      // if (data_setX === "value") {
      //   d3.selectAll(".spaceX").text("data dell'evento")
      //   d3.select(".xAxis")
      //   .call(dateAxis)
      //   .classed("xAxis", true);
      // }else if(data_setX === "age") {
      //   d3.selectAll(".spaceX").text("età dell'attentatore")
      //   d3.select(".xAxis")
      //   .call(ageAxis)
      //   .classed("xAxis", true);
      // }else {
      //   d3.selectAll(".spaceX").text("numero di vittime")
      //   d3.select(".xAxis")
      //   .call(killAxis)
      //   .classed("xAxis", true);
      // }

      simulation.force('x', d3.forceX(function(d){
        if (data_setX === "value"){
          return x(d[data_setX])
        }else if(data_setX === "count"){
          return x2(d[data_setX])
        }else {
          return x1(d[data_setX])
        }
      }))

      simulation
      // .alphaDecay(0)
      .alpha(1)
      .restart()
    })

  })
