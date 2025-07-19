"use client"
import { MessageCirclePlus, Search, UserPlus } from "lucide-react"
import ContactCard from "../Cards/ContactCard";
import ChatCard from "../Cards/ChatCard";
import { useUser } from "@/context/UserContext";
import AsideSkeleton from "@/ux/components/AsideSkeleton";
import { useConversation } from "@/context/ConversationContext";
import { useContacts } from "@/context/ContactContext";
import { useState } from "react";
import NewConversationModal from "../NewConversationModal/NewConversationModal";

export enum AsideVariant {
	Chat = "chat",
	Contact = "contact"
}
interface AsideProps {
	variant: AsideVariant
}

const Aside: React.FC<AsideProps> = ({ variant }) => {

	const { loading: userLoading } = useUser()
	const { contacts, isLoading: contactsLoading } = useContacts()
	const { conversations, isConversationLoading } = useConversation()
	const [isContactModal, setIsContactModal] = useState(false)

	const handleContactModal = (e: React.MouseEvent) => {
		e.preventDefault()
		setIsContactModal(!isContactModal)
	}
	if (userLoading || (variant === AsideVariant.Contact && contactsLoading) || (variant === AsideVariant.Chat && isConversationLoading)) {
		return <AsideSkeleton />
	}
	if (variant === AsideVariant.Contact) {
		return (
			<div className="min-w-[25%] md:min-w-[465px] flex justify-center bg-primary">
				<aside className="w-[90%] flex flex-col min-h-[100%]">
					<div className="p-4 min-h-[8%] ">
						<header className="flex justify-between items-center ">
							<span className="font-bold text-2xl">Live-Chat</span>
							<button className="flex justify-center items-center">
								<UserPlus size={29} />
							</button>
						</header>
					</div>
					<div className="px-4 mb-4">
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
					</div>
					<div className="overflow-y-auto px-4 flex flex-col gap-4">
						{contacts.map((cont) => (
							<ContactCard key={cont._id} contact={cont} />
						))}
					</div>
				</aside>
			</div>
		)
	}
	return (
		<div className="min-w-[25%] md:min-w-[465px] flex justify-center bg-primary">
			<aside className="w-[90%] flex flex-col min-h-[100%]">
				<div className="p-4 min-h-[8%] ">
					<header className="flex justify-between items-center ">
						<span className="font-bold text-2xl">Live-Chat</span>
						<div className="relative inline-block">
							<button className="flex justify-center items-center" onClick={handleContactModal}>
								<MessageCirclePlus size={29} />
							</button>
							{isContactModal && (<NewConversationModal></NewConversationModal>)}
						</div>
					</header>
				</div>
				<div className="px-4">
					<div className="flex items-center bg-input rounded-lg">
						<div className="pl-3">
							<Search size={20} className="text-gray-500" />
						</div>
						<input
							type="search"
							placeholder="find conversation"
							className="w-full p-2 rounded-lg focus:outline-none bg-input"
						/>
					</div>
				</div>
				<div className="px-4 my-4">
					<ul className="flex gap-4">
						<button className="border min-w-[50px] rounded-xl border-border px-2 text-plain"> All </button>
						<button className="border min-w-[50px] rounded-xl border-border px-2 text-plain"> unread </button>
					</ul>
				</div>
				<div className="overflow-y-auto px-4 flex flex-col gap-4">
					<div className="flex flex-col gap-2 p-4">
						
						{conversations.map((conv) => (
							<ChatCard key={conv._id} conversation={conv} />
						))}
					</div>
				</div>
			</aside>
		</div>
	)
}

export default Aside 