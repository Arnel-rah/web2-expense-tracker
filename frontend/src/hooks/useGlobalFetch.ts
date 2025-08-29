import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/api";

export default function useGlobalFetch(resourceName : string) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchData = useCallback(async () => {
        if (!resourceName) return;
        setLoading(true);
        setError(null);

        try {
            const result = await apiFetch(`/${resourceName}`);
            setData(result);
        } catch (err) {
            setError(err.message || 'Erreur')
        } finally {
            setLoading(false)
        }
    }, [resourceName]);


    useEffect(() => {
        fetchData();
    }, [fetchData])

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
}