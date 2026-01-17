
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { BookListing, UserProfile } from './types';

const firebaseConfig = {
  apiKey: "AIzaSyA2oJQc8Al6WNtjseonLG7cpLWZ557Nw98",
  authDomain: "book-5963d.firebaseapp.com",
  projectId: "book-5963d",
  storageBucket: "book-5963d.firebasestorage.app",
  messagingSenderId: "839574744012",
  appId: "1:839574744012:web:50a68d4865abab8e3d4b69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Helper to compress images before upload
const compressImage = async (file: File, maxWidth: number = 1000, quality: number = 0.7): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas to Blob failed'));
        }, 'image/jpeg', quality);
      };
    };
    reader.onerror = (error) => reject(error);
  });
};

// Helper to force a timeout on cloud operations
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Cloud operation timed out')), timeoutMs)
    )
  ]);
};

const listeners = new Set<(listings: BookListing[]) => void>();
const notifyListeners = () => {
  const data = [...mockStore.listings].sort((a, b) => b.createdAt - a.createdAt);
  listeners.forEach(cb => cb(data));
};

const mapUser = async (user: FirebaseUser): Promise<UserProfile & { emailVerified: boolean }> => {
  let username = "";
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      username = userDoc.data().username || "";
    }
  } catch (e) {}

  return {
    uid: user.uid,
    displayName: user.displayName || 'Anonymous',
    username: username,
    email: user.email || '',
    photoURL: user.photoURL || undefined,
    emailVerified: user.emailVerified,
    createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now()
  };
};

