// start slingin' some d3 here.
// start slingin' some d3 here.


var jsonCircles = [
  { "x_axis": 70, "y_axis": 200, "radius": 20, "color" : "green",  "enemyName" : 'Coffee Script'},
  { "x_axis": 200, "y_axis": 300, "radius": 20, "color" : "purple", "enemyName" : 'Type Script'},
  { "x_axis": 400, "y_axis": 400, "radius": 20, "color" : "red", "enemyName" : 'Java Script'},
  { "x_axis": 70, "y_axis": 200, "radius": 20, "color" : "green",  "enemyName" : 'Coffee Script'},
  { "x_axis": 200, "y_axis": 300, "radius": 20, "color" : "purple", "enemyName" : 'Type Script'},
  { "x_axis": 400, "y_axis": 400, "radius": 20, "color" : "red", "enemyName" : 'Java Script'}
];


var svgContainer = d3.select('div').append('svg')
  .attr('width', 700)
  .attr('height', 600)
  .style('background-color', '#D3D3D3')
  .style('border', '2px solid black')
  .style('margin-top',"20px");

var circles = svgContainer.selectAll('circle')
  .data(jsonCircles)
  .enter()
  .append('circle');


var circleAttributes = circles
  .attr('cx', function(d) {return 700 * Math.random()})
  .attr('cy', d => 600 * Math.random())
  .attr('r', d => d.radius)
  .text(d => d.enemyName)
  .style('fill', d => d.color);

var player = svgContainer.append('circle')
  .attr('cx', 700 * Math.random())
  .attr('cy', 600 * Math.random())
  .attr('r', 20)
  .style('fill', "black");



function update() {
  circleAttributes.attr("class","update")
    .transition()
      .duration(750)
      .attr('cx', function(d) {return 700 * Math.random()})
      .attr('cy', d => 600 * Math.random())
}


setInterval(function() { 
  update();

},1000)