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
  deleteUser,
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
  getDownloadURL,
  deleteObject
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
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ]);
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
      
      try {
        await updateDoc(doc(db, "users", user.uid), {
          displayName: name,
          photoURL: photoURL || undefined,
          username: username || ""
        });
      } catch (e) {}

      return await mapUser(user);
    },
    signOut: () => signOut(auth),
    resetPassword: async (email: string) => {
      await sendPasswordResetEmail(auth, email);
    },
    deleteAccount: async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("No active session found");
      const uid = user.uid;
      const q = query(collection(db, "bookListings"), where("sellerId", "==", uid));
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) {
        await firebase.db.deleteListing(d.id);
      }
      if (user.photoURL) {
        try {
          await deleteObject(ref(storage, `profiles/${uid}`));
        } catch (e) {}
      }
      try { await deleteDoc(doc(db, "users", uid)); } catch (e) {}
      await deleteUser(user);
    }
  },

  db: {
    subscribeToListings: (callback: (listings: BookListing[]) => void) => {
      const q = query(collection(db, "bookListings"), orderBy("createdAt", "desc"));
      return onSnapshot(q, (snapshot) => {
        const listings = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BookListing));
        callback(listings);
      }, (error) => {
        console.error("Firestore Error:", error);
      });
    },
    uploadBookImage: async (file: File) => {
      const compressed = await compressImage(file, 1000, 0.7);
      const storageRef = ref(storage, `books/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, compressed);
      return await getDownloadURL(storageRef);
    },
    deleteStorageImage: async (url: string) => {
      if (url && url.includes('firebasestorage.googleapis.com')) {
        try {
          const imageRef = ref(storage, url);
          await deleteObject(imageRef);
        } catch (e) {}
      }
    },
    addListing: async (listing: Omit<BookListing, 'id' | 'createdAt'>, imageFile?: File) => {
      const createdAt = Date.now();
      let imageUrl = listing.imageUrl || "";
      if (imageFile) imageUrl = await firebase.db.uploadBookImage(imageFile);
      const docRef = await addDoc(collection(db, "bookListings"), { ...listing, imageUrl, createdAt });
      return { id: docRef.id, ...listing, imageUrl, createdAt } as BookListing;
    },
    updateListing: async (id: string, data: Partial<BookListing>, imageFile?: File) => {
      let imageUrl = data.imageUrl;
      if (imageFile) {
        imageUrl = await firebase.db.uploadBookImage(imageFile);
        const existing = await firebase.db.getListingById(id);
        if (existing?.imageUrl) await firebase.db.deleteStorageImage(existing.imageUrl);
      }
      const finalData = { ...data };
      if (imageUrl) finalData.imageUrl = imageUrl;
      await updateDoc(doc(db, "bookListings", id), finalData);
    },
    deleteListing: async (id: string) => {
      const listing = await firebase.db.getListingById(id);
      if (listing?.imageUrl) await firebase.db.deleteStorageImage(listing.imageUrl);
      await deleteDoc(doc(db, "bookListings", id));
    },
    getUserListings: async (uid: string) => {
      const q = query(collection(db, "bookListings"), where("sellerId", "==", uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BookListing));
    },
    getListingById: async (id: string) => {
      const snapshot = await getDoc(doc(db, "bookListings", id));
      if (snapshot.exists()) return { id: snapshot.id, ...snapshot.data() } as BookListing;
      return null;
    },
    getUserById: async (uid: string) => {
      const snapshot = await getDoc(doc(db, "users", uid));
      if (snapshot.exists()) return snapshot.data() as UserProfile;
      return undefined;
    },
    getListings: async () => {
      const q = query(collection(db, "bookListings"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BookListing));
    }
  }
};