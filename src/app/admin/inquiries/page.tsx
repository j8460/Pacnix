"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  MailX,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Inquiry } from "@/lib/types";
import { cn } from "@/lib/utils";

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type SortField = "created_at" | "name" | "email" | "company" | "product" | "email_sent";
type SortDir = "asc" | "desc";

function SortIcon({
  field,
  activeField,
  dir,
}: {
  field: SortField;
  activeField: SortField;
  dir: SortDir;
}) {
  if (field !== activeField) {
    return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
  }
  return dir === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5" />
  );
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loading, setLoading] = useState(true);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        sort: sortField,
        order: sortDir,
      });
      if (query) params.set("search", query);

      const res = await fetch(`/api/admin/inquiries?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load inquiries");

      setInquiries(data.inquiries);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, query, sortField, sortDir]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    setQuery(search);
  }

  function toggleSort(field: SortField) {
    setPagination((prev) => ({ ...prev, page: 1 }));
    if (sortField === field) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDir(field === "created_at" || field === "email_sent" ? "desc" : "asc");
  }

  function headerButton(label: string, field: SortField) {
    return (
      <button
        type="button"
        onClick={() => toggleSort(field)}
        className="inline-flex items-center gap-1 font-medium transition hover:text-slate-900"
      >
        {label}
        <SortIcon field={field} activeField={sortField} dir={sortDir} />
      </button>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Inquiries</h1>
        <p className="mt-2 text-slate-500">Read-only list of contact form submissions.</p>
      </div>

      <form onSubmit={handleSearch} className="flex max-w-xl gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company..."
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">{headerButton("Date", "created_at")}</th>
                <th className="px-4 py-3">{headerButton("Name", "name")}</th>
                <th className="px-4 py-3">{headerButton("Email", "email")}</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3">{headerButton("Company", "company")}</th>
                <th className="px-4 py-3">{headerButton("Product", "product")}</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3">{headerButton("Notify", "email_sent")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    Loading inquiries...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-t border-slate-100 align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {new Date(inquiry.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{inquiry.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      <a href={`mailto:${inquiry.email}`} className="hover:text-primary">
                        {inquiry.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <a href={`tel:${inquiry.phone}`} className="hover:text-primary">
                        {inquiry.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{inquiry.company ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{inquiry.product ?? "—"}</td>
                    <td className="max-w-xs px-4 py-3 text-slate-600">
                      <p className="line-clamp-3">{inquiry.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      {inquiry.emailSent ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <Mail className="h-3.5 w-3.5" />
                          Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                          <MailX className="h-3.5 w-3.5" />
                          Not sent
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            {sortField !== "created_at" || sortDir !== "desc" ? (
              <span className="ml-2 text-slate-400">
                · sorted by {sortField.replace("_", " ")} ({sortDir})
              </span>
            ) : null}
          </p>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-500">
              Per page
              <select
                value={pagination.limit}
                onChange={(e) =>
                  setPagination((prev) => ({
                    ...prev,
                    page: 1,
                    limit: Number(e.target.value),
                  }))
                }
                className={cn(
                  "h-8 rounded-lg border border-slate-200 bg-white px-2 text-sm",
                  "outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                )}
              >
                {[10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || loading}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
