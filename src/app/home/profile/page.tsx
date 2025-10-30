"use client"

import { useUser } from "@/context/UserContext"
import { ArrowLeft, Camera, Pencil, User } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, ChangeEvent, useRef, useEffect } from "react"

const ProfilePage = () => {
  const {user, updateProfilePicture} = useUser()
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [userName, setUserName] = useState("")
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name)
    }
  }, [user?.name])
  
  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setHasImageChanged(true)

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }

  const handleUpdateImage = async () => {
    if(!selectedFile || !user?._id){
      return;
    }
  
    setUploading(true);
    try{
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary to-secondary">
      {/* Círculos decorativos */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-message/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-message/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="w-full max-w-md px-6 py-8 bg-secondary/60 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 z-10 animate-fadeIn">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push("/home")}
            className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-300" />
          </button>
          <h1 className="text-xl font-bold text-white mx-auto pr-8">Editar perfil</h1>
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="w-[130px] h-[130px] rounded-full border-4 border-message overflow-hidden bg-gray-700 flex items-center justify-center">
              {previewUrl || user?.avatarUrl ? (
                <Image
                  src={previewUrl || user?.avatarUrl || ""}
                  alt={user?.name || "User Avatar"}
                  width={130}
                  height={130}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={80} className="text-gray-400" />
              )}
            </div>
            
            <button 
              onClick={handleSelectFile}
              className="absolute bottom-0 right-0 bg-message text-white rounded-full p-3 hover:bg-message/80 transition-all shadow-lg"
            >
              <Camera size={18} />
            </button>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          {hasImageChanged && (
            <button 
              onClick={handleUpdateImage}
              disabled={isUploading}
              className="mb-4 bg-green-600 flex items-center justify-center text-white rounded-full px-4 py-2 text-sm hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {isUploading ? 'Subiendo...' : 'Guardar imagen'}
            </button>
          )}
          
          <div className="w-full space-y-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="userName" className="text-sm font-medium text-gray-300 ml-1">Nombre</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={handleNameChange}
                  placeholder="Tu nombre"
                  className="w-full bg-input border border-gray-700 rounded-lg py-3 pl-10 pr-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-message/50 transition-all"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300 ml-1">Correo electrónico</label>
              <div className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-gray-400">
                {user?.email || "correo@ejemplo.com"}
              </div>
            </div>
            
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => router.push("/home")}
                className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                className="flex-1 py-3 rounded-lg bg-message hover:bg-message/90 text-white font-medium transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
