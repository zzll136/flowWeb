//------------------------------------二次仪表的处理-------------------------
// 代码安全性检查没有
//处理代码编辑区的TAB键盘按键响应??????????????????????????????????????
var tableid = 7;
$("#virtualInstrumentCodeArea").keydown(function (e) {
    if (e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var $this = $(this);
        var value = $this.val();

        // set textarea value to: text before caret + tab + text after caret
        $this.val(value.substring(0, start) +
            "\t" +
            value.substring(end));

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        e.preventDefault();
    }
});

$('#buttonRunScript').click(function (e) {
    //提交用户编写的脚本
    $.ajax({
        type: 'POST',
        async: false,
        url: '/experiment/updateScript7',
        data: 'code=' + encodeURIComponent($('#virtualInstrumentCodeArea').val())
    });
    //重新加载,刷新页面
    document.getElementById('instrumentScript').contentWindow.location.reload();
});

$('#buttonResetScript').click(function (e) {
    //清空用户编写的脚本
    $("#virtualInstrumentCodeArea").val("").focus();
    //重新加载,刷新页面
    // document.getElementById('instrumentScript').contentWindow.location.reload();
});

//----------------------------------------退出实验的处理----------------------------

window.onbeforeunload = function () {
    return 1; //阻止意外关闭实验页
}

//窗口关闭时,使用ajax上传实验日志
window.onunload = function () {
    recordExpLog('退出实验');
    $.ajax({
        type: 'POST',
        async: false,
        url: '/experiment/tableFree',
        data: 'tableid=' + tableid,
        success: function (data) {
        }
    });
}

// -------------------------主界面鼠标事件----------------------misc

//开始实验,清空表格,打开进水阀,关闭出水阀/侧阀,开启变频器
// $('#buttonStartExperiment').click(function (e) {
//     if (experimentStatus == 0) {
//         var status;
//         var expTime = new Date();
//         var y = expTime.getFullYear();
//         var m = addZero(expTime.getMonth() + 1);
//         var d = addZero(expTime.getDate());
//         var h = addZero(expTime.getHours());
//         var min = addZero(expTime.getMinutes());
//         var t = y + "-" + m + "-" + d;
//         h = h + ":00";
//         $.post('/experiment/judgeTime', {
//             courseid: 7
//         }, function (results) {
//             var result_str = [];
//             result_str = results.split(",");
//             for (i = 0; i < result_str.length; i++) {
//                 if (result_str[i] == t)
//                     break;
//             }
//             if (i == result_str.length) alert("今天该实验不开放");
//             else {
//                 $.post('/experiment/judgeOrder', {
//                     courseid: 7,
//                     t: t,
//                     h: h
//                 }, function (time) {
//                     if (time.num==0)
//                         alert("未预约该时间段" + h + "的实验");
//                     else if (min > 40) alert("已迟到20min以上，不能继续做实验");
//                     else {

//                         $.get('/experiment/courseInfo', function (result) {
//                             if (result != "none") {
//                                 for (var i = 0; i < result.length; i++) {
//                                     if (result[i].courseID == 7)
//                                         status = result[i].status;
//                                 }
//                                 switch (status) {
//                                     case 0:
//                                         if (confirm('你即将开始实验，继续请按确认'))
//                                             break;
//                                         else return;
//                                     case 1:
//                                         if (confirm('您已完成此实验,重做会覆盖之前的实验记录,继续请按确认。'))
//                                             break;
//                                         else return;
//                                     case 2:
//                                         alert('您已提交报告,不能重新进行此实验');
//                                         return;
//                                 }
//                             }
//                             $.post('/experiment/tableMatch', {
//                                 courseid: 7
//                             }, function (data) {
//                                 tableid = data;
//                                 if (tableid == 7) {
//                                     alert("暂无空闲实验桌，请提前预约");
//                                 }
//                                 else  //停止状态
//                                 {
//                                     experimentStatus = 1;
//                                     socket.emit('startExperiment', tableid, document.getElementById('frequencySlider').value);
//                                     chartLevel.series[0].remove();
//                                     chartLevel.series[0].remove();
//                                     chartLevel.addSeries(createEmptySeries('#5555aa', '实际液位'));
//                                     chartLevel.addSeries(createEmptySeries('#aaaa55', '超声波液位'));
//                                     time = 0;
//                                     recordExpLog('开始实验');
//                                     setButtonsByStatus();
//                                     openCamera(tableid);
//                                 }
//                             });
//                         });
//                     }
//                 });
//             }
//         });
//     } else if (experimentStatus == 1) {
//         if (confirm('是否确认结束实验？')) {
//             $.post('/experiment/codeReset', {
//                 codeid: 7
//             }, function (data) { });
//             $.post('/experiment/tableFree', {
//                 tableid: tableid
//             }, function (data) { });
//             experimentStatus = 0;
//             socket.emit('stopExperiment', tableid);
//             recordExpLog('结束实验');
//             //setButtonsByStatus();
//             window.location.href = location.href;
//         }
//     }
//     else {
//         // 重置状态
//         experimentStatus = 1; //1是运行状态，socket.emit('emitEvent',data),socket.on('emitEvent',function(data){});
//         document.getElementById('frequencySlider').value = 30;
//         socket.emit('startExperiment', tableid, document.getElementById('frequencySlider').value);
//         chartWeight.series[0].remove();
//         chartWeight.addSeries(createEmptySeries());
//         chartVortex.series[0].remove();
//         chartVortex.addSeries(createEmptySeries());
//         time = 0;
//         recordExpLog('重置后开始实验');
//         setButtonsByStatus();
//     }
// });

