import React, { useState } from 'react';
import {
  Button, Box, Chip, Drawer, FormControl, List, ListItem, IconButton,
  InputLabel, Select, Slider, MenuItem, TextField, Typography, Menu
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarIcon from '@mui/icons-material/Star';
import PropTypes from 'prop-types';
import ViewValueDialog from '../Table/ViewValueDialog';
import './feedback-list.scss';

const FeedbackList = ({ valueList, tagTypeList }) => {
  const [dialogItem, setDialogItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState(''); // Field to sort by
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRatingRange, setSelectedRatingRange] = useState([0, 5]); // [minRating, maxRating]

  const toggleDrawer = (open) => (event) => {
    // Toggle drawer only for click or keydown (tab, shift, enter, space)
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  };

  const handleFilterFieldChange = (event) => {
    setFilterField(event.target.value);
    setFilterValue(''); // Reset the filter value when changing the filter field
  };

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };


  // Integrated filter, search, and sort function
  const applyFilterSearchAndSort = (items) => {
    let result = [...items]; // Create a shallow copy of the items array

    // Apply filter based on the selected field and value
    if (filterField && filterValue) {
      if (filterField === 'creationTime') {
        result = result.filter(item => {
          const creationDate = new Date(item.creationTime);
          // If only startDate is selected, filter items from startDate onwards
          if (startDate && !endDate) {
            return creationDate >= startDate;
          }
          // If only endDate is selected, filter items up to endDate
          if (!startDate && endDate) {
            return creationDate <= endDate;
          }
          // If both dates are selected, filter items between the date range
          if (startDate && endDate) {
            return creationDate >= startDate && creationDate <= endDate;
          }
          // If no dates are selected, do not filter the items
          return true;
        });
      } else if (filterField === 'rating') {
        // Filter items based on rating range
        const [minRating, maxRating] = selectedRatingRange;
        result = result.filter(item => {
          return item.rating >= minRating && item.rating <= maxRating;
        });
      } else if (filterField === 'tag') {
        result = result.filter(item => item.tags.includes(filterValue));
      } else if (filterField === 'hasResponded') {
        const filterBool = filterValue.toLowerCase() === 'yes' ? true : false;
        result = result.filter(item => item.hasResponded === filterBool);
      } else {
        // Filter for other fields
        result = result.filter(item => {
          const itemValue = item[filterField];
          return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    }

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          value !== undefined && value !== null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Finally, sort by the selected field if applicable
    if (sortField) {
      result.sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];

        // Convert date strings to Date objects for comparison
        if (sortField === 'creationTime') {
          fieldA = new Date(fieldA);
          fieldB = new Date(fieldB);
        }

        // Compare for sorting
        if (fieldA < fieldB) {
          return sortOrder === 'asc' ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  };

  // Use the integrated function to get the filtered and sorted items
  const filteredItems = applyFilterSearchAndSort(valueList);

  const handleItemClick = (item) => {
    setDialogItem(item);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogItem(null);
  };

  // Function to determine the color or icon for time urgency
  const getTimeUrgencyIndicator = (email, creationTime, hasResponded) => {
    const iconPlaceholder = <div className="icon-placeholder"></div>;

    if (!isValidEmail(email)) {
      return iconPlaceholder;
    }

    if (hasResponded) {
      return <CheckIcon className="responded-indicator" />;
    }

    const currentTime = new Date();
    const creationDate = new Date(creationTime);
    const hoursPassed = (currentTime - creationDate) / (1000 * 60 * 60);

    if (hoursPassed > 24) {
      return <AccessTimeIcon className="overdue-indicator" />;
    } else if (hoursPassed > 12) {
      return <AccessTimeIcon className="urgent-indicator" />;
    } else {
      return <AccessTimeIcon className="normal-indicator" />;
    }
  };

  const renderEmailButton = (email, item) => {
    // Define the placeholder with the same dimensions as the IconButton
    const emailButtonPlaceholder = (
      <div className="email-button-placeholder"></div>
    );

    // Return either the IconButton or the placeholder based on the email validity
    return isValidEmail(email) ? (
      <IconButton edge="end" aria-label="email"
        onClick={() => handleEmailClick(email, item)} className="feedback-email">
        <EmailIcon />
      </IconButton>
    ) : emailButtonPlaceholder;
  };

  const isValidEmail = (email) => {
    // This regular expression covers most common email patterns
    // eslint-disable-next-line max-len
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to handle email click
  const handleEmailClick = (email, item) => {
    const subject = encodeURIComponent('Subject for the email');
    const body = encodeURIComponent('Hello,');
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
  };

  // Function to render stars for the rating
  const renderRating = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ?
        <StarIcon key={i} className="rating-star" />
        : <StarOutlineIcon key={i} className="rating-star" />);
    }
    return <div className="rating">{stars}</div>;
  };

  const rengderTags = (tags) => {
    return tags.map((tag, index) => (
      <Chip key={index} label={tag} className="feedback-tag" size="small" />
    ));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearFilters = () => {
    setFilterField('');
    setFilterValue('');
    setSelectedRatingRange([0, 5]);
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div>
      <div className="feedback-search">
        <IconButton aria-label="delete" onClick={toggleDrawer(true)}>
          <FilterListIcon />
        </IconButton>
        <TextField
          label="Search Feedback"
          variant="outlined"
          fullWidth
          onChange={handleSearchChange}
          style={{ margin: '20px 0' }}
        />
      </div>
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{ style: { height: '80vh', borderRadius: '20px 20px 0 0', overflow: 'hidden' } }}
      >

        <Box padding={2} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Box width="100%" marginBottom={2}>
            <Typography variant="h6" style={{ width: '100%', textAlign: 'center' }}>Filters</Typography>
          </Box>
          {/* Filter field selection */}
          <Box width="100%" marginBottom={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="filter-field-label">Filter Field</InputLabel>
              <Select
                labelId="filter-field-label"
                id="filter-field"
                value={filterField}
                onChange={handleFilterFieldChange}
                label="Filter Field"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="body">Body</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="eventLocation">Location</MenuItem>
                <MenuItem value="hasResponded">Response Done</MenuItem>
                <MenuItem value="tag">Tag</MenuItem>
                {/* ... other fields ... */}
              </Select>
            </FormControl>
          </Box>

          {/* Value for filtering */}
          {filterField && filterField !== 'creationTime'
            && filterField !== 'rating' &&
            filterField !== 'hasResponded' &&
            filterField !== 'tag' &&
            <Box width="100%" marginBottom={2}>
              <FormControl fullWidth margin="normal">
                <TextField
                  label={`Value for ${filterField}`}
                  value={filterValue}
                  onChange={handleFilterValueChange}
                  fullWidth
                // style={{ margin: '20px 0 10px 0' }}
                />
              </FormControl>
            </Box>
          }

          {filterField === 'creationTime' &&
            <Box width="100%" marginBottom={2}>
              <FormControl fullWidth margin="normal">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>

              </FormControl>
            </Box>
          }

          {filterField === 'creationTime' &&
            <FormControl fullWidth margin="normal">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          }

          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
            />
          </LocalizationProvider> */}

          {/* Rating range filter */}
          {filterField === 'rating' &&
            <FormControl fullWidth margin="normal" style={{ marginTop: '0' }}>
              <InputLabel htmlFor="rating-range">Rating Range</InputLabel>
              <Slider
                id="rating-range"
                value={selectedRatingRange}
                onChange={(event, newValue) => setSelectedRatingRange(newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={5}
                // Add a margin to the top of the Slider to prevent overlap with the label
                style={{ marginTop: '40px' }}
              />
            </FormControl>
          }

          {/* Filter value for 'tag' */}
          {filterField === 'tag' &&
            <Box width="100%" marginBottom={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="tag-label">Tag</InputLabel>
                <Select
                  labelId="tag-label"
                  id="tag-select"
                  value={filterValue}
                  onChange={handleFilterValueChange}
                  label="Tag"
                >
                  {tagTypeList.map((tag, index) => (
                    <MenuItem key={index + ':' + tag.name} value={tag.name}>{tag.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }

          {/* Filter value for 'hasResponded' */}
          {filterField === 'hasResponded' &&
            <Box width="100%" marginBottom={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="has-responded-label">Has Responded</InputLabel>
                <Select
                  labelId="has-responded-label"
                  id="has-responded"
                  value={filterValue}
                  onChange={handleFilterValueChange}
                  label="Has Responded"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          }


          {/* Sort field selection */}
          <Box width="100%" marginBottom={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="sort-field-label">Sort Field</InputLabel>
              <Select
                labelId="sort-field-label"
                id="sort-field"
                value={sortField}
                onChange={handleSortFieldChange}
                label="Sort Field"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="creationTime">Time</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Sort order selection */}
          <Box width="100%" marginBottom={2}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="sort-order-label">Sort Order</InputLabel>
              <Select
                labelId="sort-order-label"
                id="sort-order"
                value={sortOrder}
                onChange={handleSortOrderChange}
                label="Sort Order"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box width="100%" marginBottom={2} display="flex" justifyContent="space-between"
            style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <Button variant="outlined" onClick={handleClearFilters}>
              Clear
            </Button>
            <Button variant="outlined" onClick={toggleDrawer(false)}>
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>
      <List dense className="feedback-list">
        {filteredItems.map((item) => (
          <ListItem className="list-item" key={item.id} onClick={() => handleItemClick(item)}>
            <div className="feedback-content">
              <div className="feedback-header">
                <Typography variant="subtitle1" className="feedback-name">{item.name}</Typography>
                <div className="feedback-title-actions">
                  {renderRating(item.rating)}
                  {getTimeUrgencyIndicator(item.email, item.creationTime, item.hasResponded)}
                </div>
              </div>
              <Typography variant="body2" color="textSecondary" className="feedback-title">{item.title}</Typography>
              <Typography variant="body2"
                color="textSecondary" className="feedback-body">{item.body}</Typography>
              <div className="feedback-details">
                <Typography variant="body2"
                  color="textSecondary" className="feedback-location">{item.eventLocation}</Typography>
                <Typography variant="body2" color="textSecondary" className="feedback-time">
                  {new Date(item.creationTime).toLocaleString([], {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    hour12: true
                  })}
                </Typography>
              </div>
              <div className='feedback-actions'>
                <div className='feedback-tags'>
                  {rengderTags(item.tags)}
                </div>
                {renderEmailButton(item.email, item)}
              </div>
            </div>
          </ListItem>
        ))}
      </List>
      <ViewValueDialog open={dialogOpen} onClose={handleDialogClose} item={dialogItem} style={{ marginTop: '20px' }} />
    </div>
  );
};

FeedbackList.propTypes = {
  valueList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string,
    rating: PropTypes.number,
    creationTime: PropTypes.instanceOf(Date),
    eventLocation: PropTypes.string,
    hasResponded: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string)
  })),
  tagTypeList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string
  }))
};

export default FeedbackList;

