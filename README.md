
# benchmark framework

This is a demo of a benchmark framework, it can be seen here:

http://codes4fun.github.io/benchmark/swirlingcircles/

## current design

The current concept is that the framework adds and removes complexity and tries to find where framerates are stable at 30, 60, and max.

It uses a state machine with the following nodes:

* InitialState - sets complexity to 1 and looks at framerate and creates ramping states.
* RampState - doubles complexity each iteration until it passes a target framerate, then it creates a find state with the two complexities that cross the target.
* FindState - searches between two ranges for the complexity that is at a target framerate.

If your framerate is high enough, you will have simultanious RampStates and FindStates for 30 and 60 and the maximum fps.

I believe that makes this state machine an NFA (nondeterministic finite automaton):

http://www.gamedev.net/page/resources/_/technical/general-programming/finite-state-machines-and-regular-expressions-r3176

## problems with this design

On mobile devices framerates always seem to be unstable, and it is too sensitive, and so results can vary by a lot.

## future design ideas

Ignore framerate spikes.

Rather than searching for stable frame rates, generate a curve/graph of the relationship between complexity and framerate, and have width of min-max for framerate.
Display these graphs, overlayed with a legend, to compare different techniques.
