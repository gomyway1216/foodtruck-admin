import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../../Firebase/home';
import { Button, Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, 
  FormControlLabel, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, Switch, TextField } from '@mui/material';
import ImageUpload from '../Image/ImageUpload';

const defaultItem = {
  title: '',
  subTitle: '',
  type: '',
  price: 0,
  ingredients: [],
  description: '',
  isVisibleToCustomer: false,
  isAvailable: false,
  image: ''
};

const defaultErrorDescription = {
  title: '',
  subTitle: '',
  type: '',
  price: '',
  ingredients: '',
  description: '',
  isVisibleToCustomer: '',
  isAvailable: '',
  image: ''
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    },
  },
};

const AddMenuModal = (props) => {
  const [open, setOpen] = useState(props.open);
  const [dialogItem, setDialogItem] = useState(defaultItem);
  const [errorDescription, setErrorDescription] = useState(defaultErrorDescription);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onItemInputChange = (e) => {
    setDialogItem({
      ...dialogItem,
      [e.target.name]: e.target.value
    });
  };

  const onSelectInputChange = (e) => {
    setDialogItem({
      ...dialogItem,
      [e.target.name]: e.target.value
    });
  };

  const onSwitchChange = (e) => {
    setDialogItem({
      ...dialogItem,
      [e.target.name]: e.target.checked
    });
  };

  const handleMultipleSelectChange = (e) => {
    // On autofill we get a stringified value.
    const val = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
    setDialogItem({
      ...dialogItem,
      [e.target.name]: val
    });
  };

  const handleImageUrl = (imageUrl) => {
    setDialogItem({
      ...dialogItem,
      'image': imageUrl
    });
  };

  const onSave = async () => {
    try {
      const item = dialogItem;
      item.price = Number(item.price);
      setLoading(true);
      // verify the input is valid
      const { title, type, price, description, image } = item;
      let errorExist = false;
      const errDescCopy = errorDescription;
      if(!title) {
        errorExist = true;
        errDescCopy.title = 'title needs to be set';
      } else {
        errDescCopy.title = '';
      }

      if (!type) {
        errorExist = true;
        errDescCopy.type = 'type needs to be set';
      } else {
        errDescCopy.type = '';
      }

      if (!price) {
        errorExist = true;
        errDescCopy.price = 'price needs to be set';
      } else {
        errDescCopy.price = '';
      }

      if(!description) {
        errorExist = true;
        errDescCopy.description = 'description needs to be set';
      } else {
        errDescCopy.description = '';
      }
      setErrorDescription(errDescCopy);

      if(errorExist) {
        return;
      }

      const docId = await api.addMenu(item);
      if (docId) {
        // TODO: create response handler
        props.onClose();
        setDialogItem(defaultItem);
        props.callback();
      } else {
        console.error('saving the new menu failed.');
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  
  return (
    <div>
      <Dialog open={open} onClose={() => props.onClose()} fullWidth>
        <DialogTitle>Add Menu</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>      
            <Grid container item={true} xs={12} sm={12} md={12}>
              <ImageUpload handleImageUrl={handleImageUrl} />
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='title' name='title' label='title'
                fullWidth
                required
                helperText={errorDescription['title']}
                value={dialogItem['title']} 
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='subTitle' name='subTitle' label='Sub Title'
                fullWidth
                helperText={errorDescription['subTitle']}
                value={dialogItem['subTitle']} 
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <FormControl>
                <InputLabel id="orderby-select-label">Type</InputLabel>
                <Select
                  id="type"
                  name="type"
                  required
                  value={dialogItem['type']}
                  onChange={onSelectInputChange}
                  style={{width: 200}}
                  label="Type"
                >
                  {props.menuTypeList.map((type, i) =>
                    <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                  )}
                </Select>
                <FormHelperText>{errorDescription['type']}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='price' name='price' label='price'
                fullWidth
                required
                helperText={errorDescription['price']}
                value={dialogItem['price']}
                type="number"
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <FormControl sx={{ width: 300 }}>
                <InputLabel id="ingredients-label">Ingredients</InputLabel>
                <Select
                  id="ingredients"
                  name="ingredients"
                  multiple
                  value={dialogItem['ingredients']}
                  onChange={handleMultipleSelectChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Ingredients" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                  labelId="ingredients-label"
                >
                  {props.ingredientList.map((ingredient) => (
                    <MenuItem
                      key={ingredient.id}
                      value={ingredient.name}
                    >
                      {ingredient.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='description' name='description' label='Description'
                fullWidth
                required
                helperText={errorDescription['description']}
                value={dialogItem['description']} 
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <FormControlLabel
                control={<Switch
                  name='isVisibleToCustomer'
                  checked={dialogItem['isVisibleToCustomer']}
                  onChange={onSwitchChange}
                />}
                label='Make this menu visible to customer'
              />
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <FormControlLabel
                control={<Switch
                  name='isAvailable'
                  checked={dialogItem['isAvailable']}
                  onChange={onSwitchChange}
                />}
                label='Still stocked'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AddMenuModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  menuTypeList: PropTypes.array.isRequired,
  ingredientList: PropTypes.array.isRequired
};

export default AddMenuModal;