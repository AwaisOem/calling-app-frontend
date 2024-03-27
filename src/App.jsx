import { useState } from 'react'
import { supabase } from './utils/supabase';
import { useEffect } from 'react';
import CallComponent from './components/CallComponent';
import { Toaster } from 'react-hot-toast';

const navigation = [
  { name: 'Features', href: '#' },
  { name: 'About', href: '#' },
  { name: 'Developer', href: '#' },
  { name: 'Case study', href: '#' },
]
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
    const signOut = async () => {
      await supabase.auth.signOut();
      setUser(null);
    };
    useEffect(()=>{

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          setUser(session.user);
        }
        setLoading(false)
      })

    }, [])
  
    const signInWithGoogle = async () => {
      setLoading(true)
      const { error , data} = await supabase.auth.signInWithOAuth({
          provider : "google",
          options: {
            redirectTo : window.location.href
          }
      })      
      setLoading(false)
      if (error) {
        alert(error.message);
        setUser(null)
        return;
      }
      setUser(data.user);
    };

  return (
    <div className="bg-white h-screen w-screen overflow-hidden">
      <Toaster/>
    <header className="absolute inset-x-0 top-0">
      <nav className="flex items-center gap-6 justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="text-blue-600 font-bold text-3xl">Calto</span>
          </a>
        </div>
        {!user && <div className="hidden lg:flex lg:gap-x-12">
          { navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-gray-900">
              {item.name}
            </a>
          ))}
        </div>}
        {user && <div className="hidden lg:flex-1 lg:flex lg:justify-end ">
          <li key={user.email} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4 bg-white p-2 rounded-lg">
              <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={user.user_metadata.avatar_url} alt="" />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{user.user_metadata.full_name} (Me)</p>
                <p className=" truncate text-xs leading-5 text-gray-500">{user.email}</p>
              </div>
            </div>
          </li>
        </div>}
        <div className="flex justify-end">
            <button onClick={user ? signOut:signInWithGoogle} className="z-10 flex items-center gap-4 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 no-underline cursor-pointer">
            {loading && <div className="flex items-center justify-center ">
                <svg className="animate-spin h-6 w-6 text-indigo-500" viewBox="0 0 24 24">
                  <circle cx="12" cy="11" r="10" stroke="white" strokeWidth="4" fill="none"></circle>
                </svg>
              </div>}
                {user ? "Sign out":"Continue With Google"} 
            </button>
        </div>
      </nav>
    </header>

    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      {user ? (<div className='flex pb-20 pt-10 lg:pt-20 scroll-bar-invisible flex-col overflow-y-auto gap-6 items-center justify-start z-30 h-screen '>
        <div className=" lg:hidden flex justify-start min-w-fit w-full sm:w-[334px] ">
          <li key={user.email} className="flex justify-between gap-x-6">
            <div className="flex min-w-0 gap-x-4">
              <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={user.user_metadata.avatar_url} alt="" />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{user.user_metadata.full_name} (Me)</p>
                <p className=" truncate text-xs leading-5 text-gray-500">{user.email}</p>
              </div>
            </div>
          </li>
        </div>
        <CallComponent user={user} />
      </div>):(<div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="mb-8 flex justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Full Stack Real Time Chat App.{' '}
            <a href="#" className="font-semibold text-blue-600">
              <span className="absolute inset-0" aria-hidden="true" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Best Calling Service Ever
          </h1>
          <div className="mt-10 flex items-center justify-center gap-x-6">
          <div className="">
        <button onClick={signInWithGoogle} className="flex items-center gap-4 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 no-underline">
        {loading && <div className="flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-indigo-500" viewBox="0 0 24 24">
            <circle cx="12" cy="11" r="10" stroke="white" strokeWidth="4" fill="none"></circle>
          </svg>
        </div>}
          Continue With Google 
        </button>
        </div>
          </div>
        </div>
      </div>)}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  </div>
  )
}

export default App
