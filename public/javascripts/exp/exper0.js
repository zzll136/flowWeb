//在即将离开当前页面(刷新或关闭)时执行 JavaScript 
window.onbeforeunload = function () {
    return 1;
    //阻止意外关闭实验页
}
//窗口关闭时,使用ajax上传实验日志?????????没有exper0的路径
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
};
//-----------------misc event--------------------------------
var tableid = 7;
//console.log(req.session.userrole);
//开始实验,清空表格,打开进水阀,关闭出水阀/侧阀,开启变频器

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
            url: '/experiment/0',
            data: 'expdata=' + getTableContent('tableDataRecord') + '&log=' + document.getElementById('expLog').innerText,
            success: function (data) {
                if (data.affectedRows != 0)
                    alert('上传成功');
                else if (data.affectedRows == 0) alert('用户不存在数据表');
            },
            error: function (data) {
                alert('上传失败');
            }
        });
    }
});

//重置实验,停止水泵,打开出水阀
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

//暂停曲线按钮
var isDrawingGraph = true;
$('#buttonPauseGraph').click(function (e) {

    // 改变记录曲线标志位  暂停曲线
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        isDrawingGraph = !isDrawingGraph;
        document.getElementById("buttonPauseGraph").innerText = isDrawingGraph ? "暂停曲线" : "开始曲线";
    }
});

