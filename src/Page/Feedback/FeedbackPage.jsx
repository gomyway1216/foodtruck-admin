import React, { useEffect, useState } from 'react';
import useIsMobile from '../../Hook/useIsMobile';
import FeedbackTable from '../../Component/Table/FeedbackTable';
import FeedbackList from '../../Component/List/FeedbackList';
import * as feedbackApi from '../../Firebase/feedback';
import './feedback-page.scss';

const FeedbackPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackTypeList, setFeedbackTypeList] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      const list = await feedbackApi.getFeedbackList();
      setFeedbackList(list);

      const typeList = await feedbackApi.getFeedbackTypeList();
      setFeedbackTypeList(typeList);
    };
    fetchData();
  }, []);


  return (
    <div className='feedback-page-root'>
      <div>
        <div className='title'>Feedback</div>
        {isMobile && <FeedbackList valueList={feedbackList} tagTypeList={feedbackTypeList} />}
        {!isMobile && <FeedbackTable getList={feedbackApi.getFeedbackList} />}
      </div>
    </div>
  );
};

export default FeedbackPage;