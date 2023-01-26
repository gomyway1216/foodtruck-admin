import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, LinearProgress, TextField } from '@mui/material';
import * as api from '../../Firebase/menu';
import styles from './image-upload.module.scss';

const ImageUpload = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(props.originalImageUrl);
  const [loading, setLoading] = useState(false);

  const onFileChange = async () => {
    setLoading(true);
    const downloadURL = await api.getMenuImageRef(selectedImage);
    setImageUrl(downloadURL);
    props.handleImageUrl(downloadURL);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedImage) {
      onFileChange();
    }
  }, [selectedImage]);

  return (
    <>
      <div className={styles.uploadButton}>
        <input
          accept="image/*"
          type="file"
          id="select-image"
          style={{ display: 'none' }}
          onChange={(e) => setSelectedImage(e.target.files[0])}
        />
        <label htmlFor="select-image">
          <Button variant="contained" color="primary" component="span">
          Upload Image
          </Button>
        </label>
        <div className={styles.fileName}>
          <TextField
            disabled
            size="small"
            style={{ display: imageUrl ? 'inline' : 'none' }}
            variant="standard"
            value={selectedImage ? selectedImage.name: 
              (imageUrl ? imageUrl : '')}
          />
        </div>
      </div>
      <Box sx={{ width: '100%' }}>
        {loading && <LinearProgress />}
      </Box>
      {imageUrl && (
        <Box mt={2} textAlign="center">
          <div>Image Preview:</div>
          <img src={imageUrl} alt={selectedImage ? 
            selectedImage.name : imageUrl} className={styles.imagePreview} />
        </Box>
      )}
    </>
  );
};

ImageUpload.propTypes = {
  handleImageUrl: PropTypes.func.isRequired,
  originalImageUrl: PropTypes.string
};


export default ImageUpload;