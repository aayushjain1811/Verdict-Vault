"use client";

import { useEffect, useState } from "react";
import { Download, Mail } from "lucide-react";
import { PageHeader, AdminCard, AdminButton, NotWiredNotice } from "@/components/admin/admin-ui";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { fetchSubscribers, type SubscriberDoc } from "@/lib/firebase/firestore";

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState<SubscriberDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    fetchSubscribers()
      .then(setSubs)
      .finally(() => setLoading(false));
  }, []);

  function exportCsv() {
    const rows = [["email", "subscribed_at"]].concat(
      subs.map((s) => [s.email, s.createdAt ? new Date(s.createdAt).toISOString() : ""])
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "verdict-vault-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Subscribers"
        description="Your newsletter list, captured from the site's subscribe forms."
        action={
          <AdminButton onClick={exportCsv} disabled={subs.length === 0}>
            <Download className="h-4 w-4" /> Export CSV
          </AdminButton>
        }
      />

      {!isFirebaseConfigured && <NotWiredNotice what="Subscriber data" />}

      <AdminCard className="p-0">
        {loading ? (
          <p className="p-6 text-sm text-ash">Loading…</p>
        ) : subs.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Mail className="mb-4 h-10 w-10 text-gold/30" />
            <p className="text-smoke">No subscribers yet.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gold/12 text-ash">
              <tr>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium text-right">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-b border-gold/8 last:border-0">
                  <td className="px-6 py-4 text-bone">{s.email}</td>
                  <td className="px-6 py-4 text-right text-smoke">
                    {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AdminCard>
    </div>
  );
}
