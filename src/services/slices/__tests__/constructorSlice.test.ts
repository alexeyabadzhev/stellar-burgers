import constructorReducer, {
  addIngredient,
  deleteIngredient,
  changeIngredient,
  resetConstructor
} from '../constructorSlice';
import { TIngredient } from '../../../utils/types';

const mockBun: TIngredient = {
  _id: 'bun123',
  name: 'testBun',
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

const mockMainfirst: TIngredient = {
  _id: 'main123',
  name: 'testMainFirst',
  type: 'main',
  proteins: 35242,
  fat: 3234,
  carbohydrates: 54353,
  calories: 435,
  price: 5000,
  image: '',
  image_large: '',
  image_mobile: ''
};

const mockMainSecond: TIngredient = {
  _id: 'main124',
  name: 'testMainSecond',
  type: 'main',
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
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('Добавление булки', () => {
    const state = constructorReducer(undefined, addIngredient(mockBun));
    expect(state.bun?.name).toBe('testBun');
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toHaveLength(0);
  });

  test('Добавление нескольких ингридиентов', () => {
    let state = constructorReducer(undefined, addIngredient(mockMainfirst));
    state = constructorReducer(state, addIngredient(mockMainSecond));
    expect(state.ingredients).toHaveLength(2);
  });

  test('Удаление ингридиента по id', () => {
    let state = constructorReducer(undefined, addIngredient(mockMainfirst));
    state = constructorReducer(state, addIngredient(mockMainSecond));
    const idToRemove = state.ingredients[0].id;
    state = constructorReducer(state, deleteIngredient(idToRemove));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe('main124');
  });

  test('Изменение позиции', () => {
    let state = constructorReducer(undefined, addIngredient(mockMainfirst));
    state = constructorReducer(state, addIngredient(mockMainSecond));
    state = constructorReducer(state, changeIngredient({ from: 0, to: 1 }));
    expect(state.ingredients.map((item) => item._id)).toEqual([
      'main124',
      'main123'
    ]);
  });

  test('Сброс заказа', () => {
    let state = constructorReducer(undefined, addIngredient(mockBun));
    state = constructorReducer(state, addIngredient(mockMainfirst));
    state = constructorReducer(state, resetConstructor());
    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
