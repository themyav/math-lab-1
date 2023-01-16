let realS = 0

function getPixelColor(x, y){
    let data = ctx.getImageData(x, y, 1, 1).data;
    return data[0]; //[data[0], data[1], data[2]]
}

function colorZone(x, y){
    x = Math.round(x);
    y = Math.round(y);
    let q = new Queue();
    let s = new Set();

    q.enqueue([x, y])
    s.add(x.toString() + '_' + y.toString());

    ctx.fillStyle='red';

    while(!q.isEmpty){
        //console.log('not empty');
        let x1 = q.peek()[0];
        let y1 = q.peek()[1];

        let d = ctx.getImageData(x1, y1,1, 1);
        d.data[0] = 100;
        ctx.putImageData(d, x1, y1);

        q.dequeue();
        for(let i = 0; i < 4; i++){
            let next_x = x1 + dd[i][0];
            let next_y = y1 + dd[i][1];
            //let pk = ctx.getImageData(x, y, 1, 1).data[0];
            if(next_x >= shift && next_x <= canvas.width - shift
                && !s.has(next_x.toString() + "_" + next_y.toString())
                && next_y >= shift && next_y <= canvas.height - shift){
                let pk = getPixelColor(next_x, next_y);
                if(pk === 240){
                    q.enqueue([next_x, next_y]);
                    s.add(next_x.toString() + "_" + next_y.toString());
                    realS++;
                }
                else{
                    let d = ctx.getImageData(next_x, next_y,1, 1);
                    d.data[0] = 200;
                    d.data[1] = 90;
                    d.data[2] = 205;
                    ctx.putImageData(d, next_x, next_y);
                    realS++;
                }
            }
        }
    }
    console.log(realS, realS / (k*k))
    realS /= (k*k);
}

function chooseArea(){
    if(areaChoosing) return;
    areaChoosing = true;
    equationChoosing = false;
    document.getElementById("start").disabled = false;
    document.getElementById("back").disabled = false;
    parseAllFunctions();
    changeEquationStatus(true);
}