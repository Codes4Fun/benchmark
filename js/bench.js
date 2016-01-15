function State()
{
	var controller = false
	var awake = true
	this.isController = function () { return controller }
	this.isSleeping = function () { return !awake }
	this.wake = function () { awake = true }
	this.sleep = function ()
	{
		this.setActive(false)
		awake = false
	}
	this.setActive = function (active)
	{
		if (active)
		{
			this.wake()
			controller = true
		}
		else
		{
			controller = false
		}
	}
}

function processStates(states)
{
	var needController = true
	for (var i = 0; i < states.length; i++)
	{
		var state = states[i]
		if (state.isSleeping())
		{
			continue
		}
		if (!state.process())
		{
			states.splice(i, 1)
			i--
		}
		else if (state.isController())
		{
			needController = false
		}
	}
	if (states.length == 0)
	{
		return false
	}
	if (needController)
	{
		//console.log(states[0].constructor.name)
		states[0].activate()
		for (var i = 1; i < states.length; i++)
		{
			states[i].wake()
		}
	}
	return true
}

function runBench(bench, totalFrames)
{
	bench.start()

	var states = []
	var results = []

	var complexity = 0
	var nextComplexity = 0
	var maxComplexity = bench.getMaxComplexity();

	function FindState(realTargetMs, lower, upper)
	{
		State.call(this)

		//console.log('FindState('+realTargetMs+','+lower+','+upper+')')
		var targetMs = Math.ceil(realTargetMs)

		this.activate = function ()
		{
			//console.log('find ' + lower + ' ' + upper)
			this.setActive(true)
			nextComplexity = (upper + lower) / 2
		}

		this.process = function ()
		{
			// if complexity is out of bounds, sleep until we become active
			if (complexity < lower || complexity > upper)
			{
				this.sleep()
				return true
			}
			// update bounds
			if (timeMs <= targetMs)
			{
				lower = complexity
			}
			else
			{
				upper = complexity
			}
			// check bounds
			var delta = upper - lower
			if (delta < 2)
			{
				results.push({fps : 1000/realTargetMs, complexity : lower})
				return false
			}
			else if (this.isController())
			{
				nextComplexity = Math.trunc(delta / 2) + lower
			}
			return true
		}
	}

	function RampState(realTargetMs)
	{
		State.call(this)

		//console.log('RampState('+realTargetMs+')')
		var targetMs = Math.ceil(realTargetMs)

		var prevComplexity = complexity
		var prevMs = timeMs

		this.activate = function ()
		{
			this.setActive(true)
			nextComplexity = complexity * 2
			//console.log(complexity)
		}

		this.process = function ()
		{
			// if we have been bounded
			if (prevMs <= targetMs && targetMs < timeMs)
			{
				//console.log('bounded!')
				// check size of bounds
				var delta = complexity - prevComplexity
				if (delta < 2)
				{
					// we found our target
					results.push({fps : 1000/realTargetMs, complexity : prevComplexity})
				}
				else
				{
					// too large, needs refinement
					var state = new FindState(realTargetMs, prevComplexity, complexity)
					state.sleep()
					states.push(state)
				}
				return false
			}
			if (complexity == maxComplexity)
			{
				return false
			}
			prevMs = timeMs
			prevComplexity = complexity
			if (this.isController())
			{
				nextComplexity = complexity * 2
				if (nextComplexity > maxComplexity)
				{
					nextComplexity = maxComplexity;
				}
			}
			return true
		}
	}

	function InitialState()
	{
		State.call(this)
		
		this.activate = function ()
		{
			this.setActive(true)
			nextComplexity = 1
		}

		this.process = function ()
		{
			if (!this.isController())
			{
				return true
			}
			if (timeMs < 34)
			{
				states.push(new RampState(1000/30))
			}
			if (timeMs < 17)
			{
				states.push(new RampState(1000/60))
			}
			if (timeMs <= 16)
			{
				states.push(new RampState(timeMs))
			}
			return false
		}
	}

	states.push(new InitialState())

	var frame = 0
	var subframe
	var startT

	function simloop(t)
	{
		subframe = frame % totalFrames
		if (subframe == 0)
		{
			timeMs = (t - startT) / (totalFrames-1)
			console.log(timeMs)
			//timeMs = (complexity == maxComplexity)? 17.67 : 16.6;
			/*if (complexity > 2000)
			{
				timeMs = 1000/15
			}
			else if (complexity > 1000)
			{
				timeMs = 1000/30
			}
			else if (complexity > 500)
			{
				timeMs = 1000/60
			}
			else
			{
				timeMs = 1000/120
			}*/
			//console.log(complexity + '  ' + timeMs.toFixed(2))
			if (!processStates(states))
			{
				var text = ''
				if (!results.length)
				{
					results.push({fps : (1000/timeMs), complexity : maxComplexity})
				}
				for (var i = 0; i < results.length; i++)
				{
					text += results[i].fps.toFixed(2) + ' fps = ' + results[i].complexity + '<br>'
				}
				bench.end(results)
				output.innerHTML = text
				dialog.style.display="block"
				return
			}
			complexity = nextComplexity
			//console.log(complexity)
			bench.updateComplexity(complexity)
		}
		else if (subframe == 1)
		{
			startT = t
		}

		frame++

		bench.updateFrame(frame)

		requestAnimationFrame(simloop);
	}

	requestAnimationFrame(simloop);

	dialog.style.display="none"
}
