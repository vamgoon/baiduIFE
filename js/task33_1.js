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

    function changeXY(x, y) {
        return {
            "left": 32*(x-1) + "px",
            "top": 32*(y-1) + "px"
            // "transform": "rotate(50deg)"
        }
    }

    function turn(deg) {
        state += Math.floor(deg/90);
        $activeDiv.css("transform","rotate("+deg+state*90+"deg)");
    }

    function getXY() {
        var $div = $activeDiv[0];
        return {
            "left": $div.offsetLeft + "px",
            "top": $div.offsetHeight + "px",
            "X": Math.round((+$div.offsetLeft)/32)+1,
            "Y": Math.round((+$div.offsetTop)/32)+1
        }
    }

    function moveTo() {
        var tempX = getXY().X;
        var tempY = getXY().Y;

        // var timer = setInterval(function () {
        //     var tempX = getXY().X;
        //     var tempY = getXY().Y;
        //     if (tempX < x) {
        //         tempX++;
        //         _init(tempX,y);
        //     }
        //     else if (tempX > x) {
        //         tempX--;
        //         _init(tempX,y);
        //     }
        //     else {
        //         clearInterval(timer);
        //     }
        // },500);
        switch (state%4) {
            case 0:
                _init(tempX,tempY - 1);
                break;
            case 1:
                _init(tempX + 1, tempY);
                break;
            case 2:
                _init(tempX,tempY + 1);
                break;
            case 3:
                _init(tempX - 1, tempY);
                break;
        }
    }

    function _checkCommand(commandStr) {
        switch (commandStr) {
            case "GO":
                moveTo();
                break;
            case "TURN RIG":
                turn(90);
                break;
            case "TURN BAC":
                turn(180);
                break;
            case "TURN LEF":
                turn(270);
                break;
        }
    }

    function _init(x, y) {
        $activeDiv.css(changeXY(x, y));
    }

    return {
        init: function (x, y) {
            $activeDiv.addClass("activediv");
            _init(x, y);
        },
        checkCommand: function (commandStr) {
            _checkCommand(commandStr);
        }
    }
})();