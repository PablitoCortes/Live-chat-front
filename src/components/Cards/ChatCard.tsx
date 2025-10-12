import { useConversation } from "@/context/ConversationContext"
import { useUser } from "@/context/UserContext"
import { Conversation } from "@/interfaces/Conversation"
import ChatCardSkeleton from "@/ux/components/ChatCardSkeleton"
import { MessageSquare } from "lucide-react"

interface ChatCardProps{
	conversation: Conversation,
}

const ChatCard: React.FC<ChatCardProps> = ({ conversation}) => {
	
	const { setSelectedConversation } = useConversation()
	const {user,loading } = useUser()

const handleActiveConversation = async (conversation: Conversation) => {
  try {
		await setSelectedConversation(conversation);
  } catch (err) {
    console.error("Error al seleccionar la conversación:", err);
  }
};

	if (loading) {
		return (
			<ChatCardSkeleton/>
		)
	}

	const lastMessageTimeStamp = conversation.lastMessage?.timestamp
	const otherParticipant = conversation.participants.find(participant =>participant._id?.toString() !== user?._id?.toString())
	return (
		<div onClick={() => handleActiveConversation(conversation)} className="flex h-[72px] mt-auto transition-colors rounded-lg hover:bg-gray-800">
			<div className="flex items-center px-4">
				<MessageSquare size={48} className="text-gray-600" />
			</div>
			<div className="flex w-[85%] flex-col">
				<div className="flex flex-col w-[100%] justify-between p-3">
					<h2 className="text-lg font-semibold text-important">
						{otherParticipant?.name}
					</h2>
					<div>
						<small className="text-plain truncate w-[50px]">{conversation.lastMessage?.content}</small>
						<small>{ lastMessageTimeStamp ? lastMessageTimeStamp.toLocaleString() : "" }</small>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChatCard