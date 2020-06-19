// https://observablehq.com/d/906ab43e6414727f@434
import define1 from "./e93997d5089d7165@2264.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Watch Parties

Locate a watch party near you.`
)});

  main.variable(observer("viewof lapser")).define("viewof lapser", ["html"], function(html){return(
html`<input type=range min=1 max=10 step=1>`
)});
  main.variable(observer("lapser")).define("lapser", ["Generators", "viewof lapser"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","minMagnitude"], function(md,minMagnitude){return(
md`minimum magnitude: ${minMagnitude}`
)});
  main.variable(observer("viewof minMagnitude")).define("viewof minMagnitude", ["html"], function(html){return(
html`<input type=range min=-1 max=6 value=0 step=0.5>`
)});
  main.variable(observer("minMagnitude")).define("minMagnitude", ["Generators", "viewof minMagnitude"], (G, _) => G.input(_));
  main.define("initial zoom", function(){return(
1
)});
  main.variable(observer("mutable zoom")).define("mutable zoom", ["Mutable", "initial zoom"], (M, _) => new M(_));
  main.variable(observer("zoom")).define("zoom", ["mutable zoom"], _ => _.generator);
  main.variable(observer("viewof slider1")).define("viewof slider1", ["slider","mutable zoom"], function(slider,$0){return(
slider({min: 0, max: 10, value: $0.value})
)});
  main.variable(observer("slider1")).define("slider1", ["Generators", "viewof slider1"], (G, _) => G.input(_));
  main.variable(observer("viewof viz")).define("viewof viz", ["viewof slider1","d3","DOM","width","lapser","earthquakes","iceland","plateBoundaries","mutable zoom"], function($0,d3,DOM,width,lapser,earthquakes,iceland,plateBoundaries,$1)
{
  var height = 500;
  var zoomFactor = $0.input.value;//1.0;
  
  const svg = d3.select(DOM.svg(width, height))
      .style("width", "100%")
      .style("height", "auto");

  var color_scale = d3.scaleLinear()

      .domain([3, 4.5, 6, 7.5, 9])
      .range(["#0000ff", "#00ffff", "#00ff00", "#ffff00", "#ff0000"]);
//      .range(["#b874b2", "#f0ff00", "#fdcc00", "#1f626b", "#32b000"]);
  
  var months = ["Aug 2017", "Nov 2017", "Feb 2018", "Jul 2018", "Nov 2018", "Feb 2019", "May 2019"];

  
  var intervalCount = 7;
  var lapseFactor = lapser * 86400.0;
  
  
  var time_format = d3.timeParse("%Y-%m-%d-%H-%M"); // Date is stored as year/month/day/hour/minute
  var start_time = +(new Date(2017, 8, 0, 0, 0, 0)); // Start time on Jan 1st 2011 at 00:01
  var end_time = +(new Date(2019, 3, 30, 0, 0, 0)); // End Jan 1st 2012 at 00:01
  
//  var time_speed_up = lapseFactor/intervalCount;
  var time_speed_up = lapseFactor;
  
  // Returns a date object from time string of dataset
  function parse_time_string(time_string) {
      var year_month_day = time_string.slice(0, 10);
      var hour = time_string.slice(11,13);
      var minute = time_string.slice(14,16);
      return time_format(year_month_day + "-" + hour + "-" + minute);
  }
  
  // Convert earthquake time string into date object
  var earthquake_data = [];
  for (var i = 0; i < earthquakes.length; i++) {
      earthquake_data.push({
        "mag": earthquakes[i]["mag"],
        "latitude": earthquakes[i]["latitude"],
        "longitude": earthquakes[i]["longitude"],
        "date": parse_time_string(earthquakes[i]["date"])
      });
  }
  
  var projection = d3.geoMercator()
              .center([-19, 65])
              .scale(2000 * zoomFactor)
              .translate([width / 2, height / 2]);
  
  var path = d3.geoPath(projection);
  const g = svg.append("g");  
  

  
  /* Create Map */
  g.selectAll("path")
    .data(iceland.features)
    .enter()
    .append("path")
    .attr("fill", "#666666")
    .attr("stroke", "#3182bd")
    .attr("stroke-width", ".5")
    .attr("d", path);
  
  /* Add earthquakes */
  g.selectAll("circle")
    .data(earthquake_data)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function(d) { return projection([d.longitude, d.latitude])[0] })
    .attr("cy", function(d) { return projection([d.longitude, d.latitude])[1] })
    .attr("r", 0)
    .attr("fill", "none")
    .attr("stroke", function(d) { 
      console.log(d.mag)
      return color_scale(d.mag/2); 
    })
    .attr("stroke-width", function(d) { 
      return "10px"
      // return d.mag / 2; 
    })
    .attr("opacity", 1)
    .transition()
    .duration(function(d) { return Math.pow( 1.35, d.mag ) * 100 })
    .delay(function(d) {
      return (+d.date - start_time) / time_speed_up;
    })
    .ease(d3.easeLinear)
    .attr("r", function(d) { return d.mag; })

    g.selectAll("circle")
      .data(earthquake_data)
      .append("svg:title").text(function(d) {
        return d.mag
      });
  
  // zoom and pan
  var zoomer = d3.zoom();//.scaleExtent([1,4]);
  g.call(zoomer.on("zoom", function () {
    var tv = d3.event.transform;
    var ts = d3.event.scale;
    zoomFactor = tv.k;
    $1.value = zoomFactor;
    $0.input.value = zoomFactor;    
    $0.dispatchEvent(new CustomEvent("input"));
    g.attr("transform", d3.event.transform);
  }));
  
  
  return svg.node();
}
);
  main.variable(observer("viz")).define("viz", ["Generators", "viewof viz"], (G, _) => G.input(_));
  main.variable(observer("viewof scale")).define("viewof scale", ["d3","DOM","width","lapser"], function(d3,DOM,width,lapser)
{
  var height = 50;
  
  const svg = d3.select(DOM.svg(width, height))
      .style("width", "100%")
      .style("height", "auto");

  var months = ["Aug 2017", "Nov 2017", "Feb 2018", "Jul 2018", "Nov 2018", "Feb 2019", "May 2019"];
  var intervalCount = 7;
  var lapseFactor = lapser * 86400.0;//configuredSlider.value * 100000;
  var time_format = d3.timeParse("%Y-%m-%d-%H-%M"); // Date is stored as year/month/day/hour/minute
  var start_time = +(new Date(2017, 8, 0, 0, 0, 0)); // Start time on Jan 1st 2011 at 00:01
  var end_time = +(new Date(2019, 3, 30, 0, 0, 0)); // End Jan 1st 2012 at 00:01
//  var time_speed_up = lapseFactor/intervalCount;
  var time_speed_up = lapseFactor;
  
  // Returns a date object from time string of dataset
  function parse_time_string(time_string) {
      var year_month_day = time_string.slice(0, 10);
      var hour = time_string.slice(11,13);
      var minute = time_string.slice(14,16);
      return time_format(year_month_day + "-" + hour + "-" + minute);
  }
  
  
  // at the end in order to be visible even if iceland is zoomed
  const g1 = svg.append("g");  
  g1.selectAll("text")
      .data(months)
      .enter()
      .append("text")
      .attr("x", function(d,i) { return width * (i + 0.5) / intervalCount;}) 
      .attr("y", height - 20)
      .text(function(d) { return d;})
      .attr("text-anchor", "middle")
      .attr("font-family", "Helvetica Neue")
      .attr("font-size", 15)
      .attr("font-weight", 200);
  // Slider which keeps track of the date
  g1.append("rect")
    .attr("x", 0)
    .attr("y", height - 11)
    .attr("height", 10)
    .attr("width", 10)
    .attr("fill", "none")
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .transition()
    .duration((end_time - start_time) / time_speed_up)
    .ease(d3.easeLinear)
    .attr("x", width - 11);
  
  return svg.node();
  
}
);
  main.variable(observer("scale")).define("scale", ["Generators", "viewof scale"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function(md){return(
md`### Sources

