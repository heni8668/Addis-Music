import React, { useEffect, useRef, useState } from 'react'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AddMusicData, Music } from "../redux/Types/musicTypes";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {updateMusicAsync} from "../redux/actions/musicActions";
import { useNavigate, useParams } from 'react-router-dom';



// Validation schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  artist: Yup.string().required("Artist is required"),
  album: Yup.string().required("Album is required"),
  genre: Yup.string().required("Genre is required"),
  file: Yup.mixed().required("Music file is required"),
  coverImage: Yup.mixed().required("Cover image is required"),
});

// Define the form values type
interface FormValues {
  title: string;
  artist: string;
  album: string;
  genre: string;
}

const MusicUpdate: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const { _id } = useParams<{ _id: string }>();
  const musicData = useAppSelector((state) => state.musics.musics);
  const selectedMusic = musicData.find((m) => m._id === _id);
  const isLoading = useAppSelector((state) => state.musics.isLoading);
  const status = useAppSelector((state) => state.musics.status);
  const successMessage = useRef<boolean>(false);

  


 useEffect(() => {
   if (selectedMusic) {
     setCoverImagePreview(selectedMusic.coverImage.secure_url);
   }
 }, [selectedMusic]);

 useEffect(() => {
   if (!isLoading && (status === 201 || status === 200)) {
     setIsSubmitting(false);
     // If successful, show the success message and reset form
     toast.success("Music has been created successfully", {
       autoClose: 3000,
     });
     navigate("/");
   }
 }, [navigate, isLoading, status]);


  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("artist", values.artist);
    formData.append("album", values.album);
    formData.append("genre", values.genre);
    if (file) formData.append("file", file); // Only append if file is present
    if (coverImage) formData.append("coverImage", coverImage); // Only append if cover image is present

    try {
    //   setIsSubmitting(true);
      await dispatch(
        updateMusicAsync({ id: _id as string, musicData: formData  })
      );
    } catch (error) {
      console.error("Error while updating music", error);
    }
  };

  const handleCoverImageUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const File = e.target.files ? e.target.files[0] : null;
    if (File) {
      setCoverImage(File);
      setCoverImagePreview(URL.createObjectURL(File));
    }
  };

  const handleFileUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFile(file);
    }
  };


  return (
    <FormContainer>
      <h2>Update Music</h2>
      {selectedMusic ? (
        <Formik
          initialValues={{
            title: selectedMusic.title,
            artist: selectedMusic.artist,
            album: selectedMusic.album,
            genre: selectedMusic.genre,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter song title"
                />
                <ErrorMessage name="title" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="artist">Artist</Label>
                <Input
                  type="text"
                  name="artist"
                  placeholder="Enter artist name"
                />
                <ErrorMessage name="artist" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="album">Album</Label>
                <Input
                  type="text"
                  name="album"
                  placeholder="Enter album name"
                />
                <ErrorMessage name="album" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="genre">Genre</Label>
                <Input type="text" name="genre" placeholder="Enter genre" />
                <ErrorMessage name="genre" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="file">Music File</Label>
                <Input
                  type="file"
                  name="file"
                  accept=".mp3"
                  onChange={handleFileUpdate}
                />
                <ErrorMessage name="file" component={ErrorText} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  type="file"
                  name="coverImage"
                  accept=".png, .jpg, .jpeg"
                  onChange={handleCoverImageUpdate}
                />
                {coverImagePreview && (
                  <img src={coverImagePreview} alt="cover preview" />
                )}
                <ErrorMessage name="coverImage" component={ErrorText} />
              </FormGroup>

              <Button type="submit" disabled={isLoading || isSubmitting}>
                {isLoading ? "Updating..." : "Update Music"}
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <p>No music found with this ID</p>
      )}
    </FormContainer>
  );
}


const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 8px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default MusicUpdate