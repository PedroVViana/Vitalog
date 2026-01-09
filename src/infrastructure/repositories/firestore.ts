import { 
    collection, 
    doc, 
    setDoc, 
    deleteDoc,
    getDocs,
    writeBatch,
    onSnapshot,
    Unsubscribe
} from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { FoodEntry } from '../../domain/entities/FoodEntry';
import { Diet } from '../../domain/entities/Diet';

export class FirestoreRepository {
    private getUserId(): string {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }
        return user.uid;
    }

    // Diets
    async getDiets(): Promise<Diet[]> {
        const userId = this.getUserId();
        const dietsRef = collection(db, `users/${userId}/diets`);
        const snapshot = await getDocs(dietsRef);
        return snapshot.docs.map(doc => doc.data() as Diet);
    }

    async saveDiet(diet: Diet): Promise<void> {
        const userId = this.getUserId();
        const dietRef = doc(db, `users/${userId}/diets`, diet.id);
        await setDoc(dietRef, diet);
    }

    async deleteDiet(dietId: string): Promise<void> {
        const userId = this.getUserId();
        const dietRef = doc(db, `users/${userId}/diets`, dietId);
        await deleteDoc(dietRef);
    }

    async saveDiets(diets: Diet[]): Promise<void> {
        const userId = this.getUserId();
        const batch = writeBatch(db);
        
        diets.forEach(diet => {
            const dietRef = doc(db, `users/${userId}/diets`, diet.id);
            batch.set(dietRef, diet);
        });
        
        await batch.commit();
    }

    subscribeToDiets(callback: (diets: Diet[]) => void): Unsubscribe {
        const userId = this.getUserId();
        const dietsRef = collection(db, `users/${userId}/diets`);
        
        return onSnapshot(dietsRef, (snapshot) => {
            const diets = snapshot.docs.map(doc => doc.data() as Diet);
            callback(diets);
        });
    }

    // Food Entries
    async getFoodEntries(): Promise<FoodEntry[]> {
        const userId = this.getUserId();
        const entriesRef = collection(db, `users/${userId}/foodEntries`);
        const snapshot = await getDocs(entriesRef);
        return snapshot.docs.map(doc => doc.data() as FoodEntry);
    }

    async saveFoodEntry(entry: FoodEntry): Promise<void> {
        const userId = this.getUserId();
        const entryRef = doc(db, `users/${userId}/foodEntries`, entry.id);
        await setDoc(entryRef, entry);
    }

    async deleteFoodEntry(entryId: string): Promise<void> {
        const userId = this.getUserId();
        const entryRef = doc(db, `users/${userId}/foodEntries`, entryId);
        await deleteDoc(entryRef);
    }

    async saveFoodEntries(entries: FoodEntry[]): Promise<void> {
        const userId = this.getUserId();
        const batch = writeBatch(db);
        
        entries.forEach(entry => {
            const entryRef = doc(db, `users/${userId}/foodEntries`, entry.id);
            batch.set(entryRef, entry);
        });
        
        await batch.commit();
    }

    subscribeToFoodEntries(callback: (entries: FoodEntry[]) => void): Unsubscribe {
        const userId = this.getUserId();
        const entriesRef = collection(db, `users/${userId}/foodEntries`);
        
        return onSnapshot(entriesRef, (snapshot) => {
            const entries = snapshot.docs.map(doc => doc.data() as FoodEntry);
            callback(entries);
        });
    }

    // Clear all user data
    async clearAllUserData(): Promise<void> {
        const userId = this.getUserId();
        const collections = ['diets', 'foodEntries', 'habits', 'entries', 'mealCategories'];
        
        for (const collectionName of collections) {
            const collectionRef = collection(db, `users/${userId}/${collectionName}`);
            const snapshot = await getDocs(collectionRef);
            const batch = writeBatch(db);
            
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
        }
    }
}

export const firestoreRepo = new FirestoreRepository();

