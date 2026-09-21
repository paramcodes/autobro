"use client"

import { useCallback, useState } from "react"
import { useTheme } from "next-themes"
import {
  ReactFlow,
  Background,
  Controls,
  ConnectionLineType,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from "@xyflow/react"
import type {
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react"

const initialNodes: Node[] = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: { label: "Node 1" },
    type: "input",
  },
  {
    id: "n2",
    position: { x: 0, y: 100 },
    data: { label: "Node 2" },
  },
]

const initialEdges: Edge[] = [{ id: "n1-n2", source: "n1", target: "n2" }]

export function WorkflowCanvas() {
  const { resolvedTheme } = useTheme()
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((snapshot) => applyNodeChanges(changes, snapshot)),
    [],
  )
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((snapshot) => applyEdgeChanges(changes, snapshot)),
    [],
  )
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((snapshot) => addEdge(params, snapshot)),
    [],
  )

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={resolvedTheme === "dark" ? "dark" : "light"}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        connectionLineStyle={{ stroke: "var(--border)" }}
        defaultEdgeOptions={{
          type: "smoothstep",
          style: { stroke: "var(--border)" },
        }}
        style={
          {
            "--xy-background-color": "var(--background)",
            "--xy-edge-stroke-width": 2,
            "--xy-connectionline-stroke-width": 2,
          } as React.CSSProperties
        }
        maxZoom={1}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
