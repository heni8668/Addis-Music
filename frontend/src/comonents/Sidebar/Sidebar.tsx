// Sidebar.js
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 200px;
  background-color: #2c3e50;
  color: #fff;
  height: 100vh;
  padding: 20px;
`;

const SidebarLink = styled.a`
  display: block;
  color: #fff;
  padding: 10px;
  margin-bottom: 10px;
  text-decoration: none;

  &:hover {
    background-color: #34495e;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarLink href="/">Songlist</SidebarLink>
      <SidebarLink href="/favorite">Favorite</SidebarLink>
      <SidebarLink href="/playlist">Playlist</SidebarLink>
      <SidebarLink href="/liked-music">Liked Music</SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
