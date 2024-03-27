import { useState , useEffect } from "react";
import { supabase } from "../utils/supabase";
import toast from 'react-hot-toast';
import { getUserInfoByEmail } from "../utils/functions";
import default_avatar from '../assets/avatar.jpg'

// eslint-disable-next-line react/prop-types
export default function RecentCalls({user , CallByEmail}) {
    const [recentCalls, setRecentCalls] = useState([]);
    const fetchRecentCalls = async(limit) =>{
      // eslint-disable-next-line react/prop-types
      const {data,error} = await supabase.from("calls").select("*").or(`sender.eq.${user.email},reciever.eq.${user.email}`).limit(limit).order("created_at", { ascending: false });
      if(error){
        toast.error("failed to get recent calls")
        return;
      }
      const recent = await Promise.all(data.map(async (e) => {
        // eslint-disable-next-line react/prop-types
        const otherEmail = e.sender === user.email ? e.reciever : e.sender;
        const {data, success} = await getUserInfoByEmail(otherEmail);
        if (!success) {
          return {
            name : "Unknown",
            avatar_url : "",
            email: otherEmail,
          }
        }
        return {
          ...data,
          email: otherEmail,
        };
      }));
      setRecentCalls(recent);
    }

    useEffect(()=>{
        fetchRecentCalls(5);
    },[])

  if(!recentCalls || recentCalls.length == 0)return <></>;
  return (
    <div className="flex flex-col gap-4  w-full sm:w-[334px]">
        <h1 className="text-xl font-bold">Recent Calls</h1>
        <ul role="list" className="divide-y divide-gray-100">
        {recentCalls.map((person) => (
          <li key={person.email} className="flex justify-between gap-x-6 py-5 w-full">
            <div className="flex min-w-0 gap-x-4">
              <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.avatar_url!=""? person.avatar_url:default_avatar } alt="" />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
              </div>
            </div>
            <div className=" flex flex-col items-end">
            <button onClick={()=>CallByEmail(person.email)} className="flex items-center gap-1 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 no-underline">
                Call <span className="hidden sm:flex">Now</span> 
            </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
