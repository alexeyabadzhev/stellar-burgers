import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectBun,
  selectConstructorIngredients,
  resetConstructor
} from '../../services/slices/constructorSlice';
import {
  burgerOrder,
  resetOrder,
  selectRequest,
  selectModalData
} from '../../services/slices/orderSlice';
import { selectUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const bun = useSelector(selectBun);
  const ingredients = useSelector(selectConstructorIngredients);
  const request = useSelector(selectRequest);
  const modalData = useSelector(selectModalData);
  const user = useSelector(selectUser);

  const constructorItems = { bun, ingredients };

  const onOrderClick = () => {
    if (!constructorItems.bun || request) return;
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    const ids = [
      constructorItems.bun._id,
      ...ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(burgerOrder(ids))
      .unwrap()
      .then(() => dispatch(resetConstructor()))
      .catch(() => {});
  };
  const closeOrderModal = () => dispatch(resetOrder());

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={request}
      constructorItems={constructorItems}
      orderModalData={modalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
