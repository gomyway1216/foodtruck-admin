import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Dialog, DialogActions, DialogContent, 
  DialogTitle, LinearProgress, TextField } from '@mui/material';
import Alert from '../../Component/PopUp/Alert';

const defaultItem = {
  id: '',
  name: ''
};

export const EditValueDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  const [item, setItem] = useState(defaultItem);
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    setOpen(props.open);
    if(props.existingItem) {
      setItem(props.existingItem);
    } else {
      setItem(defaultItem);
    }
  }, [props.open]);

  const onInputChange = (e) => {
    setItem({
      ...item,
      name: e.target.value
    });
  };

  const onSave = async () => {
    try {
      if(!item.name) {
        setInputError('value cannot be empty!');
        return;
      } else {
        setInputError('');
      }

      setLoading(true);
      await props.onSave(item);
      props.onClose();
      props.callback();
    } catch (error) {
      setApiError(error.message);
    }
    setLoading(false);
  };

  const handleAlertClose = () => {
    setApiError('');
  };

  // due to the MUI library bug that DialogTitle overrides the padding-top 
  // of DialogContent paddingTop: '20px' needs to be added. 
  // Otherwise, the DialogTitle overlaps the TextField
  return (
    <>
      {apiError && <Alert message={apiError} onClose={handleAlertClose}/>}
      <Dialog open={open} onClose={() => props.onClose()} fullWidth>
        <DialogTitle>{props.existingItem ? 'Edit Value' 
          : 'Add Value'}</DialogTitle>
        <Box sx={{ width: '100%' }}>
          {loading && <LinearProgress />}
        </Box>
        <DialogContent style={{paddingTop: '20px'}}>
          <TextField id='value' name='value' label='value'
            autoFocus
            fullWidth
            required
            helperText={inputError}
            value={item.name} 
            onChange={onInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

EditValueDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  existingItem: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  })
};

export default EditValueDialog;