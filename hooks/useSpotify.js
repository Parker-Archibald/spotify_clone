import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

const useSpotify = () => {

    const {data: session, status} = useSession();

    useEffect(() => {
        if(session) {
            //  If refresh token attempt fails, redirect to login
            if(session.error === 'RefreshAccessTokenError') {
                signIn();
            }
            spotifyApi.setAccessToken(session.user.setAccessToken)
        }
    }, [session])

    // console.log(session?.user)

    return spotifyApi;
}

export default useSpotify;