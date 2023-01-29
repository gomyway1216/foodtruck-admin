import React, { useState } from 'react';
import { Scheduler } from '@aldabil/react-scheduler';
import * as scheduleApi from '../../Firebase/schedule';
import InstantMessage from '../PopUp/Alert';
import * as numberUtil from '../../Util/numberUtil';

const Calendar = () => {
  const [error, setError] = useState(null);

  const getSchedule = async (query) => {
    const schedules = await scheduleApi.getScheduleWithRange(query);
    return schedules;
  };

  const handleConfirm = async (event, action) => {
    if(!event.event_id) {
      event.event_id = numberUtil.getRandomInt();
    }

    try {
      if (action === 'edit') {
        await scheduleApi.updateSchedule(event);
      } else if (action === 'create') {
        await scheduleApi.addSchedule(event);
      }
      return event;
    } catch (err) {
      setError(err.message);
    }
    return null;
  };

  const handleDelete = async (deletedId) => {
    try {
      scheduleApi.deleteSchedule(deletedId);
      return deletedId;
    } catch (err) {
      setError(err.message);
    }
    return null;
  };

  const handleAlertClose = () => {
    setError('');
  };

  return (
    <>
      <Scheduler
        height={1200}
        week={{
          startHour: 7, 
          endHour: 24,
        }}
        fields={[
          {
            name: 'id',
            type: 'hidden',
            config: { label: 'id' }
          },
          {
            name: 'location',
            type: 'input',
            config: { label: 'Location', 
              required: true, errMsg: 'Please fill in the location' }
          },
          {
            name: 'description',
            type: 'input',
            config: { label: 'Description', multiline: true, rows: 4 }
          },
        ]}
        getRemoteEvents={getSchedule}
        onConfirm={handleConfirm}
        onDelete={handleDelete}
      />
      {error && <InstantMessage message={error}
        onClose={handleAlertClose} />
      }
    </>
  );
};

export default Calendar;