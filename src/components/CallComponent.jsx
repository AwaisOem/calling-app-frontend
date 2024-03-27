import { useState,useRef,useEffect } from "react";
import Peer from 'peerjs';
import RecentCalls from "./RecentCalls";
import toast from 'react-hot-toast';
import ringtone from '../assets/ringtone.mp3'
import default_avatar from '../assets/avatar.jpg'
import { getEmailUsername, getUserInfoByEmail, recordCallHistory } from "../utils/functions";

// eslint-disable-next-line react/prop-types
export default function CallComponent({ user }) {
  const [isOnline, setOnline] = useState(false);
  const [email, setEmail] = useState("");
  const [secondPersonEmail, setSecondPersonEmail] = useState("");
  const [secondPersonAvatarUrl , setSecondPersonAvatarUrl]= useState("")
  const [callWaiting, setCallWaiting] = useState(null);
  const [ringingWithCall, setRingingWithCall] = useState(null);
  const [CallConnected, setCallConnected] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  
  const peerRef = useRef();
  const localStreamRef = useRef();


    const getMicAccess = async () =>{
      try{
        const localStream  = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = localStream
        return localStream;
      }catch(e){
        toast.error(`Error accessing microphone ${e}`);
      }
      return null;
    }

    const endCall = () => {
      callWaiting?.close();
      ringingWithCall?.close();
      setCallWaiting(null);
      setCallConnected(null);
      remoteStream?.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
      setRemoteStream(null);
      setRingingWithCall(null);
      setSecondPersonEmail("")
      setSecondPersonAvatarUrl("")
    };

    const CallByEmail = async (receiverPeerId) => {
      if(!receiverPeerId || receiverPeerId==""){
        return;
      }
      if(peerRef.current.disconnected){
        toast.error('Peer disconnected, unable to make call');
      }
      
      const localStream = await getMicAccess()
      if(!localStream)return;
      let call = null;


      try{
        setSecondPersonEmail(receiverPeerId)
        // eslint-disable-next-line react/prop-types
        call = peerRef.current.call(getEmailUsername(receiverPeerId), localStream , {metadata: {avatar_url: user.user_metadata.avatar_url}});
        console.log('Calling...', receiverPeerId);
        setCallWaiting(call);        
      }catch(e){
        console.log('Error making call', e);
        return;
      }
      let timeout = setTimeout(()=>{
        if(CallConnected==null){
          setCallWaiting(null);
        }
      },3000)
      let timeout2 = setTimeout(()=>{
        if(CallConnected==null){
          localStreamRef.current?.getTracks().forEach((track) => {
            track.stop();
          });
          localStreamRef.current = null;
        }
      }, 10000)



        call.on('stream', (remoteStream) => {
          clearTimeout(timeout);
          clearTimeout(timeout2);
          setCallWaiting(null)
          setCallConnected(call);
          setRemoteStream(remoteStream);
        });
        call.on('close', ()=>{
          clearTimeout(timeout);
          clearTimeout(timeout2);
          endCall();
        })
        call.on('error', (err) => {
          clearTimeout(timeout);
          clearTimeout(timeout2);
          endCall()
          console.log(err);
          toast.error(`Call connection failed: ${err.toString()}`);
        });
    };

    const answerIncomingCall = async (incomingCall)=>{
      const localStream = await getMicAccess()
      if(!localStream)return;


      setSecondPersonAvatarUrl(incomingCall.metadata.avatar_url)

      // eslint-disable-next-line react/prop-types
      incomingCall.answer(localStream , {metadata: {avatar_url: user.user_metadata.avatar_url}});
      incomingCall.on('stream', (remoteStream) => {
        setRingingWithCall(null)
        setCallConnected(incomingCall);
        setRemoteStream(remoteStream);
      });
      incomingCall.on('close', endCall)
      incomingCall.on('error', (err) => {
        endCall()
        console.log(err);
        toast.error(err);
      });
    }

    
    useEffect(() => {
      let newPeer;
      try{
        // eslint-disable-next-line react/prop-types
        const myUserName = getEmailUsername(user.email)
        // eslint-disable-next-line no-undef
        console.log(`Development : ${process.env.REACT_APP_IS_DEVELOPMENT}`)
        // eslint-disable-next-line no-undef
        if(process.env.REACT_APP_IS_DEVELOPMENT){
          console.log("Development Envoirment")
          newPeer= new Peer(myUserName , {host: "127.0.0.1", port: 9000, path: "/"});
        }else{
          console.log("Production Envoirment")
          newPeer= new Peer(myUserName);
        }
      }catch(e){
        toast.error('Error in connection: ' + e.message);
      }
      
      newPeer.on("open", id=>{
          console.log(`you are online with ${id} open:${newPeer.open}`);
          peerRef.current = newPeer 
          setOnline(true);
        })
        
        newPeer.on('call', (incomingCall) => {
          setSecondPersonEmail(incomingCall.peer+"@gmail.com");
          setRingingWithCall(incomingCall);
        });
      

      return ()=>{
        newPeer.destroy();
      }
    }, []);

  return (
  <>
    <RecentCalls user={user} CallByEmail={CallByEmail} />
    <form onSubmit={async e=>{
        e.preventDefault();
        // eslint-disable-next-line react/prop-types
        if(email == user.email){
          toast.error("Cann't call yourself");
          setEmail('')
          return;
        }
        const {success , message} = await getUserInfoByEmail(email);
        if(!success){
          toast.error(message);
          return;
        }
        // eslint-disable-next-line react/prop-types
        CallByEmail(email).then(()=>recordCallHistory({sender: user.email, receiver : email}));
    }} className="space-y-4 sm:w-[334px] w-full" >
    <div>
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
        Email address
      </label>
      <div className="mt-2">
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="xxxxx@xx.com"
          autoComplete="email"
          required
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>

    <div>
      <button
        type="submit"
        disabled={!isOnline}
        className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {isOnline ? "Call":"Offline (Reload/Wait)"} 
      </button>
    </div>
    </form>
    {remoteStream && (
        <audio ref={(el) => el && (el.srcObject = remoteStream)} autoPlay />
    )}
    {callWaiting && (
      <div className="md:top-5 bottom-5 h-16 w-72 flex-col text-white flex items-center justify-center rounded-lg bg-blue-600 fixed z-50 left-1/2 transform -translate-x-1/2 right-1/2">
        <span>Call Forwarding....</span>
        <span>to {secondPersonEmail}</span>
      </div>
    )}
    {ringingWithCall && (
      <div className="fixed h-screen w-screen top-0 inset-x-0 bg-[#00000020] flex justify-center items-center">
        <audio autoPlay loop>
          <source src={ringtone}   />
        </audio>
      <div className=" w-fit  h-fit p-6 bg-slate-800 rounded-xl shadow-lg flex flex-col gap-4 justify-center items-center text-white">
        <span>Call Coming from {secondPersonEmail}</span>
        <span>Ringing...</span>
        <div className="flex gap-6 justify-center ">
          <button onClick={()=>{
            answerIncomingCall(ringingWithCall);
            setRingingWithCall(null);
          }} className="bg-green-600 rounded-lg h-12 w-36 font-semibold">Answer</button>
          <button onClick={()=>{
            ringingWithCall.close();
            setRingingWithCall(null);
          }} className="bg-red-600 rounded-lg h-12 w-36 font-semibold">Reject</button>
        </div>
      </div>
    </div>
    )}

    {CallConnected && <CallingPopUp secondPersonAvatarUrl={secondPersonAvatarUrl} callEndFunction={()=>{CallConnected.close();endCall()}} UserEmail={(secondPersonEmail && secondPersonEmail!="")? secondPersonEmail:"*****@**.**"} />}
  </>
  )
}

// eslint-disable-next-line react/prop-types
const CallingPopUp = ({UserEmail, callEndFunction , secondPersonAvatarUrl}) =>{
  return (<div className="z-50 flex-col h-screen gap-8 w-screen text-white flex bg-slate-800 items-center justify-center fixed inset-x-0 top-0">
    <img className="h-52 w-52 rounded-full" src={secondPersonAvatarUrl!="" ? secondPersonAvatarUrl:default_avatar} alt="" />
    <span>{UserEmail}</span>
    <span className="text-green-500">Call Connected</span>
    <button onClick={callEndFunction} className="h-10 w-36 bg-red-600 text-white rounded-lg">End Call</button>  
  </div>);
}


