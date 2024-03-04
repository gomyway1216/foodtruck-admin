import React from 'react';
import useIsMobile from '../../Hook/useIsMobile';
import * as api from '../../Firebase/menu';
import MenuTable from '../../Component/Menu/MenuTable';
import GeneralTable from '../../Component/Table/GeneralTable';
import styles from './home-page.module.scss';

const HomePage = () => {
  const isMobile = useIsMobile();

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
    </div>
  );
};

export default HomePage;