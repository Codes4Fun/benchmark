
var svgns = "http://www.w3.org/2000/svg"

var svg = document.createElementNS(svgns, "svg")
svg.style.width = '100%'
svg.style.height = '100%'


function createSVGElement(type, attributes)
{
	var shape = document.createElementNS(svgns, type)
	for (a in attributes)
	{
		shape.setAttributeNS(null, a, attributes[a])
	}
	return shape
}


function svgStart()
{
	document.body.appendChild(svg);
	/*if (isFullScreen())
	{
		viewWidth = screen.width;
		viewHeight = screen.height;
		viewWidth = screen.width * devicePixelRatio;
		viewHeight = screen.height * devicePixelRatio;
		//svgDiv.requestFullScreen();
	}
	else*/
	{
		viewWidth = document.body.clientWidth;
		viewHeight = document.body.clientHeight;
	}
	svg.setAttribute('width', viewWidth);
	svg.setAttribute('height', viewHeight);
	//svg.style.width = document.body.clientWidth + 'px';
	//svg.style.height = document.body.clientHeight + 'px';
}

function svgEnd()
{
	document.body.removeChild(svg)
}

