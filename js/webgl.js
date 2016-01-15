var canvas = document.createElement('canvas')
var gl = canvas.getContext('webgl')

canvas.style.width = '100%';
canvas.style.height = '100%';

function webglStart()
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

function webglEnd()
{
	document.body.removeChild(canvas)
}

function createShaderProgram(vsSrc, fsSrc, attributes, uniforms)
{
	// create vertex shader
	var vs = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vsSrc);
	gl.compileShader(vs)
	if (gl.getShaderParameter(vs, gl.COMPILE_STATUS))
	{
		console.log('vertex shader compiled successfully');
	}
	else
	{
		console.log(gl.getShaderInfoLog(vs));
	}

	// create fragment shader
	var fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, fsSrc);
	gl.compileShader(fs);
	if (gl.getShaderParameter(fs, gl.COMPILE_STATUS))
	{
		console.log('fragment shader compiled successfully');
	}
	else
	{
		console.log(gl.getShaderInfoLog(fs));
	}

	// create the shader program
	var sp = gl.createProgram();
	gl.attachShader(sp, vs);
	gl.attachShader(sp, fs);
	gl.linkProgram(sp);
	if (gl.getProgramParameter(sp, gl.LINK_STATUS))
	{
		console.log('program linked successfully');
	}
	else
	{
		console.log(gl.getProgramInfoLog(sp));
	}

	var program = { sp : sp, a : {}, u : {} }

	for (var i = 0; i < attributes.length; i++)
	{
		var a = attributes[i]
		program.a[a] = gl.getAttribLocation(sp, a)
	}

	for (var i = 0; i < uniforms.length; i++)
	{
		var u = uniforms[i]
		program.u[u] = gl.getUniformLocation(sp, u)
	}

	return program
}

function loadTexture(src)
{
	var texture = gl.createTexture()
	var img = document.createElement('img');
	img.onload = function ()
	{
		console.log(src + ' loaded');

		// create texture from image
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	};
	img.src = src
	return texture
}

function newMatrix()
{
	var matrix = new Float32Array(16)
	matrix[0] = matrix[5] = matrix[10] = matrix[15] = 1
	return matrix
}
