let canvas, ctx

const k = 14 //коэффициент домножения
const W = 20 //размер по x
const H = 44 //размер по н

const minY = -12
const maxY = 32
const minX = -12
const maxX = 8

const shift = 14
const zeroX = shift + Math.abs(minX) * k;
const zeroY = shift + Math.abs(maxY) * k;

let curF = '2*x';

function Yfunc(x){
    return eval(curF); //Math.sin(x);
}

function Xfunc(y){
    return eval(curF);
}

function kX(x){
    return zeroX + x * k;
}

function kY(y){
    return zeroY - y * k;
}

//из глобальной координаты канваса в точку
function XtoK(x){
    return (x - zeroX) / k;
}

function YtoK(y){
    return(zeroY - y) / k;
}

function drawIntegrateGreed(integrate_step){
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';

    //горизонтальные линии
    let j_up = zeroY;
    let j_down = zeroY;
    while (j_down <= canvas.height - shift || j_up >= shift){
        if(j_down <= canvas.height - shift) {
            drawLine(shift, j_down, canvas.width - shift, j_down);
            j_down+=integrate_step;
        }
        if(j_up >= shift){
            drawLine(shift, j_up, canvas.width - shift, j_up);
            j_up-=integrate_step;
        }
    }
    //вертикальные линии
    let i_left = zeroX;
    let i_right = zeroX;
    while (i_right <= canvas.width - shift || i_left >= shift){
        if(i_right <= canvas.width - shift) {
            drawLine(i_right, shift, i_right, canvas.height - shift);
            i_right+=integrate_step;
        }
        if(i_left >= shift){
            drawLine(i_left, shift, i_left, canvas.height - shift);
            i_left-=integrate_step;
        }
    }
}

function drawYFunc(graphStep){
    let pX = -12;
    let pY = Yfunc(pX);

    ctx.beginPath();
    ctx.moveTo(kX(pX), kY(pY));
    for(let i = pX + graphStep; i <= 8; i+=graphStep){
        if(kY(Yfunc(i)) <= canvas.height && kY(Yfunc(i)) >= 0){
            drawLine(kX(pX), kY(Yfunc(pX)), kX(i), kY(Yfunc(i)))
        }
        pX = i;
        pY = Yfunc(i);
    }
    ctx.stroke();
}

function drawXFunc(graphStep){
    let pY = -12;
    let pX = Xfunc(pY);

    ctx.beginPath();
    ctx.moveTo(kX(pX), kY(pY));
    for(let j = pY + graphStep; j <= 32; j += graphStep){
        if(kX(Xfunc(j)) <= canvas.width && kX(Xfunc(j)) >= 0){
            drawLine(kX(pX), kY(pY), kX(Xfunc(j)), kY(j)) //потом ограничим
        }
        pX = Xfunc(j);
        pY = j
    }
    ctx.stroke();
}

//надо отноримировать, чтобы работать все время с норм числами, а рисовало это
function drawFunction(type){
    let graphStep = 0.2;
    if(type) drawYFunc(graphStep)
    else drawXFunc(graphStep);

}

function drawLine(x1, y1, x2, y2){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke();
}

function drawPoint(x, y){
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2*Math.PI);
    ctx.fill();
}

function drawRect(x, y, w, h){
    ctx.fillRect(x, y, w, h);
}

function drawAxes(){
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    drawLine(zeroX, shift, zeroX, canvas.height - shift)
    drawLine(shift, zeroY, canvas.width-shift, zeroY)

    ctx.fillStyle = 'black';
    for(let i = shift; i <= canvas.width-shift; i+=k){
        drawPoint(i, zeroY);
    }
    for(let j = canvas.height-shift; j >= shift; j-=k){
        drawPoint(zeroX, j)
    }

    drawPoint(zeroX,zeroY);
}

function drawBorders(){
    drawLine(shift, shift, canvas.width - shift, shift);
    drawLine(canvas.width - shift, shift, canvas.width - shift, canvas.height - shift);
    drawLine(canvas.width - shift, canvas.height - shift, shift, canvas.height - shift)
    drawLine(shift, canvas.height - shift, shift, shift);

}
function drawGraphic(){
    canvas = document.getElementById("graph");
    canvas.width = W * k + 2*shift
    canvas.height = H * k + 2*shift
    ctx = canvas.getContext("2d");
    ctx.fillStyle = 'aliceblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBorders();
    drawAxes();

    ctx.fillStyle = 'blue';
    //test();
}
drawGraphic();