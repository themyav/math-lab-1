let integral = 0;
let accuracy = 0;


//вторая производная по X
function dFdX2(x, y){
    //console.log(x, y);
    return y * (2 * Math.cos(x * y) + x * y * Math.sin(x * y))
}

//вторая производная по Y
function dFdY2(x, y){
    return -x*x*x * Math.sin(x*y);
}

//исходная функция
function myFunction(x, y){
    return x*Math.sin(x*y);
}

//характеристическая функция
function characteristic(x, y){
    let pk = getPixelColor(x, y);

    if(pk === 100){
        //console.log(pk);
        return 1;
    }
    return 0;
}

function countNeighbours(x, y, integrate_step){
    let shifts = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    let cnt = 0;
    for(let d = 0; d < 4; d++){
        let new_x = x + integrate_step/2 * shifts[d][0];
        let new_y = y + integrate_step/2 * shifts[d][1];
        let pk = getPixelColor(new_x, new_y);
        if(pk !== 240) cnt++;
    }
    return cnt;
}

//рассчет для одной ячейки
function checkSinglePoint(x, y, j, integrate_step){
    let move = -integrate_step/2;
    //площадь одной ячейки
    let S = (integrate_step / k) * (integrate_step / k);
    if(characteristic(x, y)) {
        //проверка, входит ли ячейка полностью
        if(countNeighbours(x, y, integrate_step) < 4) {
            ctx.fillStyle = 'rgba(127,255,0, 0.5)';
            //считаем значение в ячейке
            integral += myFunction(XtoK(x), YtoK(y)) * S/2;
            //считаем погрешность для ячейки
            accuracy += 1/28 * S * S * (dFdX2(XtoK(x), YtoK(y)) + 1/4 * dFdY2(XtoK(x), YtoK(y)));
        }
        else  {
            ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
            //считаем значение в ячейке
            integral += myFunction(XtoK(x), YtoK(y)) * S;
            //считаем погрешность для ячейки
            accuracy += 1/24 * S * S * (dFdX2(XtoK(x), YtoK(y)) + dFdY2(XtoK(x), YtoK(y)));
        }
        drawRect(x+move, j, integrate_step, integrate_step);
    }
    else ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    drawPoint(x, y);
}

function checkYPoints(x, integrate_step, positive){
    for(let j = zeroY; j + integrate_step/2 <= canvas.height - shift; j += integrate_step){
        let y = j + integrate_step/2;
        checkSinglePoint(x, y, j, integrate_step);
    }
    for(let j = zeroY; j - integrate_step/2 >= shift; j -= integrate_step){
        let y = j - integrate_step/2;
        checkSinglePoint(x, y, j-integrate_step, integrate_step);
    }
}

function checkPoints(positive, integrate_step){
    ctx.fillStyle = 'green';
    for(let i = zeroX; i + integrate_step/2 <= canvas.width - shift; i += integrate_step){
        let x = i + integrate_step/2;
        checkYPoints(x, integrate_step, true);
    }
    for(let i = zeroX; i - integrate_step/2 >= shift; i-=integrate_step){
        let x = i - integrate_step/2;
        checkYPoints(x, integrate_step, false);
    }
}

function addResults(){
    let table_selector = $('#results tr:last');
    table_selector.after('<tr><td>' +
        '<p>Результат интегрирования:</p><td><p>' + integral.toFixed(6) + '</p>' +
        '</td></tr>');
    table_selector.after('<tr><td>' +
        '<p>Абсолютная погрешность:</p><td><p>' + Math.abs(accuracy).toFixed(6) + '</p>' +
        '</td></tr>');
    if(integral !== 0){
        table_selector.after('<tr><td>' +
            '<p>Относительная погрешность:</p><td><p>' + (Math.abs(accuracy/integral) * 100).toFixed(3) + '%</p>' +
            '</td></tr>');
    }

}
function integrate(){
    let integrate_step = parseFloat(document.getElementById("mu").value) * k;
    if(integration) return;
    integration = true;
    areaChoosing = false;
    document.getElementById("choose").disabled = true;
    //if(integrate_step >= 0.5 * k) drawIntegrateGreed(integrate_step);
    checkPoints(true, integrate_step);
    addResults();
}