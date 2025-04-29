import { Account, Client, Databases, ID, Query } from 'react-native-appwrite'

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);
const account = new Account(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query),
        ]);
    
        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];
    
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
                count: existingMovie.count + 1,
            });
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                count: 1,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (err) {
        console.log(err);
        throw err;
    } 
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc('count'),
        ]);

        return result.documents as unknown as TrendingMovie[];
    } catch (err) {
        console.log(err);
        return undefined;
    }
}

export const checkIfMovieSaved = async (movieId: number, userId: string): Promise<boolean> => {
  try {
    const res = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal('movie_id', movieId),
      Query.equal("user_id", userId),
    ]);
    
    return res.documents.length > 0;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export const saveMovie = async (movie: MovieDetails, userId: string) => {
    try {
        const alreadySaved = await checkIfMovieSaved(movie.id, userId);
  
        if (!alreadySaved) {
            await database.createDocument(DATABASE_ID, SAVED_COLLECTION_ID, ID.unique(), {
                movie_id: movie.id,
                title: movie.title,
                poster_url: movie.poster_path 
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                    : null,
                user_id: userId,
            });
        } else {
            return;
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const getSavedMovies = async (userId: string): Promise<AppwriteMovie[]> => {
    try {
        const response = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
            Query.equal("user_id", userId),
        ]);

        return response.documents as unknown as AppwriteMovie[];
    } catch (err) {
        console.error(err);
        return [];
    }
}

export const unsaveMovie = async (docId: string, userId: string) => {
    try {
        const doc = await database.getDocument(DATABASE_ID, SAVED_COLLECTION_ID, docId);

        if (doc.user_id !== userId)
            throw new Error("You don't have permission to delete this movie.");

        await database.deleteDocument(DATABASE_ID, SAVED_COLLECTION_ID, docId);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// AUTH FUNCTIONS
export const restoreSession = async () => {
    try {
        return await account.get();
    } catch (err) {
        console.log('Session restore error:', err);
        return null;
    }
}

export const logout = async () => {
    try {
        await account.deleteSession('current');
    } catch (err) {
        console.error('Logout error:', err);
        throw err;
    }
}

export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch {
        return null;
    }
}

export const signUp = async (email: string, password: string, username: string) => {
    try {
      try {
        await account.deleteSession('current');
      } catch (deleteError) {}
  
      const user = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
      
      await account.createEmailPasswordSession(email, password);
      return user;
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
}

export const login = async (email: string, password: string) => {
    try {
      try {
        await account.deleteSession('current');
      } catch (deleteError) {}
      
      await account.createEmailPasswordSession(email, password);
      return await account.get();
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
}