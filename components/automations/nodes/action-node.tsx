import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Mail, Database, MessageSquare, Globe, CreditCard } from "lucide-react"

export const ActionNode = memo(({ data, isConnectable }: NodeProps) => {
  const getIcon = () => {
    switch (data.icon) {
      case "email":
        return <Mail className="h-5 w-5 text-green-500" />
      case "database":
        return <Database className="h-5 w-5 text-indigo-500" />
      case "slack":
        return <MessageSquare className="h-5 w-5 text-pink-500" />
      case "http":
        return <Globe className="h-5 w-5 text-cyan-500" />
      case "stripe":
        return <CreditCard className="h-5 w-5 text-purple-500" />
      default:
        return <Mail className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 w-48">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-green-100">{getIcon()}</div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.description}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id="b"
        style={{ background: "#48bb78", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: "#48bb78", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  )
})

ActionNode.displayName = "ActionNode"

