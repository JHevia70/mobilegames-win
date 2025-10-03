'use client';

import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import type { Article } from './articles';

// Create a new article
export async function createArticle(articleData: Omit<Article, 'id' | 'createdAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'articles'), {
      ...articleData,
      createdAt: serverTimestamp(),
    });
    console.log('✅ Article created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating article:', error);
    throw error;
  }
}

// Update an existing article
export async function updateArticle(id: string, articleData: Partial<Article>): Promise<void> {
  try {
    const articleRef = doc(db, 'articles', id);
    await updateDoc(articleRef, {
      ...articleData,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Article updated:', id);
  } catch (error) {
    console.error('❌ Error updating article:', error);
    throw error;
  }
}

// Delete an article
export async function deleteArticle(id: string): Promise<void> {
  try {
    const articleRef = doc(db, 'articles', id);
    await deleteDoc(articleRef);
    console.log('✅ Article deleted:', id);
  } catch (error) {
    console.error('❌ Error deleting article:', error);
    throw error;
  }
}
