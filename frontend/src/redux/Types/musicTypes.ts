// types.ts
export interface MusicFile {
  public_id: string;
  secure_url: string;
}

export interface Music {
  file: MusicFile;
  coverImage: MusicFile;
  _id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
}

export interface AddMusicData {
  file: File; // File object for the music file
  coverImage: File; // File object for the cover image
  title: string;
  artist: string;
  album: string;
  genre: string;
}

// Define a type for the statistics response
export interface Statistics {
    totalMusic: number;
    totalGenres: number;
    totalAlbums: number;
}

// Define the shape of the initial state
export interface MusicState {
  musics: Music[];
  error: string | null;
  status: number | null;
  isLoading: boolean;
  selectedMusic: Music | null;
  isPlaying: boolean;
  statistics: Statistics | null;
}