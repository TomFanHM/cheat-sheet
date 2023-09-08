---
id: 835a3b7d
layout: ../../layouts/MarkdownContainer.astro
title: Firebase
description: Firebase is a comprehensive app development platform provided by Google. It's a suite of cloud-based tools that aims to help developers build, improve, and grow their applications. Firebase offers a wide range of services like real-time databases, user authentication, cloud storage, hosting, machine learning, analytics, and much more. It's designed to be easy to use, scalable, and integrates well with other Google cloud services and APIs. Firebase supports various platforms including iOS, Android, Web, and even Unity for game development.
imageUrl: ../../assets/firebase.png
date: Sep 8, 2023
datetime: "2023-09-08"
category: Documentation
disable: false
---

### Initialization

- You can get your Firebase configuration object from the Firebase console

```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
```

### Getting a Collection

- To get a reference to a Firestore collection

```typescript
import { collection } from "firebase/firestore";

const usersCollection = collection(firestore, "users");
```

### Creating a Query

- To create a new query with additional restrictions

```typescript
import { query, where } from "firebase/firestore";

const q = query(collection(firestore, "users"), where("active", "==", true));
```

### Fetching a Document

- To fetch a specific document from a collection

```typescript
import { doc, getDoc } from "firebase/firestore";

async function getDocument(collection: string, uid: string) {
  try {
    const docRef = doc(firestore, collection, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();
  } catch (error) {
    console.error("Error fetching document: ", error);
  }
  return null;
}
```

### Uploading an Image

- To upload an image to Firebase Storage and get its download URL

```typescript
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

async function uploadImage(path: string, file: File): Promise<string> {
  try {
    const imageRef = ref(storage, path);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image: ", error);
  }
  return null;
}
```

### Fetching and Validating Data from Firestore

- To fetch multiple documents from a Firestore collection and validate the data against a Zod schema

```typescript
export const ArticleSchema = z.object({
  title: z.string(),
  description: z.string(),
  publishedAt: z.string().datetime(),
});

export type ArticleSchemaType = z.infer<typeof ArticleSchema>;

export async function getArticles() {
  const articlesCollection = collection(firestore, "articles");
  const q = query(
    articlesCollection,
    orderBy("publishedAt", "desc"),
    limit(10)
  );

  try {
    const querySnapshot = await getDocs(q);

    const articles = querySnapshot.docs.map((doc) => {
      const data = ArticleSchema.safeParse(doc.data());
      if (data.success) {
        return data.data;
      }
    });

    return articles.flatMap((article) => (article ? [article] : []));
  } catch (error) {
    console.error("Error fetching articles: ", error);
  }
  return [];
}
```