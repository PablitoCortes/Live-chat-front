"use client"
import { userService } from "@/services/userService"
import { ChangeEvent, useState } from "react"

export const AddContact =()=>{
    
    const [contactData, setContactData] = useState({email:""})
    
    const handleSubmit= async(e: React.FormEvent)=>{
      e.preventDefault();
      try{
        const res = await userService.addContact(contactData.email)
        if(!res){
          throw new Error("No response from server")
        }  
        alert("Contact added");
        setContactData({email: ""});
      }catch(err: any){
        const errorMessage = err.response?.data?.message;
        alert(errorMessage);
      }
    }
    
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setContactData(prev => ({
          ...prev,
          [name]: value,
        }));
      }
    return(
        <form  onSubmit={handleSubmit}>
          <input 
            type="email" 
            name="email"
            placeholder="Email del contacto" 
            className="w-full p-2 border rounded mb-2"
            required
            onChange={handleInputChange}
          />
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Agregar
          </button>
        </form>
 
    )
}

