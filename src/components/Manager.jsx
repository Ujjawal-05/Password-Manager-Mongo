import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
const Manager = () => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passarr, setPassarr] = useState([])
    useEffect(() => {
        getpasswords();
    }, [])
    
    let getpasswords= async()=>{
        let req=await fetch("http://localhost:3000/");
        let passwords = await req.json()
        setPassarr(passwords)
    }

    const showPass = () => {
        if (ref.current.src.includes("/eye.svg")) {
            ref.current.src = "/ceye.svg"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "/eye.svg"
        }
    }
    const savepass = async() => {
        if(form.site.length>3&&form.username.length>3&&form.password.length>3){
            //If any such id exist then delete(For Editing)
            await fetch("http://localhost:3000/",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:form.id})}) 
        setPassarr([...passarr, { ...form, id: uuidv4() }])
        await fetch("http://localhost:3000/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,id:uuidv4()})}) 
        // localStorage.setItem("passwords", JSON.stringify([...passarr, { ...form, id: uuidv4() }]))
        // console.log([...passarr, form])
        setform({ site: "", username: "", password: "" })}
        else{
            alert("Password,Username,URL must be greater than 3")
        }
    }
    
    const deletepass = async (id) => {
        setPassarr(passarr.filter(item => item.id !== id))
        let res=await fetch("http://localhost:3000/",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})}) 
        // localStorage.setItem("passwords", JSON.stringify(passarr.filter(item => item.id !== id)))
    }

    const editpass = (id) => {
        setform({...passarr.filter(i => i.id === id)[0],id:id})
        setPassarr(passarr.filter(i => i.id !== id))
    }
    const handlechange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    return (
        <>
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
            <div className="p-2 md:p-0 md:mycontainer text-white">
                <h1 className='text-3xl font-bold text-center'><span>Pass</span><span className='text-blue-600'>M</span></h1>
                <p className='text-center'>Your Password Manager</p>
                <div className="flex text-white flex-col p-4 gap-8 items-center">
                    <input value={form.site} onChange={handlechange} placeholder='Enter Website URL' className='rounded-xl border bg-[#180c38] border-blue-800 w-full p-4 py-1' type="text" name="site" id="" />
                    <div className="flex w-full md:flex-row flex-col justify-between gap-8">
                        <input value={form.username} onChange={handlechange} placeholder='Enter Username' className='rounded-xl border bg-[#180c38] border-blue-800 w-full p-4 py-1' type="text" name="username" id="" />
                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handlechange} placeholder='Enter Password' className='rounded-xl border bg-[#180c38] border-blue-800 w-full p-4 py-1' type="password" name="password" id="" /><span className='absolute right-[4px] top-[8px] cursor-pointer' onClick={showPass}><img ref={ref} width={20} src="/eye.svg" alt="" /></span>
                        </div>
                    </div>
                    <button onClick={savepass} className='flex justify-center items-center w-fit bg-[#2a1958] rounded-xl p-2 hover:bg-[#4b318c]'><img src="/Add.svg" alt="" />Save Password</button>
                </div>
                <div className="passwords ">
                    <h1 className='font-bold text-xl py-4'>Your Passwords</h1>
                    {passarr.length === 0 && <div>No Passwords To Display</div>}
                    <div className='md:max-h-[40vh] max-h-[33vh] overflow-auto'>
                        {passarr.length !== 0 &&
                            <table className="table-auto w-full rounded-lg md:mb-6 mb-10">
                                <thead className='py-2 bg-[#311677]'>
                                    <tr>
                                        <th>Site</th>
                                        <th>Username</th>
                                        <th>Password</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-[#413466] '>
                                    {passarr.map((item, index) => {
                                        return <tr key={index}>
                                            <td className='py-2 text-center w-32'>{item.site}</td>
                                            <td className='py-2 text-center w-32'>{item.username}</td>
                                            <td className='py-2 text-center w-32'>{item.password}</td>
                                            <td className='py-2 text-center w-32'>
                                                <div className='flex justify-center items-center gap-4'>
                                                    <img onClick={() => { editpass(item.id) }} className='cursor-pointer' src="/Edit.svg" alt="" />
                                                    <img onClick={() => { deletepass(item.id) }} className='cursor-pointer' src="/delete.svg" alt="" />
                                                </div>
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Manager
