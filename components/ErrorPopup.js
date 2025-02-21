

const ErrorPopup = ({isOpen, callBack}) => {

    setTimeout(() => {
        callBack()
    }, 8000)

    if(isOpen) {
        return (
            <div className="fixed top-0 left-0 bg-transparent w-screen flex items-center justify-center py-8">
                <div className="bg-red-500/80 text-white w-fit px-8 py-2 rounded-md shadow-lg max-w-48 relative">
                    <p className="py-4">Error: Please ensure that Spotify is open - This application is only a controller for spotify</p>
                    <p className="absolute right-1 top-1 hover:bg-red-600/50 px-2 py-0.5 transition-all duration-200 ease-out rounded-md cursor-pointer" onClick={() => callback()}>X</p>
                </div>
            </div>
        )
    }
}

export default ErrorPopup;