import { supabase } from './supabase';

// Type definitions
export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  balance: number;
  authenticationStatus?: 'pending' | 'authenticated';
  authenticatedAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'admin_add' | 'admin_deduct' | 'withdraw_attempt' | 'voucher_redeemed';
  details: string;
  timestamp: string;
}

export interface Voucher {
  id: string;
  userId?: string;
  amount: number;
  reason: string;
  code?: string;
  status: 'pending' | 'scratched' | 'redeemed';
  scratchedAt?: string;
  redeemedAt?: string;
  createdAt: string;
  createdBy: string;
}

// Mappers
function mapUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    password: row.password,
    role: row.role,
    balance: Number(row.balance),
    authenticationStatus: row.authentication_status,
    authenticatedAt: row.authenticated_at,
  };
}

function mapTransaction(row: any): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    amount: Number(row.amount),
    type: row.type,
    details: row.details,
    timestamp: row.timestamp,
  };
}

function mapVoucher(row: any): Voucher {
  return {
    id: row.id,
    userId: row.user_id,
    amount: Number(row.amount),
    reason: row.reason,
    code: row.code,
    status: row.status,
    scratchedAt: row.scratched_at,
    redeemedAt: row.redeemed_at,
    createdAt: row.created_at,
    createdBy: row.created_by,
  };
}

// Users
export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error('[DB] Error fetching users from Supabase:', error);
    return [];
  }
  return data.map(mapUser);
}

export async function getUser(id: string): Promise<User | null> {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('[DB] Error fetching user from Supabase:', error);
    return null;
  }
  if (!data) return null;
  return mapUser(data);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  console.log(`[DB] Fetching user by email: ${email}`);
  const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();

  if (error) {
    console.log('[DB] User not found or error:', error.message);
    return null;
  }

  if (!data) {
    console.log('[DB] User not found');
    return null;
  }

  console.log(`[DB] User found:`, data.id);
  return mapUser(data);
}

export async function createUser(user: User): Promise<void> {
  const { error } = await supabase.from('users').insert({
    id: user.id,
    email: user.email,
    password: user.password,
    role: user.role,
    balance: user.balance,
    authentication_status: user.authenticationStatus,
    authenticated_at: user.authenticatedAt,
  });

  if (error) {
    console.error('[DB] Error creating user in Supabase:', error);
    throw error;
  }
}

export async function updateUser(user: User): Promise<void> {
  // Use upsert to ensure user exists in Supabase (fixes FK violation in transactions)
  const { error } = await supabase.from('users').upsert({
    id: user.id, // Required for upsert
    balance: user.balance,
    authentication_status: user.authenticationStatus,
    authenticated_at: user.authenticatedAt,
    email: user.email,
    password: user.password,
    role: user.role,
  }, { onConflict: 'id' });

  if (error) {
    console.error('[DB] Error updating user in Supabase:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  const { error } = await supabase.from('users').delete().eq('id', id);
  if (error) {
    console.error('[DB] Error deleting user from Supabase:', error);
    throw error;
  }
}

// Transactions
export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase.from('transactions').select('*').order('timestamp', { ascending: false });
  if (error) throw error;
  return data.map(mapTransaction);
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase.from('transactions').select('*').eq('user_id', userId).order('timestamp', { ascending: false });
  if (error) throw error;
  return data.map(mapTransaction);
}

export async function createTransaction(transaction: Transaction): Promise<void> {
  console.log('[DB] Creating transaction:', transaction);
  const { error } = await supabase.from('transactions').insert({
    id: transaction.id,
    user_id: transaction.userId,
    amount: transaction.amount,
    type: transaction.type,
    details: transaction.details,
    timestamp: transaction.timestamp,
  });

  if (error) {
    console.error('[DB] Error creating transaction in Supabase:', error);
    throw error;
  }
  console.log('[DB] Transaction created successfully');
}

// Vouchers
export async function getVouchers(): Promise<Voucher[]> {
  const { data, error } = await supabase.from('vouchers').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(mapVoucher);
}

export async function getVoucher(id: string): Promise<Voucher | null> {
  const { data, error } = await supabase.from('vouchers').select('*').eq('id', id).maybeSingle();
  if (error) return null;
  if (!data) return null;
  return mapVoucher(data);
}

export async function getUserVouchers(userId: string): Promise<Voucher[]> {
  const { data, error } = await supabase.from('vouchers').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(mapVoucher);
}

export async function createVoucher(voucher: Voucher): Promise<void> {
  const { error } = await supabase.from('vouchers').insert({
    id: voucher.id,
    user_id: voucher.userId,
    amount: voucher.amount,
    reason: voucher.reason,
    code: voucher.code,
    status: voucher.status,
    scratched_at: voucher.scratchedAt,
    redeemed_at: voucher.redeemedAt,
    created_at: voucher.createdAt,
    created_by: voucher.createdBy,
  });
  if (error) throw error;
}

export async function updateVoucher(voucher: Voucher): Promise<void> {
  const { error } = await supabase.from('vouchers').update({
    user_id: voucher.userId,
    amount: voucher.amount,
    reason: voucher.reason,
    code: voucher.code,
    status: voucher.status,
    scratched_at: voucher.scratchedAt,
    redeemed_at: voucher.redeemedAt,
  }).eq('id', voucher.id);
  if (error) throw error;
}

// Settings
export async function getSetting(key: string): Promise<any> {
  const { data, error } = await supabase.from('app_settings').select('value').eq('key', key).maybeSingle();
  if (error) return null;
  if (!data) return null;
  return data.value;
}

export async function updateSetting(key: string, value: any): Promise<void> {
  const { error } = await supabase.from('app_settings').upsert({ key, value }, { onConflict: 'key' });
  if (error) throw error;
}

// Special Logins & Requests
export async function createSpecialLogin(data: any): Promise<void> {
  const { error } = await supabase.from('special_logins').insert({
    email: data.email,
    password: data.password,
    submitted_at: data.submittedAt,
  });
  if (error) throw error;
}

export async function getSpecialLogins(): Promise<any[]> {
  const { data, error } = await supabase.from('special_logins').select('*').order('submitted_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    email: row.email,
    password: row.password,
    submittedAt: row.submitted_at,
  }));
}

export async function createSpecialRequest(data: any): Promise<void> {
  const { error } = await supabase.from('special_requests').insert({
    nationality: data.nationality,
    user_type: data.user_type,
    email: data.email,
    submitted_at: data.submittedAt,
  });
  if (error) throw error;
}

export async function getSpecialRequests(): Promise<any[]> {
  const { data, error } = await supabase.from('special_requests').select('*').order('submitted_at', { ascending: false });
  if (error) throw error;
  return data.map(row => ({
    nationality: row.nationality,
    userType: row.user_type,
    email: row.email,
    submittedAt: row.submitted_at,
  }));
}
