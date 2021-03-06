import React from "react";
import io from "socket.io-client";
// import { Col } from "react-bootstrap";

class Sketch extends React.Component {
    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {
    let socket = io.connect("http://localhost:8080");
    let mouse = {
      click: false,
      move: false,
      pos: {
        x: 0,
        y: 0
      },
      pos_prev: false
    };
    let canvas = this.refs.canvas;
    let context = canvas.getContext('2d');

    // let elm = document.querySelector(".sketchpad");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    canvas.onmousedown = function(e) {
      mouse.click = true;
    };
    canvas.onmouseup = function(e) {
      mouse.click = false;
    };

    canvas.onmousemove = function(e) {
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
    };

    socket.on('draw_line', function(data) {
      let line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      context.stroke();
    });

    function mainLoop() {
      if (mouse.click && mouse.move && mouse.pos_prev) {
        socket.emit('draw_line', {
          line: [mouse.pos, mouse.pos_prev]
        });
        mouse.move = false;
      }
      mouse.pos_prev = {
        x: mouse.pos.x,
        y: mouse.pos.y
      };
      setTimeout(mainLoop, 25);
    }
    mainLoop();
    }

    render() {
        return (
            <div className="sketchpad">
                <canvas id="canvas" ref="canvas"/>
            </div>
        )
    }
}

export default Sketch;