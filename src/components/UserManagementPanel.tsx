import React, { useEffect, useMemo, useState } from 'react';
import { collection, deleteDoc, doc, getCountFromServer, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db, resetPassword } from '../firebase';
import { useApp } from '../context/AppContext';
import { GUEST_PLACEHOLDER_EMAIL, OWNER_ADMIN_EMAIL } from '../config/admin';

interface ManagedUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  profileCompleted: boolean;
  lastLoginAt: string | null;
  suspended: boolean;
  suspendedAt: string | null;
  allergenCount: number;
  isGuest: boolean;
}

type FilterTab = 'all' | 'admins' | 'suspended';

const formatDate = (iso: string | null) => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

const toManagedUser = (uid: string, data: Record<string, any>): ManagedUser => {
  const email = String(data.email || '').toLowerCase();
  return {
    uid,
    displayName: String(data.displayName || '') || (email ? email.split('@')[0] : 'Guest User'),
    email,
    photoURL: String(data.photoURL || ''),
    profileCompleted: data.profileCompleted === true,
    lastLoginAt: typeof data.lastLoginAt === 'string' ? data.lastLoginAt : null,
    suspended: data.suspended === true,
    suspendedAt: typeof data.suspendedAt === 'string' ? data.suspendedAt : null,
    allergenCount: Array.isArray(data.activeAllergens)
      ? data.activeAllergens.filter((a: any) => a?.active).length
      : 0,
    isGuest: !email || email === GUEST_PLACEHOLDER_EMAIL,
  };
};

const Pill: React.FC<{ className: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={`px-2 py-0.5 rounded-full font-mono-tech text-[10px] font-bold uppercase ${className}`}>{children}</span>
);

