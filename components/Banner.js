'use client'

const Banner = () => {

    const handleAcknowledge = (e) => {
        e.preventDefault();

        document.getElementById('banner').style.right = '-48rem'

        setTimeout(() => {
            document.getElementById('banner').style.display = 'none'
        }, 500)
    }

    return (
        <div id='banner' className='fixed bottom-24 right-5 z-30 bg-blue-400/75 px-8 py-2 rounded-md flex flex-col items-center space-y-4 transition-all duration-500 ease-in-out max-w-lg'>
            <p>This is a clone of Spotify strictly used for education purposes - please ensure that spotify is <b>open</b> on your device (this application only controls Spotify using their API)</p>
            <button className="bg-blue-800 text-white px-4 py-1 rounded-md" onClick={(e) => handleAcknowledge(e)}>Acknowledge</button>
        </div>
    )
}

export default Banner;