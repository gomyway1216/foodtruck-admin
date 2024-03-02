import React from 'react';
import * as api from '../../Firebase/menu';
import * as feedbackApi from '../../Firebase/feedback';
import MenuTable from '../../Component/Menu/MenuTable';
import GeneralTable from '../../Component/Table/GeneralTable';
import Calendar from '../../Component/Calendar/Calendar';
import styles from './home-page.module.scss';
import FeedbackTable from '../../Component/Table/FeedbackTable';

const HomePage = () => {
  return (
    <div className={styles.adminPageRoot}>
      <div className={styles.menuTable}>
        <div className={styles.title}>Menu List</div>
        <MenuTable />
      </div>
      <div className={styles.listTables}>
        <div>
          <div className={styles.title}>Menu Type</div>
          <GeneralTable getList={api.getMenuTypeList} 
            onAdd={api.addMenuType} onUpdate={api.updateMenuType} />
        </div>
        <div>
          <div className={styles.title}>Ingredient</div>
          <GeneralTable getList={api.getIngredientList} 
            onAdd={api.addIngredient} onUpdate={api.updateIngredient} />
        </div>
      </div>
      <div className={styles.feedbackTable}>
        <div className={styles.title}>Feedback List</div>
        <FeedbackTable getList={feedbackApi.getFeedbackList}/>
      </div>
      <div className={styles.schedule}>
        <div className={styles.title}>Schedule</div>
        <Calendar />
      </div>
    </div>
  );
};

export default HomePage;