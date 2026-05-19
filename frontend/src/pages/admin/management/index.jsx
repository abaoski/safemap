import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Map,
  Edit2,
  Trash2,
  Filter,
  Plus,
  Send,
  X,
  Settings2,
  Download,
  AlertTriangle,
  Activity,
  Users,
  Tag,
} from "lucide-react"
import { API_BASE } from "@/lib/api-base"
import AdminLayout from "../../../components/admin/AdminLayout"
import DirectoryAddDialog from "../../../components/admin/management/DirectoryAddDialog"
import DirectoryMapDialog from "../../../components/admin/management/DirectoryMapDialog"
import CategoryDialog from "../../../components/admin/management/CategoryDialog"

const categoryColor = (cat) => {
  const map = {
    hospital: "bg-sky-100 text-sky-600",
    medical: "bg-sky-100 text-sky-600",
    police: "bg-indigo-100 text-indigo-600",
    pnp: "bg-indigo-100 text-indigo-600",
    wcpd: "bg-violet-100 text-violet-600",
    vawc: "bg-pink-100 text-pink-600",
    fire: "bg-orange-100 text-orange-600",
    rescue: "bg-emerald-100 text-emerald-600",
    dswd: "bg-teal-100 text-teal-600",
    emergency: "bg-red-100 text-red-600",
    disaster: "bg-amber-100 text-amber-600",
  }
  return map[cat] || "bg-slate-100 text-slate-500"
}

const priorityColor = (p) => {
  if (p === "critical") return "bg-red-100 text-red-600"
  if (p === "high") return "bg-orange-100 text-orange-600"
  if (p === "medium") return "bg-amber-100 text-amber-600"
  return "bg-green-100 text-green-600"
}

const priorityBorder = (p) => {
  if (p === "critical") return "border-red-500"
  if (p === "high") return "border-orange-400"
  if (p === "medium") return "border-amber-400"
  return "border-green-400"
}

