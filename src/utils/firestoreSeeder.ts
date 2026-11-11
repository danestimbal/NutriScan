import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db, sanitizePayload } from '../firebase';
import { comprehensiveSeedProducts } from '../data/seedProducts50';
import { initialAdditivePolicies } from '../data/seedData';
import { FoodProduct, AdditivePolicy } from '../types';

export interface SeedProgressResult {
  productsSeeded: number;
  policiesSeeded: number;
  totalProducts: number;
  alreadyPopulated: boolean;
  timestamp: string;
}

/**
 * Automatically seeds 52 food products and additive policies into Firestore if not yet populated
 */
export async function seedDatabaseIfEmpty(force = false): Promise<SeedProgressResult> {
  try {
    const productsColl = collection(db, 'products');
    const existingSnap = await getDocs(productsColl);
    const existingCount = existingSnap.size;

    // Check if any seeded product in Firestore still has a stale/mismatched image URL compared to comprehensiveSeedProducts
    const seedImageMap = new Map(comprehensiveSeedProducts.map((p) => [p.id, p.image]));
    const hasOutdatedSeedImages = existingSnap.docs.some((docSnap) => {
      const data = docSnap.data() as FoodProduct;
      const expectedImage = seedImageMap.get(data.id);
      return expectedImage && data.image !== expectedImage;
    });

    if (!force && existingCount >= 50 && !hasOutdatedSeedImages) {
      return {
        productsSeeded: 0,
        policiesSeeded: 0,
        totalProducts: existingCount,
        alreadyPopulated: true,
        timestamp: new Date().toLocaleTimeString(),
      };
    }

    // Seed products in batches (Firestore allows up to 500 writes per batch)
    const batch = writeBatch(db);
    let seededProductsCount = 0;

    for (const prod of comprehensiveSeedProducts) {
      const prodRef = doc(db, 'products', prod.id);
      batch.set(prodRef, sanitizePayload(prod), { merge: true });
      seededProductsCount++;
    }

    // Seed additive policies
    let seededPoliciesCount = 0;
    for (const policy of initialAdditivePolicies) {
      const policyRef = doc(db, 'additivePolicies', policy.eCode);
      batch.set(policyRef, sanitizePayload(policy), { merge: true });
      seededPoliciesCount++;
    }

    await batch.commit();

    return {
      productsSeeded: seededProductsCount,
      policiesSeeded: seededPoliciesCount,
      totalProducts: comprehensiveSeedProducts.length,
      alreadyPopulated: false,
      timestamp: new Date().toLocaleTimeString(),
    };
  } catch (error) {
    console.warn('Firestore seeding notice:', error);
    // Fallback: seed items individually if batch encounters network restriction
    try {
      let count = 0;
      for (const prod of comprehensiveSeedProducts) {
        await setDoc(doc(db, 'products', prod.id), sanitizePayload(prod), { merge: true });
        count++;
      }
      for (const pol of initialAdditivePolicies) {
        await setDoc(doc(db, 'additivePolicies', pol.eCode), sanitizePayload(pol), { merge: true });
      }
      return {
        productsSeeded: count,
        policiesSeeded: initialAdditivePolicies.length,
        totalProducts: count,
        alreadyPopulated: false,
        timestamp: new Date().toLocaleTimeString(),
      };
    } catch (innerErr) {
      console.error('Individual seeding error:', innerErr);
      throw innerErr;
    }
  }
}
