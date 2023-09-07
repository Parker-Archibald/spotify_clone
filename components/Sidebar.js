import useSpotify from '@/hooks/useSpotify';
import {HomeIcon, MagnifyingGlassIcon, QueueListIcon, PlusCircleIcon, HeartIcon, RssIcon} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {playlistIdState} from '@/atoms/PlaylistAtom'
import {BsDot} from 'react-icons/bs'

const Sidebar = ( ) => {

    const spotifyApi = useSpotify()
    const {data: session, status} = useSession(); 
    const [playlists, setPlaylists] = useState([])
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    useEffect(() => {

        if(session?.user?.accessToken) {
            fetch(`https://api.spotify.com/v1/users/${session.user.username}/playlists?limit=50`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session.user.accessToken
                }
            })
            .then(results => results.json())
            .then(results => {
                setPlaylists(results.items);
                if(playlistId === null) {
                    setPlaylistId(results.items[0].id)
                }
            })
        }
        
    }, [session, spotifyApi])

    return (
        <div className='text-gray-500 p-5 text-sm border-r border-gray-900 h-screen w-[50%] md:text-xl max-w-[400px]'>
            <div className='space-y-4 h-[35%]'>
                <button onClick={() => signOut()}>Logout</button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HomeIcon className='w-5 h-5'/>
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <MagnifyingGlassIcon className='w-5 h-5'/>
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <QueueListIcon className='w-5 h-5'/>
                    <p>Library</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'/>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleIcon className='w-5 h-5'/>
                    <p>Create Playlist</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HeartIcon className='w-5 h-5'/>
                    <p>Liked Songs</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <RssIcon className='w-5 h-5'/>
                    <p>Your Episodes</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'/>
            </div>
            {/* Playlists */}
            <section className='overflow-y-scroll scrollbar-hide h-[65%] pb-24'>
                {playlists?.map(playlist => (
                    <div key={playlist.id} className='flex space-x-4 hover:bg-gray-900 px-4 py-2 rounded-xl hover:text-white cursor-pointer' onClick={() => setPlaylistId(playlist.id)}>
                        <img src={playlist.images[0].url} className='w-16 rounded-xl'/>
                        <div>
                            <p key={playlist.id} className=''>{playlist.name}</p>
                            <div className='flex items-center mt-2 text-xs'>
                                <p className=''>Playlist</p>
                                <BsDot/>    
                                <p>{session?.user?.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
            
        </div>
    )
}

export default Sidebar;