import { useCallback, useState, useRef } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
} from 'reactflow';
// 👇 you need to import the reactflow styles
import 'reactflow/dist/style.css';
import './Editor.css';
import UsualNode from '../nodes/UsualNode/UsualNode';
import NodeFactory from '../nodes/NodeFactory';
import getProjectJson from '../api/getProjectJson';
import DebugSection from './DebugSection';
import Header from '../Header/Header';
import EditorToolbar from './EditorToolbar';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import ContextMenu from './ContextMenu';

const nodeTypes = { usual: UsualNode };
const debug_input = getProjectJson();
const initialNodes = [...NodeFactory.manyFromJson(debug_input)];
const initialEdges = [];


export default function Editor() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback(
        (connection) => { setEdges((eds) => addEdge(connection, eds)) },
        [setEdges]
    );
    const [sizes, setSizes] = useState([
        100,
        '30%',
        'auto',
    ]);
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance,] = useState(null);
    const onNodeAdd = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            const newNode = NodeFactory.fromCode();

            newNode.position = position;

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance]
    );

    console.log(onNodeAdd);
    const layoutCSS = {
        height: '100%'
    };

    return (
        <>
            <ContextMenu />
            <Header />
            <EditorToolbar />
            <div className='page-layout'>
                <SplitPane
                    split='vertical'
                    sizes={sizes}
                    onChange={setSizes}
                >
                    <div style={layoutCSS}>
                        <Pane minSize={50} maxSize='50%'>
                            <DebugSection />
                        </Pane>
                    </div>
                    <div className="editor">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                        >
                            <MiniMap />
                            <Controls />
                            <Background />
                        </ReactFlow>
                    </div>
                </SplitPane>
            </div>
        </>
    );
}