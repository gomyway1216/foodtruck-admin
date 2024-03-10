import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@mui/material';
import {
  DataGrid, GridToolbarContainer, GridToolbarColumnsButton,
  GridToolbarFilterButton, GridToolbarDensitySelector,
  GridToolbarExport
} from '@mui/x-data-grid';
import ReplayIcon from '@mui/icons-material/Replay';
import EmailButton from '../Feedback/EmailButton';
import TimeUrgencyIndicator from '../Feedback/TimeUrgencyIndicator';
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
      width: 80,
      type: 'number', // Specify the column type as 'number'
    },
    { field: 'creationTime', headerName: 'Creation Time', flex: 1 },
    { field: 'eventLocation', headerName: 'Event Location', flex: 1 },
    { field: 'tags', headerName: 'Tags', flex: 1 },
    {
      field: 'responding',
      headerName: 'Responding',
      width: 100,
      sortable: false,
      renderCell: (params) => {
        return (
          <Tooltip title="Responding status">
            <TimeUrgencyIndicator
              email={params.row.email}
              creationTime={params.row.creationTime}
              hasResponded={params.row.hasResponded} />
          </Tooltip>
        );

      }
    },
    {
      field: 'action',
      headerName: 'Email',
      width: 80,
      sortable: false,
      renderCell: (params) => {
        if (params.row.email) {
          return (
            <Tooltip title="Send Email">
              <EmailButton email={params.row.email} />
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