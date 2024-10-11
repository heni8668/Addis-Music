import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import styled from "styled-components";
import { fetchStatisticsAsync} from '../redux/actions/musicActions'

const Statistics: React.FC = () => {
    const dispatch = useAppDispatch();
    const statistics= useAppSelector((state) => state.musics.statistics);
    const {isLoading, error} = useAppSelector((state) => state.musics)
    // console.log(statistics);
    
    useEffect(() => {
        dispatch(fetchStatisticsAsync());
    }, [dispatch]);

    if (isLoading) {
        return <p>Loading Statistics...</p>
    } 

    if (error) {
        return <p>Error Loading Statistics: {error}</p>
    }
  return (
    <CardContainer>
      <StatCard>
        <Title>Total Music</Title>
        <Stat>{statistics?.totalMusic}</Stat>
      </StatCard>
      <StatCard>
        <Title>Total Genres</Title>
        <Stat>{statistics?.totalGenres}</Stat>
      </StatCard>
      <StatCard>
        <Title>Total Albums</Title>
        <Stat>{statistics?.totalAlbums}</Stat>
      </StatCard>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  display: flex; /* Use flexbox for layout */
  justify-content: space-around; /* Space out the cards */
  flex-wrap: wrap; /* Allow cards to wrap on smaller screens */
  margin: 20px; /* Margin around the container */
`;

const StatCard = styled.div`
  background-color: #f9f9f9; /* Light background */
  border-radius: 8px; /* Rounded corners */
  padding: 20px; /* Padding inside the card */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Shadow effect */
  margin: 10px; /* Margin between cards */
  flex: 1; /* Allow cards to grow and shrink */
  min-width: 200px; /* Minimum width for each card */
  text-align: center; /* Center text */
`;

const Title = styled.h2`
  font-size: 1.5rem; /* Font size for the title */
  margin-bottom: 15px; /* Margin below the title */
`;

const Stat = styled.p`
  font-size: 1.2rem; /* Font size for the statistics */
  margin: 5px 0; /* Margin above and below each statistic */
`;

export default Statistics
