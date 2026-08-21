import ingredientsReducer, { getIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

const testIngredient: TIngredient = {
  _id: '123',
  name: 'testIngredient',
  type: 'bun',
  proteins: 35242,
  fat: 3234,
  carbohydrates: 54353,
  calories: 435,
  price: 5000,
  image: '',
  image_large: '',
  image_mobile: ''
};

describe('Reducer tests', () => {
  test('Начальное состояние', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: undefined
    });
  });

  test('Ожидание ингридиентов', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.pending('request-id')
    );
    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: undefined
    });
  });

  test('Ингредиенты получены', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.fulfilled([testIngredient], 'request-id')
    );
    expect(state).toEqual({
      ingredients: [testIngredient],
      isLoading: false,
      error: undefined
    });
  });

  test('Ошибка', () => {
    const state = ingredientsReducer(
      undefined,
      getIngredients.rejected(new Error('Server error'), 'request-id')
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Server error');
  });
});
