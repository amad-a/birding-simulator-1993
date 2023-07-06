let handpose;
let video;
let volume = 0;
let hands = [];
let lastHands = [];
let simpleShader;
let camera;
let font;
let shots = 24;
let currentCoords = [0, 0];
let shotCoords,
  mirroredCoords = [0, 0];
let screenWidth = 1280;
let screenHeight = 960;
let currentScreen = 2;
let backgrounds;
let cardinalDirections;
let modelLoaded = false;
let currentArrow;

let savedTime;
let totalTime = 1000;
let cameraSound;

// const screens = [
//   {
//     id: 0,
//     url: '0.png',
//     arrows: [
//       { direction: 'w', x: 60, y: 450, screen: 1 },
//       { direction: 'e', x: screenWidth - 180, y: 450, screen: 2 },
//     ],
//   },
//   {
//     id: 1,
//     url: '1.png',
//     arrows: [
//       { direction: 'w', x: 60, y: 450, screen: 2 },
//       { direction: 'e', x: screenWidth - 180, y: 450, screen: 0 },
//     ],
//   },
//   {
//     id: 2,
//     url: '2.png',
//     arrows: [
//       { direction: 'w', x: 60, y: 450, screen: 0 },
//       { direction: 'e', x: screenWidth - 180, y: 450, screen: 1 },
//     ],
//   },
//   {
//     id: 3,
//     url: '3.png',
//     arrows: [
//       { direction: 'ne', x: 100, y: 100, screen: 2 },
//       { direction: 'w', x: 100, y: 100, screen: 1 },
//     ],
//   },
//   {
//     id: 4,
//     url: '4.png',
//     arrows: [
//       { direction: 'ne', x: 100, y: 100, screen: 1 },
//       { direction: 'w', x: 100, y: 100, screen: 3 },
//     ],
//   },
// ];

const screens = [
  {
    id: 0,
    arrows: [
      { direction: 'w', x: 60, y: 450, screen: 7 },
      { direction: 'e', x: screenWidth - 180, y: 450, screen: 11 },
    ],
  },
  {
    id: 1,
    arrows: [{ direction: 'w', x: 60, y: 450, screen: 2 }],
  },
  {
    id: 2,
    arrows: [
      { direction: 'w', x: 60, y: 450, screen: 3 },
      { direction: 'e', x: screenWidth - 180, y: 450, screen: 1 },
    ],
  },
  {
    id: 3,
    arrows: [
      { direction: 'ne', x: 650, y: 500, screen: 10 },
      { direction: 'sw', x: 450, y: screenHeight - 150, screen: 2 },
    ],
  },
  {
    id: 4,
    arrows: [
      { direction: 'w', x: 60, y: 450, screen: 9 },
      { direction: 'e', x: screenWidth - 180, y: 450, screen: 10 },
      { direction: 'n', x: 600, y: 40, screen: 5 },
    ],
  },
  {
    id: 5,
    arrows: [
      { direction: 's', x: 600, y: screenHeight - 160, screen: 4 },
    ],
  },
  {
    id: 6,
    arrows: [{ direction: 'w', x: 60, y: 450, screen: 10 }],
  },
  {
    id: 7,
    arrows: [
      { direction: 'e', x: screenWidth - 180, y: 450, screen: 0 },
    ],
  },
  {
    id: 8,
    arrows: [{ direction: 'sw', x: 60, y: 450, screen: 11 }],
  },
  {
    id: 9,
    arrows: [
      { direction: 's', x: 600, y: screenHeight - 160, screen: 4 },
      {
        direction: 'nw',
        x: 475,
        y: 500,
        screen: 11,
      },
    ],
  },
  {
    id: 10,
    arrows: [
      { direction: 'w', x: 60, y: 450, screen: 4 },
      { direction: 's', x: 600, y: screenHeight - 160, screen: 3 },
      { direction: 'e', x: screenWidth - 180, y: 450, screen: 6 },
    ],
  },
  {
    id: 11,
    arrows: [
      { direction: 's', x: 600, y: screenHeight - 160, screen: 9 },
      { direction: 'w', x: 60, y: 450, screen: 0 },
      { direction: 'ne', x: screenWidth - 180, y: 450, screen: 8 },
    ],
  },
];

//if over arrow:

function preload() {
  cardinalDirections = {
    e: loadImage('images/arrows/e.png'),
    n: loadImage('images/arrows/n.png'),
    ne: loadImage('images/arrows/ne.png'),
    nw: loadImage('images/arrows/nw.png'),
    s: loadImage('images/arrows/s.png'),
    se: loadImage('images/arrows/se.png'),
    sw: loadImage('images/arrows/sw.png'),
    w: loadImage('images/arrows/w.png'),
    prev: loadImage('images/arrows/prev.png'),
  };

  camera = loadImage('images/cameraTransparent2.png');
  roll = loadImage('images/35mmrollSharp.png');
  pointer = loadImage('images/pointer.png');

  egret = loadImage('images/birds/egretSitting.png');
  blueheron = loadImage('images/birds/crowFlying.png');
  mallard = loadImage('images/birds/duck.png');

  // delegate this to screens object?
  backgrounds = {
    0: loadImage('images/screens/0.png'),
    1: loadImage('images/screens/1.png'),
    2: loadImage('images/screens/2.png'),
    3: loadImage('images/screens/3.png'),
    4: loadImage('images/screens/4.png'),
    5: loadImage('images/screens/5.png'),
    6: loadImage('images/screens/6.png'),
    7: loadImage('images/screens/7.png'),
    8: loadImage('images/screens/8.png'),
    9: loadImage('images/screens/9.png'),
    10: loadImage('images/screens/10.png'),
    11: loadImage('images/screens/11.png'),
  };

  cameraSound = loadSound('sounds/snapshot.mp3');
  grassSound = loadSound('sounds/grass.mp3');
  font = loadFont('fonts/garamond-italic-sp.ttf');
}

