
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;	//	the tween manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

BasicGame.Game.prototype = {

	function preload() {
    game.load.image('you', 'assets/you.png');
    game.load.image('me', 'assets/me.png');
    game.load.image('col', 'assets/col.png');
    game.load.image('start', 'assets/start.png');
    game.load.image('lose', 'assets/lose.png');
    game.load.image('win', 'assets/win.png');
    game.load.audio('downYou', 'assets/downYou.mp3');
    game.load.audio('downMe', 'assets/downMe.mp3');
    game.load.audio('love', 'assets/loveloop.mp3');
    game.load.audio('lose', 'assets/lose.mp3');
    game.load.audio('win', 'assets/win.mp3');
    game.load.audio('theme', 'assets/siamesetheme.mp3');
}

var youPlayer;
var mePlayer;
var obstacles;
var starts;
var playerBounce = 0.8;
// var playerGravity = -50;
var youScale = 2;
var meScale = 2;
var youOpacity = 1;
var meOpacity = 1;
var scaleUp = 0.1;
var scaleDown = 0.025;
var downYou, downMe, love, lose, win, theme;
var gameStart = true;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function create() {
    Phaser.Canvas.setSmoothingEnabled(game.context, false);
    // game.stage.backgroundColor = '#8e8d8d';
    starts = game.add.group();
    var start = starts.create(game.world.width/2-50, -50, 'start');
    start.scale.x = 2;
    start.scale.y = 2;
    start = starts.create(game.world.width/2-50, game.world.height-50, 'start' );
    start.scale.x = 2;
    start.scale.y = 2;

    var xMax = game.world.width/25;
    var yMax = game.world.height/25;

    obstacles = game.add.group();
    for (var i=0; i<250; i++){
        var xRand = getRandomInt(0,xMax)*25;
        var yRand = getRandomInt(0,yMax)*25;
        var col = obstacles.create(xRand, yRand,'col');
        col.body.immovable = true;
    }



    youPlayer = game.add.sprite(game.world.width/2, 25, 'you');
    mePlayer  = game.add.sprite(game.world.width/2, game.world.height-25, 'me');
    
    youPlayer.scale.x = youScale;
    youPlayer.scale.y = youScale;
    mePlayer.scale.x = meScale;
    mePlayer.scale.y = meScale;

    mePlayer.anchor.setTo(0.5,0.5);
    youPlayer.anchor.setTo(0.5,0.5);

    mePlayer.angle = 0;
    youPlayer.angle = 180;
    



    youPlayer.body.bounce.y = playerBounce;
    mePlayer.body.bounce.y = playerBounce;
    youPlayer.body.bounce.x = playerBounce;
    mePlayer.body.bounce.x = playerBounce;


    // youPlayer.body.gravity.y = -playerGravity;
    // mePlayer.body.gravity.y = playerGravity;


    youPlayer.body.collideWorldBounds = true;
    mePlayer.body.collideWorldBounds = true;

    love = game.add.audio('love',.25,true);
    win = game.add.audio('win',1,false);
    downYou = game.add.audio('downYou',0.25,false);
    downMe = game.add.audio('downMe',0.25,false);
    lose = game.add.audio('lose',1,false);
    theme = game.add.audio('theme',1,true);
    theme.play('',0,0.5,true);


    cursor = game.input.keyboard.createCursorKeys();
}

function update() {
    // Split these conditions up so that they destroy the players
    endGame();
    if (gameStart){control()};
    game.physics.collide(youPlayer, mePlayer, setScaleUp, null, this);
    game.physics.collide(youPlayer, obstacles, setScaleDownYou, null, this);
    game.physics.collide(mePlayer, obstacles, setScaleDownMe, null, this);
    game.physics.overlap(obstacles, starts, removeObstacles, null, this);

    function removeObstacles(col)
    {
        col.kill();
    }

    function setScaleUp()
    {
        love.play();
        meOpacity = 1;
        mePlayer.alpha = 1;
        youOpacity = 1;
        youPlayer.alpha = 1;
        // if (youScale >= 4 || meScale >= 4){
        //     meScale += scaleUp*50;
        //     youScale += scaleUp*50;
        // }
        // else{
            meScale += scaleUp;
            youScale += scaleUp;   
        // }
        youPlayer.scale.x = youScale;
        youPlayer.scale.y = youScale;
        mePlayer.scale.x = meScale;
        mePlayer.scale.y = meScale;
    }

    function setScaleDownYou(player,col){
        love.stop();
        downYou.play();
        if (youScale >= 1)
        {
            youScale -= scaleDown;
            youPlayer.scale.x = youScale;
            youPlayer.scale.y = youScale;
        }
        else
        {
            youOpacity = youOpacity -0.01;
            youPlayer.alpha = youOpacity;
        }

        if (youScale >= 4){
            col.kill()
        }

    }

    function setScaleDownMe(player,col){
        love.stop();
        downMe.play();
        if (meScale >= 1)
        {
            meScale -= scaleDown;
            mePlayer.scale.x = meScale;
            mePlayer.scale.y = meScale;
        }
        else
        {
            meOpacity = meOpacity -0.01;
            mePlayer.alpha = meOpacity;
        }
         if (meScale >= 4){
            col.kill()
        }
        
    }
    backColor();

}

function backColor(){
    if ((meScale >= 3 && meScale < 5) && (youScale >= 3 && youScale < 5)){
        game.stage.backgroundColor = '#666666';
    }
    if ((meScale >= 5 && meScale < 6) && (youScale >= 5 && youScale < 6)){
        game.stage.backgroundColor = '#999999';
    }
    if ((meScale >= 6 && meScale < 7) && (youScale >= 6 && youScale < 7)){
        game.stage.backgroundColor = '#b8b8b8';
    }
    if ((meScale >= 7 && meScale < 8) && (youScale >= 7 && youScale < 8)){
        game.stage.backgroundColor = '#cccccc';
    }
    // if ((meScale >= 6 && meScale < 8) || (youScale >= 6 && youScale < 8)){
    //     game.stage.backgroundColor = '#cccccc';
    // }
    // if ((meScale >= 6 && meScale < 8) || (youScale >= 6 && youScale < 8)){
    //     game.stage.backgroundColor = '#cccccc';
    // }

}

function control(){
    var moveSpeed = 75;
    var restSpeed = 0;
    mePlayer.rotation = game.physics.angleBetween(mePlayer, youPlayer);
    youPlayer.rotation = game.physics.angleBetween(youPlayer, mePlayer);

    // mePlayer.body.velocity.x = restSpeed;
    // mePlayer.body.velocity.y = restSpeed;
    // youPlayer.body.velocity.x = -restSpeed;
    // youPlayer.body.velocity.y = -restSpeed;

    //Left and Right
    if (cursor.left.isDown)
    {
        mePlayer.body.velocity.x = -moveSpeed;
        youPlayer.body.velocity.x = moveSpeed;
    }
    else if (cursor.right.isDown)
    {
        mePlayer.body.velocity.x = moveSpeed;
        youPlayer.body.velocity.x = -moveSpeed;
    }
    
    //Up and Down
    if (cursor.down.isDown)
    {
        mePlayer.body.velocity.y = moveSpeed;
        youPlayer.body.velocity.y = -moveSpeed;
    }
    else if (cursor.up.isDown) 
    {
        mePlayer.body.velocity.y = -moveSpeed;
        youPlayer.body.velocity.y = moveSpeed;
    }

    //Left Diagonals
    if (cursor.left.isDown && cursor.up.isDown)
    {
        mePlayer.body.velocity.x = -moveSpeed/2;
        youPlayer.body.velocity.x = moveSpeed/2;
        mePlayer.body.velocity.y = -moveSpeed/2;
        youPlayer.body.velocity.y = moveSpeed/2;
    }
    else if (cursor.left.isDown && cursor.down.isDown)
    {
        mePlayer.body.velocity.x = -moveSpeed/2;
        youPlayer.body.velocity.x = moveSpeed/2;
        mePlayer.body.velocity.y = moveSpeed/2;
        youPlayer.body.velocity.y = -moveSpeed/2;
    }

    //Right Diagonals
    if (cursor.right.isDown && cursor.up.isDown)
    {
        mePlayer.body.velocity.x = moveSpeed/1.5;
        youPlayer.body.velocity.x = -moveSpeed/1.5;
        mePlayer.body.velocity.y = -moveSpeed/1.5;
        youPlayer.body.velocity.y = moveSpeed/1.5;
    }
    else if (cursor.right.isDown && cursor.down.isDown)
    {
        mePlayer.body.velocity.x = moveSpeed/1.5;
        youPlayer.body.velocity.x = -moveSpeed/1.5;
        mePlayer.body.velocity.y = moveSpeed/1.5;
        youPlayer.body.velocity.y = -moveSpeed/1.5;
    }
}

function endGame(){
    if (meOpacity <= 0.2 || youOpacity <= 0.2){
        lose.play();
        console.log('lost');
        game.add.sprite(0,0, 'lose');
        youPlayer.kill();
        mePlayer.kill();
        theme.stop();
        meOpacity = 1;
        youOpacity = 1;
    }
    else if (meScale >=8 || youScale >= 8){
        win.play();
        game.add.sprite(0,0, 'win')
        youPlayer.kill();
        mePlayer.kill();
        theme.stop();
        meScale = 2;
        youScale = 2;
    }

}

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.game.state.start('MainMenu');

	}

};



var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload:preload,  create: create, update: update });




