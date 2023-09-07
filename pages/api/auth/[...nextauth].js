import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi, {LOGIN_URL} from "@/lib/Spotify"

const refreshAccessToken = async (token) => {
  console.log(token)
    try {
        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)

        const {body: refreshedToken} = await spotifyApi.refreshAccessToken()
        console.log('refreshed token is', refreshedToken)

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken // replace if new token came back, else use old refresh token
        }
    }
    catch (error) {
        console.log(error)

        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({token, account, user}) {
        //initial signin

        console.log(account)
        
        if (account && user) {
          // console.log(account)
            return {
                ...token,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000
            }
        }

        

        // return previous token if the access token has not expired yet
        if(Date.now() < token.accessTokenExpires) {
            return token
        }

        // Access token has expired, need to refresh it
        console.log('Access token has expired, refreshing...') 
        return await refreshAccessToken(token)
    }, 

    async session({session, token}) {
        session.user.accessToken = token.accessToken
        session.user.refreshToken = token.refreshToken
        session.user.username = token.username

        return session
    }
  },
})