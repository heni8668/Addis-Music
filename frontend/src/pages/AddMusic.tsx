import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addMusicAsync,
  // clearAddMusicStatus,
} from "../redux/actions/musicActions";
import { AddMusicData } from "../redux/Types/musicTypes";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  artist: Yup.string().required("Artist is required"),
  album: Yup.string().required("Album is required"),
  genre: Yup.string().required("Genre is required"),
  file: Yup.mixed().required("Music file is required"),
  coverImage: Yup.mixed().required("Cover image is required"),
});

const AddMusic: React.FC = () => {
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector((state) => state.musics.isLoading);
  const successMessage = useRef<boolean>(false);

  
  
  // Initial form values
  const initialValues: Omit<AddMusicData, "file" | "coverImage"> & {
    file: File | null;
    coverImage: File | null;
  } = {
    title: "",
    artist: "",
    album: "",
    genre: "",
    file: null,
    coverImage: null,
  };

  const handleSubmit = async (
    values: Omit<AddMusicData, "file" | "coverImage"> & {
      file: File | null;
      coverImage: File | null;
    },
    { resetForm, setSubmitting }: FormikHelpers<typeof values>
  ) => {
    if (!file || !coverImage) {
      console.error("File and cover image are required");
      setSubmitting(false);
      return;
    }

    const { title, artist, album, genre } = values;
    const addMusicData = {
      title,
      artist,
      album,
      genre,
      file,
      coverImage,
    };

    // Prevent double submission by checking if successMessage.current is true
    if (successMessage.current) return;
   

    try {
      if (isLoading) return; // Prevent double submission
      // Dispatch the action and await its resolution
      await dispatch(addMusicAsync(addMusicData)).unwrap(); // `unwrap()` to handle success/failure properly

      // If successful, show the success message and reset form
      toast.success("Music has been created successfully", {
        autoClose: 3000,
      });

      //  await dispatch(clearAddMusicStatus());
      successMessage.current = true; // Mark success to prevent another submission

      // Reset the form after successful submission
      resetForm();
      setSubmitting(false);

      // Navigate to the home page (or wherever you want) after a delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      // Handle the error case
      toast.error("Failed to add song, please try again", {
        autoClose: 3000,
      });
      console.error("Error adding music:", error);
      setSubmitting(false);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  

  return (
    <div>
      <FormContainer>
        <h2>Add New Music</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Enter music title"
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
                <input
                  type="file"
                  name="file"
                  accept=".mp3"
                  onChange={(e) => {
                    handleFileChange(e);
                    setFieldValue(
                      "file",
                      e.target.files ? e.target.files[0] : null
                    );
                  }}
                />
                <ErrorMessage name="file" component={ErrorText} />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="coverImage">Cover Image</Label>
                <input
                  type="file"
                  name="coverImage"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => {
                    handleCoverImageChange(e);
                    setFieldValue(
                      "coverImage",
                      e.target.files ? e.target.files[0] : null
                    );
                  }}
                />
                <ErrorMessage name="coverImage" component={ErrorText} />
              </FormGroup>
              <Button type="submit" disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting  ? "Adding..." : "Add Song"}
              </Button>
            </Form>
          )}
        </Formik>
      </FormContainer>
      <ToastContainer />
    </div>
  );
};

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
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

export default AddMusic;
