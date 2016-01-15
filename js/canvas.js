
var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')

canvas.style.width = '100%';
canvas.style.height = '100%';

function canvasStart()
{
	document.body.appendChild(canvas);
	if (isFullScreen())
	{
		viewWidth = screen.width * devicePixelRatio;
		viewHeight = screen.height * devicePixelRatio;
	}
	else
	{
		viewWidth = document.body.clientWidth;
		viewHeight = document.body.clientHeight;
	}
	canvas.width = viewWidth;
	canvas.height = viewHeight;
}

function canvasEnd()
{
	document.body.removeChild(canvas)
}
