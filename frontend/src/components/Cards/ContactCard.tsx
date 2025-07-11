import { useUser } from "@/context/UserContext"
import { User } from "@/interfaces/User"
import { MessageSquare } from "lucide-react"
import { socket } from "@/socket/socket"

interface CardProps {
	contact: Partial<User>,
}

const ContactCard: React.FC<CardProps> = ({ contact }) => {
	const {user}= useUser()
	
	if (!user) return null
	


	const handleNewConversation = async (contactId: string) => {
	if (!contact) {
		alert("Contact is mandatory")
		return
	}
	socket.emit("new conversation", {
  	participants: [contactId, user._id]
	});
}
	

	return (
	<div className="flex h-[72px] mt-auto transition-colors rounded-lg" >
		<div className="flex items-center px-4" onClick={() => handleNewConversation(contact._id!)}>
			<MessageSquare size={48} className="text-gray-600" />
		</div>
		<div className="flex w-[85%] flex-col">
			<div className="flex flex-col w-[100%] justify-between p-3">
				<h2 className="text-lg font-semibold text-important">{contact.name }</h2>
				<div className="flex justify-between items-center">
					<small className="text-plain">{contact.email || 'Sin email'}</small>
				</div>
			</div>
		</div>
	</div>

	)
}

export default ContactCard
