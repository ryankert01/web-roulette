var startAngle = 0;
var arc = Math.PI / 18.5;
var spinTimeout = null;
var spinsize = 150;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;
var ctx;
var check = true;

var total_money = 1000;
var put_money = 0;

var win_number;

function draw() { //初始畫面繪圖
    drawRouletteWheel();
    drawTable();
    var text = document.getElementById("money");
    text.innerHTML += total_money;

    text = document.getElementById("putmoney");
    text.innerHTML += put_money;
}

function isEven(n) {
    return (n % 2 == 0);
}

function isOdd(n) {
    return (Math.abs(n) % 2 == 1);
}

function getText(i) { //輪盤數字
    var text;
    if (i === 36)
        text = "0";
    else if (isEven(i))
        text = (i + 1).toString();
    else if (isOdd(i))
        text = (i + 1).toString();
    return text;
}

function drawRouletteWheel() { //畫輪盤

    var canvas = document.getElementById("wheelcanvas");
    if (canvas.getContext) {
        var outsideRadius = 145;
        var textRadius = 125;
        var insideRadius = 100;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 1000, 1000);


        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.font = 'bold 20px Avenir Next, sans-serif';

        for (var i = 0; i < 37; i++) {
            var angle = startAngle + i * arc;
            if (i === 36)
                ctx.fillStyle = "green";
            else if (isEven(i + 1))
                ctx.fillStyle = "red";
            else if (isOdd(i + 1))
                ctx.fillStyle = "black";

            ctx.beginPath();
            ctx.arc(spinsize, spinsize, outsideRadius, angle, angle + arc, false);
            ctx.arc(spinsize, spinsize, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();

            if (i === 36)
                ctx.fillStyle = "black";
            else if (isEven(i + 1))
                ctx.fillStyle = "black";
            else if (isOdd(i + 1))
                ctx.fillStyle = "white";
            ctx.translate(spinsize + Math.cos(angle + arc / 2) * textRadius, spinsize + Math.sin(angle + arc / 2) *
                textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = getText(i);
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        }

        //Arrow
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.moveTo(spinsize - 4, spinsize - (outsideRadius + 5));
        ctx.lineTo(spinsize + 4, spinsize - (outsideRadius + 5));
        ctx.lineTo(spinsize + 4, spinsize - (outsideRadius - 5));
        ctx.lineTo(spinsize + 9, spinsize - (outsideRadius - 5));
        ctx.lineTo(spinsize + 0, spinsize - (outsideRadius - 13));
        ctx.lineTo(spinsize - 9, spinsize - (outsideRadius - 5));
        ctx.lineTo(spinsize - 4, spinsize - (outsideRadius - 5));
        ctx.lineTo(spinsize - 4, spinsize - (outsideRadius + 5));
        ctx.fill();
    }
}

function spin() {
    if (check == true) {
        if (check_money() == true) {
            var text = document.getElementById("money");
            total_money -= put_money;
            text.innerHTML = "剩餘金額: " + total_money;

            check = false;
            spinAngleStart = Math.random() * 10 + 10;
            spinTime = 0;
            spinTimeTotal = Math.random() * 3 + 4 * 1618;
            rotateWheel();
        } else
            alert("籌碼不夠!!");
    }
}

function rotateWheel() { //輪盤轉動
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 30);
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    if (index === 36) {
        ctx.fillStyle = "white";
        ctx.shadowColor = "black";
    } else if (isEven(index + 1)) {
        ctx.fillStyle = "red";
        ctx.shadowColor = "white";
    } else if (isOdd(index + 1)) {
        ctx.fillStyle = "black";
        ctx.shadowColor = "white";
    }
    ctx.font = 'bold 150px sans-serif';
    ctx.shadowOffsetX = -2;
    ctx.shadowOffsetY = -2;
    ctx.shadowBlur = 1;

    var text = getText(index);
    win_number = text; //抽到的號碼
    ctx.fillText(text, spinsize - ctx.measureText(text).width / 2, spinsize + 52);
    ctx.restore();
    check = true;
    checkwin();
}

