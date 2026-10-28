import { useState, useEffect } from "react";

export default function useFetchPhotos() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const  [error, setError] = useState(null);

    const URL = "https://picsum.photos/v2/list?limit=30";

    useEffect(() => {
        async function fetchPhotos() {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(URL);

                if(!response.ok) {
                    throw new Error("Failed to fetch photos.");
                }

                const data = await response.json();
                console.log(data);
                setPhotos(data);
            } catch(err) {
                setError(err.message || "Something went wrong");
            }
            setLoading(false);
        }

        fetchPhotos();
    }, []);

    return {photos, loading, error};
}