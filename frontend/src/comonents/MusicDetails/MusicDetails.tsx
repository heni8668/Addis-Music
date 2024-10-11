import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams} from "react-router-dom";
import { deleteMusicAsync} from '../../redux/actions/musicActions'

const MusicDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const successMessage = useRef(false);
  const { _id } = useParams<{ _id: string }>();
  const musicData = useAppSelector((state) => state.musics.musics);
  const selectedMusic = musicData.find((m) => m._id === _id);
  const status = useAppSelector((state) => state.musics.status);


  useEffect(() => {
    if (status === 201 && !successMessage.current) {
      toast.success("Music has been successfully updated", { autoClose: 3000 });
    } else if (status === 500 && !successMessage.current) {
      toast.error("Error updating music", { autoClose: 3000 });
    }
    return () => {
      if (status === 200) {
        successMessage.current = true;
      }
    };
  }, [status]);


// handle delete music
  const handleDeleteMusic = async () => {
    if (_id) {
      if (window.confirm("Are you sure you want to delete this music?")) {
        await dispatch(deleteMusicAsync(_id));
        toast.success("Music deleted successfully!");
        navigate("/");
      }
    } else {
      console.error("Music ID is undefined.");
    }
  };


  if (!selectedMusic) return <div>Music Not Found</div>
  return (
    <div>
      <DetailContainer>
        <CoverImage
          src={selectedMusic.coverImage.secure_url}
          alt={selectedMusic.title}
        />
        <Details>
          <Title>{selectedMusic.title}</Title>
          <Artist>{selectedMusic.artist}</Artist>
          <Album>{selectedMusic.album}</Album>
          <ButtonContainer>
            <UpdateButton
              onClick={() => {
                navigate(`/musics/update/${_id}`);
              }}
            >
              Update
            </UpdateButton>
            <DeleteButton onClick={handleDeleteMusic}>Delete</DeleteButton>
          </ButtonContainer>
        </Details>
      </DetailContainer>
      <ToastContainer />
    </div>
  );
};

// Styled components
const DetailContainer = styled.div`
  padding: 20px;
  display: flex;
`;

const CoverImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin-right: 20px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0;
`;

const Artist = styled.p`
  margin: 5px 0;
`;

const Album = styled.p`
  margin: 5px 0;
  color: #555;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const UpdateButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #2980b9;
  }
`;

const DeleteButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
`;

export default MusicDetails