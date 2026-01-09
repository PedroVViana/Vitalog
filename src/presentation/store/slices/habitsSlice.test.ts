import habitsReducer, { addHabit, updateHabit, deleteHabit } from './habitsSlice';
import { Habit } from '../../../domain/entities/Habit';

describe('habitsSlice', () => {
    const initialState = {
        items: [],
        loading: false,
        error: null,
    };

    const mockHabit: Habit = {
        id: '1',
        name: 'Test Habit',
        frequencyPerWeek: 3,
        isArchived: false,
        createdAt: new Date().toISOString(),
        colorHex: '#000000',
    };

    it('should handle initial state', () => {
        expect(habitsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addHabit', () => {
        const actual = habitsReducer(initialState, addHabit(mockHabit));
        expect(actual.items).toHaveLength(1);
        expect(actual.items[0]).toEqual(mockHabit);
    });

    it('should handle updateHabit', () => {
        const state = { ...initialState, items: [mockHabit] };
        const updatedHabit = { ...mockHabit, name: 'Updated' };
        const actual = habitsReducer(state, updateHabit(updatedHabit));
        expect(actual.items[0].name).toBe('Updated');
    });

    it('should handle deleteHabit', () => {
        const state = { ...initialState, items: [mockHabit] };
        const actual = habitsReducer(state, deleteHabit('1'));
        expect(actual.items).toHaveLength(0);
    });
});
