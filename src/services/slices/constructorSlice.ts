import { createSlice } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';

interface ConstructorStateProps {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: ConstructorStateProps = {
  bun: null,
  ingredients: []
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      }),
      reducer: (state, action: { payload: TConstructorIngredient }) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      }
    },
    deleteIngredient: (state, action: { payload: string }) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    changeIngredient: (
      state,
      action: { payload: { from: number; to: number } }
    ) => {
      const { from, to } = action.payload;
      const ingredients = state.ingredients;
      const ingredient = ingredients[from];
      ingredients.splice(from, 1);
      ingredients.splice(to, 0, ingredient);
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients
  }
});

export const {
  addIngredient,
  deleteIngredient,
  changeIngredient,
  resetConstructor
} = constructorSlice.actions;
export const { selectBun, selectConstructorIngredients } =
  constructorSlice.selectors;

export default constructorSlice.reducer;
