import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { currentSongState, isPlayingState } from "@/atoms/PlaylistAtom";

const Player = () => {

    const {data: session} = useSession();
    const [currentSong, setCurrentSong] = useRecoilState(currentSongState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

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

    return (
        <div className="w-screen fixed bottom-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm h-20 flex items-center">
            <div className="flex items-center w-1/3 h-full pl-10">
                <img src={currentSong?.item?.album?.images?.[0]?.url} className="w-16 h-16 rounded-lg"/>
                <div className="ml-10">
                    <div className="text-white text-xl">{currentSong?.item?.name}</div>
                    <div className="text-gray-400 text-sm">{currentSong?.item?.artists?.[0]?.name}</div>
                </div>
            </div>
            <div className="w-1/3 h-full flex justify-center">
                {isPlaying ? (
                    <PauseCircleIcon className="w-16 text-green-400 cursor-pointer" onClick={handlePause}/>
                ) : (
                    <PlayCircleIcon className="w-16 text-green-400 cursor-pointer" onClick={handlePlay}/>
                )}
            </div>
            <div className="w-1/3 h-full">stuff</div>
        </div>
    )
}

export default Player;