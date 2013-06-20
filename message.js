/*
 * Message Part
 * SWM Project, all right reserved
 */
 
var _debug = true;
function debug(str) {
	if (_debug) {
		_alarm(str, "#FFFF66");
	}
}

var timer_alarm;
var timer_alarm_count=0;
var timer_remove_count=0;
function alarm(str) {
	_alarm(str, "#FFFFFF");
}
function badalarm(str) {
	_alarm(str, "#FF6666");
}
function _alarm(str, clr) {
	// 알림 메시지를 띄우고 삭제시키는 메서드입니다.
	$("#message").show();
	clearTimeout(timer_alarm);
	timer_alarm = setTimeout(function() {
		$("#message").fadeOut("fast");
	}, 3000);
	
	// append message
	$("#message").append("<p id=alarm" + timer_alarm_count + " style='color:" + clr + ";'>" + str + "</p>");
	timer_alarm_count += 1;
	setTimeout(function() {
		$("#alarm"+timer_remove_count).remove();
		timer_remove_count += 1;
	}, 5000);
}