import { stratify, tree } from 'd3-hierarchy';
import React, { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { initialEdges, initialNodes } from './nodes-edges';

const g = tree();

const getLayoutedElements = (nodes: string | any[], edges: any[], options: { direction: any; }) => {
  if (nodes.length === 0) return { nodes, edges };

  const element = document.querySelector(`[data-id="${nodes[0].id}"]`);
  if (!element) return { nodes, edges };

  const { width, height } = element.getBoundingClientRect();
  const hierarchy = stratify()
    .id((node: any) => node.id)
    .parentId((node: any) => edges.find((edge) => edge.target === node.id)?.source);
  const root = hierarchy(Array.isArray(nodes) ? nodes : [nodes]);
  const layout = g.nodeSize([width * 2, height * 4])(root);

  return {
    nodes: layout
      .descendants()
      .map((node) => ({ ...(node.data as object), position: { x: node.x, y: node.y } })),
    edges,
  };
};


const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onLayout = useCallback(
    (direction: any) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, {
        direction,
      });

      setNodes(Array.isArray(layoutedNodes) ? layoutedNodes : []);
      setEdges([...layoutedEdges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );

  return (
    <div style={{width: '100vw', height: '100vh', background: "#808080"}}>

    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-left">
        <button onClick={onLayout}>layout</button>
      </Panel>
    </ReactFlow>
    </div>
  );
};

function App() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}

export default App;
