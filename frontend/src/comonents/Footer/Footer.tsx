// Footer.js
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #34495e;
  color: #fff;
  text-align: center;
  padding: 10px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2024 Addis Music App. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
