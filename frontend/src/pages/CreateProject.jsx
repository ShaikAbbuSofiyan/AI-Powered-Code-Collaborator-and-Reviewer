import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api.js';

const CreateProject = () => {
    // const [title, setTitle] = useState("");
    // const [description, setDescription] = useState("");
    const navigate = useNavigate();
    async function handleSubmit(e){
        e.preventDefault();
        const title = e.target.title.value;
        const description = e.target.description.value;
        const project = await API.post('/api/projects/', {
            title, description
        },{withCredentials:true})
        console.log(project);
        navigate('/dashboard');

    }

  return (
    <div className = "flex justify-center">
        <div className='mt-50 w-100 py-10 px-10 lg:w-150 bg-linear-to-tr from-gray-900/10 via-gray-800/70 to-gray-700/90 flex-col justify-center shadow-sm rounded-xl'>
            <div className='font-semibold text-4xl mb-5 flex'>
                <button onClick={()=> navigate('/dashboard')} className='cursor-pointer'>⬅️</button>
                <p>New project.</p>
                
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='Title' name='title'  className="mt-3 mb-3 bg-gray-700 w-full px-3 py-3 rounded-sm outline-0 hover:outline-1 hover:outline-blue-500"/>
                <textarea placeholder='Description' name="description" className="mt-3 mb-3 bg-gray-700 w-full px-3 py-3 rounded-sm outline-0 hover:outline-1 hover:outline-blue-500"></textarea>
                <input type="submit" value="Create" className="mt-3 mb-3 font-semibold text-md bg-gray-700 w-full px-3 py-3 rounded-sm hover:cursor-pointer bg-linear-to-br from-green-400/50 via-cyan-500/50 to-green-900/10   "/>
            </form>
        </div>
    </div>
  )
}

export default CreateProject
