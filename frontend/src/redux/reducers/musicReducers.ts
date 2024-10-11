import { createReducer } from "@reduxjs/toolkit";
import {
  fetchMusicsAsync,
  addMusicAsync,
  updateMusicAsync,
  deleteMusicAsync,
  fetchStatisticsAsync,
  setSelectedMusic,
  togglePlayPause,
  clearAddMusicStatus,
} from "../actions/musicActions";
import { MusicState,  } from "../Types/musicTypes";



// Initial state
const initialState: MusicState = {
  musics: [],
  error: null,
  status: null,
  isLoading: false,
  selectedMusic: null,
  isPlaying: false,
  statistics: null,
};

// Music reducer
const musicReducer = createReducer(initialState, (builder) => {
    builder
      // Fetch musics async action
      .addCase(fetchMusicsAsync.pending, (state) => {
        state.isLoading = true;
        state.status = 0;
        state.error = null;
      })
      .addCase(fetchMusicsAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.musics = action.payload;
        state.error = null;
      })
      .addCase(fetchMusicsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "An error occurred";
      })

      // Add music async action
      .addCase(addMusicAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = 0;
      })
      .addCase(addMusicAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // state.status = action.payload;
        state.musics.push(action.payload);
        state.status = 201;
        state.error = null;
      })
      .addCase(addMusicAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "An error occurred";
      })

      // Update music async action
      .addCase(updateMusicAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = 0;
      })
      .addCase(updateMusicAsync.fulfilled, (state, action) => {
        const updatedMusicData = action.payload; // This should now match the UpdateMusicResponse type
        const updatedMusic = updatedMusicData.data;
        state.status = updatedMusicData.status;

        // If status is 201, update the music in the state
        if (updatedMusicData.status === 201) {
          const index = state.musics.findIndex(
            (music) => music._id === updatedMusic._id
          );
          if (index !== -1) {
            state.musics[index] = updatedMusic;
          }
        }
        state.isLoading = false;
      })
      .addCase(updateMusicAsync.rejected, (state, action) => {
        state.status = action.error.message ? 500 : 0; // You may want to set a default status
        state.isLoading = false;
      })

      // Delete music async action
      .addCase(deleteMusicAsync.fulfilled, (state, action) => {
        const deletedMusicId = action.payload; // Ensure this is a string
        state.musics = state.musics.filter(
          (music) => music._id !== deletedMusicId.toString()
        ); // Convert if needed
        state.selectedMusic = null;
        state.isPlaying = false;
      })

      //handle fetch statistics
      .addCase(fetchStatisticsAsync.pending, (state) => {
        state.isLoading = true; // Set loading state
      })
      .addCase(fetchStatisticsAsync.fulfilled, (state, action) => {
        state.isLoading = false; // Reset loading state
        state.statistics = action.payload; // Update statistics with fetched data
      })
      .addCase(fetchStatisticsAsync.rejected, (state, action) => {
        state.isLoading = false; // Reset loading state
        state.error = action.error.message || "An unknown error occurred"; // Capture any error
      })

      // select music
      .addCase(setSelectedMusic, (state, action) => {
        state.selectedMusic = action.payload; // Update selected music
      })
      // toggle play/pause
      .addCase(togglePlayPause, (state) => {
        state.isPlaying = !state.isPlaying; // Toggle playing state
      })

      // Add this case in your reducer
      .addCase(clearAddMusicStatus, (state) => {
        state.status = null; // Reset status
        state.isLoading = false; // Reset loading state
        state.error = null; // Clear error
      });
});

export default musicReducer;