// //重置实验,停止水泵,打开出水阀
// $('#buttonResetExperiment').click(function (e) {
//     if (experimentStatus == 0) {
//         alert("请先点击开始实验");
//         return false;
//     }
//     else {
//         experimentStatus = 2;
//         setButtonsByStatus();
//         socket.emit('resetExperiment', tableid);
//         recordExpLog('重置实验');
//     }
// });

//上传实验数据
$('#buttonEndExperiment').click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        $.ajax({
            type: 'POST',
            async: false,
            url: '/experiment/7',
            data: 'expdata=' + getTableContent('tableDataRecord') + '&log=' + document.getElementById('expLog').innerText+ '&tableid='+tableid+ '&year='+year+'&code=' + encodeURIComponent($('#virtualInstrumentCodeArea').val()),
            success: function (data) {
                if (data=="none")
                    alert('用户不存在数据表');
                else if (data.affectedRows!= 0) alert('上传成功');
            },
            error: function (data) {
                alert('上传失败');
            }
        });
    }
});

var isDrawingGraph = true;
$('#buttonPauseGraph').click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        isDrawingGraph = !isDrawingGraph;
        document.getElementById("buttonPauseGraph").innerText = isDrawingGraph ? "暂停曲线" : "开始曲线";
    }
});

//---------------------------tableOperations-----------------------------

var recordingIndex = 0;
//清空表格按钮
$('#buttonClearRecord').click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        recordingIndex = 0;
        $("#tableDataRecord").empty(); //清除所有内容
        //添加表格标题行
        var row = document.getElementById("tableDataRecord").insertRow();
        var cell;
        cell = row.insertCell(-1);
        cell.innerHTML = "序号";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "时间";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "实际流量(m3/h)";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "计算流量(m3/h)";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        recordExpLog('清空表格');
    }
});

var isRecordingTable = false;
$("#buttonStartRecord").click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        isRecordingTable = !isRecordingTable;
        document.getElementById("buttonStartRecord").innerText = isRecordingTable ? "停止记录" : "开始记录";
        if (isRecordingTable) recordExpLog('开始记录数据,间隔:' + recordInterval + 's');
        else recordExpLog('停止记录数据');
    }
});

//表格更新时间间隔
function recordIntervalChange() {
    var interval = parseInt($("#inputSampleInterval").val());
    if (isNaN($("#inputSampleInterval").val())) document.getElementById("inputSampleInterval").value = 1;
    if (interval > 10) document.getElementById("inputSampleInterval").value = 10;
    if (interval < 1) document.getElementById("inputSampleInterval").value = 1;
    recordInterval = parseInt($("#inputSampleInterval").val());
    recordIntervalCounter = recordInterval;
}

//-------------------视屏流---------------------------------

//var canvas = document.getElementById('video-canvas');
//var player = new JSMpeg.Player('Socket.IO', { canvas: canvas, channel: 1 });

//--------------------------------socket.io------------------------------

var labelTimeD = 0;
var cs = 0;
var calculateFlowRateHM = 0;
var actualFlowRateHM = 0;
var socket = io.connect();
var time = 0;
var recordInterval = 1;
var recordIntervalCounter = 1;
var warnflag = 0, warnflag2 = 0;
var experimentStatus = 0; //实验状态,0:空闲(停止);1:正在实验;2:正在重置
var errorflag = [0, 0, 0, 0];
const L=0.13;
const D=0.02;

setInterval(function () {
    if (experimentStatus != 0) {
        // var reqTime = Date.now();
        socket.emit('getdata', tableid);

    }
}, 1000);

