import { useSelector } from '../../services/store';
import { selectIsLoading } from '../../services/slices/ingredientsSlice';
import { ConstructorPageUI } from '../../components/ui/pages/constructor-page';

import { FC, useEffect } from 'react';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
