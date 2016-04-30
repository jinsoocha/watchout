/********** Helper Functions and Methods **********/

var updateCollision = function() {
  d3.select('#collision-count').text(gameStats.collision.toString());
  gameStats.collision++;
  svgContainer.style("border-color","red");
  setTimeout(function(){
    svgContainer.style("border-color","black");
  },200);
};

var updateScore = function() {
  return d3.select('#current-score').text(gameStats.score.toString());
};

var updateBestScore = function() {
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  d3.select('#highest-score').text(gameStats.bestScore.toString());
  d3.select('#collision-count').text(gameStats.collision.toString());

};

var increaseScore = function() {
  gameStats.score++;
  return updateScore();
};

var updatePositions = function() {
  circleAttributes.attr("class","update")
    .transition()
    .duration(1500)
    .attr('cx', function(d) { return 700 * Math.random(); })
    .attr('cy', d => 600 * Math.random());
};



var drag = d3.behavior.drag()  
  .on('dragstart', function() { player.style('fill', 'white'); })
  .on('drag', function() { 
    player.attr('cx', d3.event.x).attr('cy', d3.event.y); 
  })
  .on('dragend', function() { player.style('fill', 'black'); });

/*************** Game Board Here! ***************/

var svgContainer = d3.select('div').append('svg')
  .attr('width', 700)
  .attr('height', 600)
  .style('background-color', '#D3D3D3')
  .style('border', '4px solid black')
  .style('margin-top',"20px");

/*************** Game Data Here! ****************/

var gameStats = {score: 0, bestScore: 0, collision: 0};

/********** Enemies and Player Circles **********/

var jsonCircles = [
  { "color" : "green", "id" : 'a'},
  { "color" : "purple", "id" : 'b'},
  { "color" : "red", "id" : 'c'},
  { "color" : "teal",  "id": 'd'},
  { "color" : "gray", "id": 'e'},
  { "color" : "orange", "id": 'f'},
  { "color" : "green", "id" : 'g'},
  { "color" : "purple", "id" : 'h'},
  { "color" : "red", "id" : 'i'},
  { "color" : "teal",  "id": 'j'},
  { "color" : "gray", "id": 'k'},
  { "color" : "orange", "id": 'l'},
  { "color" : "green", "id" : 'm'},
  { "color" : "purple", "id" : 'n'},
  { "color" : "red", "id" : 'o'},
  { "color" : "teal",  "id": 'p'},
  { "color" : "gray", "id": 'q'},
  { "color" : "orange", "id": 'r'},
  { "color" : "green", "id" : 's'},
  { "color" : "purple", "id" : 't'},
  { "color" : "red", "id" : 'u'},
  { "color" : "teal",  "id": 'v'},
  { "color" : "gray", "id": 'w'},
  { "color" : "orange", "id": 'x'},
  { "color" : "pink", "id": 'y'},
  { "color" : "yellow", "id": 'z'}

];

var enemies = [];

_.each(jsonCircles, function(element) {enemies.push('#'+ element.id);});
console.log(JSON.stringify(enemies));

var circles = svgContainer.selectAll('circle')
  .data(jsonCircles)
  .enter()
  .append('circle')
  .attr('id', function(d){ return d.id})

var circleAttributes = circles
  .attr('cx', function(d) {
    return 700 * Math.random()})
  .attr('cy', d => 600 * Math.random())
  .attr('r', d => 10)
  .text(d => d.enemyName)
  .style('fill', d => d.color)


var player = svgContainer.append('circle')
  .attr('class','player')
  .attr('cx', 350)
  .attr('cy', 300)
  .attr('r', 13)
  .style('fill', "black")
  .call(drag);


/****************** Play Game! ******************/

updateBestScore();

var throttleCollision = _.throttle(updateCollision, 500, {leading: false, trailing: false});

setInterval(function() { 
  updatePositions();
}, 1500);


setInterval(function(){
  increaseScore();
}, 50);


setInterval(function() {
  playerX = parseFloat(player.attr("cx"));
  playerY = parseFloat(player.attr("cy"));

  _.each(enemies, function(enemy) {
    var enemyX = Math.floor(d3.select(enemy).attr('cx'));
    var enemyY = Math.floor(d3.select(enemy).attr('cy'));

    var hasCollisionX = playerX < (enemyX + 15) && playerX > (enemyX - 15);
    var hasCollisionY = playerY < (enemyY + 15) && playerY > (enemyY - 15);
    //console.log(enemyX, enemyY, 'Enemies');
    if (hasCollisionX && hasCollisionY) {
      throttleCollision();
      updateBestScore();
      gameStats.score = 0;
      
      
    }
  });
}, 0);

