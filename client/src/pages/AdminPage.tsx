import SiteFooter from "@/components/SiteFooter";
import SiteNavbar from "@/components/SiteNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { useSEO } from "@/hooks/useSEO";
import { Loader2, Users, FileText, Mail, Activity, Shield, Trash2, Search, Database, Play, ChevronDown, ChevronUp, Eye, EyeOff, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Stats {
  users: number;
  admins: number;
  subscribers: number;
  blogPosts: number;
  publishedPosts: number;
  activeSessions: number;
  signupsByDay: { date: string; count: number }[];
  usersByPlan: { plan: string; count: number }[];
}

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  plan: string | null;
  created_at: string;
}

interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  category: string;
  published: number;
  author: string;
  created_at: string;
}

interface Subscriber {
  id: number;
  email: string;
  source: string;
  created_at: string;
}

interface TableInfo {
  name: string;
  rowCount: number;
  columns: { name: string; type: string; notnull: number; pk: number }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function api<T>(url: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...opts?.headers } });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

type Tab = "overview" | "users" | "blog" | "subscribers" | "database";
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "users", label: "Users", icon: Users },
  { id: "blog", label: "Blog Posts", icon: FileText },
  { id: "subscribers", label: "Subscribers", icon: Mail },
  { id: "database", label: "Database", icon: Database },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminPage() {
  useSEO({ title: "Admin Dashboard — PsychedBox", description: "Admin dashboard for managing PsychedBox users, blog posts, subscribers, and database.", noIndex: true });

  const { user, loading: authLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteNavbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-gray-400" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <SiteNavbar />
        <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-4">Admin</p>
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight max-w-3xl mb-6">Access Denied</h1>
            <p className="text-white text-lg md:text-xl max-w-3xl">
              You need admin privileges to view this page.
            </p>
          </div>
        </section>
        <section className="px-6 py-16 text-center">
          <Link href="/account" className="text-[#FF6B6B] font-semibold hover:underline">
            Back to Account
          </Link>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNavbar />

      <section style={{ backgroundColor: "#FF6B6B" }} className="px-6 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/80 text-xs uppercase tracking-[0.2em] font-bold mb-3">Admin</p>
          <h1 className="text-white text-3xl md:text-5xl font-black leading-tight">Dashboard</h1>
        </div>
      </section>

      {/* Tab bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? "border-[#FF6B6B] text-[#FF6B6B]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <t.icon size={15} />
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {tab === "overview" && <OverviewTab />}
          {tab === "users" && <UsersTab />}
          {tab === "blog" && <BlogTab />}
          {tab === "subscribers" && <SubscribersTab />}
          {tab === "database" && <DatabaseTab />}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────────────────────────

function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Stats>("/api/admin/stats").then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <ErrorMessage message="Failed to load stats" />;

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Users" value={stats.users} />
        <StatCard label="Admins" value={stats.admins} />
        <StatCard label="Subscribers" value={stats.subscribers} />
        <StatCard label="Blog Posts" value={stats.blogPosts} />
        <StatCard label="Published" value={stats.publishedPosts} />
        <StatCard label="Active Sessions" value={stats.activeSessions} />
      </div>

      {/* Users by plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Users by Plan</h3>
        {stats.usersByPlan.length === 0 ? (
          <p className="text-gray-500 text-sm">No data yet</p>
        ) : (
          <div className="space-y-3">
            {stats.usersByPlan.map((row) => {
              const pct = stats.users > 0 ? Math.round((row.count / stats.users) * 100) : 0;
              return (
                <div key={row.plan} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-24 capitalize">{row.plan}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: "#FF6B6B" }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-20 text-right">{row.count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Signups chart (simple bar chart) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Signups (Last 30 Days)</h3>
        {stats.signupsByDay.length === 0 ? (
          <p className="text-gray-500 text-sm">No signups yet</p>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {stats.signupsByDay.map((d) => {
              const max = Math.max(...stats.signupsByDay.map((x) => x.count), 1);
              const h = Math.max((d.count / max) * 100, 4);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400">{d.count}</span>
                  <div
                    className="w-full rounded-t"
                    style={{ height: `${h}%`, backgroundColor: "#FF6B6B", minHeight: 4 }}
                    title={`${d.date}: ${d.count}`}
                  />
                  <span className="text-[9px] text-gray-400 -rotate-45 origin-top-left mt-1 whitespace-nowrap">
                    {d.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Users Tab ───────────────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user: me } = useAuth();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ users: AdminUser[]; total: number }>(`/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
      setUsers(data.users);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  async function toggleRole(u: AdminUser) {
    const newRole = u.role === "admin" ? "user" : "admin";
    await api(`/api/admin/users/${u.id}/role`, { method: "PATCH", body: JSON.stringify({ role: newRole }) });
    loadUsers();
  }

  async function deleteUser(u: AdminUser) {
    if (!confirm(`Delete user ${u.email}? This cannot be undone.`)) return;
    await api(`/api/admin/users/${u.id}`, { method: "DELETE" });
    loadUsers();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email or name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 outline-none"
          />
        </div>
        <span className="text-sm text-gray-500">{total} total</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm text-center">No users found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{u.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.name || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{u.plan || "free"}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleRole(u)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                          title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                        >
                          <Shield size={14} />
                        </button>
                        {u.id !== me?.id && (
                          <button onClick={() => deleteUser(u)} className="p-1.5 rounded hover:bg-red-50 text-red-400" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 50 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Prev</button>
          <span className="px-3 py-1 text-sm text-gray-500">Page {page}</span>
          <button disabled={page * 50 >= total} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}

// ─── Blog Tab ────────────────────────────────────────────────────────────────

function BlogTab() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api<{ posts: BlogPostRow[] }>("/api/admin/blog");
      setPosts(data.posts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  async function togglePublish(p: BlogPostRow) {
    const post = await api<{ post: any }>(`/api/admin/blog/${p.id}`);
    await api(`/api/admin/blog/${p.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...post.post, tags: JSON.parse(post.post.tags || "[]"), body: JSON.parse(post.post.body || "[]"), published: !p.published }),
    });
    loadPosts();
  }

  async function deletePost(p: BlogPostRow) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    await api(`/api/admin/blog/${p.id}`, { method: "DELETE" });
    loadPosts();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{posts.length} posts</span>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: "#FF6B6B" }}
        >
          <Plus size={14} />
          New Post
        </button>
      </div>

      {showCreate && <BlogCreateForm onCreated={() => { setShowCreate(false); loadPosts(); }} onCancel={() => setShowCreate(false)} />}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm text-center">No blog posts yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Slug</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Author</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{p.title}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{p.slug}</td>
                    <td className="px-4 py-3 text-gray-600">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {p.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.author}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => togglePublish(p)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500" title={p.published ? "Unpublish" : "Publish"}>
                          {p.published ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => deletePost(p)} className="p-1.5 rounded hover:bg-red-50 text-red-400" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Blog Create Form ────────────────────────────────────────────────────────

function BlogCreateForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("News");
  const [author, setAuthor] = useState("PsychedBox Team");
  const [body, setBody] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Parse body — each paragraph becomes a "text" content block
    const blocks = body
      .split(/\n\n+/)
      .filter(Boolean)
      .map((text) => ({ type: "text" as const, content: text.trim() }));

    try {
      await api("/api/admin/blog", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug: slug || autoSlug(title),
          description,
          category,
          author,
          body: blocks,
          published,
          tags: [],
          read_time: `${Math.max(1, Math.ceil(body.split(/\s+/).length / 200))} min read`,
        }),
      });
      onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Create Blog Post</h3>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Title" required>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(autoSlug(e.target.value)); }}
            className="input-field"
            placeholder="My Post Title"
          />
        </FormField>
        <FormField label="Slug" required>
          <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="input-field" placeholder="my-post-title" />
        </FormField>
        <FormField label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
            {["News", "Education", "Culture", "Guides", "Science", "Community"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Author">
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="input-field" />
        </FormField>
      </div>

      <FormField label="Description">
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" placeholder="Short summary…" />
      </FormField>

      <FormField label="Body (paragraphs separated by blank lines)">
        <textarea
          rows={8}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="input-field font-mono text-sm"
          placeholder={"First paragraph...\n\nSecond paragraph..."}
        />
      </FormField>

      <div className="flex items-center gap-2">
        <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded" />
        <label htmlFor="published" className="text-sm text-gray-700">Publish immediately</label>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          style={{ backgroundColor: "#1a1a1a" }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold hover:opacity-90 disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving…" : "Create Post"}
        </button>
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Subscribers Tab ─────────────────────────────────────────────────────────

function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    api<{ subscribers: Subscriber[]; total: number }>(`/api/admin/subscribers?page=${page}`)
      .then((data) => { setSubscribers(data.subscribers); setTotal(data.total); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-4">
      <span className="text-sm text-gray-500">{total} subscribers</span>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : subscribers.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm text-center">No subscribers yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400">{s.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.email}</td>
                    <td className="px-4 py-3 text-gray-600">{s.source}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 50 && (
        <div className="flex justify-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Prev</button>
          <span className="px-3 py-1 text-sm text-gray-500">Page {page}</span>
          <button disabled={page * 50 >= total} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded border text-sm disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}

// ─── Database Tab ────────────────────────────────────────────────────────────

function DatabaseTab() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sql, setSql] = useState("SELECT * FROM users LIMIT 10");
  const [queryResult, setQueryResult] = useState<{ rows: any[]; count: number } | null>(null);
  const [queryError, setQueryError] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    api<{ tables: TableInfo[] }>("/api/admin/db/tables").then((d) => setTables(d.tables)).finally(() => setLoading(false));
  }, []);

  async function runQuery() {
    setQueryError("");
    setQueryResult(null);
    setRunning(true);
    try {
      const data = await api<{ rows: any[]; count: number }>(`/api/admin/db/query?sql=${encodeURIComponent(sql)}`);
      setQueryResult(data);
    } catch (err: any) {
      setQueryError(err.message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Schema overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Schema Overview</h3>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-2">
            {tables.map((t) => (
              <div key={t.name} className="border border-gray-100 rounded-lg">
                <button
                  onClick={() => setExpanded(expanded === t.name ? null : t.name)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Database size={14} className="text-gray-400" />
                    <span className="font-mono text-sm font-medium text-gray-900">{t.name}</span>
                    <span className="text-xs text-gray-400">{t.rowCount} rows</span>
                  </div>
                  {expanded === t.name ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                </button>
                {expanded === t.name && (
                  <div className="px-4 pb-3">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-gray-500">
                          <th className="text-left py-1">Column</th>
                          <th className="text-left py-1">Type</th>
                          <th className="text-left py-1">PK</th>
                          <th className="text-left py-1">Not Null</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.columns.map((c: any) => (
                          <tr key={c.name} className="border-t border-gray-50">
                            <td className="py-1 font-mono text-gray-900">{c.name}</td>
                            <td className="py-1 text-gray-500">{c.type}</td>
                            <td className="py-1">{c.pk ? "Yes" : ""}</td>
                            <td className="py-1">{c.notnull ? "Yes" : ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SQL query runner */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">SQL Query Runner</h3>
        <p className="text-xs text-gray-400 mb-3">Read-only: SELECT and PRAGMA queries only</p>
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) runQuery(); }}
            className="flex-1 font-mono text-sm rounded-lg border border-gray-300 px-3 py-2 focus:border-[#FF6B6B] focus:ring-2 focus:ring-[#FF6B6B]/20 outline-none resize-y"
            placeholder="SELECT * FROM users LIMIT 10"
          />
          <button
            onClick={runQuery}
            disabled={running || !sql.trim()}
            className="self-start inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            Run
          </button>
        </div>

        {queryError && <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{queryError}</div>}

        {queryResult && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-xs text-gray-400 mb-2">{queryResult.count} rows returned</p>
            {queryResult.rows.length > 0 && (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-100">
                    {Object.keys(queryResult.rows[0]).map((k) => (
                      <th key={k} className="text-left px-3 py-2 font-medium whitespace-nowrap">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="px-3 py-1.5 text-gray-700 whitespace-nowrap max-w-xs truncate" title={String(v)}>
                          {String(v ?? "NULL")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 size={24} className="animate-spin text-gray-400" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{message}</div>;
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
