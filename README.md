# GLSL Node Editor

 GLSL node editor is a web-based editor for WebGL fragment shaders.
 It uses visual programming to model a work of shader, but you can always write your own node with the code you want.

## Shader Editor
### How to create a new shader?
- Register an account, clicking on the button "Sign in"<br />
- Click on Projects button, click  `+ Create new project`<br />
- You can change a name and description of your project just with clicking and editing its data<br />

### How to use Shader Editor
- To move around, use mouse, scroll to zoom in/out
- To place a node, right click and choose one from the list that drops
- To move a specific, drag its header
- To connect nodes, click on one anchor and click on the other, starting from input to output
  -  Alternatively, you can just click once, drag and drop onto the other node output
- To see the output and see if shader is correct, press the `Compile` button
- To save the project, press the `Save Project` button, changes you have made will not change automatically
- To download the shader text, press the `Save as Shader` button

### Program correctness
- As all inputs are typed, you are unlikely to have an issue if:
  - You have an output
  - All nodes inputs are connected
- Programs should have an output, a colorOutput node
  
## Node Editor
WIP
