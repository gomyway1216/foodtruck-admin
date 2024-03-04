import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import HomePage from './Page/Home/HomePage';
import SignInPage from './Page/SignIn/SignInPage';
import FeedbackPage from './Page/Feedback/FeedbackPage';
import SchedulePage from './Page/Schedule/SchedulePage';

const RouteList = () => {
  return (
    <div className="page-container">
      <Routes>
        <Route path='/signin' element={<SignInPage />} />
        <Route exact path='/' element={<PrivateRoute />}>
          <Route exact path='/' element={<HomePage />} />
        </Route>
        <Route exact path='/feedback' element={<PrivateRoute />}>
          <Route exact path='/feedback' element={<FeedbackPage />} />
        </Route>
        <Route exact path='/schedule' element={<PrivateRoute />}>
          <Route exact path='/schedule' element={<SchedulePage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default RouteList;