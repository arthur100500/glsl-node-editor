import { Handle, Position } from 'reactflow';

import './UsualNode.css';

const handleStyle = (pos) => { return { top: pos } };
const handleLabelStyle = (pos) => { return { top: pos, position: 'absolute', left: 10 } };
const isValidConnection = (connection) => {
    let target = document.querySelector('[data-nodeid="' + connection.target + '"]');
    let source = document.querySelector('[data-handleid="' + connection.sourceHandle + '"]');
    return target.attributes.data_type.value === source.attributes.data_type.value;
};

function UsualNode({ data }) {
    let iter = 1;
    let height = data.inputs.length * 20 + 30;
    if (data.inputs.length === 0)
        height = 50;
    return (
        <div className="usual-node" style={{ height: height }}>
            <meta className='node-code' id={'node'+data.id+'code'}></meta>
            <span className="node-title">{data.title}</span>

            {data.type !== "void" &&
                <>
                    <Handle type="target" position={Position.Right}
                        isValidConnection={isValidConnection}
                        data_type={data.type} />
                    <span className="node-output" key={"output-span"} style={{ top: height / 2 - 6.25, position: "absolute", right: "10px" }}>
                        {"(" + data.type + ")"}
                    </span>
                </>
            }

            {data.inputs.map(param => {
                iter += 1;
                return <>
                    <Handle type="source" key={"input" + (iter)}
                        position={Position.Left}
                        id={data.id + "input" + (iter)}
                        style={handleStyle(iter * 20)}
                        data_type={param.type}
                        isValidConnection={isValidConnection}
                    />
                    <span className="node-input" key={"input-span" + (iter)} style={handleLabelStyle(iter * 20 - 12.5)}>{param.name + " (" + param.type + ")"}</span>
                </>
            })}
        </div>
    );
}

export default UsualNode;
