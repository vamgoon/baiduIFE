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
    var terX;//记录terminalX/Y 和nowX/Y的距离
    var terY;//记录terminalX/Y 和nowX/Y的距离
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
            _init(getXY().X - parseInt(steps || 1), getXY().Y);
        },
        "TRA TOP": function (steps) {
            _init(getXY().X, getXY().Y - parseInt(steps || 1));
        },
        "TRA RIG": function (steps) {
            _init(getXY().X + parseInt(steps || 1), getXY().Y);
        },
        "TRA BOT": function (steps) {
            _init(getXY().X, getXY().Y + parseInt(steps || 1));
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
        setTimeout(function () {
            moveSomeSteps(steps)
        },300);
    }

    function turn(deg) {
        var x = 0;
        var nowState = state%4;
        var timer = setInterval(function () {
            if (deg >= 0) {
                if ((x + 90 * nowState) <= (deg + 90 * nowState)) {
                    $activeDiv.css("transform","rotate("+(x + 90 * nowState)+"deg)");
                    x += 2;
                } else {
                    clearInterval(timer);
                }
            }
            else {
                if ((x + 90 * nowState) >= (deg + 90 * nowState)) {
                    $activeDiv.css("transform","rotate("+(x + 90 * nowState)+"deg)");
                    x -= 2;
                } else {
                    clearInterval(timer);
                }
            }
        },1);

        state = (state + Math.floor(deg/90) + 4)%4;
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

    function handlerCommand(i) {
        var commandTextValue = $("#commandText").val();
        var commandArr = commandTextValue.trim().split(";");
        commandArr.pop();
        var arr = commandArr[i].trim().split(/([A-Z]+)\s+(\d+)/g);
        var str = arr.length === 4 ? arr[0] + arr[1] : arr[0];
        console.log(arr)
        command[str](arr[2]);
    }

    function graduallyMove(terminalXY, nowXY, direc) {
        var differ = terminalXY - nowXY;
        var x = 0;
        if (differ > 0) {
            var timer = setInterval(function () {
                if (x <= differ) {
                    $activeDiv.css(direc, x+nowXY+"px");
                    x += 2;
                } else {
                    clearInterval(timer);
                }
            },1);
        }
        else {
            var timer = setInterval(function () {
                if (x > differ) {
                    x -= 2;
                    $activeDiv.css(direc,nowXY + x+"px");
                } else {
                    clearInterval(timer);
                }
            },1);
        }
    }

    function _init(x, y) {
        
        var nowX = parseInt(getXY().left);
        var nowY = parseInt(getXY().top);
        var terminalX = parseInt(changeXY(x, y).left);
        var terminalY = parseInt(changeXY(x, y).top);
        terX = 1;
        terY = terminalY;

        if (terminalX !== nowX) {
            graduallyMove(terminalX, nowX, "left");

        } else {
            graduallyMove(terminalY, nowY, "top");
        }
    }
    
    return {
        init: function (x, y) {
            $activeDiv.addClass("activediv");
            $activeDiv.css(changeXY(x, y));
        },
        handlerCommand: function (i) {
            handlerCommand(i);
        }
    }
})();

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

  function init() {
      var commandBtn = document.getElementById("commandBtn");

      activeDiv.init(2, 18);
      addListener(commandBtn, "click", function () {
          activeDiv.handlerCommand(0);
      });
  }

  init();