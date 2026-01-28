
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
import { BookListing, UserProfile } from './types';

// ==========================================
// 1. YOUR CLOUDINARY CONFIG
// ==========================================
const CLOUDINARY_CLOUD_NAME = "dxbqn8ms0";
const CLOUDINARY_UPLOAD_PRESET = "boisathi_preset"; 
// ==========================================

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
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), pass);
      return await mapUser(user);
    },
    signUp: async (email: string, pass: string, name: string, photoFile?: File) => {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      
      try {
        await sendEmailVerification(user);
      } catch (e) {
        console.error("Verification email failed to send", e);
      }

      let photoURL = "";
      if (photoFile) {
        try {
          const res = await firebase.db.uploadBookImage(photoFile);
          photoURL = res.secure_url;
        } catch (e) {
          console.warn("Profile photo upload failed");
        }
      }
      
      await updateProfile(user, { displayName: name.trim(), photoURL });
      const userProfile: UserProfile = { uid: user.uid, displayName: name.trim(), email: email.trim(), photoURL: photoURL || undefined, createdAt: Date.now(), username: "" };
      try { await setDoc(doc(db, "users", user.uid), userProfile); } catch (e) {}
      
      return await mapUser(user);
    },
    updateProfile: async (name: string, photoFile?: File, username?: string) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No user found");

      let photoURL = user.photoURL || "";
      if (photoFile) {
        try {
          const res = await firebase.db.uploadBookImage(photoFile);
          photoURL = res.secure_url;
        } catch (e) {
          console.warn("Profile photo upload failed");
        }
      }
      
      await updateProfile(user, { displayName: name.trim(), photoURL });
      
      try {
        await updateDoc(doc(db, "users", user.uid), {
          displayName: name.trim(),
          photoURL: photoURL || undefined,
          username: (username || "").trim().toLowerCase()
        });
      } catch (e) {}

      return await mapUser(user);
    },
    signOut: () => signOut(auth),
    resetPassword: async (email: string) => {
      await sendPasswordResetEmail(auth, email.trim());
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
    compressImage: async (file: File): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Compression failed"));
            }, 'image/jpeg', 0.7);
          };
        };
        reader.onerror = (e) => reject(e);
      });
    },
    uploadBookImage: async (fileOrBlob: File | Blob): Promise<{ secure_url: string, delete_token?: string }> => {
      const formData = new FormData();
      formData.append("file", fileOrBlob);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "boisathi_uploads");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        return { 
          secure_url: data.secure_url, 
          delete_token: data.delete_token 
        };
      } catch (error: any) {
        throw new Error(error.message || "Connection failed.");
      }
    },
    deleteImageByToken: async (token: string): Promise<void> => {
      try {
        const formData = new FormData();
        formData.append("token", token);
        
        await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
          {
            method: "POST",
            body: formData
          }
        );
      } catch (e) {
        console.warn("Cloudinary delete failed", e);
      }
    },
    addListing: async (listing: Omit<BookListing, 'id' | 'createdAt'>, imageFile?: File) => {
      const createdAt = Date.now();
      let imageUrl = listing.imageUrl || "";
      let imageDeleteToken = listing.imageDeleteToken || "";
      
      if (imageFile) {
        const compressed = await firebase.db.compressImage(imageFile);
        const res = await firebase.db.uploadBookImage(compressed);
        imageUrl = res.secure_url;
        imageDeleteToken = res.delete_token || "";
      }
      
      const docRef = await addDoc(collection(db, "bookListings"), { ...listing, imageUrl, imageDeleteToken, createdAt });
      return { id: docRef.id, ...listing, imageUrl, imageDeleteToken, createdAt } as BookListing;
    },
    updateListing: async (id: string, data: Partial<BookListing>, imageFile?: File) => {
      let imageUrl = data.imageUrl;
      let imageDeleteToken = data.imageDeleteToken;

      if (imageFile) {
        const compressed = await firebase.db.compressImage(imageFile);
        const res = await firebase.db.uploadBookImage(compressed);
        imageUrl = res.secure_url;
        imageDeleteToken = res.delete_token || "";
      }

      const finalData = { ...data };
      finalData.imageUrl = imageUrl || ""; 
      finalData.imageDeleteToken = imageDeleteToken || "";
      await updateDoc(doc(db, "bookListings", id), finalData);
    },
    deleteListing: async (id: string) => {
      try {
        // Try to delete image from Cloudinary if listing exists and has token
        const snapshot = await getDoc(doc(db, "bookListings", id));
        if (snapshot.exists()) {
          const data = snapshot.data() as BookListing;
          if (data.imageDeleteToken) {
            await firebase.db.deleteImageByToken(data.imageDeleteToken);
          }
        }
      } catch (e) {
        console.warn("Failed to delete image during listing removal", e);
      }
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
