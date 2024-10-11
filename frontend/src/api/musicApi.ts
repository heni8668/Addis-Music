import axios from 'axios'
import { Music, AddMusicData } from '../redux/Types/musicTypes'

const BASE_URL = "http://localhost:8080/music";
// Fetching the music
export const fetchMusics = async (): Promise<Music[]> => {
    try {
        const response = await axios.get<Music[]>(`${BASE_URL}/`); // Specify the type of response
        console.log(response.data);
        
        return response.data;
    } catch (error: any) { // Specify the error type
        console.error('Error fetching music:', error.message);
        throw error;
    }
};


// Adding music
export const addMusic = async (musicData: AddMusicData): Promise<Music> => {
  try {
    const response = await axios.post(`${BASE_URL}/`, musicData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error adding music:", error.message);
    throw error;
  }
};


// Updating music
export const updateMusic = async (
  id: string,
  musicData: FormData | Partial<Omit<Music, "_id">>
): Promise<any> => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, musicData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error: any) {
    console.error("Error updating music:", error);
    return error.response;
  }
};

// Deleting music
export const deleteMusic = async (musicid: string): Promise< number > => {
    try {
        const response = await axios.delete(`${BASE_URL}/${musicid}`);
        return response.status;
    } catch (error: any) {
        console.error('Error deleting music:', error.message);
        throw error;
    }
};