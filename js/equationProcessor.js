let equations = ['y=x*x', 'y=3']
let eqCnt = 2;
let areaChoosing = false;
let equationChoosing = true;
let integration = false;


let dd = [[-1, 0], [0, -1], [1, 0], [0, 1]];
let functions = [0, 0]
function changeEquationStatus(status){
    let n = document.getElementById("eqTable").rows.length;
    for(let i = 0; i < n; i++){
        document.getElementById("eq" + (i + 1).toString()).readOnly = status;
    }
    document.getElementById("add").disabled = status;
}
function addEquationField(){
    eqCnt++;
    let n = eqCnt.toString();
    $('#eqTable tr:last').after('<tr><td>' +
        '<label for="eq'+ n + '">Уравнение ' + n + ': </label>' +
        '<select id="eqType' + n + '">\n' +
        '            <option value="y=">y =</option>\n' +
        '            <option value="x=">x =</option>\n' +
        '          </select> '+
        ' <input type="text" id="eq' + n + '"/>' +
    '</td></tr>');
    functions.push(0);
}


function parseAllFunctions(){
    let n = document.getElementById("eqTable").rows.length;
    for(let i = 0; i < n; i++){
        let type = document.getElementById("eqType" + (i + 1).toString()).value;
        let yF = (type === "y=");
        functions[i] = document.getElementById("eq" + (i + 1).toString()).value;
        curF = functions[i];
        if(curF) drawFunction(yF);
    }
}

function goBack(){
    if(areaChoosing){
        drawGraphic();
        areaChoosing = false;
        equationChoosing = true;
        document.getElementById("start").disabled = true;
        document.getElementById("back").disabled = true;
        changeEquationStatus(false);
    }
    else if(integration){
        drawGraphic();
        document.getElementById("choose").disabled = false;
        integration = false;
        integral = 0;
        accuracy = 0;
        chooseArea();
    }
}

$(document).ready(function () {
    $("canvas").click(function(e){
        if(!areaChoosing) return;
        mouseX = e.pageX - $("canvas").offset().left;
        mouseY = e.pageY - $("canvas").offset().top;
        console.log(mouseX, mouseY);
        colorZone(mouseX, mouseY);
    })

    $('input[type=range]').on('change', function () {
        let val = document.getElementById("mu_val");
        val.textContent = val.textContent.split(':')[0] + ': ' + this.value;
    });

    /*$("input").on('change', function(){
        let id = parseInt(this.id.substring(2)) - 1;
        functions[id] = this.value;
        curF = functions[id];
        drawFunction(functions[id]);
    })*/
})