function easeOut(t, b, c, d) {
    var ts = (t /= d) * t;
    var tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}
//////////////////////////////////////////////////////////////////////end  wheel


function drawTable() {
    var numf = 1;
    var nums = 0;
    var numt = 0;
    var color = "black";
    var table;
    var newcell;
    var temp;
    for (var i = 1; i < 37; i++) {
        if (i % 3 == 0) {
            table = document.getElementById("third_row");
            newcell = table.insertCell(numt);
            numt++;
        } else if (i % 3 == 1) {
            table = document.getElementById("first_row");
            newcell = table.insertCell(numf);
            numf++;
        } else {
            table = document.getElementById("second_row");
            newcell = table.insertCell(nums);
            nums++;
        }

        if (i % 2 == 0)
            color = "red";
        else
            color = "black";

        temp = "" + i;
        newcell.style.backgroundColor = color;
        newcell.id = temp;
        newcell.onclick = function () { //newcell.onclick = putmoney 不能取得this的資訊
            putmoney(this);
        }
        newcell.innerHTML = temp;
    }

    table = document.getElementById("third_row");
    newcell = table.insertCell(numt);
    newcell.style.backgroundColor = 'green';
    newcell.innerHTML = "2 to 1";
    newcell.id = "2_to_1_3";
    newcell.onclick = function () {
        putmoney_other(this);
    }

    table = document.getElementById("second_row");
    newcell = table.insertCell(nums);
    newcell.style.backgroundColor = 'green';
    newcell.innerHTML = "2 to 1";
    newcell.id = "2_to_1_2";
    newcell.onclick = function () {
        putmoney_other(this);
    }

    table = document.getElementById("first_row");
    newcell = table.insertCell(numf);
    newcell.style.backgroundColor = 'green';
    newcell.innerHTML = "2 to 1";
    newcell.id = "2_to_1_1";
    newcell.onclick = function () {
        putmoney_other(this);
    }
}


function putmoney(obj) { //數字押注


    var num = new Number(obj.id);
    var temp, checkcoin;


    if (obj.style.backgroundColor == 'red' || obj.style.backgroundColor == 'black' || obj.style.backgroundColor ==
        'green') {

        //
        obj.style.border = '5px solid white'; //想要投注後顏色更改

        var c10 = document.getElementById("coin10");
        var c25 = document.getElementById("coin25");
        var c50 = document.getElementById("coin50");


        if (c10.style.border == '3px solid black') {
            temp = 10;
        } else if (c25.style.border == '3px solid black') {
            temp = 25;
        } else {
            temp = 50;
        }

        put_money += temp;

    }


    var text = document.getElementById("putmoney");
    text.innerHTML = "已投注: " + put_money;


    //  投注表  投注//modified
    var odiv = document.createElement("P");
    odiv.id = "willBeDeleteByClean";
    var t = document.createTextNode("投注號碼: " + num + " 金額 " + temp + " 元");
    odiv.appendChild(t);
    obox.appendChild(odiv);
    //  

}

function checkwin() {
    var check_table = document.getElementById(win_number);
    var text = document.getElementById("money");

    var coin10 = document.getElementById("coin10");
    var coin25 = document.getElementById("coin25");
    var coin50 = document.getElementById("coin50");

    if (check_table.style.border == '5px solid white'); //沒下注


    if (coin10.style.border == '3px solid black') {
        total_money = total_money + 10 * 36;
    } else if (coin25.style.border == '3px solid black') {
        total_money = total_money + 25 * 36;
    } else if (coin50.style.border == '3px solid black') {
        total_money = total_money + 50 * 36;
    }


    checkOtherWin(document.getElementById("1st"));
    checkOtherWin(document.getElementById("2nd"));
    checkOtherWin(document.getElementById("3rd"));
    checkOtherWin(document.getElementById("1_to_18"));
    checkOtherWin(document.getElementById("19_to_36"));
    checkOtherWin(document.getElementById("put_even"));
    checkOtherWin(document.getElementById("put_odd"));
    checkOtherWin(document.getElementById("color_black"));
    checkOtherWin(document.getElementById("color_red"));
    checkOtherWin(document.getElementById("2_to_1_1"));
    checkOtherWin(document.getElementById("2_to_1_2"));
    checkOtherWin(document.getElementById("2_to_1_3"));
    text = document.getElementById("money");
    text.innerHTML = "剩餘金額: " + total_money;

    clean();
}

