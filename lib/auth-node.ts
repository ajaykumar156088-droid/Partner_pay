import { getUserByEmail } from './db';
import bcrypt from 'bcryptjs';
import { SessionPayload } from './auth';

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

export async function authenticateUser(email: string, password: string): Promise<SessionPayload | null> {
    console.log(`[Auth] Attempting login for: ${email}`);
    const user = await getUserByEmail(email);

    if (!user) {
        console.log('[Auth] User not found');
        return null;
    }

    const isValid = await verifyPassword(password, user.password);
    console.log(`[Auth] Password valid: ${isValid}`);
    if (!isValid) {
        return null;
    }

    return {
        userId: user.id,
        email: user.email,
        role: user.role,
    };
}
