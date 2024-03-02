import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarColumnsButton, 
  GridToolbarFilterButton, GridToolbarDensitySelector, 
  GridToolbarExport } from '@mui/x-data-grid';
import ReplayIcon from '@mui/icons-material/Replay';
import EmailIcon from '@mui/icons-material/Email';
import ViewValueDialog from './ViewValueDialog';
import styles from './general-table.module.scss';

const FeedbackTable = (props) => {
  const [valueList, setValueList] = useState([]);
  const [dialogItem, setDialogItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'body', headerName: 'Body', flex: 1 },
    {
      field: 'rating',
      headerName: 'Rating',
      flex: 1,
      type: 'number', // Specify the column type as 'number'
    },
    { field: 'action', 
      headerName: 'Edit',
      width: 80,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // Prevent row click
          const email = params.row.email;
          const subject = encodeURIComponent('Tokachi Musubi');
          const body = encodeURIComponent(`Hello, ${params.row.name}`);
          window.open(`mailto:${email}?subject=${subject}&body=${body}`);
        };

        if (params.row.email) {
          return (
            <Tooltip title="Send Email">
              <IconButton aria-label="send email" onClick={onClick} color="primary">
                <EmailIcon />
              </IconButton>
            </Tooltip>
          );
        } else {
          return null;
        }
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

  const handleRowClick = (params) => {
    setDialogItem(params.row);
    setDialogOpen(true);
  };

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  return (
    <div className={styles.menuTableRoot}>
      <div className={styles.commands}>
        <Button onClick={getValueList} variant="outlined" 
          startIcon={<ReplayIcon />}>Update</Button>
      </div>
      <DataGrid
        rows={valueList}
        columns={columns}
        onRowClick={handleRowClick}
        components={{ Toolbar: CustomToolbar }}
      />
      <ViewValueDialog open={dialogOpen} onClose={handleDialogClose} item={dialogItem} />
    </div>
  );
};

FeedbackTable.propTypes = {
  getList: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default FeedbackTable;