function AdminManagementPage() {
  // Top-level tab state
  const [currentTab, setCurrentTab] = useState("directory") // "directory" or "category"

  // Directory State
  const [directories, setDirectories] = useState([])
  const [dirSearch, setDirSearch] = useState("")
  const [dirFilter, setDirFilter] = useState("")
  const [isAddDirOpen, setIsAddDirOpen] = useState(false)
  const [editContact, setEditContact] = useState(null)
  const [mapContact, setMapContact] = useState(null)
  const [isMapOpen, setIsMapOpen] = useState(false)

  // Category State
  const [categories, setCategories] = useState([])
  const [catSearch, setCatSearch] = useState("")
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false)
  const [editCategory, setEditCategory] = useState(null)

  const refreshCategories = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/reports/categories`)
      if (!res.ok) return
      const data = await res.json()
      const cats = data.categories || []
      if (cats.length > 0) {
        setCategories(
          cats.map((c, i) => ({
            id: c.id || i,
            catId: String(c.id || i).padStart(4, "0") + "-C",
            name: c.label || c.name,
            rawName: c.name,
            desc: c.description || c.name,
            incidents: c.report_count || 0,
            priority: (c.priority || "medium").toUpperCase() + " PRIORITY",
            prioColor: priorityColor(c.priority),
            borderColor: priorityBorder(c.priority),
            raw: c,
          }))
        )
      }
    } catch {
      /* ignore */
    }
  }, [])

  const handleDeleteCategory = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${API_BASE}/reports/categories/${cat.id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) refreshCategories()
      else {
        const err = await res.json().catch(() => ({}))
        alert(err.error || "Failed to delete category.")
      }
    } catch {
      alert("Network error. Please try again.")
    }
  }

  useEffect(() => {
    // Fallback mock data arrays
    const mockDirectories = [
      {
        id: 1,
        caseId: "#EMG-011",
        name: "Gensan Medical Center",
        phone: "887-9898",
        location: "National Highway, General Santos City",
        lat: "6.0828┬░ N",
        lng: "125.1481┬░ E",
        type: "CRITICAL",
        typeColor: "bg-red-100 text-red-600",
      },
      {
        id: 2,
        caseId: "#REG-712",
        name: "Bureau of Fire Protection",
        phone: "+63 43-341-5561",
        location: "General Santos City, South Cotabato, Philippines",
        lat: "6.0796┬░ N",
        lng: "125.1468┬░ E",
        type: "REGIONAL",
        typeColor: "bg-blue-100 text-blue-600",
      },
      {
        id: 3,
        caseId: "#SOC-102",
        name: "GSC Police Office",
        phone: "+63 98-598-7207",
        location: "Camp Fermin G. Lira Jr., Brgy. Dadiangas West...",
        lat: "6.11┬░ N",
        lng: "125.16┬░ E",
        type: "SOCIAL CARE",
        typeColor: "bg-emerald-100 text-emerald-600",
      },
      {
        id: 4,
        caseId: "#DRF-004",
        name: "Police Station 7",
        phone: "NOT ASSIGNED",
        location: "Pending Coordinates City, PH",
        lat: "-",
        lng: "-",
        type: "DRAFT",
        typeColor: "bg-slate-100 text-slate-500",
      },
    ]

    const mockCategories = [
      {
        id: 1,
        catId: "8821-E",
        name: "Emotional Distress",
        desc: "Incidents involving severe psychological impact or trauma responses requiring...",
        incidents: 42,
        priority: "HIGH PRIORITY",
        prioColor: "bg-red-100 text-red-600",
        borderColor: "border-red-500",
      },
      {
        id: 2,
        catId: "4410-H",
        name: "Harassment",
        desc: "Reports of targeted exclusionary behavior, verbal abuse, or persistent unwanted...",
        incidents: 28,
        priority: "MEDIUM PRIORITY",
        prioColor: "bg-amber-100 text-amber-600",
        borderColor: "border-amber-400",
      },
      {
        id: 3,
        catId: "1102-P",
        name: "Physical Safety",
        desc: "Threats or actual incidents concerning physical infrastructure, environment, or...",
        incidents: 15,
        priority: "LOW PRIORITY",
        prioColor: "bg-green-100 text-green-600",
        borderColor: "border-[#1f295b]", // Mockup shows dark blue line for physical safety
      },
      {
        id: 4,
        catId: "9002-B",
        name: "Policy Breach",
        desc: "Violations of internal guidelines or administrative protocols not classified...",
        incidents: 92,
        priority: "ROUTINE",
        prioColor: "bg-slate-100 text-slate-600",
        borderColor: "border-slate-300",
      },
    ]

    const loadData = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        // Load directories from help/contacts
        const dirRes = await fetch(`${API_BASE}/help/contacts`, { headers })
        const catRes = await fetch(`${API_BASE}/reports/categories`)

        if (dirRes.ok) {
          const dbDir = await dirRes.json()
          const contacts = dbDir.contacts || []
          if (contacts.length > 0) {
            const shaped = contacts.map((c, i) => ({
              id: c.id || i,
              caseId: `#${(c.category || "dir").toUpperCase().slice(0, 3)}-${String(c.id || i).padStart(3, "0")}`,
              name: c.name,
              phone: c.phone || c.phone_alt || "NOT ASSIGNED",
              location: c.address || "—",
              lat: c.location?.latitude != null ? `${c.location.latitude.toFixed(4)}° N` : "—",
              lng: c.location?.longitude != null ? `${c.location.longitude.toFixed(4)}° E` : "—",
              type: (c.category || "other").toUpperCase(),
              typeColor: categoryColor(c.category),
              raw: c,
            }))
            setDirectories(shaped)
          } else {
            setDirectories(mockDirectories)
          }
        } else {
          setDirectories(mockDirectories)
        }

        if (catRes.ok) {
          const dbCat = await catRes.json()
          const cats = dbCat.categories || []
          if (cats.length > 0) {
            setCategories(
              cats.map((c, i) => ({
                id: c.id || i,
                catId: String(c.id || i).padStart(4, "0") + "-C",
                name: c.label || c.name,
                rawName: c.name,
                desc: c.description || c.name,
                incidents: c.report_count || 0,
                priority: (c.priority || "medium").toUpperCase() + " PRIORITY",
                prioColor: priorityColor(c.priority),
                borderColor: priorityBorder(c.priority),
                raw: c,
              }))
            )
          } else {
            setCategories(mockCategories)
          }
        } else {
          setCategories(mockCategories)
        }
      } catch (error) {
        setDirectories(mockDirectories)
        setCategories(mockCategories)
      }
    }

    loadData()
  }, [])

  const refreshDirectories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await fetch(`${API_BASE}/help/contacts`, { headers })
      if (!res.ok) return
      const data = await res.json()
      const contacts = data.contacts || []
      setDirectories(
        contacts.map((c, i) => ({
          id: c.id || i,
          caseId: `#${(c.category || "dir").toUpperCase().slice(0, 3)}-${String(c.id || i).padStart(3, "0")}`,
          name: c.name,
          phone: c.phone || c.phone_alt || "NOT ASSIGNED",
          location: c.address || "—",
          lat: c.location?.latitude != null ? `${c.location.latitude.toFixed(4)}° N` : "—",
          lng: c.location?.longitude != null ? `${c.location.longitude.toFixed(4)}° E` : "—",
          type: (c.category || "other").toUpperCase(),
          typeColor: categoryColor(c.category),
          raw: c,
        }))
      )
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <AdminLayout activeTab="management">
      {/* Header Area */}
      <div className="w-full max-w-sm px-4 mb-4">
        <div className="flex bg-slate-100/80 p-1 rounded-xl shadow-sm mb-4 border border-slate-200">
          <button
            onClick={() => setCurrentTab("directory")}
            className={`flex-1 py-2 text-xs font-bold font-['DM_Sans'] rounded-lg transition-all ${
              currentTab === "directory" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:bg-slate-200/50"
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => setCurrentTab("category")}
            className={`flex-1 py-2 text-xs font-bold font-['DM_Sans'] rounded-lg transition-all ${
              currentTab === "category" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:bg-slate-200/50"
            }`}
          >
            Category & Tag
          </button>
        </div>
        <h1 className="text-zinc-800 text-xl font-extrabold font-['DM_Sans']">
          {currentTab === "directory" ? "Directory Management" : "Category & Tag Management"}
        </h1>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-sm px-4 pb-20 space-y-5">
        {currentTab === "directory" && (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-4 shadow-[0px_8px_24px_rgba(149,157,165,0.1)] border border-slate-100">
              <h3 className="text-slate-400 text-xs font-bold font-['DM_Sans'] mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setEditContact(null)
                    setIsAddDirOpen(true)
                  }}
                  className="w-full bg-[#1f295b] text-white py-3 rounded-xl font-bold text-sm font-['DM_Sans'] shadow-sm hover:bg-[#151c3d] transition-colors"
                >
                  New Entry
                </button>
                <button className="w-full bg-white text-[#1f295b] py-3 rounded-xl font-bold text-sm font-['DM_Sans'] border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
                  Export CSV
                </button>
              </div>
            </div>

            {/* Categories Box */}
            <div className="bg-white rounded-2xl shadow-[0px_8px_24px_rgba(149,157,165,0.1)] border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="text-slate-400 text-xs font-bold font-['DM_Sans']">Categories</h3>
              </div>
              <div className="divide-y divide-slate-100">
                <div
                  onClick={() => setDirFilter("emergency")}
                  className={`p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${dirFilter === "emergency" ? "bg-slate-50 font-bold" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-50 rounded-md text-[#1f295b]">
                      <AlertTriangle size={16} />
                    </div>
                    <span className="text-[#1f295b] font-bold text-sm font-['DM_Sans']">Emergency</span>
                  </div>
                  <span className="px-2 py-1 bg-[#1f295b] text-white text-[10px] font-bold rounded-full">
                    {directories.filter((d) => d.type === "EMERGENCY").length}
                  </span>
                </div>
                <div
                  onClick={() => setDirFilter("medical")}
                  className={`p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${dirFilter === "medical" ? "bg-slate-50 font-bold" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-50 rounded-md text-[#1f295b]">
                      <Activity size={16} />
                    </div>
                    <span className="text-[#1f295b] font-bold text-sm font-['DM_Sans']">Medical / Hospital</span>
                  </div>
                  <span className="text-slate-500 text-xs font-medium">
                    {directories.filter((d) => d.type === "MEDICAL" || d.type === "HOSPITAL").length}
                  </span>
                </div>
                <div
                  onClick={() => setDirFilter("pnp")}
                  className={`p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${dirFilter === "pnp" ? "bg-slate-50 font-bold" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-slate-50 rounded-md text-[#1f295b]">
                      <Settings2 size={16} />
                    </div>
                    <span className="text-[#1f295b] font-bold text-sm font-['DM_Sans']">Police / PNP</span>
                  </div>
                  <span className="text-slate-500 text-xs font-medium">
                    {directories.filter((d) => d.type === "POLICE" || d.type === "PNP").length}
                  </span>
                </div>
                <div
                  onClick={() => setDirFilter("")}
                  className="p-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="p-1.5 bg-slate-50 rounded-md text-[#1f295b]">
                    <Tag size={16} />
                  </div>
                  <span className="text-[#1f295b] font-bold text-sm font-['DM_Sans']">Show All Labels</span>
                </div>
              </div>
            </div>

            {/* Search + Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name, number, or location..."
                  value={dirSearch}
                  onChange={(e) => setDirSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium font-['DM_Sans'] outline-none focus:border-[#1f295b] shadow-[0px_8px_24px_rgba(149,157,165,0.05)]"
                />
              </div>
              {/* Category filter chips */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "", label: "All" },
                  { key: "hospital", label: "Hospital" },
                  { key: "medical", label: "Medical" },
                  { key: "police", label: "Police" },
                  { key: "pnp", label: "PNP" },
                  { key: "wcpd", label: "WCPD" },
                  { key: "fire", label: "Fire" },
                  { key: "rescue", label: "Rescue" },
                  { key: "dswd", label: "DSWD" },
                  { key: "vawc", label: "VAWC" },
                  { key: "emergency", label: "Emergency" },
                  { key: "disaster", label: "Disaster" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setDirFilter(f.key)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold font-['DM_Sans'] uppercase transition-colors whitespace-nowrap ${
                      dirFilter === f.key
                        ? "bg-[#1f295b] text-white shadow-sm"
                        : "bg-white text-slate-500 border border-slate-200 hover:border-[#1f295b] hover:text-[#1f295b]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List — sorted newest first, filtered */}
            <div className="space-y-4">
              {[...directories]
                .sort((a, b) => b.id - a.id)
                .filter((dir) => {
                  const q = dirSearch.toLowerCase()
                  const matchSearch =
                    !q ||
                    (dir.name || "").toLowerCase().includes(q) ||
                    (dir.phone || "").toLowerCase().includes(q) ||
                    (dir.location || "").toLowerCase().includes(q)
                  const matchFilter = !dirFilter || (dir.type || "").toLowerCase() === dirFilter.toLowerCase()
                  return matchSearch && matchFilter
                })
                .map((dir) => (
                  <div
                    key={dir.id}
                    className="bg-white rounded-2xl p-4 shadow-[0px_8px_24px_rgba(149,157,165,0.1)] border border-slate-100 flex flex-col relative"
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-[10px] font-bold font-['DM_Sans']">
                        CASE ID: {dir.caseId}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${dir.typeColor}`}>{dir.type}</span>
                    </div>
                    {/* Name & Phone */}
                    <h3 className="text-base font-bold font-['DM_Sans'] text-[#1f295b] mb-1">{dir.name}</h3>
                    <p className="text-base font-bold font-['DM_Sans'] mb-3 text-blue-600">{dir.phone}</p>

                    {/* Location */}
                    <div className="mb-4">
                      <p className="text-slate-400 text-[9px] font-medium font-['DM_Sans'] mb-1">Location Data</p>
                      <div className="flex items-start gap-1">
                        <Map className="w-3 h-3 text-[#1f295b] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold font-['DM_Sans'] leading-tight text-slate-800">
                            {dir.location}
                          </p>
                          <p className="text-slate-400 text-[9px] font-medium mt-0.5">
                            LAT: {dir.lat} | LONG: {dir.lng}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 mt-auto">
                      <button
                        onClick={() => {
                          setMapContact(dir.raw || dir)
                          setIsMapOpen(true)
                        }}
                        className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                      >
                        <Map size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setEditContact(dir.raw || dir)
                          setIsAddDirOpen(true)
                        }}
                        className="px-5 py-2 bg-[#1f295b] text-white rounded-lg text-xs font-bold font-['DM_Sans'] hover:bg-[#151c3d] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              {[...directories].filter((dir) => {
                const q = dirSearch.toLowerCase()
                const matchSearch =
                  !q ||
                  (dir.name || "").toLowerCase().includes(q) ||
                  (dir.phone || "").toLowerCase().includes(q) ||
                  (dir.location || "").toLowerCase().includes(q)
                const matchFilter = !dirFilter || (dir.type || "").toLowerCase() === dirFilter.toLowerCase()
                return matchSearch && matchFilter
              }).length === 0 && (
                <div className="text-center py-10">
                  <div className="text-3xl mb-2">📂</div>
                  <p className="text-slate-400 text-xs font-medium font-['DM_Sans']">No entries found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === "category" && (
          <div className="space-y-4">
            <button
                onClick={() => { setEditCategory(null); setIsCatDialogOpen(true) }}
                className="bg-[#1f295b] text-white px-4 py-2 rounded-full text-[11px] font-bold font-['DM_Sans'] shadow hover:bg-[#151c3d] transition-colors">
              + New Category
            </button>

            <div className="bg-white rounded-2xl p-4 shadow-[0px_8px_24px_rgba(149,157,165,0.1)] border border-slate-100 flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name, number, or location..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-medium font-['DM_Sans'] outline-none focus:border-[#1f295b]"
                />
              </div>
              <button className="w-full bg-blue-50/50 text-[#1f295b] py-3 rounded-xl font-bold text-sm font-['DM_Sans'] border border-blue-50 flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                <Filter size={16} /> Filter
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {categories
                .filter((cat) => {
                  const q = catSearch.toLowerCase().trim()
                  if (!q) return true
                  return (
                    (cat.name || "").toLowerCase().includes(q) ||
                    (cat.desc || "").toLowerCase().includes(q) ||
                    (cat.priority || "").toLowerCase().includes(q)
                  )
                })
                .map((cat) => (
                <div
                  key={cat.id}
                  className={`bg-white rounded-2xl p-5 shadow-[0px_8px_24px_rgba(149,157,165,0.1)] border-l-4 ${cat.borderColor} border-y border-r border-y-slate-100 border-r-slate-100 flex flex-col`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-[10px] font-bold font-['DM_Sans']">CAT-ID: {cat.catId}</span>
                    <div className="flex gap-3 text-slate-400">
                      <button
                        onClick={() => { setEditCategory(cat.raw || cat); setIsCatDialogOpen(true) }}
                        className="hover:text-[#1f295b] transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-[#1f295b] text-base font-bold font-['DM_Sans'] mb-2">{cat.name}</h3>
                  <p className="text-slate-500 text-xs font-medium font-['DM_Sans'] mb-4 leading-relaxed">{cat.desc}</p>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[9px] font-bold">
                      {cat.incidents} INCIDENTS
                    </span>
                    <span className={`px-2 py-1 rounded text-[9px] font-bold ${cat.prioColor}`}>{cat.priority}</span>
                  </div>
                </div>
              ))}
              {categories.filter((cat) => {
                const q = catSearch.toLowerCase().trim()
                if (!q) return false
                return (
                  (cat.name || "").toLowerCase().includes(q) ||
                  (cat.desc || "").toLowerCase().includes(q) ||
                  (cat.priority || "").toLowerCase().includes(q)
                )
              }).length === 0 && catSearch.trim() && (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-xs font-medium font-['DM_Sans']">No categories match "{catSearch}"</p>
                </div>
              )}
            </div>

            {/* Global Tags */}
            <div className="bg-white rounded-2xl shadow-[0px_8px_24px_rgba(149,157,165,0.1)] border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-[#1f295b] text-sm font-bold font-['DM_Sans']">Global Tags</h3>
                  <p className="text-slate-400 text-[9px] font-bold mt-0.5 uppercase tracking-wider">
                    Universal Filtering Metadata
                  </p>
                </div>
                <button className="w-8 h-8 rounded-full bg-[#1f295b] text-white flex items-center justify-center hover:bg-[#151c3d] transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="p-4 bg-slate-50/50">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    "Urgent \u00d7",
                    "First-Response \u00d7",
                    "Escalated \u00d7",
                    "Night-Shift \u00d7",
                    "Legal-Review \u00d7",
                    "Verified \u00d7",
                  ].map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white border border-blue-100 text-[#1f295b] text-xs font-semibold rounded-full shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Add new tag..."
                    className="w-full bg-white border border-slate-200 rounded-full py-2.5 pl-4 pr-10 text-xs font-medium font-['DM_Sans'] outline-none focus:border-[#1f295b]"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1f295b] hover:text-blue-700">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#1f295b] rounded-2xl p-5 shadow-lg border border-[#3b4b8a]">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="text-white w-4 h-4" />
                <h3 className="text-white text-xs font-bold font-['DM_Sans'] tracking-widest uppercase">
                  Taxonomy Insight
                </h3>
              </div>
              <p className="text-[#a4b4f0] text-xs font-medium leading-relaxed mb-4">
                Recent reporting patterns suggest a need for a{" "}
                <span className="text-white font-bold">"Digital Conduct"</span> sub-category.
              </p>
              <button className="w-full bg-[#2a3773] text-white border border-[#4456a3] py-2.5 rounded-lg text-[11px] font-bold hover:bg-[#34458a] transition-colors">
                GENERATE DRAFT CATEGORY
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay Dialogs could be rendered here later */}
      <DirectoryAddDialog
        isOpen={isAddDirOpen}
        onClose={() => {
          setIsAddDirOpen(false)
          setEditContact(null)
        }}
        onAdd={() => refreshDirectories()}
        editContact={editContact}
      />

      <DirectoryMapDialog
        isOpen={isMapOpen}
        onClose={() => {
          setIsMapOpen(false)
          setMapContact(null)
        }}
        contact={mapContact}
      />

      <CategoryDialog
        isOpen={isCatDialogOpen}
        onClose={() => { setIsCatDialogOpen(false); setEditCategory(null) }}
        onSave={() => refreshCategories()}
        editCategory={editCategory}
      />
    </AdminLayout>
  )
}

export default AdminManagementPage
