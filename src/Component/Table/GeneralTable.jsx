import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ReplayIcon from '@mui/icons-material/Replay';
import EditIcon from '@mui/icons-material/Edit';
import EditValueDialog from './EditValueDialog';
import styles from './general-table.module.scss';


const MenuTable = (props) => {
  const [valueList, setValueList] = useState([]);
  const [dialogItem, setDialogItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Value', flex: 1 },
    { field: 'action', 
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
      }
  
    }
  ];

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogItem(null);
  };

  const getValueList = async () => {
    const values = await props.getList();
    setValueList(values);
  };

  useEffect(() => {
    getValueList();
  }, []);

  return (
    <div className={styles.menuTableRoot}>
      <div className={styles.commands}>
        <Button onClick={() => setDialogOpen(true)} 
          variant="outlined">Add</Button>
        <Button onClick={getValueList} variant="outlined" 
          startIcon={<ReplayIcon />}>Update</Button>
      </div>
      <DataGrid
        rows={valueList}
        columns={columns}
      />
      <EditValueDialog open={dialogOpen} onClose={handleDialogClose} 
        callback={getValueList} existingItem={dialogItem} 
        onSave={dialogItem ? props.onUpdate : props.onAdd}/>
    </div>
  );
};

MenuTable.propTypes = {
  getList: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default MenuTable;