import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Filter, GitBranch, Clock, List } from "lucide-react"

export const FilterNode = memo(({ data, isConnectable }: NodeProps) => {
  const getIcon = () => {
    switch (data.icon) {
      case "filter":
        return <Filter className="h-5 w-5 text-amber-500" />
      case "router":
        return <GitBranch className="h-5 w-5 text-red-500" />
      case "delay":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "iterator":
        return <List className="h-5 w-5 text-purple-500" />
      default:
        return <Filter className="h-5 w-5 text-amber-500" />
    }
  }

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-amber-500 w-48">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-amber-100">{getIcon()}</div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.description}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="b"
        style={{ background: "#d69e2e", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: "#d69e2e", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  )
})

FilterNode.displayName = "FilterNode"

