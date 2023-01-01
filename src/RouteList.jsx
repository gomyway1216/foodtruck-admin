import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import HomePage from './Page/Home/HomePage';
import SignInPage from './Page/SignIn/SignInPage';
const RouteList = () => {
  return (
    <div className="page-container">
      <Routes>
        <Route path='/signin' element={<SignInPage />} />
        <Route exact path='/' element={<PrivateRoute/>}>
          <Route exact path='/' element={<HomePage/>}/>
        </Route>
      </Routes>
    </div>
  );
};

export default RouteList;