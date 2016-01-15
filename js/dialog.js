var devicePixelRatio = (window.devicePixelRatio || 1);
var dialogScale = (devicePixelRatio - 1) * 0.5 + 1;


if (!document.body.requestFullScreen)
{
	if (document.body.webkitRequestFullScreen)
	{
		document.body.requestFullScreen = document.body.webkitRequestFullScreen;
	}
	else if (document.body.mozRequestFullScreen)
	{
		document.body.requestFullScreen = document.body.mozRequestFullScreen;
	}
	else
	{
		//fullScreenCheck.checked = false;
		//fullScreenOptionDiv.style.display = 'none';
	}
}

function isFullScreen ()
{
	var element = document.body;
	return (document.fullScreenElement == element
	 || document.webkitFullscreenElement == element
	 || document.mozFullScreenElement == element);
}

var dialog = document.createElement('div')
dialog.style.cssText = 'position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(' + dialogScale + '); border: 1px solid lightgrey; border-radius: 5px; padding: 8px'

var complexityDiv = document.createElement('div');
complexityDiv.style.display = 'none';
complexityDiv.textContent = 'complexity : ';
var complexityInput = document.createElement('input');
complexityInput.type = 'text';
complexityInput.style.width = '7em';
complexityDiv.appendChild(complexityInput);
dialog.appendChild(complexityDiv);

var fullScreenOptionDiv = document.createElement('div');
fullScreenOptionDiv.style.display = 'none';
fullScreenOptionDiv.textContent = 'full screen';
var fullScreenCheck = document.createElement('input');
fullScreenCheck.type = 'checkbox';
fullScreenCheck.checked = true;
fullScreenOptionDiv.appendChild(fullScreenCheck);
dialog.appendChild(fullScreenOptionDiv);

var output = document.createElement('div')
dialog.appendChild(output)

dialog.createButton = function(label, action)
{
	var button = document.createElement('button')
	button.textContent=label
	button.onclick=action
	this.appendChild(button)
}
dialog.createButton('Start', function (){start()})
dialog.createButton('Full Screen', function () {document.body.requestFullScreen()})
dialog.createButton('Back', function (){history.back()})

document.body.appendChild(dialog)

function loadSettings()
{
	var item = location.href.substr(location.href.lastIndexOf('/') + 1);
	var settings = localStorage.getItem(item);
	if (settings)
	{
		settings = JSON.parse(settings);
		if (settings.complexity)
		{
			complexityInput.value = settings.complexity;
		}
		if (settings.fullScreen)
		{
			fullScreenCheck.checked = settings.fullScreen;
		}
		output.innerHTML = settings.output;
	}
}

function saveSettings()
{
	var item = location.href.substr(location.href.lastIndexOf('/') + 1);
	var settings = { version : 1.0 };
	if (complexityDiv.style.display != 'none')
	{
		settings.complexity = complexityInput.value;
	}
	if (fullScreenOptionDiv.style.display != 'none')
	{
		settings.fullScreen = fullScreenCheck.checked;
	}
	settings.output = output.innerHTML;
	localStorage.setItem(item, JSON.stringify(settings));
}
