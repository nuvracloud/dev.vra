import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Webhook, Clock, Mail, Users } from "lucide-react"

export const TriggerNode = memo(({ data, isConnectable }: NodeProps) => {
  const getIcon = () => {
    switch (data.icon) {
      case "webhook":
        return <Webhook className="h-5 w-5 text-blue-500" />
      case "schedule":
        return <Clock className="h-5 w-5 text-green-500" />
      case "email":
        return <Mail className="h-5 w-5 text-purple-500" />
      case "crm":
        return <Users className="h-5 w-5 text-orange-500" />
      default:
        return <Webhook className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 w-48">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-100">{getIcon()}</div>
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">{data.description}</div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ background: "#4299e1", width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </div>
  )
})

TriggerNode.displayName = "TriggerNode"

