  /**
 * Created by LoveS on 2016/5/24.
 */

/**
* addListener方法，跨浏览器的时间监听
* @param element
* @param event
* @param listener
*/
function addListener(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    }
    else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    }
    else {
        element["on" + event] = listener;
    }
}    

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
    var state = 0;//记录状态
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
            turn(-90);
        },
        "TRA LEF": function (steps) {
            move(getXY().X - parseInt(steps || 1), getXY().Y);
        },
        "TRA TOP": function (steps) {
            move(getXY().X, getXY().Y - parseInt(steps || 1));
        },
        "TRA RIG": function (steps) {
            move(getXY().X + parseInt(steps || 1), getXY().Y);
        },
        "TRA BOT": function (steps) {
            move(getXY().X, getXY().Y + parseInt(steps || 1));
        },
        "MOV LEF": function (steps) {
            turnAndGo(-1, steps);
        },
        "MOV TOP": function (steps) {
            turnAndGo(0, steps);
        },
        "MOV RIG": function (steps) {
            turnAndGo(1, steps);
        },
        "MOV BOT": function (steps) {
            turnAndGo(2, steps);
        },
        "PAINT": function (x) {
            paint(x);
        },
        "INIT": function () {
            $activeDiv.css(changeXY(5, 5));
        }
    };

    function changeXY(x, y) {
        return {
            "left": 32*(x-1) + "px",
            "top": 32*(y-1) + "px"
        }
    }
    
    function turnAndGo(terminalState, steps) {
        var differ = terminalState - state;
        switch (differ%4) {
            case -3:
            case 1:
                turn(90);
                break;
            case -2:
            case 2:
                turn(180);
                break;
            case -1:
            case 3:
                turn(-90);
                break;
        }
        moveSomeSteps(steps);
    }

    function turn(deg) {
        $activeDiv.css("transform","rotate("+ (deg+state*90) +"deg)");
        state = state + deg/90;
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
                move(tempX,tempY - _steps);
                break;
            case 1:
                move(tempX + _steps, tempY);
                break;
            case 2:
                move(tempX,tempY + _steps);
                break;
            case 3:
                move(tempX - _steps, tempY);
                break;
        }
    }

    function handlerCommand() {
        var commandTextValue = $("#commandText").val();
        var commandArr = commandTextValue.trim().split(";");
        commandArr.pop();
        var arr = commandArr[0].trim().split(/([A-Z]+)\s+(\d+)/g);
        var str = arr.length === 4 ? arr[0] + arr[1] : arr[0];
        command[str](arr[2]);
        var  x = 1;
        var timer = setInterval(function () {
            if (x === commandArr.length) {
                clearInterval(timer);
            } else {
                var arr = commandArr[x].trim().split(/([A-Z]+)\s+(\d+)/g);
                var str = arr.length === 4 ? arr[0] + arr[1] : arr[0];
                command[str](arr[2]);
                x++;
            }
        },450);
    }

    function paint(x) {
        var xx = state === 3?-parseInt(x):parseInt(x);
        var nowX = parseInt(getXY().X);
        function _paint() {
            $("div[title = '"+getXY().Y+","+getXY().X+"']").css("background-color", "red");
        }
        moveSomeSteps(parseInt(x));
        var timer = setInterval(function () {
           if (getXY().X === nowX + xx) {
               clearInterval(timer);
           } else {
               _paint();
           }
        },1);

    }

    function move(x, y) {
        
        var nowX = parseInt(getXY().left);
        var nowY = parseInt(getXY().top);
        var terminalX = parseInt(changeXY(x, y).left);
        var terminalY = parseInt(changeXY(x, y).top);

        if (terminalX !== nowX) {
            $activeDiv.css("left", terminalX+"px");
        } else {
            $activeDiv.css("top", terminalY+"px");
        }

    }
    
    return {
        init: function (x, y) {
            $activeDiv.addClass("activediv");
            $activeDiv.css(changeXY(x, y));
        },
        handlerCommand: function (event) {
            var evt = event || window.event;
            var target = evt.target || evt.srcElement;

            switch (target.value) {
                case "执行":
                    handlerCommand();
                    break;
                case "清空":
                    document.querySelector("#commandText").value = "";
                    break;
            }
        }
    }
})();
  

function init() {
    var commandBtn = document.getElementById("commandBtn");
    activeDiv.init(1, 1);
    addListener(commandBtn, "click", activeDiv.handlerCommand);
}
init();