Plate Boundaries (GeoJSON) : [Hugo Ahlenius](https://github.com/fraxen/tectonicplates)

Iceland Earthquake Data (CSV): (http://hraun.vedur.is/ja/viku/2019/vika_08/listi)

Iceland Map Data (GeoJSON): [Baldur Helgarson](https://raw.githubusercontent.com/baldurh/iceland-geodata/master/country/100/iceland.geojson)`
)});
  main.variable(observer("plateBoundaries")).define("plateBoundaries", ["d3"], function(d3){return(
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
)});
  main.variable(observer("iceland")).define("iceland", ["d3"], function(d3){return(
d3.json("https://raw.githubusercontent.com/baldurh/iceland-geodata/master/country/1000/iceland.geojson")
)});
  main.variable(observer("earthquakes")).define("earthquakes", ["d3","minMagnitude"], function(d3,minMagnitude){return(
d3.csv("https://gist.githubusercontent.com/chloelangston/f24dffcec565f99059c1c98269acca35/raw/b666dc6b92d6a7b3f9cacd621ed46546db02c07f/iceland-watch-parties.csv", function(d) {
    if (d.M > minMagnitude) {
          return {
              depth: +d.depth,
              ml: +d.ML,
              mag: +d.M + 4.0, // workaround in order to handle earthquake magnitudes < 1.0
//              mag: +d.M, // workaround in order to handle earthquake magnitudes < 1.0
              latitude: +d.latitude,
              longitude: +d.longitude,
              date : d.time
          };
    }
})
)});
  const child1 = runtime.module(define1);
  main.import("slider", child1);
  main.variable(observer("configuredSlider")).define("configuredSlider", ["slider"], function(slider){return(
slider({
  min: 1, 
  max: 10, 
  step: 1
})
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
