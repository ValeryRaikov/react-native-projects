import i18n from '@/services/i18n';

export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}` || '',
    },
}

const getLanguageParam = (): string => {
    return i18n.language === 'bg' ? 'bg-BG' : 'en-US';
}

// Movie functions
export const fetchMovies = async ({ query }: { query: string }) => {
    const lang = getLanguageParam();

    const endpoint = query 
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=${lang}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&language=${lang}`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok) {
        // @ts-ignore
        throw new Error(`Failed to fetch movies. ${response.statusText}`);
    }

    const data = await response.json();

    return data.results || [];
}

export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {    
    const lang = getLanguageParam();

    try {
        const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}&language=${lang}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });

        if (!response.ok)
            throw new Error("Failed to fetch movie details!");

        const data = await response.json();

        return data;        
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const fetchBulgarianMovies = async () => {
    const lang = getLanguageParam();

    try {
        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/discover/movie?language=${lang}&with_original_language=bg&sort_by=popularity.desc&api_key=${TMDB_CONFIG.API_KEY}`, {
            method: 'GET',
            headers: TMDB_CONFIG.headers,
        });

        if (!response.ok) 
            throw new Error("Failed to fetch bulgarian movies");

        const data = await response.json();

        return data.results;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// TV Show functions
export const fetchTVShows = async ({ query }: { query?: string }) => {
    const lang = getLanguageParam();
  
    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/tv?query=${encodeURIComponent(query)}&language=${lang}`
        : `${TMDB_CONFIG.BASE_URL}/discover/tv?sort_by=popularity.desc&language=${lang}`;
  
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });
  
    if (!response.ok)
        throw new Error("Failed to fetch TV shows.");
  
    const data = await response.json();

    return data.results || [];
}

export const fetchTVShowDetails = async (id: string) => {
    const lang = getLanguageParam();

    try {
        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/tv/${id}?language=${lang}`, {
                method: 'GET',
                headers: TMDB_CONFIG.headers,
            }
        );
        
        if (!response.ok)
            throw new Error("Failed to fetch TV show details");
        
        const data = await response.json();
      
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const fetchBulgarianTVShows = async () => {
    const lang = getLanguageParam();

    try {
        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/discover/tv?language=${lang}&with_original_language=bg&sort_by=popularity.desc&api_key=${TMDB_CONFIG.API_KEY}`, {
                method: 'GET',
                headers: TMDB_CONFIG.headers,
            }
        );

        if (!response.ok)
            throw new Error("Failed to fetch Bulgarian TV shows");

        const data = await response.json();
        
        return data.results || [];
    } catch (err) {
        console.error('Error fetching Bulgarian TV shows:', err);
        throw err;
    }
}

// Actor functions
export const fetchActors = async ({ query }: { query?: string }) => {
    const lang = getLanguageParam();

    const endpoint = query
        ? `${TMDB_CONFIG.BASE_URL}/search/person?query=${encodeURIComponent(query)}&language=${lang}`
        : `${TMDB_CONFIG.BASE_URL}/person/popular?language=${lang}`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMDB_CONFIG.headers,
    });

    if (!response.ok)
        throw new Error(`Failed to fetch actors. ${response.statusText}`);

    const data = await response.json();

    return data.results || [];
}

export const fetchActorDetails = async (actorId: string) => {
    const lang = getLanguageParam();

    try {
        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/person/${actorId}?language=${lang}`, {
                method: 'GET',
                headers: TMDB_CONFIG.headers,
            }
        );

        if (!response.ok) 
            throw new Error('Failed to fetch actor details.');

        const data = await response.json();

        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const fetchActorMovies = async (actorId: string) => {
    const lang = getLanguageParam();

    try {
        const response = await fetch(
            `${TMDB_CONFIG.BASE_URL}/person/${actorId}/movie_credits?language=${lang}`, {
                method: 'GET',
                headers: TMDB_CONFIG.headers,
            }
        );

        if (!response.ok)
            throw new Error('Failed to fetch actor movie credits.');

        const data = await response.json();

        const sortedMovies = (data.cast || []).sort((a: any, b: any) => {
            const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
            const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
            return dateB - dateA;
        });

        return sortedMovies;
    } catch (err) {
        console.log(err);
        throw err;
    }
}