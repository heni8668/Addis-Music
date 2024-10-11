// Navbar.js
import styled from "styled-components";
import { Link } from "react-router-dom";

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #2980b9;
  padding: 20px 20px;
  color: #fff;
`;

const NavbarLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  margin: 0 10px;
  font-size: 18px;

  &:hover {
    color: #f1c40f;
  }
`;

const NavBar = () => {
  return (
    <NavbarContainer>
      <NavbarLink to="musics/add-music">Add Song</NavbarLink>
      <NavbarLink to="/statistics">Statistics</NavbarLink>
    </NavbarContainer>
  );
};

export default NavBar;
