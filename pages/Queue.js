import { useRecoilState } from "recoil";
import { queueState } from "@/atoms/PlaylistAtom";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Queue = () => {

    const {data: session} = useSession();
    const [queueOpen, setQueueOpen] = useRecoilState(queueState)
    const [queueList, setQueueList] = useState([]);

    useEffect(() => {
        if(queueOpen) {
            fetch(`https://api.spotify.com/v1/me/player/queue`, {
                method: 'GET', headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + session?.user?.accessToken
                }
                })
                .then(results => results.json())
                .then(results => setQueueList(results))
        }
    }, [queueOpen, queueList])

    return (
        <div id='queueContainer' className="flex flex-grow flex-col bg-black overflow-y-scroll pl-10 pt-10 scrollbar-hide">
            <section className="text-white ">
                <div className="text-3xl font-bold">Queue</div>
                <div>
                    <div className="text-gray-400 text-xl mt-10 mb-10">Now Playing:</div>
                    <div className="flex space-x-8">
                        <img src={queueList?.currently_playing?.album?.images?.[0]?.url} className="w-24 h-24 rounded-lg"/>
                        {/* {console.log(queueList?.currently_playing)} */}
                        <div className="text-xl">
                            <p>{queueList?.currently_playing?.name}</p>
                            <p className="text-gray-400 mt-4">{queueList?.currently_playing?.artists?.[0]?.name}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="text-white mt-10">
                <div className="text-xl mb-10 text-gray-400">Next in queue:</div>
                    <div className="pb-24 space-y-2">
                        {queueList?.queue?.map((song, index) => (
                            // <div key={song?.name}/>
                                <div className="flex hover:bg-gray-800 py-4 mr-8 pl-8 rounded-xl items-center cursor-pointer">
                                    <div className="flex items-center space-x-10 w-[95%]">
                                        <div>{index + 1}</div>
                                        <img src={song.album.images[0].url} className="w-16 h-16 rounded-lg"/>
                                        <div className="space-y-1">
                                            <div>{song.name}</div>
                                            <div className="text-sm text-gray-400">{song.artists[0].name}</div>
                                        </div>
                                    </div>
                                    <div className="">{((song.duration_ms/1000)/60).toFixed(2)}</div>
                                </div>
                                
                        ))}
                    </div>
            </section>
        </div>
    )
}

export default Queue;