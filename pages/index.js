import Center from "@/components/Center";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import Head from "next/head";
import Queue from "./Queue";

const Home = () => {


  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
        {/* <link/> */}
      </Head>

      <main className="flex">
          <Sidebar/>
          <Center/>
      </main>

      <Player/>
    </div>
  )
}

export default Home;