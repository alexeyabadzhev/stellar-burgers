import { ConstructorPage, Feed, NotFound404, Login, Register, ForgotPassword, ResetPassword, Profile, ProfileOrders } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { Routes, Route } from 'react-router-dom';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = false;
  const ingredients = [];
  const error = null;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
      <Route path='*' element={<NotFound404 />} />
      <Route path='/' element={<ConstructorPage />} />
      <Route path='/feed' element={<Feed />} />
      <Route path='/feed/:number' element={<Modal><OrderInfo /></Modal>} />
      <Route path='/ingredients/:id' element={<Modal><IngredientDetails /></Modal>} />
    </Routes>
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/profile' element={<Profile />}>
        <Route path='orders' element={<ProfileOrders />}>
          <Route path=':number' element={<Modal><OrderInfo /></Modal>} />
        </Route>
      </Route>
    </Routes>
    </div>
  );
};

export default App;