export const UserManagementPanel: React.FC<{ onToast: (message: string) => void }> = ({ onToast }) => {
  const { adminRole } = useApp();
  const isOwnerAdmin = adminRole === 'owner';
  const myEmail = (auth.currentUser?.email || '').toLowerCase();
  const myUid = auth.currentUser?.uid || '';

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [adminEmails, setAdminEmails] = useState<Set<string>>(new Set());
  const [scanCounts, setScanCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyUid, setBusyUid] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [showGuests, setShowGuests] = useState(false);

  // Live user + admin lists
  useEffect(() => {
    const unsubscribeUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        setUsers(snapshot.docs.map((d) => toManagedUser(d.id, d.data())));
        setLoading(false);
        setLoadError(null);
      },
      (error) => {
        console.warn('User list listener:', error);
        setLoading(false);
        setLoadError(
          error?.code === 'permission-denied'
            ? 'The database refused the user list. Make sure the latest Firestore rules are deployed and you are signed in with a verified admin email.'
            : error?.message || 'Could not load users.'
        );
      }
    );
    const unsubscribeAdmins = onSnapshot(
      collection(db, 'admins'),
      (snapshot) => setAdminEmails(new Set(snapshot.docs.map((d) => d.id))),
      (error) => console.warn('Admin list listener:', error)
    );
    return () => {
      unsubscribeUsers();
      unsubscribeAdmins();
    };
  }, []);

  // Scan counts (one aggregate query per user not yet counted)
  useEffect(() => {
    const pending = users.filter((u) => scanCounts[u.uid] === undefined);
    if (pending.length === 0) return;
    let cancelled = false;
    Promise.all(
      pending.map(async (u) => {
        try {
          const snap = await getCountFromServer(collection(db, 'users', u.uid, 'scans'));
          return [u.uid, snap.data().count] as const;
        } catch {
          return [u.uid, -1] as const;
        }
      })
    ).then((entries) => {
      if (cancelled) return;
      setScanCounts((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    });
    return () => {
      cancelled = true;
    };
  }, [users, scanCounts]);

  const roleOf = (user: ManagedUser): 'owner' | 'admin' | 'user' =>
    user.email === OWNER_ADMIN_EMAIL ? 'owner' : adminEmails.has(user.email) ? 'admin' : 'user';

  const stats = useMemo(
    () => ({
      total: users.filter((u) => !u.isGuest).length,
      guests: users.filter((u) => u.isGuest).length,
      admins: 1 + adminEmails.size,
      suspended: users.filter((u) => u.suspended).length,
    }),
    [users, adminEmails]
  );

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users
      .filter((u) => showGuests || !u.isGuest || filter === 'suspended')
      .filter((u) => {
        if (filter === 'admins') return roleOf(u) !== 'user';
        if (filter === 'suspended') return u.suspended;
        return true;
      })
      .filter(
        (u) =>
          !query ||
          u.displayName.toLowerCase().includes(query) ||
          u.email.includes(query) ||
          u.uid.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const rank = { owner: 0, admin: 1, user: 2 };
        const byRole = rank[roleOf(a)] - rank[roleOf(b)];
        if (byRole !== 0) return byRole;
        return (b.lastLoginAt || '').localeCompare(a.lastLoginAt || '');
      });
    // roleOf depends on adminEmails
  }, [users, search, filter, showGuests, adminEmails]);

  const run = async (uid: string, action: () => Promise<void>, success: string) => {
    setBusyUid(uid);
    try {
      await action();
      onToast(success);
    } catch (error: any) {
      console.warn('User management action failed:', error);
      onToast(
        error?.code === 'permission-denied'
          ? 'The database refused this change (check that you are an admin and the rules are deployed).'
          : error?.message || 'Action failed.'
      );
    } finally {
      setBusyUid(null);
    }
  };

  const setAdmin = (user: ManagedUser, makeAdmin: boolean) =>
    run(
      user.uid,
      () =>
        makeAdmin
          ? setDoc(doc(db, 'admins', user.email), {
              email: user.email,
              grantedBy: myEmail,
              grantedAt: new Date().toISOString(),
            })
          : deleteDoc(doc(db, 'admins', user.email)),
      makeAdmin ? `${user.email} is now an admin.` : `Removed admin rights from ${user.email}.`
    );

  const setSuspended = (user: ManagedUser, suspend: boolean) => {
    if (
      suspend &&
      !window.confirm(`Suspend ${user.displayName}? They will be signed out and blocked from saving data until reactivated.`)
    ) {
      return;
    }
    run(
      user.uid,
      () =>
        setDoc(
          doc(db, 'users', user.uid),
          suspend
            ? { suspended: true, suspendedAt: new Date().toISOString(), suspendedBy: myEmail }
            : { suspended: false, suspendedAt: null, suspendedBy: null },
          { merge: true }
        ),
      suspend ? `${user.displayName} has been suspended.` : `${user.displayName} has been reactivated.`
    );
  };

  const sendReset = (user: ManagedUser) =>
    run(user.uid, () => resetPassword(user.email), `Password reset email sent to ${user.email}.`);

  const actionBtn =
    'px-3 py-1.5 rounded-full font-mono-tech text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Registered Users', value: stats.total, icon: 'group', tone: 'text-[#5379EE] bg-[#EEF2FF]' },
          { label: 'Admins', value: stats.admins, icon: 'shield_person', tone: 'text-[#4338ca] bg-[#e0e7ff]' },
          { label: 'Suspended', value: stats.suspended, icon: 'block', tone: 'text-[#e11d48] bg-[#fff1f2]' },
          { label: 'Guest Sessions', value: stats.guests, icon: 'person', tone: 'text-[#565e74] bg-[#f1f5f9]' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex items-start justify-between">
            <div>
              <span className="font-mono-tech text-[10px] text-[#64748b] uppercase tracking-wider font-bold">{card.label}</span>
              <span className="text-3xl font-extrabold text-[#0f172a] mt-1 block">{loading ? '…' : card.value}</span>
            </div>
            <span className={`w-10 h-10 rounded-full flex items-center justify-center ${card.tone}`}>
              <span className="material-symbols-outlined text-xl">{card.icon}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 p-0.5 bg-[#f1f5f9] rounded-xl">
          {(
            [
              { id: 'all', label: 'All Users' },
              { id: 'admins', label: 'Admins' },
              { id: 'suspended', label: 'Suspended' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg font-mono-tech text-xs font-bold transition-all cursor-pointer ${
                filter === tab.id ? 'bg-white text-[#0f172a] shadow-xs' : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 flex-1 justify-end">
          <label className="flex items-center gap-2 text-xs text-[#64748b] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showGuests}
              onChange={(e) => setShowGuests(e.target.checked)}
              className="w-4 h-4 accent-[#5379EE]"
            />
            Show guest sessions
          </label>
          <div className="relative flex items-center w-full sm:w-72">
            <span className="absolute left-3 material-symbols-outlined text-[#64748b] text-lg pointer-events-none">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or user ID"
              aria-label="Search users"
              className="w-full h-10 pl-9 pr-3 rounded-full bg-[#f8fafc] border border-slate-200 text-xs text-[#0f172a] outline-none focus:border-[#5379EE]"
            />
          </div>
        </div>
      </div>

      {!isOwnerAdmin && (
        <p className="text-xs text-[#64748b] px-1">
          Only the owner account ({OWNER_ADMIN_EMAIL}) can grant or remove admin rights.
        </p>
      )}

      {loadError && (
        <div className="p-4 rounded-2xl bg-[#fff1f2] border border-[#fecdd3] text-[#be123c] text-xs font-semibold flex items-start gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          <span>{loadError}</span>
        </div>
      )}

      {/* User list */}
      <div className="space-y-3">
        {loading && <p className="text-xs text-[#64748b] px-1">Loading users…</p>}
        {!loading && !loadError && visibleUsers.length === 0 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center text-xs text-[#64748b]">
            No users match this view.
          </div>
        )}
        {visibleUsers.map((user) => {
          const role = roleOf(user);
          const isSelf = user.uid === myUid;
          const busy = busyUid === user.uid;
          const scans = scanCounts[user.uid];
          return (
            <div
              key={user.uid}
              className={`bg-white rounded-3xl p-5 border shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                user.suspended ? 'border-[#fecdd3]' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-11 h-11 rounded-full object-cover bg-slate-100 shrink-0" />
                ) : (
                  <span className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-white font-black text-sm flex items-center justify-center uppercase shrink-0">
                    {user.displayName.trim().charAt(0) || '?'}
                  </span>
                )}
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-bold text-[#0f172a] truncate">{user.displayName}</span>
                    {isSelf && <Pill className="bg-[#f1f5f9] text-[#565e74]">You</Pill>}
                    {role === 'owner' && <Pill className="bg-[#0f172a] text-white">Owner</Pill>}
                    {role === 'admin' && <Pill className="bg-[#e0e7ff] text-[#4338ca]">Admin</Pill>}
                    {user.isGuest && <Pill className="bg-[#f1f5f9] text-[#64748b]">Guest</Pill>}
                    {user.suspended && <Pill className="bg-[#fff1f2] text-[#e11d48]">Suspended</Pill>}
                    {!user.isGuest && !user.profileCompleted && (
                      <Pill className="bg-[#fffbeb] text-[#d97706]">Onboarding</Pill>
                    )}
                  </div>
                  <p className="text-xs text-[#64748b] truncate">{user.email || 'No email (anonymous session)'}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#64748b]">
                    <span>Last sign-in: {formatDate(user.lastLoginAt)}</span>
                    <span>Scans: {scans === undefined ? '…' : scans < 0 ? '—' : scans}</span>
                    <span>Active allergens: {user.allergenCount}</span>
                    {user.suspended && <span className="text-[#e11d48]">Suspended {formatDate(user.suspendedAt)}</span>}
                  </div>
                  <p className="font-mono-tech text-[10px] text-[#94a3b8] truncate">UID {user.uid}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:justify-end shrink-0">
                {isOwnerAdmin && role !== 'owner' && !user.isGuest && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setAdmin(user, role !== 'admin')}
                    className={`${actionBtn} ${
                      role === 'admin'
                        ? 'bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a]'
                        : 'bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4338ca]'
                    }`}
                  >
                    {role === 'admin' ? 'Remove admin' : 'Make admin'}
                  </button>
                )}
                {!user.isGuest && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => sendReset(user)}
                    className={`${actionBtn} bg-[#f1f5f9] hover:bg-slate-200 text-[#0f172a]`}
                  >
                    Send password reset
                  </button>
                )}
                {role === 'user' && !isSelf && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setSuspended(user, !user.suspended)}
                    className={`${actionBtn} ${
                      user.suspended
                        ? 'bg-[#5379EE] hover:bg-[#4368DD] text-white'
                        : 'bg-[#fff1f2] hover:bg-[#ffe4e6] text-[#e11d48]'
                    }`}
                  >
                    {user.suspended ? 'Reactivate' : 'Suspend'}
                  </button>
                )}
                {role !== 'user' && !isSelf && (
                  <span className="text-[11px] text-[#94a3b8]">
                    {role === 'owner' ? 'Owner account' : 'Remove admin rights to suspend'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-[#94a3b8] px-1 leading-relaxed">
        Admin rights apply only when the person signs in with a verified email (Google sign-in is verified
        automatically). Suspension signs the user out and blocks saving profile and scan data; deleting a login
        account entirely is done from the Firebase console.
      </p>
    </div>
  );
};
