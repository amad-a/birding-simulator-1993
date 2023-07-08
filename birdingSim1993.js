let handpose;
let video;
let volume = 0;
let hands = [];
let lastHands = [];
let camera;
let font;
let shots = 24;
let currentCoords = [400, 400];
let shotCoords,
  mirroredCoords = [0, 0];
let screenWidth = 1280;
let screenHeight = 960;
let currentScreen = 2;
let backgrounds;
let cardinalDirections;
let modelLoaded = false;
let currentArrow;
let capturedBirds = [];

let savedTime;
let totalTime = 1000;
let cameraSound;

const screens = [
  {
    id: 0,
    arrows: [
      { direction: 'w', x: 60, y: 450, screen: 7 },
      { direction: 'e', x: screenWidth - 185, y: 450, screen: 11 },
    ],
    birds: [
      {
        bird: 'woodDuckS',
        name: 'Wood Duck',
        link: 'https://www.allaboutbirds.org/guide/wood_duck',
        x: 600,
        y: 500,
        chance: 10,
      },
      {
        bird: 'osprey2S',
        name: 'Osprey',
        link: 'https://www.allaboutbirds.org/guide/osprey',
        x: 100,
        y: 100,
        chance: 10,
      },
      {
        bird: 'crowFlyingS',
        name: 'American Crow',
        link: 'https://www.allaboutbirds.org/guide/American_Crow/',
        x: 1000,
        y: 150,
        chance: 10,
      },
    ],
  },
  {
    id: 1,
    arrows: [{ direction: 'w', x: 60, y: 450, screen: 2 }],
    birds: [
      {
        bird: 'herringGullXL',
        name: 'Herring Gull',
        link: 'https://www.allaboutbirds.org/guide/Herring_Gull',
        x: 300,
        y: 600,
        chance: 3,
      },
      {
        bird: 'brantS',
        name: 'Brant',
        link: 'https://www.allaboutbirds.org/guide/brant',
        x: 850,
        y: 600,
        chance: 5,
      },
      {
        bird: 'woodDuckS',
        name: 'Wood Duck',
        link: 'https://www.allaboutbirds.org/guide/wood_duck',
        x: 100,
        y: 600,
        chance: 8,
      },
      {
        bird: 'hudsonianGodwitS',
        name: 'Hudsonian Godwit',
        link: 'https://www.allaboutbirds.org/guide/hudsonian_godwit',
        x: 300,
        y: 550,
        chance: 7,
      },
      {
        bird: 'blueHeronFlyingS',
        name: 'Great Blue Heron',
        link: 'https://www.allaboutbirds.org/guide/Great_Blue_Heron/',
        x: 200,
        y: 100,
        chance: 8,
      },
    ],
  },
  {
    id: 2,
    arrows: [
      { direction: 'w', x: 60, y: 450, screen: 3 },
      { direction: 'e', x: screenWidth - 185, y: 450, screen: 1 },
    ],
    birds: [
      {
        bird: 'americanWhitePelicanS',
        name: 'American White Pelican',
        link: 'https://www.allaboutbirds.org/guide/American_White_Pelican',
        x: 200,
        y: 100,
        chance: 8,
      },
      {
        bird: 'blackSkimmerS',
        name: 'Black Skimmer',
        link: 'https://www.allaboutbirds.org/guide/black_skimmer',
        x: 600,
        y: 400,
        chance: 7,
      },
      {
        bird: 'houseSparrowS',
        name: 'House Sparrow',
        link: 'https://www.allaboutbirds.org/guide/house_sparrow',
        x: 800,
        y: 620,
        chance: 6,
      },
      {
        bird: 'houseSparrowS',
        name: 'House Sparrow',
        link: 'https://www.allaboutbirds.org/guide/house_sparrow',
        x: 900,
        y: 610,
        chance: 6,
      },
      {
        bird: 'europeanStarlingS',
        name: 'European Starling',
        link: 'https://www.allaboutbirds.org/guide/european_starling',
        x: 200,
        y: 660,
        chance: 5,
      },
    ],
  },
  {
    id: 3,
    arrows: [
      { direction: 'ne', x: 650, y: 500, screen: 10 },
      { direction: 'sw', x: 450, y: screenHeight - 150, screen: 2 },
    ],
    birds: [
      {
        bird: 'egretSittingL',
        name: 'Great Egret',
        link: 'https://www.allaboutbirds.org/guide/Great_Egret/',
        x: 800,
        y: 300,
        chance: 6,
      },
    ],
  },
  {
    id: 4,
    arrows: [
      { direction: 'w', x: 60, y: 450, screen: 9 },
      { direction: 'e', x: screenWidth - 185, y: 450, screen: 10 },
      { direction: 'n', x: 600, y: 40, screen: 5 },
    ],
    birds: [
      {
        bird: 'greatBlueHeronSittingL',
        name: 'Great Blue Heron',
        link: 'https://www.allaboutbirds.org/guide/Great_Blue_Heron/',
        x: 500,
        y: 300,
        chance: 6,
      },
      {
        bird: 'beltedKingfisherS',
        name: 'Belted Kingfisher',
        link: 'https://www.allaboutbirds.org/guide/Belted_Kingfisher',
        x: 200,
        y: 600,
        chance: 4,
      },
    ],
  },
  {
    id: 5,
    arrows: [
      { direction: 's', x: 600, y: screenHeight - 160, screen: 4 },
    ],
    birds: [
      // { bird: 'americanRobinS', x: 100, y: 400, chance: 8 },
      {
        bird: 'redwingedBlackbirdS',
        name: 'Red-winged Blackbird',
        link: 'https://www.allaboutbirds.org/guide/Red-winged_Blackbird',
        x: 550,
        y: 100,
        chance: 6,
      },
      {
        bird: 'northernCardinalS',
        name: 'Northern Cardinal',
        link: 'https://www.allaboutbirds.org/guide/Northern_Cardinal',
        x: 900,
        y: 300,
        chance: 4,
      },
      {
        bird: 'europeanStarlingS',
        name: 'European Starling',
        link: 'https://www.allaboutbirds.org/guide/european_starling',
        x: 850,
        y: 500,
        chance: 8,
      },
      {
        bird: 'houseSparrowS',
        name: 'House Sparrow',
        link: 'https://www.allaboutbirds.org/guide/house_sparrow',
        x: 550,
        y: 500,
        chance: 10,
      },
    ],
  },
  {
    id: 6,
    arrows: [{ direction: 'w', x: 60, y: 450, screen: 10 }],
    birds: [
      {
        bird: 'mourningDoveXL',
        name: 'Mourning Dove',
        link: 'https://www.allaboutbirds.org/guide/Mourning_Dove',
        x: 150,
        y: 100,
        chance: 4,
      },
      {
        bird: 'greatBlueHeron2M',
        name: 'Great Blue Heron',
        link: 'https://www.allaboutbirds.org/guide/Great_Blue_Heron/',
        x: 900,
        y: 600,
        chance: 6,
      },
      {
        bird: 'americanWhitePelicanS',
        name: 'American White Pelican',
        link: 'https://www.allaboutbirds.org/guide/American_White_Pelican',
        x: 800,
        y: 200,
        chance: 8,
      },
    ],
  },
  {
    id: 7,
    arrows: [
      { direction: 'e', x: screenWidth - 185, y: 450, screen: 0 },
    ],
    birds: [
      {
        bird: 'blueHeronFlyingS',
        name: 'Great Blue Heron',
        link: 'https://www.allaboutbirds.org/guide/Great_Blue_Heron/',
        x: 120,
        y: 100,
        chance: 8,
      },
      {
        bird: 'egretS',
        name: 'Great Egret',
        link: 'https://www.allaboutbirds.org/guide/Great_Egret/',
        x: 850,
        y: 450,
        chance: 6,
      },
    ],
  },
  {
    id: 8,
    arrows: [{ direction: 'sw', x: 60, y: 450, screen: 11 }],
    birds: [
      {
        bird: 'americanWhitePelicanM',
        name: 'American White Pelican',
        link: 'https://www.allaboutbirds.org/guide/American_White_Pelican',
        x: 600,
        y: 100,
        chance: 10,
      },
      {
        bird: 'monkParakeetS',
        name: 'Monk Parakeet',
        link: 'https://www.allaboutbirds.org/guide/Monk_Parakeet',
        x: 480,
        y: 400,
        chance: 4,
      },
      {
        bird: 'northernCardinalS',
        name: 'Northern Cardinal',
        link: 'https://www.allaboutbirds.org/guide/Northern_Cardinal',
        x: 300,
        y: 650,
        chance: 6,
      },
      {
        bird: 'americanCrow1S',
        name: 'American Crow',
        link: 'https://www.allaboutbirds.org/guide/american_crow',
        x: 900,
        y: 360,
        chance: 8,
      },
    ],
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
    birds: [
      {
        bird: 'americanCrow1M',
        name: 'American Crow',
        link: 'https://www.allaboutbirds.org/guide/american_crow',
        x: 100,
        y: 520,
        chance: 4,
      },
      {
        bird: 'snowEgretM',
        name: 'Snowy Egret',
        link: 'https://www.allaboutbirds.org/guide/Snowy_Egret',
        x: 650,
        y: 300,
        chance: 6,
      },
    ],
  },
  {
    id: 10,
    arrows: [
      { direction: 'w', x: 60, y: 450, screen: 4 },
      { direction: 's', x: 600, y: screenHeight - 160, screen: 3 },
      { direction: 'e', x: screenWidth - 185, y: 450, screen: 6 },
    ],
    birds: [
      {
        bird: 'monkParakeetS',
        name: 'Monk Parakeet',
        link: 'https://www.allaboutbirds.org/guide/Monk_Parakeet',
        x: 100,
        y: 100,
        chance: 6,
      },
      {
        bird: 'leastBitternM',
        name: 'Least Bittern',
        link: 'https://www.allaboutbirds.org/guide/Least_Bittern',
        x: 1000,
        y: 700,
        chance: 4,
      },
      {
        bird: 'snowEgretFlyingS',
        name: 'Snowy Egret',
        link: 'https://www.allaboutbirds.org/guide/Snowy_Egret',
        x: 750,
        y: 700,
        chance: 8,
      },
    ],
  },
  {
    id: 11,
    arrows: [
      { direction: 's', x: 600, y: screenHeight - 160, screen: 9 },
      { direction: 'w', x: 60, y: 450, screen: 0 },
      { direction: 'ne', x: screenWidth - 185, y: 450, screen: 8 },
    ],
    birds: [
      {
        bird: 'brantM',
        name: 'Brant',
        link: 'https://www.allaboutbirds.org/guide/Brant',
        x: 850,
        y: 750,
        chance: 4,
      },
      {
        bird: 'greatBlueHeronXL',
        name: 'Great Blue Heron',
        link: 'https://www.allaboutbirds.org/guide/Great_Blue_Heron/',
        x: 200,
        y: 600,
        chance: 4,
      },
      // {
      //   bird: 'egretXl',
      //   name: 'Great Egret',
      //   link: 'https://www.allaboutbirds.org/guide/Great_Egret',
      //   x: 100,
      //   y: 100,
      //   chance: 8,
      // },
      {
        bird: 'osprey2S',
        name: 'Osprey',
        link: 'https://www.allaboutbirds.org/guide/Osprey',
        x: 100,
        y: 200,
        chance: 8,
      },
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

  birdsList = {
    woodDuckS: loadImage('images/birds/50/wood_duck.png'),
    blueHeronFlyingS: loadImage(
      'images/birds/50/great_blue_heron_3.png'
    ),
    hudsonianGodwitS: loadImage(
      'images/birds/50/hudsonian_godwit.png'
    ),
    brantS: loadImage('images/birds/50/brant.png'),
    crowFlyingS: loadImage('images/birds/50/crow_flying.png'),
    osprey2S: loadImage('images/birds/50/osprey_2.png'),
    ospreyS: loadImage('images/birds/50/osprey_1.png'),
    americanWhitePelicanS: loadImage(
      'images/birds/50/american_white_pelican.png'
    ),
    blackSkimmerS: loadImage('images/birds/50/black_skimmer.png'),
    europeanStarlingS: loadImage(
      'images/birds/50/european_starling.png'
    ),
    northernCardinalS: loadImage(
      'images/birds/50/northern_cardinal.png'
    ),
    houseSparrowS: loadImage('images/birds/50/house_sparrow.png'),
    beltedKingfisherS: loadImage(
      'images/birds/50/belted_kingfisher.png'
    ),
    americanRobinS: loadImage('images/birds/50/american_robin.png'),
    redwingedBlackbirdS: loadImage(
      'images/birds/50/redwinged_blackbird.png'
    ),
    blackCappedChickadeeS: loadImage(
      'images/birds/50/black_capped_chickadee.png'
    ),
    houseSparrowS: loadImage('images/birds/50/house_sparrow.png'),
    egretS: loadImage('images/birds/50/egretSitting.png'),
    monkParakeetS: loadImage('images/birds/100/monk_parakeet.png'),
    americanCrow1S: loadImage('images/birds/50/american_crow_1.png'),
    snowEgretFlyingS: loadImage('images/birds/50/snow_egret_2.png'),

    woodDuckM: loadImage('images/birds/50/wood_duck.png'),
    greatBlueHeron2M: loadImage(
      'images/birds/100/great_blue_heron_2.png'
    ),
    americanWhitePelicanM: loadImage(
      'images/birds/100/american_white_pelican.png'
    ),
    americanRobinM: loadImage('images/birds/100/american_robin.png'),
    americanCrow1M: loadImage('images/birds/100/american_crow_1.png'),
    leastBitternM: loadImage('images/birds/100/least_bittern.png'),
    brantM: loadImage('images/birds/100/brant.png'),

    egretSittingL: loadImage('images/birds/150/egret_sitting.png'),
    greatBlueHeronSittingL: loadImage(
      'images/birds/150/great_blue_heron.png'
    ),
    snowEgretM: loadImage('images/birds/100/snow_egret.png'),

    herringGullXL: loadImage('images/birds/200/herring_gull.png'),
    mourningDoveXL: loadImage(
      'images/birds/200/mourningDoveFlying.png'
    ),
    greatBlueHeronXL: loadImage(
      'images/birds/200/great_blue_heron.png'
    ),
    egretXl: loadImage('images/birds/200/egretSitting.png'),
  };

  camera = loadImage('images/cameraTransparent2.png');
  roll = loadImage('images/35mmrollSharp.png');
  pointer = loadImage('images/pointer.png');

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
  noLoop();

  const uniqueBirds = removeDuplicatesByPropertyName(capturedBirds);
  renderBirdLinks(uniqueBirds);
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

function renderBirds() {
  let birds = screens[currentScreen].birds;
  birds.map((bird) => {
    if (bird.chance >= volume) {
      birdGraphic = birdsList[bird.bird];
      image(
        birdGraphic,
        bird.x,
        bird.y,
        birdGraphic.width * 2,
        birdGraphic.height * 2
      );
    }
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

function birdDetected() {
  let birds = screens[currentScreen].birds;
  let hoveredArrow;
  birds.map((bird) => {
    birdGraphic = birdsList[bird.bird];
    if (
      calculateOverlap(
        bird.x + 100,
        bird.y,
        birdGraphic.width * 2,
        birdGraphic.height * 2
      ) > 50
    ) {
      console.log('BIRD:', bird.name);
      capturedBirds.push(bird);
    }
  });
}

function draw() {
  background(backgrounds[currentScreen]);

  if (!modelLoaded) renderLoading();

  textFont(font);
  textSize(130);

  if (modelLoaded && shots > 0) {
    let passedTime = millis() - savedTime;

    if (passedTime > totalTime && volume > 0) {
      volume -= 1;
      savedTime = millis();
    }

    renderArrows();
    renderBirds();
    renderHud();

    translate(width, 0);
    scale(-1, 1);
    drawCamera();
  }
  if (shots < 1) {
    renderGameOver();
  }
}

function drawCamera() {
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

      volume = Math.min(12, volume + 2);

      grassSound.play();
    } else {
      birdDetected();
      shots -= 1;
      shotCoords = currentCoords;
      volume = Math.min(12, volume + 4);

      cameraSound.play();
    }
  }
}

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

function removeDuplicatesByPropertyName(arr) {
  const uniqueObjects = {};

  for (const obj of arr) {
    const name = obj.name;

    if (!uniqueObjects[name]) {
      uniqueObjects[name] = obj;
    }
  }

  const uniqueArr = Object.values(uniqueObjects);

  return uniqueArr;
}

function renderBirdLinks(birds) {
  let div;

  // Find the div element by its ID
  div = select('#birdLinks');

  // Create a new ul element
  let ul = createElement('ul');

  // Loop through the birds array
  for (let i = 0; i < birds.length; i++) {
    let bird = birds[i];

    // Create a new li element
    let li = createElement('li');

    // Create a new anchor element
    let a = createA(bird.link, bird.name);

    // Set the anchor's attributes
    a.attribute('target', '_blank'); // Open link in a new tab

    // Append the anchor to the li
    a.parent(li);

    // Append the li to the ul
    li.parent(ul);
  }

  // Append the ul to the div
  ul.parent(div);
}
