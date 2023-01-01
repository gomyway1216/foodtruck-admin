import React from 'react';
import MenuTable from '../../Component/Menu/MenuTable';
import styles from './home-page.module.scss';

const HomePage = () => {
  return (
    <div className={styles.adminPageRoot}>
      <div className={styles.section}>
        <div className={styles.title}>Menu</div>
        <MenuTable />
      </div>
    </div>
  );
};

export default HomePage;