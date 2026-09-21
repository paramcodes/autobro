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
  NodeTypes,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
} from "@xyflow/react"

import { StepNode } from "./step-node"
import { StepNodeType } from "../nodes/node-registry"

const nodeTypes: NodeTypes = { step: StepNode }

const initialNodes: StepNodeType[] = [
  {
    id: "start",
    type: "step",
    position: { x: 0, y: 0 },
    data: { type: "start", kind: "trigger", title: "Start", values: {} },
  },
]

const initialEdges: Edge[] = []

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
        nodeTypes={nodeTypes}
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
