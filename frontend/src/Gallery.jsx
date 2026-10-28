import useFetchPhotos from "./hooks/useFetchPhotos";
import {useState, useEffect, useReducer, useCallback, useMemo} from "react";
import {PulseLoader} from "react-spinners";
import {favouritesReducer} from "./reducers/favouritesReducer";

export default function Gallery() {
    const {photos, loading, error} = useFetchPhotos();
    const [search, setSearch] = useState("");

    const handleSearch = useCallback((value) => {
        setSearch(value);
    }, [])

    const [favourites, dispatch] = useReducer(
        favouritesReducer,
        undefined,
        () => {
            const saved = localStorage.getItem("favourites");
            return saved ? JSON.parse(saved) : [];
        }
    );

    useEffect(() => {
    const savedFavourites = localStorage.getItem("favourites");

    if (savedFavourites) {
        dispatch({
        type: "LOAD_FAVORITES",
        payload: JSON.parse(savedFavourites),
        });
    }
    }, []);

    useEffect(() => {
        localStorage.setItem("favourites", JSON.stringify(favourites));
    }, [favourites]);

    const filteredPhotos = useMemo(() => {
        return photos.filter((photo) => 
        photo.author.toLowerCase().includes(search.toLowerCase())
    );
    }, [photos, search]);

    if(error) {
        return <p className="mt-10 text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="px-6 w-full max-w-8xl py-8 sm:px-10 lg:px-12">
                <h1 className="mb-8 text-center text-3xl font-bold text-cyan-900">
                    Photo Gallery
                </h1>

                <input
                    type="text"
                    placeholder="paul jarvis"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="mb-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:ring-0 focus:ring-blue-400"
                    />

                {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
                    <PulseLoader color="#7c3aed" size={15} />
                </div>
                )}

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {filteredPhotos.map((photo) => (
                        <div
                        key={photo.id}
                        className="relative overflow-hidden rounded-xl bg-white shadow-lg duration-300 hover:shadow-2xl"
                        >
                            <img
                                src={photo.download_url}
                                alt={`Photo by ${photo.author}`}
                                className="h-44 w-full rounded-t-lg object-cover md:h-48"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    dispatch({
                                    type: "TOGGLE_FAVORITE",
                                    payload: photo.id,
                                    })
                                }
                                className="absolute right-4 top-4 text-2xl text-white drop-shadow-lg cursor-pointer"
                            >
                                {favourites.includes(photo.id) ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" className="size-6">
                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                </svg> : 
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>}
                            
                            </button>

                            <p className="px-2 py-3 text-sm font-medium text-slate-700">
                                {photo.author}
                            </p>

                        </div>
                    ))}
                    {!loading &&
                        search.trim() !== "" &&
                        filteredPhotos.length === 0 && (
                        <p className="mt-6 text-center text-gray-500">
                            No images found.
                        </p>
                    )}
                </div>
                
            </div>
            
        </div>
    );
}