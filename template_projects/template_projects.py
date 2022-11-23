NODE_TEMPLATE = """
// Welcome to node creator!
// You can write a function that will become a node, use GLSL syntax for that
// To check if the function you wrote can be compiled and see the output,
// press Compile button.

// You can add custom attributes and uniforms above

// Here is a sample GLSL program
float _sin_x_2(float value){
    return sin(2. * value);
}
"""

PROJECT_TEMPLATE = """[{"name":"texCoord_","code":"vec2 texCoord_(){\n\treturn texCoord;\n}","id":1,
"additionElements":["varying vec2 texCoord;"],"parameters":[],"positionX":120,"positionY":255,"width":200,
"height":70, "inputs": [], "parameters": [], "output": {"type":"vec2","name":"result","id":0}}, {"name":"_texture_4",
"code":"vec4 _texture_4(vec2 coord){\n\treturn texture2D(img4, coord);\n}","id":2,"additionElements":["uniform 
sampler2D img4;"],"parameters":[],"positionX":372,"positionY":342,"width":200,"height":100, "inputs": [{
"type":"vec2","name":"coord","id":0, "connectedSource": "node1output0"}], "parameters": [], "output": {"type":"vec4",
"name":"result","id":0}}, {"name":"colorOutput","code":"void colorOutput(vec4 color){\n\tgl_FragColor = color;\n}",
"id":3,"additionElements":[],"parameters":[],"positionX":640,"positionY":461,"width":200,"height":50, "inputs": [{
"type":"vec4","name":"color","id":0, "connectedSource": "node2output0"}], "parameters": [], "output": {"type":"void",
"name":"result","id":0}}] """