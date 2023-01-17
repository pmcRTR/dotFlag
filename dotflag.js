/** JavaScript on <canvas> dotflag. pmc/Retro
  */

//IIFE called from the associated HTML, see the <script> tag
(function wavingDotflag() {
  const canvas = document.getElementById("dotflagCanvas");
  const context = canvas.getContext("2d");

  const SIN_TAB = [0,0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,6,7,7,7,8,8,8,9,9,9,9,10,10,10,11,11,11,11,12,12,12,13,13,13,13,14,14,14,14,15,15,15,16,16,16,16,17,17,17,17,17,18,18,18,18,19,19,19,19,19,20,20,20,20,20,21,21,21,21,21,21,22,22,22,22,22,22,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,24,24,24,24,24,24,24,24,24,23,23,23,23,23,23,23,23,22,22,22,22,22,22,21,21,21,21,21,21,20,20,20,20,20,19,19,19,19,18,18,18,18,18,17,17,17,17,16,16,16,16,15,15,15,15,14,14,14,14,13,13,13,12,12,12,12,11,11,11,10,10,10,10,9,9,9,8,8,8,8,7,7,7,6,6,6,5,5,5,4,4,4,3,3,3,3,2,2,2,1,1,1,0,0,0,0,0,0,-1,-1,-1,-2,-2,-2,-3,-3,-3,-3,-4,-4,-4,-5,-5,-5,-6,-6,-6,-7,-7,-7,-8,-8,-8,-8,-9,-9,-9,-10,-10,-10,-10,-11,-11,-11,-12,-12,-12,-12,-13,-13,-13,-14,-14,-14,-14,-15,-15,-15,-15,-16,-16,-16,-16,-17,-17,-17,-17,-18,-18,-18,-18,-18,-19,-19,-19,-19,-20,-20,-20,-20,-20,-21,-21,-21,-21,-21,-21,-22,-22,-22,-22,-22,-22,-23,-23,-23,-23,-23,-23,-23,-23,-24,-24,-24,-24,-24,-24,-24,-24,-24,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-25,-24,-24,-24,-24,-24,-24,-24,-24,-24,-24,-23,-23,-23,-23,-23,-23,-23,-22,-22,-22,-22,-22,-22,-21,-21,-21,-21,-21,-21,-20,-20,-20,-20,-20,-19,-19,-19,-19,-19,-18,-18,-18,-18,-17,-17,-17,-17,-17,-16,-16,-16,-16,-15,-15,-15,-14,-14,-14,-14,-13,-13,-13,-13,-12,-12,-12,-11,-11,-11,-11,-10,-10,-10,-9,-9,-9,-9,-8,-8,-8,-7,-7,-7,-6,-6,-6,-6,-5,-5,-5,-4,-4,-4,-3,-3,-3,-2,-2,-2,-1,-1,-1,0,0,0,0]

  // dotflag constants

  // number of columns in the flag (dots per row)
  const FLAG_WIDTH = 37
  // number of rows in the flag
  const FLAG_HEIGHT = 23
  // x coord of top left dot
  const START_X = 50
  // y coord of top left dot
  const START_Y = 70
  // space between columns (in pixels)
  const X_SPACER = 8
  // space between rows (in pixels)
  const Y_SPACER = 7
  // colour of the flag dots
  const DOT_COLOUR = '#AAAAAA'

  // sin pointers for x and y
  let mainIdxX = { value: 0 };
  let mainIdxY = { value: 0 };
  let outerIdxX = { value: 0 };
  let outerIdxY = { value: 0 };
  let innerIdxX = { value: 0 };
  let innerIdxY = { value: 0 };
  // sin values for x and y
  let mainValX = 0;
  let mainValY = 0;
  let outerValX = 0;
  let outerValY = 0;
  let innerValX = 0;
  let innerValY = 0;
  let sinVals = [];
  // start positions for x and y
  let tempStartX = 0;
  let tempStartY = 0;


  // functions

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function getSinVals(xStep, yStep, xIdx, yIdx) {
    xIdx.value += xStep;
    yIdx.value += yStep;
    if (xIdx.value > SIN_TAB.length - 1) {
      xIdx.value = 0 + (xIdx.value - SIN_TAB.length);
    }
    if (yIdx.value > SIN_TAB.length - 1) {
      yIdx.value = 0 + (yIdx.value - SIN_TAB.length);
    }
    // deal with minus value step numbers
    if (xIdx.value < 0) {
      xIdx.value = SIN_TAB.length + xIdx.value;
    }
    if (yIdx.value < 0) {
      yIdx.value = SIN_TAB.length + yIdx.value;
    }
    let sinXVal = SIN_TAB[xIdx.value];
    let sinYVal = SIN_TAB[yIdx.value];
    return [sinXVal, sinYVal]
  }

  function plotPixel(x, y){
    context.fillStyle = DOT_COLOUR;
    context.fillRect(x, y, 2, 2);
  }

  function waveFlag() {
    sinVals = getSinVals(1, 4, mainIdxX, mainIdxY);
    mainValX = sinVals[0];
    mainValY = sinVals[1];
    outerIdxX.value = mainIdxX.value;
    outerIdxY.value = mainIdxY.value;
    outerValX = sinVals[0];
    outerValY = sinVals[1];
    tempStartY = START_Y;
    for (let i = 0; i < FLAG_HEIGHT; i++) {
      tempStartX = START_X;
      innerIdxX.value = outerIdxX.value;
      innerIdxY.value = outerIdxY.value;
      innerValX = outerValX;
      innerValY = outerValY;
      for (let j = 0; j < FLAG_WIDTH; j++) {
        innerValX += tempStartX;
        innerValY += tempStartY;
        plotPixel(innerValX, innerValY);
        sinVals = getSinVals(5, -16, innerIdxX, innerIdxY);
        innerValX = sinVals[0];
        innerValY = sinVals[1];
        tempStartX += X_SPACER;
      }
      sinVals = getSinVals(-19, 22, outerIdxX, outerIdxY)
      outerValX = sinVals[0];
      outerValY = sinVals[1];
      tempStartY += Y_SPACER;
    }
  }

  // main routine loop
  var mainLoop = function() {
    clearCanvas();
    waveFlag();
    // keep the flag waving
    requestAnimationFrame(mainLoop, canvas);
  };
  // start the flag waving
  requestAnimationFrame(mainLoop, canvas);
}());
