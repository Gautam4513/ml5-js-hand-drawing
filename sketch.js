let handPose;
let video;   
let hands = [];
let drawFinger;
let big;
let small;
let isdraw=false;
let prevX,prevY;

let drawnLines = [];

document.querySelector("#canvasClear").addEventListener("click",function (){
  drawnLines = [];
})

function preload() {
  handPose = ml5.handPose({
  maxHands: 1,
  flipped: true,
  runtime: "tfjs",
  modelType: "full",
  detectorModelUrl: undefined, //default to use the tf.hub model
  landmarkModelUrl: undefined, //default to use the tf.hub model
});
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
   video = createCapture(VIDEO);
   connections = handPose.getConnections();
   console.log(connections);
  video.size(width, height);
  video.hide();
  colorMode(HSB);
 
   handPose.detectStart(video, gotHands);
}

function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
  if(hands.length>0){
    // console.log(hands[0].keypoints)
    drawFinger=hands[0].keypoints[8];
    big=hands[0].keypoints[12];
    small=hands[0].keypoints[7];
    if(small.y-big.y<0){
      isdraw=true;
      if (!prevX || !prevY) { 
        // console.log("first");
        prevX = drawFinger.x; 
        prevY = drawFinger.y; 
      }
    }else{
      isdraw=false;
      prevX = undefined;  // Reset prevX and prevY but keep drawnLines
      prevY = undefined;
    }
  }

}

function draw() {
  image(video, 0, 0, width, height);
  
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
      for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
        fill("rgb(255,0,0)");
      noStroke();
      circle(keypoint.x, keypoint.y, 20);
    }
  }

  for (let i = 0; i < drawnLines.length; i++) {
    // console.log("draw2")
    let lineData = drawnLines[i];
    let lineHue = Math.abs(lineData.x1-lineData.y1);
    console.log(lineData.x1,lineData.y1)
    stroke(lineHue,90,90);
    strokeWeight(10);
    line(lineData.x1, lineData.y1, lineData.x2, lineData.y2);
  }

  for(let i=0;i<connections.length;i++){
    let start = connections[i][0];
    let end = connections[i][1];
    stroke("rgb(0,255,0)");
    strokeWeight(2);
    if(hands.length>0){
      line(hands[0].keypoints[start].x,hands[0].keypoints[start].y,hands[0].keypoints[end].x,hands[0].keypoints[end].y);
    }
  }

  if(isdraw && prevX !== undefined && prevY !== undefined){
    // console.log("draw");
    
  drawnLines.push({ x1: prevX, y1: prevY, x2: drawFinger.x, y2: drawFinger.y });

    // Draw current line
    line(prevX, prevY, drawFinger.x, drawFinger.y);
    prevX = drawFinger.x;
    prevY = drawFinger.y;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}