let handpose;
let video;
let hands = [];
let lastHands = [];
let img;
let simpleShader;
let camera;

function preload() {
  simpleShader = loadShader('basic.vert', 'basic.frag');
  img = loadImage('images/concept3wide.png');
  img2 = loadImage('images/conceptart1wide.png');
  camera = loadImage('images/cameraTransparent2.png');
  roll = loadImage('images/35mmrollSharp.png');
}

function setup() {
  createCanvas(1280, 960);

  video = createCapture(VIDEO);
  video.size(1280, 960);
  video.hide();

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "hands"
  // with an array every time new hand poses are detected
  handpose.on('hand', (results) => {
    hands = results;
  });
}

function modelReady() {
  console.log('Model ready!');
}

function draw() {
  background(img);
  translate(width, 0);
  scale(-1, 1);

  drawCamera();
  image(roll, 0, 780, 160, 160);
}

function drawCamera() {
  if (!hands[0]) {
    // background(img2);
  }
  for (let i = 0; i < hands.length; i += 1) {
    const prediction = hands[i];
    // for (let j = 3; j < 4; j += 1) {
    const keypoint = prediction.landmarks[3];
    fill(0, 255, 0);
    noStroke();
    image(camera, 2 * keypoint[0], 2 * keypoint[1]);
    // }
  }
}
