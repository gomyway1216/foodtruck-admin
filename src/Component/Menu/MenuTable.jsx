import React, { useEffect, useState } from 'react';
import * as api from '../../Firebase/home';
import { Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridToolbarContainer, 
  GridToolbarColumnsButton, GridToolbarFilterButton, 
  GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import ReplayIcon from '@mui/icons-material/Replay';
import EditIcon from '@mui/icons-material/Edit';
import EditMenuModal from './EditMenuModal';
import AddMenuModal from './AddMenuModal';
import styles from './menu-table.module.scss';

const MenuTable = () => {
  const [menuList, setMenuList] = useState([]);
  const [menuTypeList, setMenuTypeList] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogItem, setDialogItem] = useState({});
  const [addMenuDialogOpen, setAddMenuDialogOpen] = useState(false);

  // the default width is 100px
  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'subTitle', headerName: 'Sub Title', width: 150 },
    { field: 'type', headerName: 'Type' },
    { field: 'price', headerName: 'Price', width: 70 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'ingredients', headerName: 'Ingredients', flex: 1 },
    { field: 'isVisibleToCustomer', headerName: 'Visible', width: 80, type: 'boolean' },
    { field: 'isAvailable', headerName: 'Available', width: 80, type: 'boolean' },
    {
      field: 'action',
      headerName: 'Edit',
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          setDialogItem(params.row);
          handleDialogOpen();
        };
        return (
          <Tooltip title="edit">
            <IconButton aria-label="edit" onClick={onClick} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        );
      },
    }
  ];

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const getMenuList = async () => {
    const menus = await api.getMenuList();
    setMenuList(menus);
  };

  const getMenuTypeList = async () => {
    const menuTypes = await api.getMenuTypeList();
    setMenuTypeList(menuTypes);
  };

  const getIngredientsList = async () => {
    const ingredients = await api.getIngredientList();
    setIngredientList(ingredients);
  };

  useEffect(() => {
    getMenuList();
    getMenuTypeList();
    getIngredientsList();
  }, []);

  const handleAddMenuClick = () => {
    setAddMenuDialogOpen(true);
  };

  const handleAddMenuDialogClose = () => {
    setAddMenuDialogOpen(false);
  };
  
  return (
    <div className={styles.menuTableRoot}>
      <div className={styles.commands}>
        <Button onClick={handleAddMenuClick} variant="outlined" >Add menu</Button>
        <Button onClick={getMenuList} variant="outlined" startIcon={<ReplayIcon />}>Update</Button>
      </div>
      <DataGrid
        rows={menuList}
        columns={columns}
        components={{ Toolbar: () => {
          return (
            <GridToolbarContainer>
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
            </GridToolbarContainer>);
        }}}
      />
      <EditMenuModal item={dialogItem} open={dialogOpen} onClose={handleDialogClose} callback={getMenuList} menuTypeList={menuTypeList} ingredientList={ingredientList}/>
      <AddMenuModal open={addMenuDialogOpen} onClose={handleAddMenuDialogClose} callback={getMenuList} menuTypeList={menuTypeList} ingredientList={ingredientList}/>
    </div>
  );
};

export default MenuTable;