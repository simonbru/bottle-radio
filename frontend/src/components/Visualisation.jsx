import React, { useEffect } from "react";
import p5 from 'p5';

import liipSlashes from '../models/liip-slashes.obj'

window.p5 = p5;
// import 'p5/lib/addons/p5.sound'


// import p5 from 'p5';
// import 'p5/lib/addons/p5.sound';

const sketch = ( p ) => {

  let slashes; // liip icon logo
  let angle = 0; //Spin amount
  let song; // Audio object
  let amp; // Sound data value 
  let button; // play pause button

  p.preload = function() {
    slashes = p.loadModel(liipSlashes); // 3d model from blender
  };

  p.setup = function() {
    // p.createCanvas(p.windowWidth, p.windowHeight-100, p.WEBGL);
    p.createCanvas(400, 400, p.WEBGL);
    amp = new p5.Amplitude();
    window.p = p
    window.amp = amp
  };

  p.draw = function() {
    // console.log("draw")
    var vol = amp.getLevel();
    // console.log(vol)
    let volWave = p.map(vol, 0, 1, 0, 50);

    p.background(110, 166, 68); // liip green 700

    // Scene Lights
    p.pointLight(208, 221, 44, -p.windowWidth/2, 0, 0) // liip green 100 - side
	  p.pointLight(164, 195, 57, p.windowWidth/2, 0, 0)  // liip green 400 -side
    p.pointLight(208, 221, 44, 0, -200, 0)  // liip green 100 - above 
    p.pointLight(164, 195, 57, 0, 300, 0)  // liip green 400 - below 
    p.pointLight(255, 255, 255, 0, 0, 300)  // white 

    // spin object
    p.rotateX(angle);
    p.rotateY(angle);
    p.rotateZ(angle);

    // slash object settings
    p.noStroke();
    p.scale(100+volWave); // size - move with music
   	p.ambientMaterial(255); // fill object with white
    //normalMaterial(); // rainbow debugger color 
    p.model(slashes); // load 3d model into canvas
    
    // value for the rotation
	  angle += 0.01
  };
};

const Visualisation = (props) => {
  const container = React.createRef();

  useEffect(() => {
    const renderVisualisation = () => {
      // Add compatibility check for Safari
      // let AudioContext = window.AudioContext || window.webkitAudioContext;
      // let context = new AudioContext();

      // let src = context.createMediaElementSource(props.audio);
      // let analyser = context.createAnalyser();

      // src.connect(analyser);
      // analyser.connect(context.destination);

      // analyser.fftSize = 32;
      // window.analyser = analyser;

      // let bufferLength = analyser.frequencyBinCount;

      // let dataArray = new Uint8Array(bufferLength);



      // const renderFrame = () => {
      //   requestAnimationFrame(renderFrame);
        // let canvas = document.getElementById("canvas");
      //   canvas.height = window.innerHeight;
      //   canvas.width = window.innerWidth;
      //   let ctx = canvas.getContext("2d");

      //   let WIDTH = canvas.width;
      //   let HEIGHT = canvas.height;

      //   let barWidth = WIDTH / bufferLength;
      //   let barHeight;
      //   let x = 0;

      //   analyser.getByteFrequencyData(dataArray);
      //   let sum = 0;
      //   for (let i = 0; i < bufferLength; i++) {
      //     sum += dataArray[i];
      //   }
      //   // console.log("Average:", sum/bufferLength);

      //   ctx.fillStyle = "transparent";
      //   ctx.fillRect(0, 0, WIDTH, HEIGHT);

      //   for (let i = 0; i < bufferLength; i++) {
      //     barHeight = dataArray[i];

      //     var r = barHeight + 25 * (i / bufferLength);
      //     var g = 250 * (i / bufferLength);
      //     var b = 50;

      //     ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      //     ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

      //     x += barWidth + 1;
      //   }
      // };
      // renderFrame();

      // document.documentElement.addEventListener("mousedown", function () {
      //   if (context.state !== "running") {
      //     console.log("AudioContext starting due to user input");
      //     context.resume();
      //   }
      // });

      import('p5/lib/addons/p5.sound').then(() => {
        console.log("init slashes")
        // let canvas = document.getElementById("canvas");
        const myp5 = new p5(sketch, container.current);
        window.myp5 = myp5

        let AudioContext = window.AudioContext || window.webkitAudioContext;
        // let context = new AudioContext();
  
        let context = myp5.getAudioContext()
        let source = context.createMediaElementSource(props.audio);
        source.connect(context.destination)

        setTimeout(() => {
          window.amp.setInput(source)
        }, 4000)
        // window.source = source
        // let analyser = context.createAnalyser();

        // source.connect(analyser);
        // analyser.connect(context.destination);


        document.documentElement.addEventListener("mousedown", function () {
          if (context.state !== "running") {
            console.log("AudioContext starting due to user input");
            context.resume();
          }
        });
      })
    };
    renderVisualisation();
  }, [props.audio]);

  // return <canvas id='canvas'></canvas>;
  return <div ref={container}></div>;
};

export default Visualisation;
