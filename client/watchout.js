/********** Helper Functions and Methods **********/

let updateCollision = () => {
  d3.select('#collision-count').text(gameStats.collision.toString());
  gameStats.collision++;
  svgContainer.style("border-color","red");
  setTimeout(function(){
    svgContainer.style("border-color","black");
  },200);
};

let updateScore = () => d3.select('#current-score').text(gameStats.score.toString());

let updateBestScore = () => {
  gameStats.bestScore = Math.max(gameStats.bestScore, gameStats.score);
  d3.select('#highest-score').text(gameStats.bestScore.toString());
  d3.select('#collision-count').text(gameStats.collision.toString());
};

let increaseScore = () => {
  gameStats.score++;
  return updateScore();
};

let updatePositions = () => {
  circles
    .transition()
    .duration(1500)
    .attr('cx', d => 700 * Math.random())
    .attr('cy', d => 600 * Math.random());
};

let drag = d3.behavior.drag()  
  .on('dragstart', () => player.style('fill', 'white'))
  .on('drag', () => player.attr('cx', d3.event.x).attr('cy', d3.event.y))
  .on('dragend', () => player.style('fill', 'black'));

/*************** Game Board Here! ***************/

let svgContainer = d3.select('div').append('svg')
  .attr("class","gameboard")
  .attr('width', 700)
  .attr('height', 600)
  .style('background-color', '#D3D3D3')
  .style('border', '4px solid black')
  .style('margin-top',"20px");

/*************** Game Data Here! ****************/

let gameStats = {score: 0, bestScore: 0, collision: 0};

/********** Enemies and Player Circles **********/

let jsonCircles = [];

let CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

class EnemiesCircle {
  constructor(id) {
    this.id = id,
    this.color = CSS_COLOR_NAMES[Math.floor(Math.random() * CSS_COLOR_NAMES.length)];
  }
}

for (let i = 0; i < 100; i++) {
  let obj = new EnemiesCircle(`a${i}`); 
  jsonCircles.push(obj);
}

let circles = svgContainer.selectAll('circle')
  .data(jsonCircles)
  .enter()
  .append('circle')
  .attr('id', d => d.id)
  .attr('cx', d => 700 * Math.random())
  .attr('cy', d => 600 * Math.random())
  .attr('r', d => 10)
  .style('fill', d => d.color);

let player = svgContainer.append('circle')
  .attr('class','player')
  .attr('cx', 350)
  .attr('cy', 300)
  .attr('r', 13)
  .style('fill', "black")
  .call(drag);

/****************** Play Game! ******************/

updateBestScore();

let throttleCollision = _.throttle(updateCollision, 500, {leading: false, trailing: false});

setInterval(function() { 
  updatePositions();
}, 1500);

setInterval(function(){
  increaseScore();
}, 50);

setInterval(function() {
  playerX = parseFloat(player.attr("cx"));
  playerY = parseFloat(player.attr("cy"));

  _.each(jsonCircles, enemy => {
    // console.log(enemy)
    let enemyX = Math.floor(d3.select('#' + enemy.id).attr('cx'));
    let enemyY = Math.floor(d3.select('#' + enemy.id).attr('cy'));

    let hasCollisionX = playerX < (enemyX + 15) && playerX > (enemyX - 15);
    let hasCollisionY = playerY < (enemyY + 15) && playerY > (enemyY - 15);
    //console.log(enemyX, enemyY, 'Enemies');
    if (hasCollisionX && hasCollisionY) {
      throttleCollision();
      updateBestScore();
      gameStats.score = 0;
    }
  });
}, 0);

