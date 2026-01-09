# TODO.md - VitaLog MVP

## Step 2: Domain Models
- [x] Create `src/domain/entities/Habit.ts`
- [x] Create `src/domain/entities/Entry.ts`
- [x] Create `src/domain/value-objects/EntryType.ts`
- [x] Create `src/domain/value-objects/Score0to10.ts`
- [x] Create `src/domain/use-cases/CreateHabit.ts`
- [x] Create `src/domain/use-cases/UpdateHabit.ts`
- [x] Create `src/domain/use-cases/ArchiveHabit.ts`
- [x] Create `src/domain/use-cases/CreateEntry.ts`
- [x] Create `src/domain/use-cases/DeleteEntry.ts`

## Step 3: Redux Store and Persistence
- [x] Create `src/presentation/store/store.ts`
- [x] Create `src/presentation/store/provider.tsx`
- [x] Create `src/presentation/store/slices/habitsSlice.ts`
- [x] Create `src/presentation/store/slices/entriesSlice.ts`
- [x] Create `src/presentation/store/slices/uiSlice.ts`
- [x] Create `src/infrastructure/repositories/localStorage.ts`

## Step 4: Shared Services
- [x] Create `src/application/services/streak.ts`
- [x] Create `src/application/services/weeklyConsistency.ts`

## Step 5: UI Primitives
- [ ] Build `Button`, `Card`, `Modal`, `Drawer`, `Chip`, `SegmentedControl`, `Slider`, `Toast`, `Input`

## Step 6: Feature UI
- [ ] Implement Habits Page
- [ ] Implement Quick Log Modal
- [ ] Implement Timeline Page
- [ ] Implement Insights Page
- [ ] Implement Settings Page

## Step 7: Pages and Layout
- [ ] Refactor `layout.tsx` for navigation
- [ ] Add Mobile Bottom Nav

## Step 8: Tests
- [ ] Reducer tests
- [ ] Service unit tests
- [ ] Component integration tests