function check_money() {
    if (total_money < put_money)
        return false;
    else
        return true;
}

function clean() { //賭盤      投注版也要清除  
    if (check == true) {
        var text;
        // var borderColor;
        for (var i = 1; i < 37; i++) {
            text = document.getElementById("" + i);
            // borderColor = document.getElementById("" + i);
            if (i % 2 == 0) {
                text.style.backgroundColor = 'red';
                text.style.border = '2px solid black';
            } else
                text.style.backgroundColor = 'black';
            text.style.border = '2px solid black';
        }

        text = document.getElementById("0");
        text.style.backgroundColor = 'green';
        text.style.border = '2px solid black';
        text = document.getElementById("1st");
        text.style.backgroundColor = 'green';
        text.style.border = '2px solid black';
        text = document.getElementById("2nd");
        text.style.backgroundColor = 'green';
        text.style.border = '2px solid black';
        text = document.getElementById("3rd");
        text.style.backgroundColor = 'green';
        text.style.border = '2px solid black';
        text = document.getElementById("1_to_18");
        text.style.backgroundColor = 'green';
        text.style.border = '1px solid black';
        text = document.getElementById("put_even");
        text.style.backgroundColor = 'green';
        text.style.border = '1px solid black';
        text = document.getElementById("put_odd");
        text.style.backgroundColor = 'green';
        text.style.border = '2px solid black';
        text = document.getElementById("19_to_36");
        text.style.backgroundColor = 'green';
        text.style.border = '2px solid black';
        text = document.getElementById("color_black");
        text.style.backgroundColor = 'black';
        text.style.border = '2px solid black';
        text = document.getElementById("color_red");
        text.style.backgroundColor = 'red';
        text.style.border = '2px solid black';
        text = document.getElementById("2_to_1_1");
        text.style.backgroundColor = 'green';
        text.style.border = '2px solid black';
        text = document.getElementById("2_to_1_2");
        text.style.backgroundColor = 'green';
        text.style.border = '2px solid black';
        text = document.getElementById("2_to_1_3");
        text.style.backgroundColor = 'green';
        text.style.border = '2px solid black';
        put_money = 0;
        text = document.getElementById("putmoney");
        text.innerHTML = "已投注: " + put_money;

        for (let i = 0; i < 230; i++) {
            deleteElementById("willBeDeleteByClean");
        }

    }
}

function deleteElementById(id) //投注表全清除
{
    var d = document.getElementById(id);
    d.remove();

}


function putmoney_other(obj) { //除了數字

    if (check == true) {
        var temp, checkcoin;

        obj.style.border = '5px solid white';

        if (obj.style.backgroundColor == 'red' || obj.style.backgroundColor == 'black' || obj.style.backgroundColor ==
            'green') {

            //obj.style.backgroundColor == 'gray';

            var c10 = document.getElementById("coin10");
            var c25 = document.getElementById("coin25");
            var c50 = document.getElementById("coin50");


            if (c10.style.border == '3px solid black') {
                temp = 10;
            } else if (c25.style.border == '3px solid black') {
                temp = 25;
            } else {
                temp = 50;
            }

            put_money += temp;
        }

        var text = document.getElementById("putmoney");
        text.innerHTML = "已投注: " + put_money;
    }


    //  投注表  投注
    var odiv2 = document.createElement("P");

    var texttt = document.getElementById(obj.id); //按下的字
    var t2 = document.createTextNode("投注 " + texttt.innerHTML + " 金額 " + temp + " 元");
    odiv2.id = "willBeDeleteByClean";
    odiv2.appendChild(t2);
    obox2.appendChild(odiv2);
}


