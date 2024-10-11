import React, { ReactNode, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchMusicsAsync, setSelectedMusic, togglePlayPause } from "../../redux/actions/musicActions";
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link for navigation
import styled from "styled-components";
import { Music } from '../../redux/Types/musicTypes';
import Player from '../Player/Player';

const MusicList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { musics, isLoading, error, selectedMusic, isPlaying } = useAppSelector(
    (state) => state.musics
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [artists, setArtists] = useState<string[]>([]);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [likedSongs, setLikedSongs] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Dispatch the fetch music action when the component mounts
    dispatch(fetchMusicsAsync());
  }, [dispatch]);

  //handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value);
  };

  // Filtered and Searched Data
  const displayedMusic = musics.filter((song) => {
    const matchesSearch = song?.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "artist" && artists.includes(song._id)) ||
      (filter === "album" && playlist.includes(song._id)) ||
      (filter === "" && artists.includes(song._id));

    return matchesSearch && matchesFilter;
  });

  
  const playMusic = (song: Music) => {
    // Set the selected music and toggle play/pause
    if (selectedMusic?._id === song._id) {
      // If the clicked music is already playing, just toggle play/pause
      dispatch(togglePlayPause(!isPlaying));
    } else {
      // Otherwise, set the selected music and start playing
      dispatch(setSelectedMusic(song));
      dispatch(togglePlayPause(true));
    }
  };

  // Toggle Like
  const toggleLike = (_id: string):void => {
    setLikedSongs((prev: string[]) =>
      prev.includes(_id) ? prev.filter((songId) => songId !== _id) : [...prev, _id]
    );
  };


  // Toggle Favorite
  const toggleFavorite = (_id: string):void => {
    setArtists((prev: string[]) =>
      prev.includes(_id) ? prev.filter((songId) => songId !== _id) : [...prev, _id]
    );
  };

  //Add to playlist
  const addToPlaylist = (_id: string): void => {
    setPlaylist((prev: string[]) =>
      prev.includes(_id) ? prev.filter((songId) => songId!== _id) : [...prev, _id]
);
alert('You want to add to playlist')
  };

  
  

  return (
    <MainContainer>
      <SearchFilterContainer>
        <SearchBar
          type="text"
          placeholder="Search for music..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <FilterDropdown value={filter}>
          <option value="all">All</option>
          <option value="artists">Artists</option>
          <option value="playlist">Playlist</option>
        </FilterDropdown>
      </SearchFilterContainer>

      <MusicGrid>
        
        { isLoading ? <Loading>The Music is Loading...</Loading>:displayedMusic.map((song) => (
          <MusicCard key={song._id}>
            {/* Click to play the song */}
            <MusicCardImage
              src={song.coverImage.secure_url}
              alt={`${song.title} cover`}
              onClick={() => playMusic(song)}
            />
            <MusicInfo>
              {/* Click to route to music details */}
              <Link to={`/musics/${song._id}`}>
                <MusicTitle>Title:{song?.title}</MusicTitle>
              </Link>
              <ArtistName>Artist: {song?.artist}</ArtistName>
              <ArtistName>Album: {song?.album}</ArtistName>
              <ArtistName>Genre: {song?.genre}</ArtistName>
            </MusicInfo>
            <IconContainer>
              <IconButton onClick={() => toggleLike(song._id)}>
                {likedSongs.includes(song._id) ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart color="black" />
                )}
              </IconButton>
              <IconButton onClick={() => toggleFavorite(song._id)}>
                {artists.includes(song._id) ? (
                  <FaStar color="gold" />
                ) : (
                  <FaRegStar />
                )}
              </IconButton>
              <IconButton onClick={() => addToPlaylist(song._id)}>
                <FaPlus />
              </IconButton>
            </IconContainer>
          </MusicCard>
        ))}
      </MusicGrid>
      <Player musicList={musics} />
    </MainContainer>
  );
}

// Styled Components
const MainContainer = styled.div`
  padding: 20px;
`;

const SearchFilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  padding: 10px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  flex: 1;
`;

const FilterDropdown = styled.select`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const MusicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 50px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MusicCard = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MusicCardImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 10px;
  cursor: pointer;
`;

const MusicInfo = styled.div`
  margin-top: 10px;
`;

const MusicTitle = styled.h4`
  margin: 5px 0;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:hover {
    color: #2980b9;
  }
`;

const ArtistName = styled.p`
  margin: 0;
  color: #555;
  font-size: 15px;
  font-weight: 600;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #2980b9;
  font-size: 1.2em;

  &:hover {
    color: #f1c40f;
  }

`;
const Loading = styled.h3`
text-align: center;
font-size: 20px;
font-weight: bold;
`;

export default MusicList