function setup() {
  createCanvas(screenWidth, screenHeight);
  savedTime = millis();

  video = createCapture(VIDEO);
  video.size(screenWidth, screenHeight);
  video.hide();

  handpose = ml5.handpose(video, modelReady);

  handpose.on('hand', (results) => {
    hands = results;
    modelLoaded = true;
  });
}

function modelReady() {
  console.log('ml5js handpose model ready');
}

function renderHud() {
  text(shots, 135, 820, -100, 100);
  fill(255);
  text(shots, 145, 820, -100, 100);
  fill(0);

  image(roll, 0, 780, 160, 160);
  renderVolumeMeter();
}

function renderVolumeMeter() {
  fill(0);
  rect(1245, 940, 20, -140);
  volume < 4
    ? fill(92, 154, 5)
    : volume < 9
    ? fill(209, 209, 46)
    : fill(179, 0, 0);
  rect(1250, 935, 10, volume * -10);
  fill(0);
}

function renderGameOver() {
  fill(0);
  text('GAME OVER!', screenWidth / 2 - 325, screenHeight / 2);
  fill(255);
  text('GAME OVER!', screenWidth / 2 - 335, screenHeight / 2);
}

function renderLoading() {
  fill(0);
  text('Loading...', screenWidth / 2 - 225, screenHeight / 2);
  fill(255);
  text('Loading...', screenWidth / 2 - 235, screenHeight / 2);
  fill(0);
}

function renderArrows() {
  let arrows = screens[currentScreen].arrows;
  arrows.map((arrow) => {
    arrowGraphic = cardinalDirections[arrow.direction];
    image(
      arrowGraphic,
      arrow.x,
      arrow.y,
      arrowGraphic.width * 2.5,
      arrowGraphic.height * 2.5
    );
  });
}

function overlapArrows() {
  let arrows = screens[currentScreen].arrows;
  let hoveredArrow;
  arrows.map((arrow) => {
    arrowGraphic = cardinalDirections[arrow.direction];
    if (
      calculateOverlap(
        arrow.x + 100,
        arrow.y,
        arrowGraphic.width * 2.5,
        arrowGraphic.height * 2.5
      ) > 50
    ) {
      hoveredArrow = arrow;
    }
  });
  return hoveredArrow;
}

function draw() {
  background(backgrounds[currentScreen]);

  if (!modelLoaded) renderLoading();

  textFont(font);
  textSize(130);

  if (modelLoaded && shots > 0) {
    renderHud();
    let passedTime = millis() - savedTime;

    if (passedTime > totalTime && volume > 0) {
      volume -= 1;
      savedTime = millis();
    }

    // image(egret, 100, 300, egret.width * 1.5, egret.height * 1.5);

    // image(
    //   blueheron,
    //   100,
    //   100,
    //   blueheron.width * 1.5,
    //   blueheron.height * 1.5
    // );

    // image(mallard, 500, 450, mallard.width * 2, mallard.height * 2);

    renderArrows();
    //renderBirds();

    translate(width, 0);
    scale(-1, 1);
    drawCamera();
  }
  if (shots < 1) {
    renderGameOver();
  }
}

function drawCamera() {
  if (!hands[0]) {
  }

  if (modelLoaded) {
    for (let i = 0; i < hands.length; i += 1) {
      const prediction = hands[i];
      const keypoint = prediction.landmarks[3];
      noStroke();
      mirroredCoords = [2 * keypoint[0], 2 * keypoint[1]];
      currentCoords = [
        screenWidth - 2 * keypoint[0],
        2 * keypoint[1],
      ];

      overlapArrows()
        ? image(
            pointer,
            2 * keypoint[0],
            2 * keypoint[1],
            pointer.width * 2,
            pointer.height * 2
          )
        : image(camera, 2 * keypoint[0], 2 * keypoint[1]);
    }
  }
}

function keyPressed() {
  if (keyCode == SHIFT && shots > 0 && modelLoaded) {
    if (overlapArrows()) {
      let currentArrow = overlapArrows();
      currentScreen = currentArrow.screen;

      volume = Math.min(12, volume + 4);

      grassSound.play();
    } else {
      shots -= 1;
      shotCoords = currentCoords;
      volume = Math.min(12, volume + 6);

      cameraSound.play();
    }
  }
}

function clickDetection() {}

function calculateOverlap(x2, y2, w2, h2) {
  let x1 = currentCoords[0];
  let y1 = currentCoords[1];
  let w1 = 75;
  let h1 = 75;

  let left = max(x1, x2);
  let right = min(x1 + w1, x2 + w2);
  let top = max(y1, y2);
  let bottom = min(y1 + h1, y2 + h2);

  let width = right - left;
  let height = bottom - top;

  if (width < 0 || height < 0) {
    return 0;
  }

  let overlapArea = width * height;
  let rectArea = w1 * h1;
  let percentageOverlap = (overlapArea / rectArea) * 100;

  return percentageOverlap;
}

function successfulShot() {}
function changeScreen() {}
function arrowClick() {}
// let screens = {};

// function renderText(text, x, y, w, h) {
//   text(shots, 135, 820, -100, 100);
//   fill(255);
//   text(shots, 145, 820, -100, 100);
//   fill(0);

//   text(volume, 135, 120, -100, 100);
//   fill(255);
//   text(volume, 145, 120, -100, 100);
//   fill(0);
// }
