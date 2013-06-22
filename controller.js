/*
 * Controller Part
 * SWM Project, all right reserved
 */


function isDesktop() {
	var filter="win16|win32|win64|mac|macintel";
	if (navigator.platform) {
		if (filter.indexOf(navigator.platform.toLowerCase())<0) {
			return false;
		} else {
			return true;
		}
	}
}

// 추가적으로 지원할 내역
// 1. 옵션이 없을때는 css 값 자체를 만들지 않도록 하기 (별도의 function이 필요하다고 생각됨)
// 2. display, opacity 옵션 지원 추가
// 3. Trigger 옵션 추가
// - id / targetid / attr / val로 처리하기.
// - targetid는 공백으로 나뉠 수 있으며, 각각에 대해서 별개로 옵션을 처리하도록 한다.

function writeCSSAttr(name, val) {
	if (val == null) {
		return " ";
	} else {
		return " " + name + ":" + val + "; ";
	}
}

function writeDisplayAttr(val) {
	if (val == null) {
		return " ";
	} else {
		if (val == "false") {
			return writeCSSAttr("display", "none");
		} else {
			return writeCSSAttr("display", "block");
		}
	}
}

function writePxAttr(name, val) {
	if (val == null) {
		return " ";
	} else {
		return writeCSSAttr(name, val*w_ratio+"px");
	}
}

function writeBgAttr(val) {
	if (val == null) {
		return " ";
	} else {
		return writeCSSAttr("background", "url(./controller/" + val + ") no-repeat 0 0; -webkit-background-size: 100% auto; -moz-background-size: 100% auto; -o-background-size: 100% auto; background-size: 100% auto");
	}
		
}

function loadLayout(name) {
	hideController();
	mode_loading(true);
	
	var url = "./controller/"+name+".xml";
	$.get(url, function(data) {
		var controller = $(data).find("ControllerLayout");
		if (controller.length == 0) {
			alert("Invalid Layout");
			return;
		} else {
			clearController();
			if (controller.attr("background")!=null) {
				$("#controller").css("-webkit-background-size", "100% auto");
				$("#controller").css("-moz-background-size", "100% auto");
				$("#controller").css("-o-background-size", "100% auto");
				$("#controller").css("background-size", "100% auto");
				$("#controller").css("background","url(./controller/"+controller.attr("background")+") no-repeat 0 0");
			}
			
			controller.find("TextView").each(function() {
				// create label
				var html = "<div class='bg_100' id='" + $(this).attr("id") + "' style='position:absolute; display:flex;" + writePxAttr("left", $(this).attr("x")) + writePxAttr("top", $(this).attr("y")) + writePxAttr("width", $(this).attr("width")) + writePxAttr("height", $(this).attr("height")) + writeCSSAttr("opacity", $(this).attr("opacity")) + writeDisplayAttr($(this).attr("display")) + writeBgAttr($(this).attr("background")) + "text-align:center; align-self: center;'>" + $(this).attr("text") + "</div>";
				$("#controller").append(html);
				
				if ($(this).attr("visible") == "hide") {
					$("#"+$(this).attr("id")).hide();
				}
			});
			
			controller.find("Button").each(function() {
				var attr_press=""
				var attr_sound=""
				if ($(this).attr("pressed")) {
					attr_press = $(this).attr("pressed");
				}
				if ($(this).attr("sound")) {
					attr_sound = $(this).attr("sound");
				}
													
				// create button
				// ontouchenter='cont_over(this)' ontouchend='cont_out(this)'  ontouchcancel='cont_out(this)'  onmousedown='cont_over(this);' onmouseup='cont_out(this);'
				var html = "<div class='bg_100' id='" + $(this).attr("id") + "' press='" + attr_press + "' sound='" + attr_sound +
				"' style='position:absolute; display:flex;" + writePxAttr("left", $(this).attr("x")) + writePxAttr("top", $(this).attr("y")) + writePxAttr("width", $(this).attr("width")) + writePxAttr("height", $(this).attr("height")) + writeBgAttr($(this).attr("background")) + writeCSSAttr("opacity", $(this).attr("opacity")) + writeDisplayAttr($(this).attr("display")) + "text-align:center; align-self: center;'>" + $(this).attr("text") + "</div>";
				$("#controller").append(html);
				
				$("#" + $(this).attr("id")).bind("touchstart mousedown", function(e) {
					e.preventDefault();
					cont_over($(this));
				});
				$("#" + $(this).attr("id")).bind("touchend mouseup", function(e) {
					e.preventDefault();
					cont_out($(this));
				});
				
				
				if ($(this).attr("visible") == "hide") {
					$("#"+$(this).attr("id")).hide();
				}
			});
			
			/* Animation part */
			controller.find("Animation").each(function() {
				var id = $(this).attr("id");
				var val = $(this).attr("val");
				var time = $(this).attr("time");
				
				if ($(this).attr("attr") == "x") {
					setTimeout(function() {
						$("#" + id).animate({
							'left':val
							}, {duration: time});
					}, $(this).attr("delay"));
				}
				if ($(this).attr("attr") == "y") {
					setTimeout(function() {
						$("#" + id).animate({
							'top':val
							}, {duration: time});
					}, $(this).attr("delay"));
				}
				if ($(this).attr("attr") == "o") {
					setTimeout(function() {
						$("#" + id).animate({
							'opacity':val
							}, {duration: time});
					}, $(this).attr("delay"));
				}
			});
			
			/* Trigger part */
			controller.find("Trigger").each(function() {
				var id = $(this).attr("id")
				var targets = $(this).attr("targetid").split(" ");
				var attr = $(this).attr("attr");
				var val = $(this).attr("val");
				
				if (attr == "display") {
					$("#"+id).bind("touchstart mousedown", function(e) {
						e.preventDefault();
						if (val == "false") {
							for(i=0; i<targets.length; i++) {
								$("#"+targets[i]).hide();
							}
						} else if (val == "true") {
							for(i=0; i<targets.length; i++) {
								$("#"+targets[i]).show();
							}
						}
					});
				}
			});
		}
		
		mode_loading(false);
		showController();
	});
}

function showController() {
	// slide left with transparency
	$('#controller').css('left', w_size+'px');
	$('#controller').fadeIn('fast').animate({
            'left':0
            }, {duration: 'slow', queue: false});
}

function hideController() {
	// just hide
	$('#controller').hide();
}

function clearController() {
	// html nonde
	$('#controller').html("");
}
