import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.error('❌ Missing Firebase Admin credentials:', {
        hasProjectId: !!projectId,
        hasClientEmail: !!clientEmail,
        hasPrivateKey: !!privateKey
      });
      throw new Error('Missing Firebase Admin environment variables');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

const db = admin.firestore();

// POST - Create new article
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new article...');
    const body = await request.json();

    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json({
        error: 'El título es obligatorio',
        details: 'Falta el campo "title"'
      }, { status: 400 });
    }

    if (!body.content?.trim()) {
      return NextResponse.json({
        error: 'El contenido es obligatorio',
        details: 'Falta el campo "content"'
      }, { status: 400 });
    }

    const articleData = {
      ...body,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('articles').add(articleData);
    console.log(`✅ Article created with ID: ${docRef.id}`);

    return NextResponse.json({
      success: true,
      id: docRef.id
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error creating article:', error);
    return NextResponse.json({
      error: 'Error al crear el artículo',
      details: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}

// PUT - Update existing article
export async function PUT(request: NextRequest) {
  try {
    console.log('✏️ Updating article...');
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({
        error: 'ID del artículo es requerido',
        details: 'Falta el campo "id"'
      }, { status: 400 });
    }

    // Validate article exists
    const docRef = db.collection('articles').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({
        error: 'Artículo no encontrado',
        details: `No existe un artículo con ID: ${id}`
      }, { status: 404 });
    }

    const articleData = {
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.update(articleData);
    console.log(`✅ Article updated: ${id}`);

    return NextResponse.json({
      success: true,
      id
    });

  } catch (error: any) {
    console.error('❌ Error updating article:', error);
    return NextResponse.json({
      error: 'Error al actualizar el artículo',
      details: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}

// DELETE - Delete article
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Deleting article...');
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({
        error: 'ID del artículo es requerido',
        details: 'Falta el campo "id"'
      }, { status: 400 });
    }

    // Validate article exists before deleting
    const docRef = db.collection('articles').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({
        error: 'Artículo no encontrado',
        details: `No existe un artículo con ID: ${id}`
      }, { status: 404 });
    }

    await docRef.delete();
    console.log(`✅ Article deleted: ${id}`);

    return NextResponse.json({
      success: true,
      id
    });

  } catch (error: any) {
    console.error('❌ Error deleting article:', error);
    return NextResponse.json({
      error: 'Error al eliminar el artículo',
      details: error.message || 'Error desconocido'
    }, { status: 500 });
  }
}
