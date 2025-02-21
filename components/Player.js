import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PauseCircleIcon, PlayCircleIcon, ForwardIcon, BackwardIcon } from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { currentSongState, isPlayingState } from "@/atoms/PlaylistAtom";
import {PiQueueLight} from 'react-icons/pi'
import {BiSpeaker, BiVolumeFull} from 'react-icons/bi'
import { queueState } from "@/atoms/PlaylistAtom";
import Banner from '@/components/Banner'

const Player = () => {

    const {data: session} = useSession();
    const [currentSong, setCurrentSong] = useRecoilState(currentSongState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [queueOpen, setQueueOpen] = useRecoilState(queueState)

    useEffect(() => {
        console.log('called')
            if(isPlaying) {
                getCurrSong()
            }
    }, [session, isPlaying])

    // console.log(currentSong)

    const getCurrSong = async () => {
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
                    setIsPlaying(true)
                }
                else {
                    setIsPlaying(false)
                }
                setTimeout(() => {
                    getCurrSong()
                }, results.item.duration_ms - results.progress_ms)
            })
    }

    const handlePause = async () => {
        await fetch(`https://api.spotify.com/v1/me/player/pause`, {
            method: 'PUT', headers: {
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
        .then(results => setCurrentSong(results))

        setIsPlaying(false)
    }

    const handlePlay = async () => {
        await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT', headers: {
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
        .then(results => setCurrentSong(results))

        setIsPlaying(true)
    }

    const handlePlayNext = async () => {
        setIsPlaying(false)

        await fetch(`https://api.spotify.com/v1/me/player/next`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
            }
        })

        setTimeout(() => {
            fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
            }
            })
            .then(results => results.json())
            .then(results => setCurrentSong(results))   
        }, 500)

        setIsPlaying(true)
    }

    const handlePLayPrevious = async () => {
        setIsPlaying(false)

        await fetch(`https://api.spotify.com/v1/me/player/previous`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
            }
        })

        setTimeout(() => {
            fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET', headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.user?.accessToken
            }
            })
            .then(results => results.json())
            .then(results => setCurrentSong(results))   
        }, 500)

        setIsPlaying(true)
    }

    return (
        <div className="w-screen fixed bottom-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm h-20 flex items-center z-20">
            <Banner/>
            <div className="flex items-center w-1/3 h-full pl-10">
                <img src={currentSong?.item?.album?.images?.[0]?.url} className="w-16 h-16 rounded-lg"/>
                <div className="ml-10">
                    <div className="text-white text-xl truncate w-56">{currentSong?.item?.name}</div>
                    <div className="text-gray-400 text-sm">{currentSong?.item?.artists?.[0]?.name}</div>
                </div>
            </div>
            <div className="w-1/3 h-full flex justify-center space-x-8">
                <BackwardIcon className="text-gray-400 w-10 hover:text-white cursor-pointer" onClick={handlePLayPrevious}/>
                {isPlaying ? (
                    <PauseCircleIcon className="w-16 text-green-400 cursor-pointer" onClick={handlePause}/>
                ) : (
                    <PlayCircleIcon className="w-16 text-green-400 cursor-pointer" onClick={handlePlay}/>
                )}
                <ForwardIcon className="text-gray-400 w-10 hover:text-white cursor-pointer" onClick={handlePlayNext}/>
            </div>
            <div className="w-1/3 h-full flex items-center justify-center space-x-8">
                <div id='queueIcon' className="text-3xl text-gray-400 hover:text-white cursor-pointer" onClick={() => {!queueOpen ? (setQueueOpen(true), document.getElementById('queueIcon').style.color = 'lightgreen') : (setQueueOpen(false), document.getElementById('queueIcon').style.color = 'lightgray')}}><PiQueueLight className="pointer-events-none"/></div>
                <div className="text-3xl text-gray-400 hover:text-white cursor-pointer"><BiSpeaker/></div>
                <div className="text-3xl text-gray-400 hover:text-white cursor-pointer"><BiVolumeFull/></div>
            </div>
        </div>
    )
}

export default Player;