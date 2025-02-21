import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Search = () => {


    return (
        <div className="text-white">
            <section className="flex items-center ml-48 mt-10">
                <div><MagnifyingGlassIcon className="w-4 relative left-6"/></div>
                <input placeholder="What do you want to listen to?" className="bg-gray-800 w-96 p-2 rounded-lg focus:outline-none indent-6"/>
            </section>
        </div>
    )
}

export default Search;