const getStoredListings = (): BookListing[] => {
  try {
    const stored = localStorage.getItem('bk_listings_v5');
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [];
};

const mockStore = {
  listings: getStoredListings(),
  save: (data: BookListing[]) => {
    mockStore.listings = data;
    localStorage.setItem('bk_listings_v5', JSON.stringify(data));
    notifyListeners();
  }
};

export const firebase = {
  auth: {
    onAuthStateChanged: (callback: (user: UserProfile | null) => void) => {
      return onAuthStateChanged(auth, async (user) => {
        callback(user ? await mapUser(user) : null);
      });
    },
    reloadUser: async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        return await mapUser(auth.currentUser);
      }
      return null;
    },
    signIn: async (email: string, pass: string) => {
      const { user } = await signInWithEmailAndPassword(auth, email, pass);
      return await mapUser(user);
    },
    signUp: async (email: string, pass: string, name: string, photoFile?: File) => {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      
      try {
        await sendEmailVerification(user);
      } catch (e) {
        console.error("Verification email failed to send", e);
      }

      let photoURL = "";
      if (photoFile) {
        try {
          const compressed = await compressImage(photoFile, 400, 0.8);
          const storageRef = ref(storage, `profiles/${user.uid}`);
          await withTimeout(uploadBytes(storageRef, compressed));
          photoURL = await getDownloadURL(storageRef);
        } catch (e) {
          console.warn("Profile photo upload failed");
        }
      }
      
      await updateProfile(user, { displayName: name, photoURL });
      const userProfile: UserProfile = { uid: user.uid, displayName: name, email, photoURL: photoURL || undefined, createdAt: Date.now(), username: "" };
      try { await setDoc(doc(db, "users", user.uid), userProfile); } catch (e) {}
      
      return await mapUser(user);
    },
    updateProfile: async (name: string, photoFile?: File, username?: string) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No user found");

      let photoURL = user.photoURL || "";
      if (photoFile) {
        try {
          const compressed = await compressImage(photoFile, 400, 0.8);
          const storageRef = ref(storage, `profiles/${user.uid}`);
          await withTimeout(uploadBytes(storageRef, compressed));
          photoURL = await getDownloadURL(storageRef);
        } catch (e) {
          console.warn("Profile photo upload failed");
        }
      }
      
      await updateProfile(user, { displayName: name, photoURL });
      
      // Update firestore document too
      try {
        await updateDoc(doc(db, "users", user.uid), {
          displayName: name,
          photoURL: photoURL || undefined,
          username: username || ""
        });
      } catch (e) {
        console.warn("Firestore user update failed, syncing locally");
      }

      return await mapUser(user);
    },
    signOut: () => signOut(auth),
    resetPassword: async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    }
  },

  db: {
    exportData: () => {
      const blob = new Blob([JSON.stringify(mockStore.listings)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookswap_listings_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    },
    importData: (jsonStr: string) => {
      try {
        const data = JSON.parse(jsonStr);
        if (Array.isArray(data)) {
          mockStore.save(data);
          return true;
        }
      } catch (e) {
        console.error("Import failed", e);
      }
      return false;
    },
    subscribeToListings: (callback: (listings: BookListing[]) => void) => {
      listeners.add(callback);
      callback([...mockStore.listings].sort((a, b) => b.createdAt - a.createdAt));

      try {
        const q = query(collection(db, "bookListings"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookListing));
            mockStore.listings = listings;
            callback(listings);
          }
        }, (error) => {
          console.warn("Firestore subscription inactive (Local Mode Active)");
        });

        return () => {
          unsub();
          listeners.delete(callback);
        };
      } catch (e) {
        return () => listeners.delete(callback);
      }
    },
    uploadBookImage: async (file: File) => {
      try {
        const compressed = await compressImage(file, 1000, 0.7);
        const storageRef = ref(storage, `books/${Date.now()}_${file.name}`);
        await withTimeout(uploadBytes(storageRef, compressed), 3000);
        return await getDownloadURL(storageRef);
      } catch (e) {
        console.warn("Storage upload failed, using local URL");
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
    },
    addListing: async (listing: Omit<BookListing, 'id' | 'createdAt'>, imageFile?: File) => {
      const createdAt = Date.now();
      let imageUrl = listing.imageUrl || "";
      if (imageFile) imageUrl = await firebase.db.uploadBookImage(imageFile);
      const finalListing = { ...listing, imageUrl, createdAt };

      const tempId = 'local_' + Math.random().toString(36).substr(2, 9);
      const localBook = { id: tempId, ...finalListing } as BookListing;
      
      mockStore.save([localBook, ...mockStore.listings]);

      withTimeout(addDoc(collection(db, "bookListings"), finalListing), 5000)
        .then(() => {
          console.log("Cloud sync successful");
        })
        .catch(e => console.warn("Background cloud sync failed.", e));

      return localBook;
    },
    updateListing: async (id: string, data: Partial<BookListing>, imageFile?: File) => {
      let imageUrl = data.imageUrl;
      if (imageFile) imageUrl = await firebase.db.uploadBookImage(imageFile);
      const finalData = { ...data };
      if (imageUrl) finalData.imageUrl = imageUrl;

      const newListings = mockStore.listings.map(l => l.id === id ? { ...l, ...finalData } : l);
      mockStore.save(newListings);

      if (!id.startsWith('local_')) {
        try { 
          await withTimeout(updateDoc(doc(db, "bookListings", id), finalData), 5000); 
        } catch (e) {
          console.warn("Firestore update background sync delayed.", e);
        }
      }
    },
    deleteListing: async (id: string) => {
      mockStore.save(mockStore.listings.filter((l) => l.id !== id));
      if (!id.startsWith('local_')) {
        try { await withTimeout(deleteDoc(doc(db, "bookListings", id)), 3000); } catch (e) {}
      }
    },
    getUserListings: async (uid: string) => {
      try {
        const q = query(collection(db, "bookListings"), where("sellerId", "==", uid));
        const snapshot = await withTimeout(getDocs(q), 5000) as any;
        const cloudData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as BookListing));
        return cloudData.length > 0 ? cloudData : mockStore.listings.filter(l => l.sellerId === uid);
      } catch (e) {
        return mockStore.listings.filter((l) => l.sellerId === uid);
      }
    },
    getListingById: async (id: string) => {
      try {
        const snapshot = await withTimeout(getDoc(doc(db, "bookListings", id)), 3000) as any;
        if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() } as BookListing;
      } catch (e) {}
      return mockStore.listings.find((l) => l.id === id);
    },
    getUserById: async (uid: string) => {
      try {
        const snapshot = await withTimeout(getDoc(doc(db, "users", uid)), 3000) as any;
        if (snapshot.exists()) return snapshot.data() as UserProfile;
      } catch (e) {}
      return undefined;
    },
    getListings: async () => {
      try {
        const q = query(collection(db, "bookListings"), orderBy("createdAt", "desc"));
        const snapshot = await withTimeout(getDocs(q), 5000) as any;
        const cloudData = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as BookListing));
        return cloudData.length > 0 ? cloudData : [...mockStore.listings].sort((a, b) => b.createdAt - a.createdAt);
      } catch (e) {
        return [...mockStore.listings].sort((a, b) => b.createdAt - a.createdAt);
      }
    }
  }
};
