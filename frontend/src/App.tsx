import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./comonents/Sidebar/Sidebar";
import Navbar from "./comonents/Navbar/Navbar";
import Footer from "./comonents/Footer/Footer";
import MusicList from "./comonents/MusicList/MusicList";
import AddMusic from "./pages/AddMusic";
import MusicDetails from "./comonents/MusicDetails/MusicDetails";
import MusicUpdate from "./pages/MusicUpdate";
import Statistics from "./pages/Statistics";
import PlayList from "./pages/PlayList";
import FavoriteMusic from "./pages/FavoriteMusic";
import LikedMusic from "./pages/LikedMusic";

const App = () => {
  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <ContentContainer>
          <Navbar />
          <MainContent>
            <Routes>
              <Route path="/" element={<MusicList />} />
              <Route path="musics/:_id" element={<MusicDetails />} />
              <Route path="musics/add-music" element={<AddMusic />} />
              <Route path="musics/update/:_id" element={<MusicUpdate />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="playlist" element={<PlayList />} />
              <Route path="favorite" element={<FavoriteMusic />} />
              <Route path="liked-music" element={<LikedMusic />} />
            </Routes>
          </MainContent>
          <Footer />
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh; /* Full height of the viewport */
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.div`
  flex-grow: 1; /* Ensures this grows to fill space, pushing the footer down */
`;
export default App