function checkOtherWin(obj) {
    var win = 0;

    var coin10 = document.getElementById("coin10");
    var coin25 = document.getElementById("coin25");
    var coin50 = document.getElementById("coin50");


    if (obj.id == "1st" && obj.style.border == '5px solid white') {
        if (win_number < 13)
            win = 3;
    } else if (obj.id == "2nd" && obj.style.border == '5px solid white') {
        if (win_number < 25 && win_number > 12)
            win = 3;
    } else if (obj.id == "3rd" && obj.style.border == '5px solid white') {
        if (win_number < 37 && win_number > 24)
            win = 3;
    } else if (obj.id == "1_to_18" && obj.style.border == '5px solid white') {
        if (win_number < 19)
            win = 2;
    } else if (obj.id == "19_to_36" && obj.style.border == '5px solid white') {
        if (win_number < 37 && win_number > 18)
            win = 2;
    } else if (obj.id == "put_even" && obj.style.border == '5px solid white') {
        if (win_number % 2 == 0)
            win = 2;
    } else if (obj.id == "put_odd" && obj.style.border == '5px solid white') {
        if (win_number % 2 == 1)
            win = 2;
    } else if (obj.id == "color_red" && obj.style.border == '5px solid white') {
        if (win_number % 2 == 0)
            win = 2;
    } else if (obj.id == "color_black" && obj.style.border == '5px solid white') {
        if (win_number % 2 == 1)
            win = 2;
    } else if (obj.id == "2_to_1_1" && obj.style.border == '5px solid white') {
        if (win_number % 3 == 1)
            win = 3;
    } else if (obj.id == "2_to_1_2" && obj.style.border == '5px solid white') {
        if (win_number % 3 == 2)
            win = 3;
    } else if (obj.id == "2_to_1_3" && obj.style.border == '5px solid white') {
        if (win_number % 3 == 0)
            win = 3;
    } else
        win = 0;

    if (coin10.style.border == '3px solid black')
        total_money = total_money + 10 * win;
    else if (coin25.style.border == '3px solid black')
        total_money = total_money + 25 * win;
    else if (coin50.style.border == '3px solid black')
        total_money = total_money + 50 * win;
}


/////////////////////////////////////////////   投注表相關

//數字
let oadd = document.getElementById("add");
let odel = document.getElementById("del");
let obox = document.getElementById("box");

//除了數字
let oadd2 = document.getElementById("add2");
let odel2 = document.getElementById("del2");
let obox2 = document.getElementById("box2");

odel.onclick = function () { //投注表 Remove左   id = "del"     數字
    var divs = obox.getElementsByTagName("P");

    if (divs.length > 0) {
        var a = divs.length;
        obox.removeChild(divs[a - 1]);

        //  putmoney -= 10;                                          測試REMOVE後金額變動
        //  var text = document.getElementById("putmoney");
        //  text.innerHTML = "已投注: " + put_money;
    }
}

odel2.onclick = function () { //投注表 Remove右   id = "del2"     除了數字
    var divs2 = obox2.getElementsByTagName("P");
    if (divs2.length > 0) {
        var b = divs2.length;
        obox2.removeChild(divs2[b - 1]);
    }
}

/////////////////////////////////////////////////////////


function selectCoin(obj) {

    var c10 = document.getElementById("coin10");
    var c25 = document.getElementById("coin25");
    var c50 = document.getElementById("coin50");

    if (obj.id == "coin25") {

        obj.style.border = "3px solid black";
        c10.style.border = "none";
        c50.style.border = "none";
    }

    if (obj.id == "coin10") {

        obj.style.border = "3px solid black";
        c25.style.border = "none";
        c50.style.border = "none";
    }

    if (obj.id == "coin50") {

        obj.style.border = "3px solid black";
        c10.style.border = "none";
        c25.style.border = "none";
    }
}


draw();