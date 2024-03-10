import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText,
  Divider, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel
} from '@mui/material';
import * as feedbackApi from '../../Firebase/feedback';
import * as emailUtil from '../../Util/emailUtil';
import EmailButton from '../Feedback/EmailButton';
import PropTypes from 'prop-types';

const formatDate = (date) => {
  if (date instanceof Date) {
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  return date;
};

const ViewValueDialog = ({ open, onClose, item, onUpdateFeedback }) => {
  const [tags, setTags] = useState([]);
  const [hasResponded, setHasResponded] = useState(false);
  const [feedbackTypeList, setFeedbackTypeList] = useState([]);


  // Populate state when item changes
  useEffect(() => {
    if (item) {
      setTags(item.tags || []);
      setHasResponded(item.hasResponded || false);
    }

    const fetchData = async () => {
      const typeList = await feedbackApi.getFeedbackTypeList();
      setFeedbackTypeList(typeList);
    };

    fetchData();
  }, [item]);

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    setTags(typeof value === 'string' ? value.split(',') : value);
  };

  const handleHasRespondedChange = async (event) => {
    const newHasResponded = event.target.checked;
    setHasResponded(newHasResponded);
    await feedbackApi.setHasResponded(item.id, newHasResponded);

    // update parent
    if (onUpdateFeedback) {
      onUpdateFeedback({ ...item, hasResponded: newHasResponded });
    }
  };

  const saveTags = () => {
    feedbackApi.editTag(item.id, tags);

    // Call onUpdateFeedback with the updated item
    if (onUpdateFeedback) {
      onUpdateFeedback({ ...item, tags: tags });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}
      aria-labelledby="view-value-dialog-title" fullWidth maxWidth="sm">
      <DialogTitle id="view-value-dialog-title"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Feedback
        {item && <EmailButton email={item.email} />} {/* Conditional rendering based on item presence */}
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {item && Object.keys(item).map((key, index) => {
            const value = item[key];
            let displayValue = '';

            if (value === undefined || value === null) {
              displayValue = 'Empty'; // Placeholder for undefined or null values
            } else if (key === 'creationTime' && value instanceof Date) {
              displayValue = formatDate(value);
            } else {
              displayValue = value.toString();
            }

            if (key === 'tags') {
              return (
                <React.Fragment key={key}>
                  <ListItem>
                    <FormControl fullWidth margin="normal" key={key}>
                      <InputLabel id="tags-multiple-select-label">Tags</InputLabel>
                      <Select
                        labelId="tags-multiple-select-label"
                        multiple
                        value={tags}
                        onChange={handleTagChange}
                        onClose={saveTags}
                        renderValue={(selected) => selected.join(', ')}
                      >
                        {feedbackTypeList.map((type) => (
                          <MenuItem key={type.id} value={type.name}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItem>
                  {index < Object.keys(item).length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              );
            } else if (key === 'hasResponded') {
              if (emailUtil.isValidEmail(item.email)) {
                return (
                  <React.Fragment key={key}>
                    <ListItem>
                      <FormControlLabel key={key}
                        control={<Switch checked={hasResponded} onChange={handleHasRespondedChange} />}
                        label="Responded?"
                      />
                    </ListItem>
                    {index < Object.keys(item).length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                );
              }
            } else {
              return (
                <React.Fragment key={key}>
                  <ListItem>
                    <ListItemText primary={key} secondary={displayValue} />
                  </ListItem>
                  {index < Object.keys(item).length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              );
            }
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

ViewValueDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onUpdateFeedback: PropTypes.func.isRequired
};

export default ViewValueDialog;
