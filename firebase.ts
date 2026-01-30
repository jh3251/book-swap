
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
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
  onSnapshot,
  Timestamp,
  serverTimestamp,
  limit
} from "firebase/firestore";
import { BookListing, UserProfile, Conversation, ChatMessage } from './types';

const CLOUDINARY_CLOUD_NAME = "dxbqn8ms0";
const CLOUDINARY_UPLOAD_PRESET = "boisathi_preset"; 

const firebaseConfig = {
  apiKey: "AIzaSyA2oJQc8Al6WNtjseonLG7cpLWZ557Nw98",
  authDomain: "boisathi.com", // Updated to custom domain
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
      try { await sendEmailVerification(user); } catch (e) {}
      let photoURL = "";
      if (photoFile) {
        try {
          const res = await firebase.db.uploadBookImage(photoFile);
          photoURL = res.secure_url;
        } catch (e) {}
      }
      await updateProfile(user, { displayName: name.trim(), photoURL });
      const userProfile: UserProfile = { uid: user.uid, displayName: name.trim(), email: email.trim(), photoURL: photoURL || undefined, createdAt: Date.now(), username: "" };
      try { await setDoc(doc(db, "users", user.uid), userProfile); } catch (e) {}
      return await mapUser(user);
    },
    updateProfile: async (name: string, photoURL?: string, username?: string) => {
      const user = auth.currentUser;
      if (!user) throw new Error("No active session found");
      await updateProfile(user, { displayName: name.trim(), photoURL });
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { displayName: name.trim(), photoURL, username });
    },
    signOut: () => signOut(auth),
    resetPassword: async (email: string) => {
      await sendPasswordResetEmail(auth, email.trim());
    },
    verifyPasswordCode: async (code: string) => {
      return await verifyPasswordResetCode(auth, code);
    },
    confirmPasswordReset: async (code: string, newPass: string) => {
      await confirmPasswordReset(auth, code, newPass);
    },
    deleteAccount: async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("No active session found");
      const uid = user.uid;
      const q = query(collection(db, "bookListings"), where("sellerId", "==", uid));
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) { await firebase.db.deleteListing(d.id); }
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
      });
    },
    uploadBookImage: async (fileOrBlob: File | Blob): Promise<{ secure_url: string, delete_token?: string }> => {
      const formData = new FormData();
      formData.append("file", fileOrBlob);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "boisathi_uploads");
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
      const data = await response.json();
      return { secure_url: data.secure_url, delete_token: data.delete_token };
    },
    deleteImageByToken: async (deleteToken: string) => {
      const formData = new FormData();
      formData.append("token", deleteToken);
      try {
        await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`, { 
          method: "POST", 
          body: formData 
        });
      } catch (e) {}
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
              if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
              if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Compression failed'));
            }, 'image/jpeg', 0.8);
          };
        };
        reader.onerror = (error) => reject(error);
      });
    },
    addListing: async (listing: Omit<BookListing, 'id' | 'createdAt'>, imageFile?: File) => {
      const createdAt = Date.now();
      let imageUrl = listing.imageUrl || "";
      let imageDeleteToken = listing.imageDeleteToken || "";
      if (imageFile) {
        const res = await firebase.db.uploadBookImage(imageFile);
        imageUrl = res.secure_url;
        imageDeleteToken = res.delete_token || "";
      }
      const docRef = await addDoc(collection(db, "bookListings"), { ...listing, imageUrl, imageDeleteToken, createdAt });
      return { id: docRef.id, ...listing, imageUrl, imageDeleteToken, createdAt } as BookListing;
    },
    updateListing: async (id: string, data: Partial<BookListing>) => {
      await updateDoc(doc(db, "bookListings", id), data);
    },
    deleteListing: async (id: string) => {
      await deleteDoc(doc(db, "bookListings", id));
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
    },
    getUserListings: async (uid: string) => {
      const q = query(collection(db, "bookListings"), where("sellerId", "==", uid));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BookListing));
    },

    createOrGetConversation: async (book: BookListing, buyer: UserProfile): Promise<string> => {
      const participants = [buyer.uid, book.sellerId].sort();
      const conversationId = `${book.id}_${participants.join('_')}`;
      const convRef = doc(db, "conversations", conversationId);
      const snap = await getDoc(convRef);

      if (!snap.exists()) {
        const convData: Conversation = {
          id: conversationId,
          bookId: book.id,
          bookTitle: book.title,
          bookImageUrl: book.imageUrl,
          participants,
          participantNames: {
            [buyer.uid]: buyer.displayName,
            [book.sellerId]: book.sellerName
          },
          updatedAt: Date.now()
        };
        await setDoc(convRef, convData);
      }
      return conversationId;
    },

    subscribeToConversations: (userId: string, callback: (conversations: Conversation[]) => void) => {
      // Note: orderBy is removed here to prevent 'failed-precondition' error without manual index creation.
      // We sort manually on the client side in the DashboardPage component.
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", userId)
      );
      return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(d => d.data() as Conversation));
      });
    },

    subscribeToMessages: (conversationId: string, callback: (messages: ChatMessage[]) => void) => {
      const q = query(
        collection(db, "conversations", conversationId, "messages"),
        orderBy("createdAt", "asc")
      );
      return onSnapshot(q, (snapshot) => {
        callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage)));
      });
    },

    sendMessage: async (conversationId: string, senderId: string, text: string) => {
      const messageData = {
        senderId,
        text,
        createdAt: Date.now()
      };
      await addDoc(collection(db, "conversations", conversationId, "messages"), messageData);
      await updateDoc(doc(db, "conversations", conversationId), {
        lastMessage: text,
        updatedAt: Date.now()
      });
    },
    
    getConversationById: async (id: string): Promise<Conversation | null> => {
      const snap = await getDoc(doc(db, "conversations", id));
      return snap.exists() ? snap.data() as Conversation : null;
    }
  }
};