var weightArray=[];
var timeArray=[];
var actualFlowrateHM=0;
socket.on("Data Pack", function (temperature, ultraTime, distance, flowRate, totalFlowVortex, weight, flowRateHM, totalFlowHM, temperatureWater,valveIn, valveOut, valveSide, inverter) {
    // distance = 'xxxx';
    //  1244.1是什么
    // actualLevel = weight * 10000 / 1244.1;
    ultraFlowRateHM = flowRateHM;
    flowRateHM = 'xxxx';

    var time_stamp = Date.now();
    weightArray.push(Number(weight));
    timeArray.push(time_stamp);
    if (weightArray.length == 11) {
        weightArray.splice(0, 1);
        timeArray.splice(0, 1);

        var a1=(weightArray[3] - weightArray[0]) * 3600 / (timeArray[3] - timeArray[0]);
        var a2=(weightArray[4] - weightArray[1]) * 3600 / (timeArray[4] - timeArray[1]);
        var a3=(weightArray[5] - weightArray[2]) * 3600 / (timeArray[5] - timeArray[2]);

        var c1=(weightArray[5] - weightArray[0]) * 3600 / (timeArray[5] - timeArray[0]);
        var c2=(weightArray[6] - weightArray[1]) * 3600 / (timeArray[6] - timeArray[1]);
        var c3=(weightArray[7] - weightArray[2]) * 3600 / (timeArray[7] - timeArray[2]);
        var c4=(weightArray[8] - weightArray[3]) * 3600 / (timeArray[8] - timeArray[3]);
        var c5=(weightArray[9] - weightArray[4]) * 3600 / (timeArray[9] - timeArray[4]);
        actualFlowrateHM=(c1+c2+c3+c4+c5)/5;
        actualFlowrateHM=actualFlowrateHM.toFixed(3);
    }

    cs = 331.3 + 0.606 * temperatureWater;
    labelTimeD = 8 *L * ultraFlowRateHM / (3.14*D*D*cs*cs);
    var vStr = $('#virtualInstrumentCodeArea').val();
    vStr = vStr.trim();
    if (!vStr) document.getElementById('labelcalculateFlowRateHM').innerHTML = '';
    //运行虚拟二次仪表
    else {
        try {
            calculateFlowRateHM = instrumentScript.calculateFlowRateHM(labelTimeD, temperatureWater);
            calculateFlowRateHM=calculateFlowRateHM.toFixed(3);
            document.getElementById('labelcalculateFlowRateHM').innerHTML = calculateFlowRateHM+ ' m3/h';
        } catch (e) {
            console.log(e.toString());
            document.getElementById('labelcalculateFlowRateHM').innerHTML = '运行错误';
        }
    }

    if (true) {

        if (weight !== -1)
            errorflag[0] = 0;
        else if (weight == -1 && errorflag[0] < 80)
            errorflag[0]++;

        if (flowRate !== -1 && totalFlowVortex !== -1)
            errorflag[1] = 0;
        else if ((flowRate == -1 || totalFlowVortex == -1) && errorflag[1] < 80)
            errorflag[1]++;

        if (errorflag[0] == 75)
            WeightError();

        if (errorflag[1] == 75)
            VortexError();

        //虚拟仪表区,比验证实验多的部分
        document.getElementById('labelTimeD').innerHTML = labelTimeD.toFixed(5) + ' s';
        document.getElementById('labelTempHM1').innerHTML = temperatureWater.toFixed(1) + ' ℃';
        document.getElementById('labelFlowRateHM1').innerHTML = actualFlowrateHM + ' m3/h';

        //电子秤
        document.getElementById('labelWeight').innerHTML = '质量:' + weight.toFixed(3) + ' kg';
        document.getElementById('labelWeightSide').innerHTML = '质量:' + weight.toFixed(3)+ ' kg';
        //涡街流量计
        document.getElementById('labelFlowRateVortex').innerHTML = '瞬时流量:' + flowRate.toFixed(3)+ ' m3/h';
        document.getElementById('labelFlowRateVortexSide').innerHTML = '瞬时流量:' + flowRate.toFixed(3) + ' m3/h';
        document.getElementById('labelTotalFlowVortex').innerHTML = '累积流量:' + totalFlowVortex.toFixed(3) + ' m3';

        document.getElementById("VortexFlowDigit1").src = "/images/LCD/" + parseInt(flowRate % 10) + ".png";
        document.getElementById("VortexFlowDigit2").src = "/images/LCD/" + parseInt((flowRate * 10) % 10) + ".png";
        document.getElementById("VortexFlowDigit3").src = "/images/LCD/" + parseInt((flowRate * 100) % 10) + ".png";
        document.getElementById("VortexFlowDigit4").src = "/images/LCD/" + parseInt((flowRate * 1000) % 10) + ".png";


        //超声波流量计
        document.getElementById('labelFlowRateHM').innerHTML = '瞬时流量:' + calculateFlowRateHM + ' m3/h';
        document.getElementById('labelFlowRateHMSide').innerHTML = '瞬时流量:' + calculateFlowRateHM + ' m3/h';
        document.getElementById('labelTotalFlowHM').innerHTML = '累积流量:' + totalFlowHM.toFixed(3) + ' m3';
        document.getElementById('labelTempHM').innerHTML = '水温:' + temperatureWater.toFixed(3) + ' C';

        document.getElementById("USFlowDigit1").src = "/images/LCD/" + parseInt(calculateFlowRateHM % 10) + ".png";
        document.getElementById("USFlowDigit2").src = "/images/LCD/" + parseInt((calculateFlowRateHM * 10) % 10) + ".png";
        document.getElementById("USFlowDigit3").src = "/images/LCD/" + parseInt((calculateFlowRateHM * 100) % 10) + ".png";
        document.getElementById("USFlowDigit4").src = "/images/LCD/" + parseInt((calculateFlowRateHM * 1000) % 10) + ".png";

        document.getElementById("USFlowTempDigit1").src = "/images/LCD/" + parseInt((temperatureWater / 10) % 10) + ".png";
        document.getElementById("USFlowTempDigit2").src = "/images/LCD/" + parseInt((temperatureWater) % 10) + ".png";
        document.getElementById("USFlowTempDigit3").src = "/images/LCD/" + parseInt((temperatureWater * 10) % 10) + ".png";
        document.getElementById("USFlowTempDigit4").src = "/images/LCD/" + parseInt((temperatureWater * 100) % 10) + ".png";
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //超声波液位计
        document.getElementById('labelWaterLevel').innerHTML = '液位:' + distance + ' mm';
        document.getElementById('labelWaterLevelSide').innerHTML = '液位:' + distance + ' mm';
        document.getElementById('labelTempAir').innerHTML = '气温:' + temperature.toFixed(3)+ ' C';
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // if (valveIn == 'on' && lastSW1) document.getElementById('sw1').checked = true;
        // if (valveIn == 'off' && !lastSW1) document.getElementById('sw1').checked = false;

        // if (valveSide == 'on' && lastSW2) document.getElementById('sw2').checked = true;
        // if (valveSide == 'off' && !lastSW2) document.getElementById('sw2').checked = false;

        // if (valveOut == 'on' && lastSW3) document.getElementById('sw3').checked = true;
        // if (valveOut == 'off' && !lastSW3) document.getElementById('sw3').checked = false;

        // if (inverter == 'on' && lastSW4) document.getElementById('sw4').checked = true;
        // if (inverter == 'off' && !lastSW4) document.getElementById('sw4').checked = false;

        // lastSW1 = valveIn == 'on';
        // lastSW2 = valveSide == 'on';
        // lastSW3 = valveOut == 'on';
        // lastSW4 = inverter == 'on';
        if (sw1Status == 1) {
            setTimeout(function () {
                sw1Status = 0;
            }, 1500);
        }
        if (sw2Status == 1) {
            setTimeout(function () {
                sw2Status = 0;
            }, 1500);
        }
        if (sw3Status == 1) {
            setTimeout(function () {
                sw3Status = 0;
            }, 1500);
        }

        if (sw4Status == 1) {
            setTimeout(function () {
                sw4Status = 0;
            }, 1500);
        }
        if (sw1Status == 0) {
            if (valveIn == '1') document.getElementById('sw1').checked = false;
            if (valveIn == '0') document.getElementById('sw1').checked = true;
        }

        if (sw2Status == 0) {
            if (valveSide == '1') document.getElementById('sw2').checked = false;
            if (valveSide == '0') document.getElementById('sw2').checked = true;
        }

        if (sw3Status == 0) {
            if (valveOut == '1') document.getElementById('sw3').checked = false;
            if (valveOut == '0') document.getElementById('sw3').checked = true;
        }

        if (sw4Status == 0) {
            if (inverter) document.getElementById('sw4').checked = true;
            if (inverter == '0') document.getElementById('sw4').checked = false;
        }

        //重置仪器终止判断
        if (experimentStatus == 2 && weight < 2 && valveOut == '1') {
            //experimentStatus = 3; //切换为闲置状态
            //等待10s,确保水放完,然后弹框提示,并关闭下水阀
            if (warnflag == 0) {
                document.getElementById("WarningResetFinished").style.visibility = "visible";
                document.getElementById("WarningResetFinished").style.opacity = "0.8";
                document.getElementById("WarningResetFinished").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
                document.getElementById("WarningResetFinished").style.zIndex = "1000";
                recordExpLog('重置实验完成,水箱已放空');
                warnflag = 1;
            }
        }
        if ((weight > 24 && valveOut == '1')||(weight > 24 && valveOut == '0' && inverter!=0)) {
            if (warnflag2 == 0) {
                document.getElementById("WarningOverflow").style.visibility = "visible";
                document.getElementById("WarningOverflow").style.opacity = "0.8";
                document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
                document.getElementById("WarningOverflow").style.zIndex = "1000";
                recordExpLog('警告:上储水箱溢出,电子秤超重');
               
                warnflag2 = 1;
            }
        };
        //重置仪器终止判断
        // if (experimentStatus == 2 && weight < 1) {
        //     experimentStatus = 0; //切换为闲置状态
        //     //等待10s,确保水放完,然后弹框提示,并关闭下水阀
        //     setTimeout(function() {
        //         socket.emit('controlValves', 'out', false);
        //         document.getElementById("WarningResetFinished").style.visibility = "visible";
        //         document.getElementById("WarningResetFinished").style.opacity = "0.8";
        //         document.getElementById("WarningResetFinished").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
        //         document.getElementById("WarningResetFinished").style.zIndex = "1000";
        //         recordExpLog('重置实验完成,水箱已放空');
        //     }, 10000);
        // }

        //记录数据只有在刷新曲线过程中才能进行
        if (isDrawingGraph) {
            if(actualFlowrateHM >=0 && actualFlowrateHM <= 3 && calculateFlowRateHM >=0 && calculateFlowRateHM <= 3){
            chartLevel.series[0].addPoint([time, Number(actualFlowrateHM)], true, false);
            chartLevel.series[1].addPoint([time, Number(calculateFlowRateHM)], true, false);
            time += 1000;
            var min = parseInt(time / 60000);
            var sec = (time / 1000) % 60;

            //如果正在记录表格,则向表格中添加数据
            if (isRecordingTable) {
                if (recordIntervalCounter < recordInterval) {
                    recordIntervalCounter++;
                } else {
                    recordIntervalCounter = 1;
                    recordingIndex++;
                    //添加表格标题行
                    var row = document.getElementById("tableDataRecord").insertRow();
                    var cell;
                    cell = row.insertCell(-1);
                    cell.innerHTML = recordingIndex;
                    cell.align = "center";

                    cell = row.insertCell(-1);
                    cell.innerHTML = (((min < 10) ? "0" : "") + min + ":" + ((sec < 10) ? "0" : "") + sec);
                    cell.align = "center";

                    cell = row.insertCell(-1);
                    cell.innerHTML = actualFlowrateHM;
                    cell.align = "center";

                    cell = row.insertCell(-1);
                    cell.innerHTML = calculateFlowRateHM;
                    cell.align = "center";

                    document.getElementById("divDataTable").scrollTop = cell.offsetTop;
                }
            } else { recordIntervalCounter = recordInterval; }
        }
    }
    }
});
// socket.on("Error", function(error) {
//     if (error == "Overflow") {
//         document.getElementById("WarningOverflow").style.visibility = "visible";
//         document.getElementById("WarningOverflow").style.opacity = "0.8";
//         document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//         document.getElementById("WarningOverflow").style.zIndex = "1000";
//         recordExpLog('错误:上储水箱溢出');
//     }
// });

//-------------------------------------Pump controlling------------------------------
// var sw4Status = 0;
// $('#sw4').click(function () {
//     if (experimentStatus == 0) {
//         alert("请先点击开始实验");
//         return false;
//     }
//     else {
//         sw4Status = 1;
//         if (document.getElementById('sw4').checked)
//             socket.emit('controlPump', tableid, document.getElementById('frequencySlider').value);
//         else
//             socket.emit('controlPump', tableid, 0);
//         recordExpLog(document.getElementById('sw4').checked ? ('开启变频器,频率:' + document.getElementById('frequencySlider').value + 'Hz') : '关闭变频器');
//     }
// })
// $('#frequencySlider').change(function () {
//     updateFrequencyValue();
//     if (document.getElementById('sw4').checked) {
//         socket.emit('controlPump', tableid, document.getElementById('frequencySlider').value);
//         recordExpLog('调节变频器频率:' + document.getElementById('frequencySlider').value + 'Hz');
//     }
// })