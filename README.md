# GLSL Node Editor

 GLSL node editor is a web-based editor for WebGL fragment shaders.
 It uses visual programming to model a work of shader, but you can always write your own node with the code you want.

## Shader Editor
Creates shaders using nodes

### How to create a new shader?
- Register an account, clicking on the button `Sign in`<br />
- Click on Projects button, click  `+ Create new project`<br />
- You can change a name and description of your project just with clicking and editing its data<br />

### How to use Shader Editor?
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
  - All nodes inputs are connected
- Programs should have an output, a colorOutput node
  
## Node Editor
Creates nodes using GLSL code

### How to create a new node?
- Register an account, clicking on the button `Sign in`<br />
- Click on Nodes button, click  `+ Create new node`<br />

### How to edit nodes name?
- Name of the node is defined by its name. `_` symbols will be replaced by `space`

### How to add custom uniforms?
You can add custom uniforms to your node. Just write them above the function like this
```glsl
// Uniforms you want to add
uniform vec3 colorBase;
uniform float transparency;
uniform int index;

// Your function
vec4 your_function(){
    if (index > 1) 
        return vec4(1.0);
    return vec4(colorBase, transparency);
}
```

## Built-in nodes
### Inputs:
- texCoord, texCoordX and texCoordY - position of pixel on screen from (0, 0) to (1, 1)
- time - float time in secods, 1s = 1.0
- mousePos - position of mouse cursor on screen, from (0, 0) to (1, 1)

### Outputs:
- outputColor - vec4, color of pixel, from (0, 0, 0, 0) to (1, 1, 1, 1), in RGBA format

### Math:
- sin - sin(value)
- pow - value to the power of power
- rand - random number for each position on screen
- noise - perlin noise
- avg - avarage between 4 floats
- multiplyff - float * float
- multiplyfv2 float * vec2
- multiplyfv4 float * vec4
- plus - float + float
- plusv2 - vec2 + vec2
- plusv4 - vec4 + vec4
- minus - float - float

### Conversions:
- vec2x - the first component of vec2
- vec2y - the second component of vec2
- vec4r - the first component of vec2, red channel of a color
- vec4g - the second component of vec2, green channel of a color
- vec4b - the third component of vec2, blue channel of a color
- vec4a - the fourth component of vec2, alpha channel of a color
- fromFloatV2 - vec2 from 2 floats, (x, y)
- fromFloatV4 - vec4 from 4 floats, (r, g, b, a)

### Constants:
- int - integer constant
- float - float constant
- vec2 - vec2 constant for position
- vec4 - vec4 constant for color

### Logic:
- multiplex - chooses between two floats, if the bool is true picks first, else second
- isBigger - a > b 

### Textures:
- textureN - gets a color from a texture with the position given

### Custom:
Nodes you added