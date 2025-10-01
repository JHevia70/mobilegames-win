import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const articleData = {
      ...body,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('articles').add(articleData);

    return NextResponse.json({
      success: true,
      id: docRef.id
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json({
      error: 'Error al crear el artículo',
      details: error.message
    }, { status: 500 });
  }
}

// PUT - Update existing article
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({
        error: 'ID del artículo es requerido'
      }, { status: 400 });
    }

    const articleData = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('articles').doc(id).update(articleData);

    return NextResponse.json({
      success: true,
      id
    });

  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json({
      error: 'Error al actualizar el artículo',
      details: error.message
    }, { status: 500 });
  }
}

// DELETE - Delete article
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({
        error: 'ID del artículo es requerido'
      }, { status: 400 });
    }

    await db.collection('articles').doc(id).delete();

    return NextResponse.json({
      success: true,
      id
    });

  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json({
      error: 'Error al eliminar el artículo',
      details: error.message
    }, { status: 500 });
  }
}
