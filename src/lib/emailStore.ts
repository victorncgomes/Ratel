/**
 * IndexedDB store for emails and RATE scores
 * Optimized for 10K+ emails
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface RatelDB extends DBSchema {
    emails: {
        key: string;
        value: {
            id: string;
            threadId: string;
            from: string;
            subject: string;
            date: string;
            snippet: string;
            labelIds: string[];
            sizeEstimate: number;
            hasUnsubscribe: boolean;
            unsubscribeLink?: string;
            rateScore?: number;
            rateCalculatedAt?: number;
            fetchedAt: number;
        };
        indexes: {
            'by-date': string;
            'by-from': string;
            'by-score': number;
        };
    };
    metadata: {
        key: string;
        value: {
            key: string;
            value: any;
            updatedAt: number;
        };
    };
    senderProfiles: {
        key: string;
        value: {
            email: string;
            deleteCount: number;
            keepCount: number;
            openCount: number;
            totalCount: number;
            lastSeen: number;
        };
    };
}

let dbInstance: IDBPDatabase<RatelDB> | null = null;

async function getDB(): Promise<IDBPDatabase<RatelDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<RatelDB>('ratel-emails', 1, {
        upgrade(db) {
            // Emails store
            if (!db.objectStoreNames.contains('emails')) {
                const emailStore = db.createObjectStore('emails', { keyPath: 'id' });
                emailStore.createIndex('by-date', 'date');
                emailStore.createIndex('by-from', 'from');
                emailStore.createIndex('by-score', 'rateScore');
            }

            // Metadata store
            if (!db.objectStoreNames.contains('metadata')) {
                db.createObjectStore('metadata', { keyPath: 'key' });
            }

            // Sender profiles store
            if (!db.objectStoreNames.contains('senderProfiles')) {
                db.createObjectStore('senderProfiles', { keyPath: 'email' });
            }
        }
    });

    return dbInstance;
}

// ========================================
// EMAIL OPERATIONS
// ========================================

export async function saveEmails(emails: any[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('emails', 'readwrite');
    const store = tx.objectStore('emails');

    const now = Date.now();

    await Promise.all(
        emails.map(email =>
            store.put({
                ...email,
                fetchedAt: now
            })
        )
    );

    await tx.done;
}

export async function getEmail(id: string): Promise<any | undefined> {
    const db = await getDB();
    return db.get('emails', id);
}

export async function getAllEmails(): Promise<any[]> {
    const db = await getDB();
    return db.getAll('emails');
}

export async function getEmailCount(): Promise<number> {
    const db = await getDB();
    return db.count('emails');
}

export async function getEmailsByDateRange(startDate: string, endDate: string): Promise<any[]> {
    const db = await getDB();
    const index = db.transaction('emails').objectStore('emails').index('by-date');
    return index.getAll(IDBKeyRange.bound(startDate, endDate));
}

export async function updateEmailScore(id: string, score: number): Promise<void> {
    const db = await getDB();
    const email = await db.get('emails', id);
    if (email) {
        email.rateScore = score;
        email.rateCalculatedAt = Date.now();
        await db.put('emails', email);
    }
}

export async function updateEmailScores(updates: { id: string; score: number }[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('emails', 'readwrite');
    const store = tx.objectStore('emails');

    await Promise.all(
        updates.map(async ({ id, score }) => {
            const email = await store.get(id);
            if (email) {
                email.rateScore = score;
                email.rateCalculatedAt = Date.now();
                await store.put(email);
            }
        })
    );

    await tx.done;
}

export async function clearOldEmails(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<number> {
    const db = await getDB();
    const tx = db.transaction('emails', 'readwrite');
    const store = tx.objectStore('emails');

    const cutoff = Date.now() - maxAgeMs;
    const emails = await store.getAll();
    let cleared = 0;

    for (const email of emails) {
        if (email.fetchedAt < cutoff) {
            await store.delete(email.id);
            cleared++;
        }
    }

    await tx.done;
    return cleared;
}

// ========================================
// METADATA OPERATIONS
// ========================================

export async function setMetadata(key: string, value: any): Promise<void> {
    const db = await getDB();
    await db.put('metadata', {
        key,
        value,
        updatedAt: Date.now()
    });
}

export async function getMetadata(key: string): Promise<any | undefined> {
    const db = await getDB();
    const record = await db.get('metadata', key);
    return record?.value;
}

export async function getLastLoadTime(): Promise<number> {
    return (await getMetadata('lastLoadTime')) || 0;
}

export async function setLastLoadTime(): Promise<void> {
    await setMetadata('lastLoadTime', Date.now());
}

// ========================================
// SENDER PROFILE OPERATIONS
// ========================================

export async function updateSenderProfile(
    email: string,
    action: 'delete' | 'keep' | 'open'
): Promise<void> {
    const db = await getDB();
    let profile = await db.get('senderProfiles', email);

    if (!profile) {
        profile = {
            email,
            deleteCount: 0,
            keepCount: 0,
            openCount: 0,
            totalCount: 0,
            lastSeen: Date.now()
        };
    }

    profile.totalCount++;
    profile.lastSeen = Date.now();

    switch (action) {
        case 'delete':
            profile.deleteCount++;
            break;
        case 'keep':
            profile.keepCount++;
            break;
        case 'open':
            profile.openCount++;
            break;
    }

    await db.put('senderProfiles', profile);
}

export async function getSenderProfile(email: string): Promise<any | undefined> {
    const db = await getDB();
    return db.get('senderProfiles', email);
}

export async function getAllSenderProfiles(): Promise<any[]> {
    const db = await getDB();
    return db.getAll('senderProfiles');
}

// ========================================
// UTILITY
// ========================================

export async function clearAllData(): Promise<void> {
    const db = await getDB();

    const tx1 = db.transaction('emails', 'readwrite');
    await tx1.objectStore('emails').clear();
    await tx1.done;

    const tx2 = db.transaction('metadata', 'readwrite');
    await tx2.objectStore('metadata').clear();
    await tx2.done;

    const tx3 = db.transaction('senderProfiles', 'readwrite');
    await tx3.objectStore('senderProfiles').clear();
    await tx3.done;
}

export async function getStorageStats(): Promise<{ emailCount: number; senderCount: number }> {
    const db = await getDB();
    return {
        emailCount: await db.count('emails'),
        senderCount: await db.count('senderProfiles')
    };
}
