var canvas;
var ctx;

function carClass() {

    const CAR_START_NORTH = -90;
    const CAR_START_SOUTH = 90;
    const CAR_START_EAST = 0;
    const CAR_START_WEST = 180;
    const ROAD_FRICTION = 0.98;
    const FORWARD_RATE = 0.2;
    const REVERSE_RATE = 0.2;
    const TURNING_RATE = 0.05;
    const MINIMUM_SPEED_TO_TURN = 0.4;

    this.carImage = undefined;
    this.name = "unNamed";
    this.car_x_position = 50;
    this.car_y_position = 50;
    this.carAngle = 0;
    this.car_speed = 0;
    this.keyHeldDown_Forward = false;
    this.keyHeldDown_Reverse = false;
    this.keyHeldDown_Right = false;
    this.keyHeldDown_Left = false;
    this.controlKeyForward = undefined;
    this.controlKeyReverse = undefined;
    this.controlKeyRight = undefined;
    this.controlKeyLeft = undefined;
    this.setKeyboardKeys = function (forward, reverse, right, left) {
        this.controlKeyForward = forward;
        this.controlKeyReverse = reverse;
        this.controlKeyRight = right;
        this.controlKeyLeft = left;
    };


    this.resetCar = function (whichImage, playerName) {
        this.carImage = whichImage;
        this.name = playerName;
        this.car_speed = 0;

        for (var eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
            for (var eachCol = 0; eachCol < TRACK_COLUMNS; eachCol++) {
                var arrayIndex = colRowToArrayIndex(eachCol, eachRow);

                if (trackArrayGrid[arrayIndex] === TRACK_CAR_START) {
                    trackArrayGrid[arrayIndex] = TRACK_ROAD;
                    this.carAngle = CAR_START_NORTH * (Math.PI / 180.0);
                    this.car_x_position = eachCol * TRACK_WIDTH + TRACK_WIDTH / 2;
                    this.car_y_position = eachRow * TRACK_HEIGHT + TRACK_HEIGHT / 2;
                    return;
                }
            }
        }
        console.log("No " + playerName + " starting point found!");
    };


    this.calculateNextCarPosition = function () {

        this.car_speed *= ROAD_FRICTION;

        if (this.keyHeldDown_Forward) {
            this.car_speed += FORWARD_RATE;
        }
        if (this.keyHeldDown_Reverse) {
            this.car_speed -= REVERSE_RATE;
        }
        if (Math.abs(this.car_speed) > MINIMUM_SPEED_TO_TURN) {
            if (this.keyHeldDown_Right) {
                this.carAngle += TURNING_RATE;
            }
            if (this.keyHeldDown_Left) {
                this.carAngle -= TURNING_RATE;
            }
        }
        this.car_x_position += Math.cos(this.carAngle) * this.car_speed;
        this.car_y_position += Math.sin(this.carAngle) * this.car_speed;

        carTrackInteraction(this);
    };


    this.drawCar = function () {
        makeCenteredImageRotate(this.carImage, this.car_x_position, this.car_y_position, this.carAngle);
    };
}

var carImage1 = document.createElement("img");
var carImage2 = document.createElement("img");


var trackImagesList = [];


const TRACK_COLUMNS = 20;
const TRACK_ROWS = 15;


const TRACK_WIDTH = 40;
const TRACK_HEIGHT = 40;
const TRACK_GAP_BETWEEN = 2;


const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_CAR_START = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
const TRACK_FLAG = 5;
const TRACK_ORANGUTAN = 6;
const TRACK_BOULDER = 7;
const TRACK_PALM = 8;
const TRACK_1 = 9;
const TRACK_2 = 10;
const TRACK_3 = 11;



var masterLevelMap1 = [9, 9, 10, 9, 11, 9, 10, 9, 11, 9, 10, 9, 11, 9, 10, 9, 11, 9, 10, 5,
                      9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 9,
                      10, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11,
                      9, 7, 0, 0, 0, 1, 1, 4, 8, 8, 8, 8, 4, 1, 1, 1, 0, 0, 0, 9,
                      11, 0, 0, 0, 1, 1, 1, 4, 8, 8, 8, 8, 4, 1, 1, 1, 1, 0, 0, 10,
                      9, 0, 0, 1, 7, 0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 9,
                      10, 0, 0, 1, 0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 7, 11,
                      9, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 9,
                      11, 0, 0, 1, 0, 0, 5, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 10,
                      9, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9,
                      10, 2, 2, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 11,
                      5, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 9,
                      11, 3, 0, 0, 0, 0, 1, 1, 6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 10,
                      9, 3, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 7, 0, 0, 0, 7, 9,
                      10, 9, 11, 9, 10, 9, 11, 9, 10, 9, 11, 9, 10, 9, 11, 9, 10, 9, 11, 5];

