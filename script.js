"use strict";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

$(document).ready(() => {
    localStorage.setItem("url", "play.html");

    let dragValue;
    let oldX, oldY, x0, y0;

    let mouseX, mouseY;
    let moving = false;
    let started = false;

    $("img").on("click", function(e) {
        if (!checkInBounds(mouseX, mouseY, e.target.width, e.target.height) && !started) {
            let newElement = e.target.cloneNode(true, true);
            $(e.target).parents()[0].append(newElement);
            started = true;
            pickUp(e, newElement);
        }
    });


    const pickUp = function(e, element) {
        x0 = e.pageX-element.offsetLeft;
        y0 = e.pageY-element.offsetTop;

        dragValue = element;

        oldX = e.pageX-x0;
        oldY = e.pageY-y0;
        dragValue.style.left = e.pageX-x0 + "px";
        dragValue.style.top = e.pageY-y0 + "px";
        moving = true;
        move(dragValue);
    
    }

    function move(element) {
        element.style.position = "absolute";
        element.style.margin = "0";

        element.onmousedown = function(e) {
            x0 = e.pageX-this.offsetLeft;
            y0 = e.pageY-this.offsetTop;
    
            if (!moving) {
                dragValue = element;
                let x = e.pageX;
                let y = e.pageY;
    
                oldX = x-x0;
                oldY = y-y0;
                dragValue.style.left = x-x0 + "px";
                dragValue.style.top = y-y0 + "px";
                moving = true;
    
            } else {
                if (!checkInBounds(mouseX, mouseY, dragValue.width, dragValue.height)) {
                    dragValue.style.left = oldX+"px";
                    dragValue.style.top = oldY+"px";
                    if (started) {
                        $(dragValue).remove();
                    }
                }
                dragValue = null;
                started = false;
                moving = false;
            }
        }
    }

    document.onmousemove = function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
        
        if (dragValue) {
            dragValue.style.left = e.pageX-x0 + "px";
            dragValue.style.top = e.pageY-y0 + "px";
        }
    }

    document.onkeydown = function(e) {
        if (e.code == "ArrowLeft") {
            dragValue.style.transform += "rotate(5deg)";
        }

        if (e.code == "ArrowRight") {
            dragValue.style.transform += "rotate(-5deg)";
        }

        if (e.code == "ArrowUp" || e.key == "+") {
            $(dragValue).width(dragValue.width + 5);
            $(dragValue).height(dragValue.height + 5);

            dragValue.style.left = parseInt(dragValue.style.left.replace(/\D/g, "")) - 2 + "px";
            dragValue.style.top = parseInt(dragValue.style.top.replace(/\D/g, "")) - 2 + "px";
            x0+=2;
            y0+=2;

        }

        if (e.code == "ArrowDown" || e.key == "-") {
            $(dragValue).width(dragValue.width - 5);
            $(dragValue).height(dragValue.height - 5);
            
            dragValue.style.left = parseInt(dragValue.style.left.replace(/\D/g, "")) + 2 + "px";
            dragValue.style.top = parseInt(dragValue.style.top.replace(/\D/g, "")) + 2 + "px";
            x0-=2;
            y0-=2;
        }

        if (e.code == "Backspace") {
            $(dragValue).remove();
            dragValue = null;
            moving = false;
            started = false;
        }

        if (e.code == "Space") {
            if (!checkInBounds(mouseX, mouseY, dragValue.width, dragValue.height)) {
                dragValue.style.left = oldX+"px";
                dragValue.style.top = oldY+"px";
                if (started) {
                    $(dragValue).remove();
                }
            }
            dragValue = null;
            started = false;
            moving = false;
        }


        if (e.code == "KeyS") {
            capture();
        }

    }
    
});



const checkInBounds = function (x, y, width, height) {
    if (x-width/2<canvas.offsetLeft || x+width/2>canvas.clientWidth+canvas.offsetLeft)
        return false;
    if (y-height/2<canvas.offsetTop || y+height/2>canvas.clientHeight+canvas.offsetTop)
        return false;
    return true;
}

const capture = async() => {

    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    const video = document.createElement("video");

    try {
        const captureStream = await navigator.mediaDevices.getDisplayMedia();
        video.srcObject = captureStream;
        context.drawImage(video, 0, 0, window.width, window.height);
        const frame = canvas.toDataURL("image/png");
        captureStream.getTracks().forEach(track => track.stop());
        window.location.href = frame;
    } catch (err) {
        console.log("Error: " + err);
    }
}