import { useState, useCallback } from 'react';

interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseAsyncResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    execute: (asyncFunction: () => Promise<T>) => Promise<T | null>;
    reset: () => void;
    setData: (data: T | null) => void;
}

export function useAsync<T = any>(initialData: T | null = null): UseAsyncResult<T> {
    const [state, setState] = useState<AsyncState<T>>({
        data: initialData,
        loading: false,
        error: null,
    });

    const execute = useCallback(async (asyncFunction: () => Promise<T>): Promise<T | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const result = await asyncFunction();
            setState({ data: result, loading: false, error: null });
            return result;
        } catch (error: any) {
            let errorMessage = 'An unexpected error occurred';

            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Connection timeout - service may be unavailable';
            } else if (error.response?.status === 404) {
                errorMessage = 'Service not found';
            } else if (error.response?.status >= 500) {
                errorMessage = 'Server error - please try again later';
            } else if (error.message) {
                errorMessage = error.message;
            }

            setState({ data: null, loading: false, error: errorMessage });
            return null;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ data: initialData, loading: false, error: null });
    }, [initialData]);

    const setData = useCallback((data: T | null) => {
        setState(prev => ({ ...prev, data }));
    }, []);

    return {
        ...state,
        execute,
        reset,
        setData,
    };
}

export default useAsync;
