/**
 * Created by LoveS on 2016/5/24.
 */

var square = (function () {

    function _paintChart() {
        var str = "";
        for (var i = 1; i < 326; i++) {
            str += "<div title='"+Math.ceil(i/18)+","+(i%18 === 0 ? 18 : i%18)+"'></div>";
        }
        $("#div-container").html(str);
    }

    return {
        paintChart: _paintChart
    }

})();

square.paintChart();

var activeDiv = (function () {

    var $activeDiv = $("div[title = '19,1']");
    var state = 0;
    var command = {
        "GO":  function (steps) {
            moveSomeSteps(steps);
        },
        "TURN RIG": function () {
            turn(90);
        },
        "TURN BAC": function () {
            turn(180);
        },
        "TURN LEF": function () {
            turn(270);
        }
    };

    function changeXY(x, y) {
        return {
            "left": 32*(x-1) + "px",
            "top": 32*(y-1) + "px"
        }
    }

    function turn(deg) {
        var x = 0;
        var nowState = state%4;
        var timer = setInterval(function () {

            if ((x + 90 * nowState) <= (deg + 90 * nowState)) {
                $activeDiv.css("transform","rotate("+(x + 90 * nowState)+"deg)");
                x += 2;
            } else {
                clearInterval(timer)
            }
        },1);

        state += Math.floor(deg/90);
    }

    function getXY() {
        var $div = $activeDiv[0];
        return {
            "left": $div.offsetLeft + "px",
            "top": $div.offsetTop + "px",
            "X": Math.round((+$div.offsetLeft)/32)+1,
            "Y": Math.round((+$div.offsetTop)/32)+1
        }
    }

    /**
     * moveSomeSteps方法，向箭头所指的方向移动steps个位置
     * 若steps为空，则默认移动一个空格
     * @param steps
     */
    function moveSomeSteps(steps) {

        var tempX = getXY().X;
        var tempY = getXY().Y;
        var _steps = parseInt(steps || 1);

        switch (state%4) {
            case 0:
                _init(tempX,tempY - _steps);
                break;
            case 1:
                _init(tempX + _steps, tempY);
                break;
            case 2:
                _init(tempX,tempY + _steps);
                break;
            case 3:
                _init(tempX - _steps, tempY);
                break;
        }
    }

    function graduallyMove(differ, direc, nowXY) {
        // console.log(nowXY);
        var x = 0;
        if (differ > 0) {
            var timer = setInterval(function () {
                if (x <= differ) {
                    $activeDiv.css(direc, x+nowXY+"px");
                    x++;
                } else {
                    clearInterval(timer);
                }
            },10);
        }
        else {
            var time = setInterval(function () {
                if (x >= differ) {
                    $activeDiv.css(direc,nowXY + x+"px");
                    x--;
                } else {
                    clearInterval(time);
                }
            },10);
        }
    }

    function _init(x, y) {
        var terminalX = parseInt(changeXY(x, y).left);
        var terminalY = parseInt(changeXY(x, y).top);
        var nowX = parseInt(getXY().left);
        var nowY = parseInt(getXY().top);

        graduallyMove(terminalX - nowX, "left", nowX);
        graduallyMove(terminalY - nowY, "top", nowY);

    }

    return {
        init: function (x, y) {
            $activeDiv.addClass("activediv");
            $activeDiv.css(changeXY(x, y));
        },
        checkCommand: function (commandStr, steps) {
            command[commandStr](steps);
        }
    }
})();