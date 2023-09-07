import { useSession } from "next-auth/react";
import { ChevronDownIcon, ArrowDownCircleIcon, UserPlusIcon, MagnifyingGlassIcon, ClockIcon } from "@heroicons/react/24/outline";
import {PlayCircleIcon} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import {shuffle} from 'lodash'
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistState, playlistIdState, deviceIdState, currentSongState, isPlayingState } from "@/atoms/PlaylistAtom";
import spotifyApi from "@/lib/Spotify";
import {BsDot} from 'react-icons/bs'

const Center = () => {

    const {data: session} = useSession();
    const [color, setColor] = useState(null)
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const [deviceId, setDeviceId] = useRecoilState(deviceIdState)
    const [currentSong, setCurrentSong] = useRecoilState(currentSongState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

    const colors = [
        'from-indigo-500',
        'from-blue-500',
        'from-green-500',
        'from-red-500',
        'from-yellow-500',
        'from-pink-500',
        'from-purple-500',
        'from-cyan-500',
        'from-orange-500'
    ]

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    useEffect(() => {
        setColor(shuffle(colors).pop())
        
    }, [playlistId])

    useEffect(() => {
            fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: 'GET', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
            }
            })
            .then(results => results.json())
            .then(results => {
                setPlaylist(results);
            })
            .catch(err => {
                {
                    console.log('something went wrong', err)
                }
            }) 

    }, [playlistId, spotifyApi])
    
    useEffect(() => {
        fetch(`https://api.spotify.com/v1/me/player/devices`, {
            method: 'GET', headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
            }
        })
        .then(results => results.json()) 
        .then(results => setDeviceId(results?.devices?.[0].id))
    }, [session])

    const handlePlaySong = async (trackId) => {

        await fetch(`https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A${trackId}`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
            }
        })

        await fetch(`https://api.spotify.com/v1/me/player/next`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
            }
        })

        await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
            }
            })
            .then(results => results.json())
            .then(results => {
                setCurrentSong(results);
                if(results.is_playing) {
                    setIsPlaying(false)
                }
                else {
                    setIsPlaying(true)
                }
            })
    }

    return (
        <div className="flex-grow overflow-y-scroll scrollbar-hide h-screen rounded-l-xl">
            <header className="absolute top-5 right-8 z-10">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white">
                    <img src={session?.user?.image} className="rounded-full w-10 h-10"/>
                    <h2 className="">{session?.user.name}</h2>
                    <ChevronDownIcon className="w-5 h-5"/>
                </div>
            </header>

            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-[600px] text-white p-8 items-center`}>
                <div className="flex items-center space-x-8 -mt-[200px]">
                    <img src={playlist?.images?.[0]?.url} className="h-56 w-56 shadow-2xl rounded-xl"/>
                    <div className=" flex flex-col space-y-[80px]">
                        <div>
                            <div>{playlist?.public ? <p>Public Playlist</p> : <p>Private Playlist</p>}</div>
                            <h1 className="text-3xl md:text-5xl xl:text-7xl font-bold">{playlist?.name}</h1>
                        </div>
                        <div className="flex items-center">
                            <img src={session?.user?.image} className="rounded-full w-10 h-10"/>
                            <p className="ml-4">{session?.user?.name}</p>
                            <BsDot/>
                            <p>{playlist?.followers?.total} likes</p>
                            <BsDot/>
                            <p>{playlist?.tracks?.total} songs</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="text-white bg-opacity-20 backdrop-blur-sm -mt-[250px] bg-gray-600 pb-10">
                {/* top play section */}
                <div className="flex items-center">
                    <div className="flex space-x-8 items-center ml-8 pt-4">
                        <PlayCircleIcon className="w-24 text-green-500 cursor-pointer hover:w-[100px]"/>
                        <p className="border border-gray-400 py-2 px-5 rounded-full cursor-pointer hover:bg-gray-700">Enhance</p>
                        <ArrowDownCircleIcon className="w-10 text-gray-400 cursor-pointer hover:w-11"/>
                        <UserPlusIcon className="w-10 text-gray-400 cursor-pointer hover:w-11"/>
                    </div>
                    <div className="absolute right-10 flex space-x-10">
                        <MagnifyingGlassIcon className="w-5 cursor-pointer"/>
                        <div className="flex space-x-2 cursor-pointer">
                            <p>Date added</p>
                            <ChevronDownIcon className="w-4"/>
                        </div>
                    </div>
                </div>

                <section className="grid grid-cols-4 w-[98%] ml-[1%] -mb-2 mt-10">
                    <div className="flex space-x-8 ml-4">
                        <div>#</div>
                        <div>Title</div>
                    </div>
                    <div className="flex pl-4">Album</div>
                    <div className="flex">Date added</div>
                    <div className="flex justify-end pr-8"><ClockIcon className="w-8 h-8"/></div>
                </section>
                <hr className="w-[98%] ml-[1%] mt-4 border-gray-400"/>
                <section className="mt-10 mb-10">
                    {playlist?.tracks?.items?.map((item, index) => {
                                const date = new Date(item.added_at);
                                const day = date.getDay();
                                const month = date.getMonth() + 1;
                                const year = date.getFullYear();

                                // console.log(item.track)

                                return (
                                    <div key={item.track.name} className="grid grid-cols-4 w-[98%] ml-[1%] hover:bg-gray-800 py-4 pr-4 items-center rounded-lg cursor-pointer text-gray-400 hover:text-white" 
                                    onMouseEnter={() => {document.getElementById(`${index}Index`).style.display = 'none'; document.getElementById(`${index}PlayIcon`).style.display = 'inline'}}
                                    onMouseLeave={() => {document.getElementById(`${index}Index`).style.display = 'flex'; document.getElementById(`${index}PlayIcon`).style.display = 'none'}}>
                                        <div className="flex space-x-6 items-center">
                                            <div id={`${index}Index`} className="w-8 flex justify-center">{index + 1}</div>
                                            <div id={`${index}PlayIcon`} className="w-8 hidden" onClick={() => handlePlaySong(item.track.id)}><PlayCircleIcon className="w-8 text-green-400 pointer-events-none"/></div>
                                            <div className="flex space-x-4 items-center">
                                                <img src={item.track.album.images[0].url} className="w-16 h-16 rounded-md"/>
                                                <div className="truncate w-48">{item.track.name}</div>
                                            </div>
                                        </div>
                                        <div className="flex truncate pl-8 lg:w-96 w-48">{item.track.album.name}</div>
                                        <div className="flex pl-24">{`${months[month]} ${day}, ${year}`}</div>
                                        <div className="flex justify-end pr-4">{((item.track.duration_ms/1000)/60).toFixed(2)}</div>
                                    </div>
                                )
                            })}
                </section>
            </section>
        </div>
    )
}

export default Center;