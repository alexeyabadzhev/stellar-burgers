import { useSelector, useDispatch } from '../../services/store';
import {
  getIngredients,
  selectIsLoading
} from '../../services/slices/ingredientsSlice';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';

import { FC, useEffect } from 'react';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
