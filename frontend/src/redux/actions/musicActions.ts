import { createAction, createAsyncThunk} from '@reduxjs/toolkit'
import { addMusic, fetchMusics, updateMusic, deleteMusic} from '../../api/musicApi'
import { Music, AddMusicData, Statistics} from "../Types/musicTypes";


// Define a type for the response of the update action
interface UpdateMusicResponse {
    status: number;
    data: Music; 
}

// Fetch musics actions
export const fetchMusicsAsync = createAsyncThunk<Music[], void>(
    'musics/fetchMusics',
    async () => {
        const musics = await fetchMusics();
        return musics;
    }
);

// Add music action
export const addMusicAsync = createAsyncThunk<Music, AddMusicData>(
  "musics/addMusic",
  async (musicData: AddMusicData) => {
    const response = await addMusic(musicData);
    console.log(response);

    return response; // Assuming this returns a status code
  }
);

// Update music action
export const updateMusicAsync = createAsyncThunk<
  UpdateMusicResponse,
  { id: string; musicData: FormData | Partial<Omit<Music, "_id">> }
>("musics/updateMusic", async ({ id, musicData }) => {
  const response = await updateMusic(id, musicData);
  return response; // Ensure this returns the correct structure
});


// Delete music action
export const deleteMusicAsync = createAsyncThunk<number , string, any>(
    'musics/deleteMusic',
    async (musicid) => {
        const status = await deleteMusic(musicid);
        return status;
    }
);



// Fetch statistics action
export const fetchStatisticsAsync = createAsyncThunk<Statistics, void>(
    'musics/fetchStatistics',
    async () => {
        const musics: Music[] = await fetchMusics(); // Fetch all music data
        return {
            totalMusic: musics.length,
            totalGenres: new Set(musics.map(music => music.genre)).size,
            totalAlbums: new Set(musics.map(music => music.album)).size,
        };
    }
);

// Selected music
export const setSelectedMusic = createAction<Music>('music/setSelectedMusic'); // Assuming you want to set the selected music
export const togglePlayPause = createAction<boolean>('music/togglePlayPause'); // Assuming a boolean indicates play/pause state
export const clearAddMusicStatus = createAction("musics/clearAddMusicStatus");
