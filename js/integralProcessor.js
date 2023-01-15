let integral = 0;
let accuracy = 0;


//вторая производная по X
function dFdX2(x, y){
    console.log(x, y);
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
    return pk === 100;
}

//рассчет для одной ячейки
function checkSinglePoint(x, y, j, integrate_step){
    let move = -integrate_step/2;
    if(characteristic(x, y)) {
        //площадь одной ячейки
        let S = (integrate_step / k) * (integrate_step / k);
        console.log(x, y, XtoK(x), YtoK(y), integrate_step / k);
        //считаем значение в ячейке
        integral += myFunction(XtoK(x), YtoK(y)) * S;
        //считаем погрешность для ячейки
        console.log(dFdX2(XtoK(x), YtoK(y)), dFdY2(XtoK(x), YtoK(y)));
        accuracy += 1/24 * realS * S * (dFdX2(XtoK(x), YtoK(y)) + dFdY2(XtoK(x), YtoK(y)));//* (S * dFdX2(XtoK(x)));
        console.log(accuracy);
        ctx.fillStyle = 'rgba(200, 0, 0, 0.5)';
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
        '<p>Точность:</p><td><p>' + accuracy.toFixed(6) + '</p>' +
        '</td></tr>');
}
function integrate(){
    let integrate_step = parseFloat(document.getElementById("mu").value) * k;
    let s = integrate_step * integrate_step;
    areaChoosing = false;
    drawIntegrateGreed(integrate_step);
    checkPoints(true, integrate_step);
    addResults();
    //console.log(integral);
    //console.log(accuracy);
}