import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Chip, Dialog, DialogActions, DialogContent, DialogTitle, 
  FormControl, FormControlLabel, FormHelperText, Grid, InputLabel, 
  LinearProgress, MenuItem, OutlinedInput, Select, 
  Switch, TextField } from '@mui/material';
import ImageUpload from '../Image/ImageUpload';
import Alert from '../../Component/PopUp/Alert';

const defaultItem = {
  title: '',
  subTitle: '',
  type: '',
  price: 0,
  cost: 0,
  ingredients: [],
  description: '',
  order: 0, // order of the food displayed
  originalStockCount: 0,
  soldCount: 0,
  canceledCount: 0,
  isVisibleToCustomer: false,
  isAvailable: false,
  image: ''
};

const defaultInputError = {
  title: '',
  subTitle: '',
  type: '',
  price: '',
  cost: '',
  ingredients: '',
  description: '',
  order: '',
  originalStockCount: '',
  soldCount: '',
  canceledCount: '',
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

const EditMenuDialog = (props) => {
  const [open, setOpen] = useState(props.open);
  // const [dialogItem, setDialogItem] = useState(props.item);
  const [item, setItem] = useState(defaultItem);
  const [inputError, setInputError] 
  = useState(defaultInputError);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [displayDeleteButton, setDisplayDeleteButton] = useState(false);

  useEffect(() => {
    setOpen(props.open);
    if (props.existingItem) {
      setItem(props.existingItem);
    } else {
      setItem(defaultItem);
    }
  }, [props.open]);

  const onItemInputChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value
    });
  };

  const onSelectInputChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value
    });
  };

  const onSwitchChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.checked
    });
  };

  const handleMultipleSelectChange = (e) => {
    // On autofill we get a stringified value.
    const val = typeof e.target.value === 'string' ? 
      e.target.value.split(',') : e.target.value;
    setItem({
      ...item,
      [e.target.name]: val
    });
  };

  const handleImageUrl = (imageUrl) => {
    setItem({
      ...item,
      'image': imageUrl
    });
  };

  const onSave = async () => {
    try {
      const itemCopy = item;
      itemCopy.price = Number(itemCopy.price);
      itemCopy.cost = Number(itemCopy.cost);
      itemCopy.order = Number(itemCopy.order);
      itemCopy.originalStockCount = Number(itemCopy.originalStockCount);
      itemCopy.soldCount = Number(itemCopy.soldCount);
      itemCopy.canceledCount = Number(itemCopy.canceledCount);
      // verify the input is valid
      const { title, type, price, description } = itemCopy;
      let errorExist = false;
      const inputErrorCopy = inputError;
      if(!title) {
        errorExist = true;
        inputErrorCopy.title = 'title needs to be set';
      } else {
        inputErrorCopy.title = '';
      }

      if (!type) {
        errorExist = true;
        inputErrorCopy.type = 'type needs to be set';
      } else {
        inputErrorCopy.type = '';
      }

      if (!price) {
        errorExist = true;
        inputErrorCopy.price = 'price needs to be set';
      } else {
        inputErrorCopy.price = '';
      }

      if(!description) {
        errorExist = true;
        inputErrorCopy.description = 'description needs to be set';
      } else {
        inputErrorCopy.description = '';
      }

      setInputError(inputErrorCopy);
      if(errorExist) {
        return;
      }

      setLoading(true);
      await props.onSave(itemCopy);
      props.onClose();
      props.callback();
    } catch (error) {
      setApiError(error.message);
    }
    setLoading(false);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await props.onDelete(props.existingItem.id);
      props.onClose();
      props.callback();
    } catch (error) {
      setApiError(error.message);
    }
    setLoading(false);
  };

  const handleDeleteClick = () => {
    setDisplayDeleteButton(true);
  };

  const handleAlertClose = () => {
    setApiError('');
  };

  return (
    <div>
      {apiError && <Alert message={apiError} onClose={handleAlertClose}/>}
      <Dialog open={open} onClose={() => props.onClose()} fullWidth>
        <DialogTitle>{props.existingItem ? 'Edit Value' 
          : 'Add Value'}</DialogTitle>
        <Box sx={{ width: '100%' }}>
          {loading && <LinearProgress />}
        </Box>
        <DialogContent>
          <Grid container spacing={3}>      
            <Grid container item={true} xs={12} sm={12} md={12}>
              <ImageUpload handleImageUrl={handleImageUrl} 
                originalImageUrl={item.image}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='title' name='title' label='title'
                fullWidth
                required
                helperText={inputError['title']}
                value={item['title']} 
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='subTitle' name='subTitle' label='Sub Title'
                fullWidth
                helperText={inputError['subTitle']}
                value={item['subTitle']} 
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <FormControl>
                <InputLabel id="orderby-select-label">Type</InputLabel>
                <Select
                  id="type"
                  name="type"
                  required
                  value={item['type']}
                  onChange={onSelectInputChange}
                  style={{width: 200}}
                  label="Type"
                >
                  {props.menuTypeList.map((type, i) =>
                    <MenuItem key={type.id} 
                      value={type.name}>{type.name}</MenuItem>
                  )}
                </Select>
                <FormHelperText>{inputError['type']}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='price' name='price' label='price'
                fullWidth
                required
                helperText={inputError['price']}
                value={item['price']}
                type="number"
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='cost' name='cost' label='cost'
                fullWidth
                required
                helperText={inputError['cost']}
                value={item['cost']}
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
                  value={item['ingredients']}
                  onChange={handleMultipleSelectChange}
                  input={<OutlinedInput id="select-multiple-chip" 
                    label="Ingredients" />}
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
                helperText={inputError['description']}
                value={item['description']} 
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='order' name='order' label='order'
                fullWidth
                required
                helperText={inputError['order']}
                value={item['order']}
                type="number"
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='originalStockCount' name='originalStockCount' 
                label='originalStockCount'
                fullWidth
                required
                helperText={inputError['originalStockCount']}
                value={item['originalStockCount']}
                type="number"
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='soldCount' name='soldCount' label='soldCount'
                fullWidth
                required
                helperText={inputError['soldCount']}
                value={item['soldCount']}
                type="number"
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <TextField id='canceledCount' name='canceledCount' 
                label='canceledCount'
                fullWidth
                required
                helperText={inputError['canceledCount']}
                value={item['canceledCount']}
                type="number"
                onChange={onItemInputChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <FormControlLabel
                control={<Switch
                  name='isVisibleToCustomer'
                  checked={item['isVisibleToCustomer']}
                  onChange={onSwitchChange}
                />}
                label='Make this menu visible to customer'
              />
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <FormControlLabel
                control={<Switch
                  name='isAvailable'
                  checked={item['isAvailable']}
                  onChange={onSwitchChange}
                />}
                label='Still stocked'
              />
            </Grid>
            <Grid item={true} xs={12} sm={12} md={12}>
              <Button color="error" 
                variant="outlined"
                onClick={handleDeleteClick}>Delete</Button>
              {displayDeleteButton && 
                <div>
                  Confirm? : 
                  <Button color="error" 
                    variant="outlined"
                    onClick={onDelete}>Yes</Button>
                </div>
              }
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

EditMenuDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  menuTypeList: PropTypes.array.isRequired,
  ingredientList: PropTypes.array.isRequired,
  existingItem: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    type: PropTypes.string,
    price: PropTypes.number,
    cost: PropTypes.number,
    ingredients: PropTypes.array,
    description: PropTypes.string,
    order: PropTypes.number,
    originalStockCount: PropTypes.number,
    soldCount: PropTypes.number,
    canceledCount: PropTypes.number,
    isVisibleToCustomer: PropTypes.bool,
    isAvailable: PropTypes.bool,
    image: PropTypes.string
  })
};

export default EditMenuDialog;