var masterLevelMap2 = [10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                      1, 2, 2, 1, 7, 1, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 1, 3, 1, 1,
                      1, 0, 0, 1, 7, 1, 0, 7, 0, 0, 0, 1, 4, 4, 4, 4, 1, 0, 1, 1,
                      1, 0, 7, 1, 7, 1, 0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 1, 0, 1, 1,
                      1, 0, 0, 1, 7, 1, 0, 0, 1, 0, 0, 1, 4, 4, 4, 4, 1, 0, 1, 1,
                      1, 0, 0, 1, 7, 1, 0, 0, 1, 0, 0, 1, 4, 4, 4, 4, 1, 0, 1, 1,
                      1, 0, 0, 1, 7, 1, 0, 0, 1, 0, 0, 1, 4, 4, 4, 1, 1, 0, 1, 1,
                      1, 7, 0, 1, 7, 1, 0, 0, 1, 0, 7, 1, 4, 4, 1, 1, 0, 0, 1, 1,
                      1, 0, 0, 1, 7, 1, 0, 0, 1, 0, 0, 1, 4, 4, 1, 7, 0, 0, 1, 1,
                      1, 0, 0, 1, 7, 1, 0, 0, 1, 0, 0, 1, 4, 4, 1, 0, 0, 0, 1, 1,
                      1, 0, 7, 1, 7, 1, 0, 0, 1, 0, 0, 1, 4, 4, 1, 0, 0, 0, 1, 1,
                      1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1,
                      1, 0, 0, 0, 0, 0, 0, 0, 1, 7, 0, 0, 0, 7, 0, 0, 0, 0, 7, 3,
                      1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 3,
                      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var masterLevelMap3 = [11, 6, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
                      8, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 6, 8,
                      8, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 8,
                      8, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
                      8, 0, 0, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 6, 0, 0, 8,
                      8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8,
                      8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 6, 0, 0, 8, 0, 0, 8,
                      8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8,
                      8, 0, 6, 8, 8, 8, 8, 8, 8, 8, 8, 6, 0, 0, 0, 0, 8, 0, 0, 8,
                      8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8,
                      8, 0, 0, 6, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 8,
                      8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8,
                      8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 6, 0, 0, 8, 0, 0, 8,
                      8, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 2, 2, 8,
                      8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];


var arrayOfLevelMaps = [masterLevelMap1, masterLevelMap2, masterLevelMap3];


var currentLevelMapNumber = 0;


var trackArrayGrid = [];


var mouse_x_value = 0;
var mouse_y_value = 0;


var winner = false;

var announceWinner = "No Winner Yet";


var sec = 0;
var timer;
var timerMin = "00";
var timerSec = "00";

function padSingleDigitWithZero(seconds) {

    if (seconds > 9) {
        return seconds;
    } else {
        return "0" + seconds;
    }
}


function countUpTimer() {
    timer = setInterval(function () {
        timerSec = padSingleDigitWithZero(sec++ % 60);
        timerMin = padSingleDigitWithZero(parseInt(sec / 60, 10));
    }, 1000);
}


function resetTimerVariables() {
    timerMin = "00";
    timerSec = "00";
    sec = 0;
}


const ARROW_KEY_UP = 38;
const ARROW_KEY_DOWN = 40;
const ARROW_KEY_RIGHT = 39;
const ARROW_KEY_LEFT = 37;
const W_KEY_UP = 87;
const S_KEY_DOWN = 83;
const D_KEY_RIGHT = 68;
const A_KEY_LEFT = 65;


function determineMousePosition(event) {
    var canvasRectangle = canvas.getBoundingClientRect();
    var wholeWebPage = document.documentElement;
    mouse_x_value = event.clientX - canvasRectangle.left - wholeWebPage.scrollLeft;
    mouse_y_value = event.clientY - canvasRectangle.top - wholeWebPage.scrollTop;


    return {
        x: mouse_x_value,
        y: mouse_y_value
    };

}


function carControlKeySetup(keyEvent, whichCar, bindToThisKey) {
    if (keyEvent.keyCode === whichCar.controlKeyForward) {
        whichCar.keyHeldDown_Forward = bindToThisKey;
    }
    if (keyEvent.keyCode === whichCar.controlKeyReverse) {
        whichCar.keyHeldDown_Reverse = bindToThisKey;
    }
    if (keyEvent.keyCode === whichCar.controlKeyRight) {
        whichCar.keyHeldDown_Right = bindToThisKey;
    }
    if (keyEvent.keyCode === whichCar.controlKeyLeft) {
        whichCar.keyHeldDown_Left = bindToThisKey;
    }
}


function keyIsPressed(keyEvent) {

    carControlKeySetup(keyEvent, player1, true);
    carControlKeySetup(keyEvent, player2, true);


    keyEvent.preventDefault();
}


function keyIsLetUp(keyEvent) {

    carControlKeySetup(keyEvent, player1, false);
    carControlKeySetup(keyEvent, player2, false);
}


function loadStartMapLevel(mapList) {
    if (currentLevelMapNumber < mapList.length) {

        trackArrayGrid = mapList[currentLevelMapNumber].slice();

        player1.resetCar(carImage1, "Lightning Bolt");
        player2.resetCar(carImage2, "Blue Vortex");
        currentLevelMapNumber++;
    }
}


function loadNextMapLevel(mapList) {

    if (currentLevelMapNumber < mapList.length) {

        trackArrayGrid = mapList[currentLevelMapNumber].slice();


        player1.resetCar(carImage1, "Lightning Bolt");
        player2.resetCar(carImage2, "Blue Vortex");
        currentLevelMapNumber++;

    }
}


var bitmapImageList = [{
        varName: carImage1,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/car1_30x16.png"
    },
    {
        varName: carImage2,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/car2_30x12.png"
    },
    {
        trackPiece: TRACK_WALL,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_wall.png"
    },
    {
        trackPiece: TRACK_ROAD,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_road.png"
    },
    {
        trackPiece: TRACK_GOAL,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_goal.png"
    },
    {
        trackPiece: TRACK_TREE,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_tree.png"
    },
    {
        trackPiece: TRACK_FLAG,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/track_flag.png"
    },
    {
        trackPiece: TRACK_ORANGUTAN,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/monkey40x40.png"
    },
    {
        trackPiece: TRACK_BOULDER,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/boulderGray1_40x40.png"
    },
    {
        trackPiece: TRACK_PALM,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/palmTree1_40x40.png"
    },
    {
        trackPiece: TRACK_1,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/number-block-one40x40.jpg"
    },
    {
        trackPiece: TRACK_2,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/number-block-two40x40.jpg"
    },
    {
        trackPiece: TRACK_3,
        imageSource: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1086855/number-block-three40x40.jpg"
    }
    ];


var numberOfImagesToLoad = bitmapImageList.length;
console.log("number of images to load: " + numberOfImagesToLoad);

function countImagesToLoad() {
    numberOfImagesToLoad--;

    if (numberOfImagesToLoad === 0) {
        console.log("done loading images");
    }
}


function beginLoadingImage(imgName, sourceUrl) {
    imgName.onload = countImagesToLoad();
    imgName.src = sourceUrl;
}


function loadTrackImagePiece(trackImageNumber, sourceUrl) {

    trackImagesList[trackImageNumber] = document.createElement("img");

    beginLoadingImage(trackImagesList[trackImageNumber], sourceUrl);
}


function loadAllBitmapGraphics(bitmapList) {
    for (var i = 0; i < bitmapList.length; i++) {

        if (bitmapList[i].varName !== undefined) {
            beginLoadingImage(bitmapList[i].varName, bitmapList[i].imageSource);
        } else {
            loadTrackImagePiece(bitmapList[i].trackPiece, bitmapList[i].imageSource);
        }
    }
}


var player1 = new carClass();
var player2 = new carClass();


window.onload = function () {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");


    var framesPerSecond = 30;
    setInterval(function () {
        calculateNextPosition();
        drawAllElements();
    }, 1000 / framesPerSecond);


    countUpTimer();


    canvas.addEventListener("mousemove",
        function (event) {
            var mousePosition = determineMousePosition(event);
        }
    );

    document.addEventListener("keydown", keyIsPressed);


    document.addEventListener("keyup", keyIsLetUp);


    canvas.addEventListener("mousedown",
        function (event) {
            if (winner) {
                winner = false;
                resetTimerVariables();
                countUpTimer();
                loadStartMapLevel();
            }
        }
    );

    loadStartMapLevel(arrayOfLevelMaps);
    console.log("after loadStartMapLevel(), current map num now: " + currentLevelMapNumber);


    loadAllBitmapGraphics(bitmapImageList);


    player1.setKeyboardKeys(W_KEY_UP, S_KEY_DOWN, D_KEY_RIGHT, A_KEY_LEFT);
    player2.setKeyboardKeys(ARROW_KEY_UP, ARROW_KEY_DOWN, ARROW_KEY_RIGHT, ARROW_KEY_LEFT);
};


function trackPieceAtColRow(col, row) {
    if (col >= 0 && col < TRACK_COLUMNS && row >= 0 && row < TRACK_ROWS) {
        var trackIndexUnderCoord = colRowToArrayIndex(col, row);

        return trackArrayGrid[trackIndexUnderCoord];
    } else {

        return TRACK_WALL;
    }
}


function carTrackInteraction(whichCar) {
    var carTrackCol = Math.floor(whichCar.car_x_position / TRACK_WIDTH);
    var carTrackRow = Math.floor(whichCar.car_y_position / TRACK_HEIGHT);
    var trackIndexUnderCar = colRowToArrayIndex(carTrackCol, carTrackRow);


    if (carTrackCol >= 0 && carTrackCol < TRACK_COLUMNS && carTrackRow >= 0 && carTrackRow < TRACK_ROWS) {
        var numberOfTrackPiece = trackPieceAtColRow(carTrackCol, carTrackRow);

        if (numberOfTrackPiece === TRACK_GOAL) {

            if (currentLevelMapNumber === arrayOfLevelMaps.length) {

                winner = true;
                announceWinner = "\ud83d\ude03  " + whichCar.name + " Wins the race!";
                clearInterval(timer);
            }

            loadNextMapLevel(arrayOfLevelMaps);
        } else if (numberOfTrackPiece !== TRACK_ROAD) {
            whichCar.car_x_position -= Math.cos(whichCar.carAngle) * whichCar.car_speed;
            whichCar.car_y_position -= Math.sin(whichCar.carAngle) * whichCar.car_speed;


            whichCar.car_speed *= -0.5;
        }
    }
}


function calculateNextPosition() {
    if (winner) {
        return;
    }

    player1.calculateNextCarPosition();
    player2.calculateNextCarPosition();
}


function colRowToArrayIndex(col, row) {
    return col + TRACK_COLUMNS * row;
}

function drawTrackElements() {
    var bitmapArrayIndex = 0;
    var imageTopLeftX = 0;
    var imageTopLeftY = 0;
    for (var eachRow = 0; eachRow < TRACK_ROWS; eachRow++) {
        for (var eachCol = 0; eachCol < TRACK_COLUMNS; eachCol++) {
            bitmapArrayIndex = colRowToArrayIndex(eachCol, eachRow);

            var mapImageNumber = trackArrayGrid[bitmapArrayIndex];
            var selectedMapImage = trackImagesList[mapImageNumber];

            ctx.drawImage(selectedMapImage, imageTopLeftX, imageTopLeftY);

            imageTopLeftX += TRACK_WIDTH;
            bitmapArrayIndex++;
        }
        imageTopLeftY += TRACK_HEIGHT;
        imageTopLeftX = 0;
    }
}

function drawAllElements() {
    if (winner) {

        makeFillColorRect(95, canvas.height / 4, 600, 75, "black"); //TODO put into new text function
        makeColorText(announceWinner, 100, canvas.height / 3, "yellow", 40);
        currentLevelMapNumber = 0;
        return;
    }


    drawTrackElements();

    player1.drawCar();
    player2.drawCar();


    makeFillColorRect(245, 5, 145, 30, "black"); //TODO put into new text function
    makeColorText("Timer: " + timerMin + ":" + timerSec, 250, 27, "yellow", 24);



}


function makeCenteredImageRotate(myImage, posX, posY, atAngle) {

    ctx.save();
    ctx.translate(posX, posY);
    ctx.rotate(atAngle);
    ctx.drawImage(myImage, -myImage.width / 2, -myImage.height / 2);
    ctx.restore();
}

function makeFillColorRect(topLeftX, topLeftY, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(topLeftX, topLeftY, width, height);
}

function makeFillColorCircle(xCenter, yCenter, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(xCenter, yCenter, radius, 0, Math.PI * 2, true);
    ctx.fill();
}


function makeColorText(showWords, textX, textY, color, fontSize) {

    var sizeAndTypeface = String(fontSize + "px sans-serif");
    ctx.font = sizeAndTypeface;
    ctx.fillStyle = color;
    ctx.fillText(showWords, textX, textY);
}
