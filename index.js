let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;

let snakeImage = new Image();
snakeImage.src = "https://pbs.twimg.com/profile_images/1332376553/FCFM.png";

let snakeHeadImage = new Image();
snakeHeadImage.src =
  "https://upload.wikimedia.org/wikipedia/commons/4/45/GDevs.png";

let appleImage = new Image();
appleImage.src =
  "https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png";

let snake = {
  tail: [],
  size: 20,
  direction: "d",
};

let apple = {
  x: 0,
  y: 0,
  size: 20,
  spawned: false,
};

let score = 0;
let gameOver = true;

let inputStack = [];

function start() {
  setup();
  document.addEventListener("keydown", input);
  setInterval(update, 1000 / 10);
}

function update() {
  if (gameOver) {
    showGameOver();
    return;
  }

  movement();
  spawnApple();
  checkCollisions();
  draw();
}

function setup() {
  snake.tail = [];
  snake.direction = "d";
  inputStack = [];
  score = 0;
  gameOver = false;
  apple.spawned = false;
  for (let i = 0; i < 3; i++) {
    snake.tail.push({ x: 0, y: 0, size: snake.size });
  }
}

function showGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", 530 / 2, 700 / 2);
}

function checkCollisions() {
  let head = snake.tail[0];
  if (isColliding(snake.tail[0], apple)) {
    apple.spawned = false;
    score++;
    snake.tail.push({
      x: head,
      y: head,
      size: snake.size,
    });
  }

  if (
    head.x < 0 ||
    head.x > 700 - snake.size ||
    head.y < 0 ||
    head.y > 700 - snake.size
  )
    gameOver = true;

  for (let i = 1; i < snake.tail.length; i++) {
    let point = snake.tail[i];

    if (isColliding(head, point)) {
      gameOver = true;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, 700, 700);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText(score, 20, 40);

  for (let i = 0; i < snake.tail.length; i++) {
    const point = snake.tail[i];
    if (i == 0)
      ctx.drawImage(snakeHeadImage, point.x, point.y, point.size, point.size);
    else ctx.drawImage(snakeImage, point.x, point.y, point.size, point.size);
  }

  ctx.fillStyle = "red";
  ctx.drawImage(appleImage, apple.x, apple.y, apple.size, apple.size);
}

function movement() {
  const nextInput = inputStack.shift();
  if (nextInput) snake.direction = nextInput;

  for (let i = snake.tail.length - 1; i > 0; i--) {
    const point = snake.tail[i];
    const nextPoint = snake.tail[i - 1];
    point.x = nextPoint.x;
    point.y = nextPoint.y;
  }

  switch (snake.direction) {
    case "d":
      snake.tail[0].x += snake.size;
      break;
    case "w":
      snake.tail[0].y -= snake.size;
      break;
    case "s":
      snake.tail[0].y += snake.size;
      break;
    case "a":
      snake.tail[0].x -= snake.size;
      break;
  }
}

function isColliding(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.size &&
    rect1.x + rect1.size > rect2.x &&
    rect1.y < rect2.y + rect2.size &&
    rect1.y + rect1.size > rect2.y
  );
}

function spawnApple() {
  if (!apple.spawned) {
    apple.x = getRandomValue();
    apple.y = getRandomValue();
    apple.spawned = true;
  }
}

function input(event) {
  if (
    (event.key == "w" ||
      event.key == "a" ||
      event.key == "s" ||
      event.key == "d") &&
    inputStack[0] != event.key
  )
    inputStack.push(event.key);

  if (event.key == "Enter" && gameOver) {
    setup();
  }
}

function getRandomValue() {
  return Math.floor(Math.random() * (700 / 20)) * 20;
}

start();
