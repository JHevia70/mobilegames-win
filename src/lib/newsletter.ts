'use client';

import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { sendWelcomeEmail as sendWelcomeEmailBrevo, canSendEmail, getEmailQuota } from './brevo';

/**
 * Verifica si un email ya está suscrito
 */
export async function isEmailSubscribed(email: string): Promise<boolean> {
  try {
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

/**
 * Guarda un suscriptor en Firestore
 */
export async function saveSubscriber(email: string, name?: string): Promise<void> {
  try {
    const subscribersRef = collection(db, 'subscribers');
    await addDoc(subscribersRef, {
      email: email.toLowerCase(),
      name: name || email.split('@')[0],
      subscribedAt: serverTimestamp(),
      status: 'active',
      source: 'website',
      confirmed: true,
      groups: ['general'], // Por defecto en grupo "General"
    });
    console.log('✅ Subscriber saved to Firestore');
  } catch (error) {
    console.error('❌ Error saving subscriber:', error);
    throw new Error('Error al guardar el suscriptor');
  }
}

/**
 * Envía email de bienvenida usando Brevo
 */
export async function sendWelcomeEmail(email: string, name?: string): Promise<void> {
  try {
    console.log('📧 Sending welcome email to:', email);
    
    // Usar Brevo en lugar de EmailJS
    await sendWelcomeEmailBrevo(email, name || '');
    
    console.log('✅ Email sent successfully via Brevo');
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    throw new Error('Error al enviar el email de bienvenida');
  }
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Función principal para suscribirse a la newsletter
 */
export async function subscribeToNewsletter(
  email: string,
  name?: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Validar email
    if (!email || !isValidEmail(email)) {
      return {
        success: false,
        message: 'Por favor, introduce un email válido',
      };
    }

    // Verificar si ya está suscrito
    const alreadySubscribed = await isEmailSubscribed(email);
    if (alreadySubscribed) {
      return {
        success: false,
        message: '¡Este email ya está suscrito a nuestra newsletter!',
      };
    }

    // Guardar en Firestore (esto es crítico)
    await saveSubscriber(email, name);

    // Intentar enviar email de bienvenida (no crítico)
    try {
      await sendWelcomeEmail(email, name);
    } catch (emailError: any) {
      console.warn('⚠️ Email no enviado (cuenta EmailJS puede estar bloqueada):', emailError.message);
      // No fallar la suscripción si el email falla
    }

    return {
      success: true,
      message: '¡Suscripción exitosa! Te has registrado correctamente.',
    };
  } catch (error: any) {
    console.error('❌ Subscription error:', error);
    return {
      success: false,
      message: error.message || 'Error al procesar la suscripción. Por favor, intenta de nuevo.',
    };
  }
}

/**
 * Obtener estadísticas de suscriptores
 */
export async function getSubscriberStats(): Promise<{
  total: number;
  active: number;
}> {
  try {
    const subscribersRef = collection(db, 'subscribers');
    const allSnapshot = await getDocs(subscribersRef);
    
    const activeQuery = query(subscribersRef, where('status', '==', 'active'));
    const activeSnapshot = await getDocs(activeQuery);

    return {
      total: allSnapshot.size,
      active: activeSnapshot.size,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return { total: 0, active: 0 };
  }
}

/**
 * Interfaz de suscriptor
 */
export interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribedAt: any;
  status: 'active' | 'blocked' | 'unsubscribed';
  source: string;
  confirmed: boolean;
  groups?: string[]; // Grupos de segmentación
}

/**
 * Obtener todos los suscriptores (incluyendo bloqueados)
 */
export async function getAllSubscribers(): Promise<Subscriber[]> {
  try {
    const subscribersRef = collection(db, 'subscribers');
    // Traer TODOS, no solo activos
    const querySnapshot = await getDocs(subscribersRef);
    
    const subscribers: Subscriber[] = [];
    querySnapshot.forEach((doc) => {
      subscribers.push({
        id: doc.id,
        ...doc.data(),
      } as Subscriber);
    });
    
    // Ordenar por fecha de suscripción (más recientes primero)
    subscribers.sort((a, b) => {
      const dateA = a.subscribedAt?.toDate?.() || new Date(0);
      const dateB = b.subscribedAt?.toDate?.() || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return subscribers;
  } catch (error) {
    console.error('Error getting subscribers:', error);
    return [];
  }
}

/**
 * Exportar suscriptores a CSV
 */
export function exportSubscribersToCSV(subscribers: Subscriber[]): string {
  const headers = ['Email', 'Nombre', 'Fecha de Suscripción', 'Estado', 'Fuente'];
  const rows = subscribers.map(sub => [
    sub.email,
    sub.name,
    sub.subscribedAt?.toDate?.().toLocaleDateString('es-ES') || 'N/A',
    sub.status,
    sub.source
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Descargar CSV
 */
export function downloadCSV(csvContent: string, filename: string = 'subscribers.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Actualizar suscriptor (estado, grupos, etc)
 */
export async function updateSubscriber(
  subscriberId: string,
  updates: Partial<Omit<Subscriber, 'id'>>
): Promise<void> {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const subscriberRef = doc(db, 'subscribers', subscriberId);
    await updateDoc(subscriberRef, updates as any);
    console.log('✅ Subscriber updated:', subscriberId);
  } catch (error) {
    console.error('Error updating subscriber:', error);
    throw new Error('Error al actualizar el suscriptor');
  }
}

/**
 * Eliminar suscriptor permanentemente
 */
export async function deleteSubscriber(subscriberId: string): Promise<void> {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const subscriberRef = doc(db, 'subscribers', subscriberId);
    await deleteDoc(subscriberRef);
    console.log('✅ Subscriber deleted:', subscriberId);
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    throw new Error('Error al eliminar el suscriptor');
  }
}

/**
 * Actualizar múltiples suscriptores (acciones en lote)
 */
export async function bulkUpdateSubscribers(
  subscriberIds: string[],
  updates: Partial<Omit<Subscriber, 'id'>>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const id of subscriberIds) {
    try {
      await updateSubscriber(id, updates);
      success++;
    } catch (error) {
      console.error(`Failed to update subscriber ${id}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Eliminar múltiples suscriptores
 */
export async function bulkDeleteSubscribers(subscriberIds: string[]): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const id of subscriberIds) {
    try {
      await deleteSubscriber(id);
      success++;
    } catch (error) {
      console.error(`Failed to delete subscriber ${id}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Obtener suscriptores por grupo
 */
export async function getSubscribersByGroup(group: string): Promise<Subscriber[]> {
  try {
    const subscribersRef = collection(db, 'subscribers');
    const q = query(subscribersRef, where('groups', 'array-contains', group));
    const querySnapshot = await getDocs(q);
    
    const subscribers: Subscriber[] = [];
    querySnapshot.forEach((doc) => {
      subscribers.push({
        id: doc.id,
        ...doc.data(),
      } as Subscriber);
    });
    
    return subscribers.sort((a, b) => b.subscribedAt - a.subscribedAt);
  } catch (error) {
    console.error('Error getting subscribers by group:', error);
    return [];
  }
}

/**
 * Interfaz de grupo de suscriptores
 */
export interface SubscriberGroup {
  id: string;
  name: string;
  description: string;
  color?: string;
  createdAt?: any;
  isDefault?: boolean; // Los grupos por defecto no se pueden eliminar
}

/**
 * Obtener todos los grupos
 */
export async function getAllGroups(): Promise<SubscriberGroup[]> {
  try {
    const groupsRef = collection(db, 'subscriberGroups');
    const querySnapshot = await getDocs(groupsRef);
    
    const groups: SubscriberGroup[] = [];
    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data(),
      } as SubscriberGroup);
    });
    
    // Ordenar por nombre
    return groups.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error getting groups:', error);
    return [];
  }
}

/**
 * Crear un nuevo grupo
 */
export async function createGroup(
  name: string,
  description: string,
  color?: string
): Promise<{ success: boolean; message: string; groupId?: string }> {
  try {
    // Validar nombre
    if (!name || name.trim().length < 2) {
      return { success: false, message: 'El nombre debe tener al menos 2 caracteres' };
    }

    // Verificar si ya existe un grupo con ese nombre
    const groups = await getAllGroups();
    const exists = groups.some(g => g.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      return { success: false, message: 'Ya existe un grupo con ese nombre' };
    }

    const groupsRef = collection(db, 'subscriberGroups');
    const docRef = await addDoc(groupsRef, {
      name: name.trim(),
      description: description.trim() || '',
      color: color || '#8B5CF6',
      createdAt: serverTimestamp(),
      isDefault: false,
    });

    return { 
      success: true, 
      message: 'Grupo creado correctamente',
      groupId: docRef.id 
    };
  } catch (error) {
    console.error('Error creating group:', error);
    return { success: false, message: 'Error al crear el grupo' };
  }
}

/**
 * Actualizar un grupo existente
 */
export async function updateGroup(
  groupId: string,
  updates: { name?: string; description?: string; color?: string }
): Promise<{ success: boolean; message: string }> {
  try {
    const { doc: docFunction, updateDoc } = await import('firebase/firestore');
    const groupRef = docFunction(db, 'subscriberGroups', groupId);
    
    const updateData: any = {};
    if (updates.name) updateData.name = updates.name.trim();
    if (updates.description !== undefined) updateData.description = updates.description.trim();
    if (updates.color) updateData.color = updates.color;

    await updateDoc(groupRef, updateData);
    return { success: true, message: 'Grupo actualizado correctamente' };
  } catch (error) {
    console.error('Error updating group:', error);
    return { success: false, message: 'Error al actualizar el grupo' };
  }
}

/**
 * Eliminar un grupo
 */
export async function deleteGroup(groupId: string): Promise<{ success: boolean; message: string }> {
  try {
    // Verificar si es un grupo por defecto
    const groups = await getAllGroups();
    const group = groups.find(g => g.id === groupId);
    
    if (group?.isDefault) {
      return { success: false, message: 'No se pueden eliminar grupos predeterminados' };
    }

    // Eliminar el grupo de todos los suscriptores
    const subscribers = await getAllSubscribers();
    const subscribersWithGroup = subscribers.filter(s => s.groups?.includes(groupId));
    
    for (const subscriber of subscribersWithGroup) {
      const newGroups = subscriber.groups?.filter(g => g !== groupId) || [];
      await updateSubscriber(subscriber.id, { groups: newGroups });
    }

    // Eliminar el grupo
    const { doc: docFunction, deleteDoc } = await import('firebase/firestore');
    const groupRef = docFunction(db, 'subscriberGroups', groupId);
    await deleteDoc(groupRef);

    return { success: true, message: 'Grupo eliminado correctamente' };
  } catch (error) {
    console.error('Error deleting group:', error);
    return { success: false, message: 'Error al eliminar el grupo' };
  }
}

/**
 * Inicializar grupos predeterminados (ejecutar una sola vez)
 */
export async function initializeDefaultGroups(): Promise<void> {
  const defaultGroups = [
    { name: 'General', description: 'Newsletter general', color: '#8B5CF6' },
    { name: 'VIP', description: 'Suscriptores VIP', color: '#F59E0B' },
    { name: 'Breaking News', description: 'Noticias urgentes', color: '#EF4444' },
    { name: 'Weekly Top 5', description: 'Top 5 semanal', color: '#3B82F6' },
    { name: 'Reviews', description: 'Análisis y reviews', color: '#10B981' },
    { name: 'Torneos', description: 'Info de torneos', color: '#EC4899' },
  ];

  try {
    const existingGroups = await getAllGroups();
    
    for (const group of defaultGroups) {
      const exists = existingGroups.some(g => g.name === group.name);
      if (!exists) {
        const groupsRef = collection(db, 'subscriberGroups');
        await addDoc(groupsRef, {
          ...group,
          createdAt: serverTimestamp(),
          isDefault: true,
        });
        console.log(`✅ Created default group: ${group.name}`);
      }
    }
  } catch (error) {
    console.error('Error initializing default groups:', error);
  }
}

/**
 * Re-exportar funciones de cuota de Brevo
 */
export { getEmailQuota, canSendEmail } from './brevo';
export type { EmailQuota } from './brevo';
