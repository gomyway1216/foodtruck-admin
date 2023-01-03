import React, { useEffect, useState } from 'react';
import * as api from '../../Firebase/home';
import { Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton,
  GridToolbarFilterButton, GridToolbarDensitySelector, 
  GridToolbarExport } from '@mui/x-data-grid';
import ReplayIcon from '@mui/icons-material/Replay';
import EditIcon from '@mui/icons-material/Edit';
import EditMenuDialog from './EditMenuDialog';
import styles from './menu-table.module.scss';

const MenuTable = () => {
  const [menuList, setMenuList] = useState([]);
  const [menuTypeList, setMenuTypeList] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [dialogItem, setDialogItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // the default width is 100px
  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'title', headerName: 'Title', width: 150 },
    { field: 'subTitle', headerName: 'Sub Title', width: 150 },
    { field: 'type', headerName: 'Type' },
    { field: 'price', headerName: 'Price', width: 70 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'ingredients', headerName: 'Ingredients', flex: 1 },
    { field: 'isVisibleToCustomer', headerName: 'Visible', 
      width: 80, type: 'boolean' },
    { field: 'isAvailable', headerName: 'Available', 
      width: 80, type: 'boolean' },
    {
      field: 'action',
      headerName: 'Edit',
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          setDialogItem(params.row);
          setDialogOpen(true);
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

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogItem(null);
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

  const updateList = async () => {
    getMenuList();
    getMenuTypeList();
    getIngredientsList();
  };

  useEffect(() => {
    getMenuList();
    getMenuTypeList();
    getIngredientsList();
  }, []);
  
  return (
    <div className={styles.menuTableRoot}>
      <div className={styles.commands}>
        <Button onClick={() => setDialogOpen(true)} 
          variant="outlined" >Add menu</Button>
        <Button onClick={updateList} variant="outlined" 
          startIcon={<ReplayIcon />}>Update</Button>
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
      <EditMenuDialog open={dialogOpen} onClose={handleDialogClose} 
        callback={getMenuList} existingItem={dialogItem}
        onSave={dialogItem ? api.updateMenu : api.addMenu }
        menuTypeList={menuTypeList} ingredientList={ingredientList}/>
      {/* <AddMenuDialog open={addMenuDialogOpen} 
        onClose={() => setAddMenuDialogOpen(false)} callback={getMenuList} 
        menuTypeList={menuTypeList} ingredientList={ingredientList}/> */}
    </div>
  );
};

export default MenuTable;