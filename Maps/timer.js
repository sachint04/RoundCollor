
var startTimer = function(){
	if(timeInrvl){
		clearTimer();
	}
	timeInrvl = setInterval(timerHandler, 1000);	
}
var clearTimer = function(){
	var $timer = $("#time");
	$time.addClass('hide');
	clearInterval(timeInrvl)
	timeInrvl = null;
}
var timerHandler = function(){
	$time = $('#time');
	$time.removeClass('hide');
	$time.html(curTime);
	curTime++;
	$time.css({
    "width": "60px",
    "height": "60px",
    "border-radius": "60px",
		"font-size": "50px",
		"top": "260px",
		"left": "50px",
		"opacity":0

});
	$time.animate({
		"width":"30px",
		"height":"30px",
		"border-radius":"30px",
		"opacity":1,
		"top": "312px",
		"left": "50px",
		"font-size": "30px"
	}, 500);
	if(curTime > maxTime){
		$time.finish();
		clearTimer();
	};	
};