//-------------------------------------------------tableOperations-------------------------
var recordingIndex = 0;
// 清空表格按钮
$('#buttonClearRecord').click(function (e) {
    if (experimentStatus == 0) {
        alert("请先点击开始实验");
        return false;
    }
    else {
        recordingIndex = 0;
        //清除试验数据的所有内容，jquery的empty函数，清除被选元素的所有内容
        $("#tableDataRecord").empty();
        // 添加表格标题行
        var row = document.getElementById("tableDataRecord").insertRow();
        var cell;
        // 将cell单元格插入到一行的末尾，-1末尾位置
        // cell = row.insertCell(-1);
        // cell.innerHTML = "序号";
        // cell.align = "center";
        // cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "时间";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "频率";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "质量(kg)";
        cell.align = "center";
        cell.style = "font-weight: bolder";

        cell = row.insertCell(-1);
        cell.innerHTML = "涡街流量(m3/h)";
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

//表格更新时间间隔，数据记录时间间隔
function recordIntervalChange() {
    var interval = parseInt($("#inputSampleInterval").val());
    if (isNaN($("#inputSampleInterval").val())) document.getElementById("inputSampleInterval").value = 1;
    if (interval > 10) document.getElementById("inputSampleInterval").value = 10;
    if (interval < 1) document.getElementById("inputSampleInterval").value = 1;
    recordInterval = parseInt($("#inputSampleInterval").val());
    recordIntervalCounter = recordInterval;
}

//-----------------------------------------------视频流--------------------------------
// var canvas = document.getElementById('video-canvas');
// var player = new JSMpeg.Player('Socket.IO', { canvas: canvas, channel: 1 });

//----------------------------------------------------------------socket.IO-----------------

var socket = io.connect();
var time = 0;
var recordInterval = 1;
var recordIntervalCounter = 1;
// var table=window.location.search.substr(1);
// var tableid=table.substr(table.indexOf("=")+1);
// var lastSW1=0,lastSW2=0, lastSW3=0, lastSW4=0;
// console.log('lastSW的值是多少:',lastSW1+lastSW2+lastSW3+lastSW4);
var experimentStatus = 0; //实验状态,0:空闲(停止);1:正在实验;2:正在重置
//var flag=0;//功能是只有收到数据之后 且开始实验之后才能显示 
// var insertflag = [0, 0, 0, 0, 0, 0];
var warnflag = 0, warnflag2 = 0;
// socket.on("device data", function (device_id) {
//     if (insertflag[device_id - 1] == 0) {
//         $.post('/experiment/tableinsert', {
//             tableid: device_id
//         }, function (data) {
//             if (data == "finished")
//                 insertflag[device_id - 1] = 1;
//         });
//     }
// });
//console.log("tableid的值" + tableid);
//var startTime;
// setInterval(function() {
//     //startTime = Date.now();
//     socket.emit('connect_test',tableid);
// }, 1000);
// var startTime;
var errorflag = [0, 0, 0, 0];
var nn = 0;
var mm = 0;
var ss = 0;
setInterval(function () {
    //console.log("定时器times" + mm++);
    //socket.emit('getexp', experimentStatus);
    if (experimentStatus != 0) {
        //var reqTime = Date.now();
        //socket.emit('getdata', tableid,reqTime);
        socket.emit('getdata', tableid);
        console.log("getdatatimes" + ss++);
    }
}, 1000);

socket.on("Data Pack", function (temperature, ultraTime, distance, flowRate, totalFlowVortex, weight, flowRateHM, totalFlowHM, temperatureWater, valveIn, valveOut, valveSide, inverter) {
    // // z?????????????????????????   pong监听什么
    // socket.emit('pong');
    // var recordingIndexTotal=0,timeTotal=0,weightTotal=0,flowRateTotal=0;
    //console.log('开关状态的值',valveIn+valveOut+valveSide+inverter);
    // if (device_id==tableid) {
    //电子秤
    //console.log("dataPacktimes"+ nn++);
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

    document.getElementById('labelWeight').innerHTML = '质量:' + weight + ' kg';
    document.getElementById('labelWeightSide').innerHTML = '质量:' + weight + ' kg';

    // 涡街流量计，以及涡街流量计的实时动态显示
    document.getElementById('labelFlowRateVortex').innerHTML = '瞬时流量:' + flowRate + ' m3/h';
    document.getElementById('labelFlowRateVortexSide').innerHTML = '瞬时流量:' + flowRate + ' m3/h';
    document.getElementById('labelTotalFlowVortex').innerHTML = '累积流量:' + totalFlowVortex + ' m3';


    document.getElementById("VortexFlowDigit1").src = "/images/LCD/" + parseInt(flowRate % 10) + ".png";
    document.getElementById("VortexFlowDigit2").src = "/images/LCD/" + parseInt((flowRate * 10) % 10) + ".png";
    document.getElementById("VortexFlowDigit3").src = "/images/LCD/" + parseInt((flowRate * 100) % 10) + ".png";
    document.getElementById("VortexFlowDigit4").src = "/images/LCD/" + parseInt((flowRate * 1000) % 10) + ".png";
   


    //超声波流量计
    document.getElementById('labelFlowRateHM').innerHTML = '瞬时流量:' + flowRateHM + ' m3/h';
    document.getElementById('labelFlowRateHMSide').innerHTML = '瞬时流量:' + flowRateHM + ' m3/h';
    document.getElementById('labelTotalFlowHM').innerHTML = '累积流量:' + totalFlowHM + ' m3';
    document.getElementById('labelTempHM').innerHTML = '水温:' + temperatureWater + ' C';

    document.getElementById("USFlowDigit1").src = "/images/LCD/" + parseInt(flowRateHM % 10) + ".png";
    document.getElementById("USFlowDigit2").src = "/images/LCD/" + parseInt((flowRateHM * 10) % 10) + ".png";
    document.getElementById("USFlowDigit3").src = "/images/LCD/" + parseInt((flowRateHM * 100) % 10) + ".png";
    document.getElementById("USFlowDigit4").src = "/images/LCD/" + parseInt((flowRateHM * 1000) % 10) + ".png";
  
    document.getElementById("USFlowTempDigit1").src = "/images/LCD/" + parseInt((temperatureWater / 10) % 10) + ".png";
    document.getElementById("USFlowTempDigit2").src = "/images/LCD/" + parseInt((temperatureWater) % 10) + ".png";
    document.getElementById("USFlowTempDigit3").src = "/images/LCD/" + parseInt((temperatureWater * 10) % 10) + ".png";
    document.getElementById("USFlowTempDigit4").src = "/images/LCD/" + parseInt((temperatureWater * 100) % 10) + ".png";
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //超声波液位计
    document.getElementById('labelWaterLevel').innerHTML = '液位:' + distance + ' mm';
    document.getElementById('labelWaterLevelSide').innerHTML = '液位:' + distance + ' mm';
    document.getElementById('labelTempAir').innerHTML = '气温:' + temperature + ' C';
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //  根据接收的阀门状态信息改变按钮的状态，inverter为变频器
    // if (valveIn == '1' && lastSW1) document.getElementById('sw1').checked = true;
    // if (valveIn == '0' && !lastSW1) document.getElementById('sw1').checked = false;

    // if (valveSide == '1' && lastSW2) document.getElementById('sw2').checked = true;
    // if (valveSide == '0' && !lastSW2) document.getElementById('sw2').checked = false;

    // // if (valveOut == '1' && lastSW3) document.getElementById('sw3').checked = true;
    // // if (valveOut == '0' && !lastSW3) document.getElementById('sw3').checked = false;
    // if (valveOut == '1' && lastSW3) document.getElementById('sw3').checked = false;
    // if (valveOut == '0' && !lastSW3) document.getElementById('sw3').checked = true;

    // if (inverter == '1' && lastSW4) document.getElementById('sw4').checked = true;
    // if (inverter == '0' && !lastSW4) document.getElementById('sw4').checked = false;
    // // ??????????????????????????????????
    // lastSW1 = valveIn == 'on';
    // lastSW2 = valveSide == 'on';
    // lastSW3 = valveOut == 'on';
    // lastSW4 = inverter == 'on';

    //  根据接收的阀门状态信息改变按钮的状态，inverter为变频器
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
    // lastSW1 = valveIn;
    // lastSW2 = valveSide;
    // lastSW3 = valveOut;
    // lastSW4 = inverter;
    //重置仪器终止判断

    if (experimentStatus == 2 && weight < 2 && valveOut == '1') {
        if (warnflag == 0) {
            //experimentStatus = 3; //切换为闲置状态
            document.getElementById("WarningResetFinished").style.visibility = "visible";
            document.getElementById("WarningResetFinished").style.opacity = "0.8";
            document.getElementById("WarningResetFinished").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
            document.getElementById("WarningResetFinished").style.zIndex = "1000";
            recordExpLog('重置实验完成,水箱已放空');
            warnflag = 1;
        }
    }
    //水箱放空提醒
    // if (experimentStatus == 1 && weight < 1) {
    //     //experimentStatus = 0; //切换为闲置状态
    //         document.getElementById("WarningResetFinished").style.visibility = "visible";
    //         document.getElementById("WarningResetFinished").style.opacity = "0.8";
    //         document.getElementById("WarningResetFinished").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
    //         document.getElementById("WarningResetFinished").style.zIndex = "1000";
    //         recordExpLog('水箱已放空');
    // }        
    //超重提示，水的质量高于24且出水阀状态是关，变频器是开是关无所谓。但有可能出水阀是开，变频器也是开的时候，也超重。
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
    //记录数据只有在刷新曲线过程中才能进行
    if (isDrawingGraph) { //  绘制曲线
        chartWeight.series[0].addPoint([time, Number(weight)], true, false);
        // chartWeight.series[1].addPoint([time, Number(inverter)], true, false);
        chartFlow.series[0].addPoint([time, Number(flowRate)], true, false);
        chartInverter.series[0].addPoint([time, Number(inverter)], true, false);
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
                console.log('表格记录是否正常:', inverter + weight + flowRate);
                var row = document.getElementById("tableDataRecord").insertRow();
                var cell;
                // cell = row.insertCell(-1);
                // cell.innerHTML = recordingIndex;
                // cell.align = "center";
                // recordingIndexTotal= recordingIndexTotal+recordingIndex;
                cell = row.insertCell(-1);
                cell.innerHTML = (((min < 10) ? "0" : "") + min + ":" + ((sec < 10) ? "0" : "") + sec);
                cell.align = "center";
                // timeTotal= timeTotal+(((min < 10) ? "0" : "") + min + ":" + ((sec < 10) ? "0" : "") + sec);

                cell = row.insertCell(-1);
                cell.innerHTML = inverter;
                cell.align = "center";

                cell = row.insertCell(-1);
                cell.innerHTML = weight;
                cell.align = "center";
                // weightTotal= weightTotal+weight;

                cell = row.insertCell(-1);
                cell.innerHTML = flowRate;
                cell.align = "center";
                // flowRateTotal= flowRateTotal+flowRate;

                document.getElementById("divDataTable").scrollTop = cell.offsetTop;
            }
        } else { recordIntervalCounter = recordInterval; }
    }
});
//     if(experimentStatus!==0 && tableid==device_id){
// }

// console.log('weightTotal的值',weightTotal);
// });


// socket.on("Message Pack", function (code, device_id) {
//     // if(experimentStatus == 1&& device_id==tableid){
//     if (experimentStatus == 1) {
//         if (code == "1") {
//             document.getElementById("WarningOverflow").style.visibility = "visible";
//             document.getElementById("WarningOverflow").style.opacity = "0.8";
//             document.getElementById("WarningOverflow").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//             document.getElementById("WarningOverflow").style.zIndex = "1000";
//             recordExpLog('错误:上储水箱溢出,电子秤超重');
//         }
//         if (code == "2") {
//             document.getElementById("WeightError").style.visibility = "visible";
//             document.getElementById("WeightError").style.opacity = "0.8";
//             document.getElementById("WeightError").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//             document.getElementById("WeightError").style.zIndex = "1000";
//             recordExpLog('错误:电子秤采集数据失败');
//         }
//         if (code == "3") {
//             document.getElementById("VortexError").style.visibility = "visible";
//             document.getElementById("VortexError").style.opacity = "0.8";
//             document.getElementById("VortexError").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//             document.getElementById("VortexError").style.zIndex = "1000";
//             recordExpLog('错误:涡街流量计采集数据失败');
//         }
//         if (code == "4") {
//             document.getElementById("LevelError").style.visibility = "visible";
//             document.getElementById("LevelError").style.opacity = "0.8";
//             document.getElementById("LevelError").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//             document.getElementById("LevelError").style.zIndex = "1000";
//             recordExpLog('错误:超声波液位计采集数据失败');
//         }
//         if (code == "5") {
//             document.getElementById("HeatError").style.visibility = "visible";
//             document.getElementById("HeatError").style.opacity = "0.8";
//             document.getElementById("HeatError").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//             document.getElementById("HeatError").style.zIndex = "1000";
//             recordExpLog('错误:超声波流量计(热能表)采集数据失败');
//         }
//         if (code == "6") {
//             document.getElementById("FreqError").style.visibility = "visible";
//             document.getElementById("FreqError").style.opacity = "0.8";
//             document.getElementById("FreqError").style.transition = "visibility 0s, opacity 0.2s ease-in-out";
//             document.getElementById("FreqError").style.zIndex = "1000";
//             recordExpLog('错误:变频器故障');
//         }
//     }
// });
//-----------------------------------punp controlling
//Pump controlling
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



// function buttonSet(){
// if(experimentStatus==0)
// {
//     //$("#sw1").attr('disabled',true);  
//     $("#sw2").attr('disabled',true);  
//     $("#sw3").attr('disabled',true);  
//     $("#sw4").attr('disabled',true);
//     $("#buttonResetExperiment").attr('disabled',true);  
//     $("#buttonStartRecord").attr('disabled',true);  
//     $("#buttonClearRecord").attr('disabled',true);  
//     $("#buttonPauseGraph").attr('disabled',true);  
//     $("#buttonEndExperiment").attr('disabled',true);  
// }
// else {
//     $("#sw1").attr('disabled',false);  
//     $("#sw2").attr('disabled',false);  
//     $("#sw3").attr('disabled',false);  
//     $("#sw4").attr('disabled',false);
//     $("#buttonResetExperiment").attr('disabled',false);  
//     $("#buttonStartRecord").attr('disabled',false);  
//     $("#buttonClearRecord").attr('disabled',false);  
//     $("#buttonPauseGraph").attr('disabled',false);  
//     $("#buttonEndExperiment").attr('disabled',false);  
// }
// }
//ping test


// socket.on('qqq', function() {
//     var latency = Date.now() - startTime;
   //console.log("Ping server test, latency=" + latency + "ms");
// });
