import React, { useEffect, useState } from 'react';
import Calendar from '../../Component/Calendar/Calendar';
import './schedule-page.scss';

const SchedulePage = () => {

  return (
    <div className='schedule-page-root'>
      <div className='schedule'>
        <div className='title'>Schedule</div>
        <Calendar />
      </div>
    </div>
  );
};

export default SchedulePage;