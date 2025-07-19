import { useContacts } from "@/context/ContactContext"
import { Search } from "lucide-react"
import ContactCard from "../Cards/ContactCard"
import { useUser } from "@/context/UserContext"
import { socket } from "@/socket/socket"
import { useConversation } from "@/context/ConversationContext"


const NewConversationModal = () => {

	const { contacts } = useContacts()
	const { user } = useUser()
	const {setSelectedConversation, conversations, setConversations} = useConversation()


	const handleNewConversation = async (contactId: string) => {
		if (contactId === user?._id) {
			return (
				alert("cannot create a conversation with yourself")
			)
		}
		socket.emit("new conversation", {
  		participants: [contactId, user?._id]
		});
		socket.on("conversation created", (data) => {
			const { conversation } = data;
			setSelectedConversation(conversation)
			setConversations([...conversations, conversation])
		})
		socket.on("newConversationError", (data) => {
			const {message}= data
			alert(`Error creating conversation ${message}`)
		})
	}

  return (
    <div className="absolute top-full mt-2 left-0 z-50   shadow-xl rounded bg-primary flex flex-col gap-2 p-2 animate-fadeIn">
      <div className="flex items-center bg-input rounded-lg">
				<div className="pl-3">
					<Search size={20} className="text-gray-500" />
				</div>
				<input
					type="search"
					placeholder="find contact"
					className="w-full p-2 rounded-lg focus:outline-none bg-input"
					/>
			</div>
			<div>
					{
					contacts.map((contact) => (
						<div
							key={contact._id}
							onClick={() => contact._id && handleNewConversation(contact._id)}
						>
							<ContactCard contact={contact} />
						</div>
					))
				}
			</div>
    </div>
  )
}

export default NewConversationModal