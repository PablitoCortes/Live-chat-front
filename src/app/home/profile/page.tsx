"use client"

import { useUser } from "@/context/UserContext"
import { Pencil, User } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, ChangeEvent, useRef, useEffect } from "react"

const ProfilePage = () => {
  const {user,updateProfilePicture} = useUser()
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [userName, setUserName] = useState("")
  const [hasImageChanged, setHasImageChanged] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null)
	const router = useRouter()

	
  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }
  useEffect(() => {
    if (user?.avatarUrl && previewUrl) {
      setPreviewUrl(null);
    }
  }, [user?.avatarUrl, previewUrl]);


	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
		const file = e.target.files?.[0];
		if(file){
			setSelectedFile(file);
			const objectUrl = URL.createObjectURL(file);
			setPreviewUrl(objectUrl);
			setHasImageChanged(true);
			console.log(previewUrl)
		}
	} 

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value)
  }

  const handleUpdateImage = async () => {
    if(!selectedFile || !user?._id){
      return;
    }
  
    setUploading(true);
    try{
			console.log("info que va al back", selectedFile, user._id)
      await updateProfilePicture(selectedFile, user._id);
      setHasImageChanged(false);
      setSelectedFile(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      alert(err);
    } finally {
      setUploading(false);
    }
  }

  // const handleSubmit = async (file:File,e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>) => {
  //   e.preventDefault()
	// 	if(!user?._id){
	// 		return
	// 	}
	// 	try{
	// 		await updateProfilePicture(file, user._id)
	// 	}catch (err){
	// 		alert(err)
	// 	}

  // }

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary text-white">
      <div className="bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8 w-[380px] flex flex-col items-center">
        
        <div className="relative mb-5">
          {previewUrl || user?.avatarUrl ? (
            <div className="w-[130px] h-[130px] rounded-full border-4 border-message overflow-hidden">
              <Image
                src={previewUrl || user?.avatarUrl || ""}
                alt={user?.name || "User Avatar"}
                width={130}
                height={130}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="bg-gray-600 rounded-full p-4 w-[130px] h-[130px] flex items-center justify-center border-4 border-message">
              <User size={80} />
            </div>
          )}

          <button 
					onClick={handleSelectFile}
					className="absolute bottom-0 right-0 bg-message text-white rounded-full p-2 hover:bg-message/80 transition-all">
            <Pencil size={16} />
          </button>
					<input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
				{hasImageChanged && (
            <button 
              onClick={handleUpdateImage}
              disabled={isUploading}
              className="relative top-0 pt-2 bg-green-600 flex items-center justify-center bg-message text-white rounded-full px-3 py-1 text-md hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {isUploading ? 'Subiendo...' : 'Guardar'}
            </button>
          )}
				
        <div className="w-full space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Name</label>
            <input
              type="text"
              placeholder={user?.name}
              value={userName}
              onChange={handleInputChange}
              className="w-full rounded-md p-2 text-black focus:outline-none focus:ring-2 focus:ring-message"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="text"
              placeholder={user?.email}
              disabled
              className="w-full rounded-md p-2 bg-gray-700 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
				
				<div className="flex justify-between w-full gap-4">
					<button 
					className="mt-8 w-[30%]"
					onClick={()=>router.push("/home") }>
						Go back
					</button>
				<button
          className="mt-8 w-full p-3 rounded-lg bg-message hover:bg-message/80 transition-colors font-semibold"
        >
          Save changes
        </button>

				</div>
        
      </div>
    </div>
  )
}

export default ProfilePage
