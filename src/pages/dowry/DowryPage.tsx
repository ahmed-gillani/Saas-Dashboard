// src/pages/dowry/DowryPage.tsx
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { dowryApi, type DowryEntry } from '../../api/dowryApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function DowryPage() {
  const { user } = useAuthStore();
  const isCustomer = user?.role === 'user';
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: '',
    age: '',
    contactNo: '',
    gender: 'male' as 'male' | 'female' | 'other',
    salary: '',
    profession: '',
  });

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['dowryInfo'],
    queryFn: dowryApi.getAll,
    enabled: !isCustomer,
  });

  const submitMutation = useMutation({
    mutationFn: dowryApi.submit,
    onSuccess: () => {
      toast.success('Dowry information submitted successfully!');
      setForm({ name: '', age: '', contactNo: '', gender: 'male', salary: '', profession: '' });
      queryClient.invalidateQueries({ queryKey: ['dowryInfo'] });
    },
    onError: (err: any) => toast.error(err.message || 'Failed to submit'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    submitMutation.mutate({
      name: form.name,
      age: parseInt(form.age),
      contactNo: form.contactNo,
      gender: form.gender,
      salary: parseInt(form.salary),
      profession: form.profession,
      submittedBy: user.id,
      submittedByName: user.name,
    });
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
  };

  const inputClass =
    'w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors text-sm';
  const labelClass = 'block text-xs sm:text-sm font-medium text-gray-300 mb-1.5';

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">

      {/* Page Header */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
        Dowry Information
      </h1>

      {/* ─── CUSTOMER FORM ─────────────────────────────────────── */}
      {isCustomer && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-2xl">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-4 sm:mb-6">
            Submit Your Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className={inputClass}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className={labelClass}>Age</label>
                <input
                  type="number"
                  min={1}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  required
                  className={inputClass}
                  placeholder="e.g. 25"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Contact Number</label>
                <input
                  value={form.contactNo}
                  onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
                  required
                  className={inputClass}
                  placeholder="+92 300 0000000"
                />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                  className={inputClass}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Monthly Salary</label>
                <input
                  type="number"
                  min={0}
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  required
                  className={inputClass}
                  placeholder="e.g. 50000"
                />
              </div>
              <div>
                <label className={labelClass}>Profession</label>
                <input
                  value={form.profession}
                  onChange={(e) => setForm({ ...form, profession: e.target.value })}
                  required
                  className={inputClass}
                  placeholder="e.g. Engineer, Teacher"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full mt-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 disabled:bg-gray-700 disabled:text-gray-400 text-white font-medium py-3 rounded-xl transition-all text-sm"
            >
              {submitMutation.isPending ? 'Submitting…' : 'Submit Information'}
            </button>
          </form>
        </div>
      )}

      {/* ─── ADMIN VIEW ─────────────────────────────────────────── */}
      {!isCustomer && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">

          {/* Card Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-700 flex items-center justify-between gap-2 bg-gray-950">
            <h2 className="text-sm sm:text-base font-semibold text-white">
              All Customer Submissions
            </h2>
            <span className="text-xs text-gray-500 shrink-0 bg-gray-800 px-2.5 py-0.5 rounded-full">
              {submissions.length} records
            </span>
          </div>

          {isLoading && (
            <div className="p-10 text-center text-gray-500 text-sm">Loading submissions…</div>
          )}

          {!isLoading && submissions.length === 0 && (
            <div className="p-10 text-center text-gray-500 text-sm">
              No submissions yet from customers.
            </div>
          )}

          {!isLoading && submissions.length > 0 && (
            <>
              {/* ── FULL TABLE — large screens (lg+) ── */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/80 text-gray-400 border-b border-gray-700 text-xs uppercase tracking-wider">
                      {['Name','Age','Contact','Gender','Salary','Profession','Submitted By','Date'].map(h => (
                        <th key={h} className="text-left px-5 py-3 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {submissions.map((entry: DowryEntry) => (
                      <tr key={entry.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-white">{entry.name}</td>
                        <td className="px-5 py-3.5">{entry.age}</td>
                        <td className="px-5 py-3.5">{entry.contactNo}</td>
                        <td className="px-5 py-3.5 capitalize">{entry.gender}</td>
                        <td className="px-5 py-3.5 font-medium text-emerald-400">
                          ${Number(entry.salary).toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">{entry.profession}</td>
                        <td className="px-5 py-3.5 text-gray-400">{entry.submittedByName || 'Customer'}</td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(entry.submittedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── CONDENSED TABLE — medium screens (md to lg) ── */}
              <div className="hidden md:block lg:hidden overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/80 text-gray-400 border-b border-gray-700 text-xs uppercase tracking-wider">
                      {['Name','Age / Gender','Contact','Salary','Profession','Date'].map(h => (
                        <th key={h} className="text-left px-4 py-3 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-300">
                    {submissions.map((entry: DowryEntry) => (
                      <tr key={entry.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-white">
                          <div className="leading-tight">{entry.name}</div>
                          <div className="text-[11px] text-gray-500 mt-0.5">{entry.submittedByName || 'Customer'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div>{entry.age}</div>
                          <div className="text-[11px] text-gray-500 capitalize">{entry.gender}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{entry.contactNo}</td>
                        <td className="px-4 py-3 font-medium text-emerald-400 whitespace-nowrap">
                          ${Number(entry.salary).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">{entry.profession}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(entry.submittedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── MOBILE CARDS — small screens (below md) ── */}
              <div className="md:hidden divide-y divide-gray-800">
                {submissions.map((entry: DowryEntry) => (
                  <div key={entry.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                    {/* Top row: name + salary */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight truncate">
                          {entry.name}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 capitalize">
                          {entry.gender} · {entry.age} yrs · {entry.profession}
                        </p>
                      </div>
                      <span className="text-emerald-400 font-bold text-sm whitespace-nowrap shrink-0">
                        ${Number(entry.salary).toLocaleString()}
                      </span>
                    </div>

                    {/* Detail grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <p className="text-gray-600 uppercase tracking-wide text-[10px] mb-0.5">Contact</p>
                        <p className="text-gray-300">{entry.contactNo}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 uppercase tracking-wide text-[10px] mb-0.5">Submitted By</p>
                        <p className="text-gray-300">{entry.submittedByName || 'Customer'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-600 uppercase tracking-wide text-[10px] mb-0.5">Date</p>
                        <p className="text-gray-400">{formatDate(entry.submittedAt)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}