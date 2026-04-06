import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

function AdminTable({ endpoint, fields, formFields, idField }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  /** Ignore stale GET responses when a newer fetch (or endpoint change) supersedes them */
  const fetchGenerationRef = useRef(0);

  const fetchData = useCallback(async () => {
    const gen = ++fetchGenerationRef.current;
    try {
      const res = await axios.get(`http://localhost:5000/api/${endpoint}`);
      if (gen !== fetchGenerationRef.current) return;
      setData(res.data);
    } catch (err) {
      if (gen !== fetchGenerationRef.current) return;
      console.error(err);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();

    // Departments
    if (["teachers", "classes"].includes(endpoint)) {
      axios.get("http://localhost:5000/api/departments")
        .then(res => setDepartments(res.data));
    }

    // Classes
    if (["students", "assignments"].includes(endpoint)) {
      axios.get("http://localhost:5000/api/classes")
        .then(res => setClasses(res.data));
    }

    // Teachers (for HOD + assignments)
    if (["departments", "assignments"].includes(endpoint)) {
      axios.get("http://localhost:5000/api/teachers")
        .then(res => setTeachers(res.data));
    }

    // Subjects (for assignments)
    if (endpoint === "assignments") {
      axios.get("http://localhost:5000/api/subjects")
        .then(res => setSubjects(res.data));
    }

  }, [endpoint, fetchData]);

  // 🔄 MAIN DATA

  // ✏️ FORM CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ ADD / ✏️ UPDATE
const handleSubmit = async () => {
  try {
    if (editingId) {
      await axios.put(
        `http://localhost:5000/api/${endpoint}/${editingId}`,
        form
      );
    } else {
      await axios.post(
        `http://localhost:5000/api/${endpoint}`,
        form
      );
    }

    setForm({});
    setEditingId(null);

    await fetchData();

  } catch (err) {
    console.error(err);
    alert(err.response?.data || "Operation failed");
  }
};

// ❌ DELETE — refetch so UI matches DB (avoids races with overlapping GETs)
const handleDelete = async (id) => {
  if (!window.confirm("Delete this item?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/${endpoint}/${id}`);
    await fetchData();
  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};
  // ✏️ EDIT
  const handleEdit = (item) => {
  const newForm = { ...item };

  delete newForm.password_hash;
if (newForm.dob) {
    newForm.dob = newForm.dob.split("T")[0]; // keeps only YYYY-MM-DD
  }
  setForm(newForm);
  setEditingId(item[idField]);
};

  return (
    <div className="bg-slate-800 p-6 rounded-2xl text-white">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-indigo-400 capitalize">
        {endpoint}
      </h1>

      {/* FORM */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {formFields.map((f) => {

          // 🔽 DEPARTMENT
          if (f === "dept_id") {
            return (
              <select
                key={f}
                name={f}
                value={form[f] || ""}
                onChange={handleChange}
                className="bg-slate-700 p-3 rounded"
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.dept_id} value={d.dept_id}>
                    {d.dept_name}
                  </option>
                ))}
              </select>
            );
          }

          // 🔽 CLASS
          if (f === "class_id") {
            return (
              <select
                key={f}
                name={f}
                value={form[f] || ""}
                onChange={handleChange}
                className="bg-slate-700 p-3 rounded"
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.class_id} value={c.class_id}>
                    {c.class_name}
                  </option>
                ))}
              </select>
            );
          }

          // 🔽 TEACHER
          if (f === "teacher_id") {
            return (
              <select
                key={f}
                name={f}
                value={form[f] || ""}
                onChange={handleChange}
                className="bg-slate-700 p-3 rounded"
              >
                <option value="">Select Teacher</option>
                {teachers.map(t => (
                  <option key={t.teacher_id} value={t.teacher_id}>
                    {t.name}
                  </option>
                ))}
              </select>
            );
          }

          // 🔽 SUBJECT
          if (f === "subject_id") {
            return (
              <select
                key={f}
                name={f}
                value={form[f] || ""}
                onChange={handleChange}
                className="bg-slate-700 p-3 rounded"
              >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.subject_name}
                  </option>
                ))}
              </select>
            );
          }

          // 🔽 HOD
          if (f === "hod_id") {
            return (
              <select
                key={f}
                name={f}
                value={form[f] || ""}
                onChange={handleChange}
                className="bg-slate-700 p-3 rounded"
              >
                <option value="">Select HOD</option>
                {teachers.map(t => (
                  <option key={t.teacher_id} value={t.teacher_id}>
                    {t.name}
                  </option>
                ))}
              </select>
            );
          }

          // 🔽 GENDER
          if (f === "gender") {
            return (
              <select
                key={f}
                name={f}
                value={form[f] || ""}
                onChange={handleChange}
                className="bg-slate-700 p-3 rounded"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            );
          }

          // 🔹 DEFAULT INPUT
          return (
            <input
              key={f}
              name={f}
              value={form[f] || ""}
              onChange={handleChange}
              placeholder={f.replace("_", " ").toUpperCase()}
              className="bg-slate-700 p-3 rounded"
            />
          );
        })}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="mb-6 bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-6 py-2 rounded"
      >
        {editingId ? "Update" : "Add"}
      </button>

      {/* TABLE */}
      <table className="w-full border border-slate-700 rounded-lg overflow-hidden">
        <thead className="bg-slate-700">
          <tr>
            {fields.map(f => (
              <th key={f} className="p-3 text-left text-sm text-slate-300 uppercase">
                {f.replace("_", " ")}
              </th>
            ))}
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map(item => (
            <tr key={item[idField]} className="border-t border-slate-700 hover:bg-slate-700/40">
              {fields.map(f => (
                <td key={f} className="p-3 text-sm">
                  {f === "dob" && item[f]
  ? item[f].split("T")[0]
  : item[f] ?? "—"}
                </td>
              ))}
              <td className="p-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item[idField])}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminTable;