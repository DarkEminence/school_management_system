import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FacultyManage = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classForm, setClassForm] = useState({
    class_name: "",
    course: "",
    subject: "",
    is_tutorship: false,
    student_count: "",
  });
  const [studentForm, setStudentForm] = useState({
    student_name: "",
    roll_no: "",
    marks: "",
    result: "",
    details: "",
  });
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [editingClassId, setEditingClassId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      await fetchClasses();
      setLoading(false);
    };

    loadData();
  }, [token]);

  const fetchClasses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faculty/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchStudents = async (classId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/faculty/classes/${classId}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClassChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClassForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...classForm,
        student_count: Number(classForm.student_count) || 0,
      };

      if (editingClassId) {
        await axios.put(
          `http://localhost:5000/api/faculty/classes/${editingClassId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/faculty/classes", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setClassForm({ class_name: "", course: "", subject: "", is_tutorship: false, student_count: "" });
      setEditingClassId(null);
      await fetchClasses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectClass = async (clazz) => {
    setSelectedClass(clazz);
    await fetchStudents(clazz.id);
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;

    try {
      const payload = {
        ...studentForm,
        marks: Number(studentForm.marks) || 0,
      };

      if (editingStudentId) {
        await axios.put(
          `http://localhost:5000/api/faculty/classes/${selectedClass.id}/students/${editingStudentId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/faculty/classes/${selectedClass.id}/students`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      setStudentForm({ student_name: "", roll_no: "", marks: "", result: "", details: "" });
      setEditingStudentId(null);
      await fetchStudents(selectedClass.id);
      await fetchClasses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudentId(student.id);
    setStudentForm({
      student_name: student.student_name || "",
      roll_no: student.roll_no || "",
      marks: student.marks || "",
      result: student.result || "",
      details: student.details || "",
    });
  };

  const handleEditClass = (clazz) => {
    setEditingClassId(clazz.id);
    setClassForm({
      class_name: clazz.class_name || "",
      course: clazz.course || "",
      subject: clazz.subject || "",
      is_tutorship: Boolean(clazz.is_tutorship),
      student_count: clazz.student_count || "",
    });
  };

  const resetEdit = () => {
    setEditingClassId(null);
    setEditingStudentId(null);
    setClassForm({ class_name: "", course: "", subject: "", is_tutorship: false, student_count: "" });
    setStudentForm({ student_name: "", roll_no: "", marks: "", result: "", details: "" });
  };

  if (loading) {
    return <div className="text-center mt-10">Loading faculty management...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Class & Subject Management</h1>
            <p className="text-sm text-slate-500">Create classes, assign subjects and tutorship, and manage student result details.</p>
          </div>
          <button
            onClick={() => navigate("/faculty/dashboard")}
            className="px-4 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Add Class / Subject</h2>
            <form onSubmit={handleClassSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Class Name</label>
                <input
                  name="class_name"
                  value={classForm.class_name}
                  onChange={handleClassChange}
                  className="mt-2 w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="Example: B.Sc CS 1A"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Course</label>
                <input
                  name="course"
                  value={classForm.course}
                  onChange={handleClassChange}
                  className="mt-2 w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="Example: Computer Science"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Subject</label>
                <input
                  name="subject"
                  value={classForm.subject}
                  onChange={handleClassChange}
                  className="mt-2 w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="Example: Data Structures"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    name="is_tutorship"
                    checked={classForm.is_tutorship}
                    onChange={handleClassChange}
                    className="h-4 w-4 rounded border-slate-300 text-purple-600"
                  />
                  Tutorship Class
                </label>
                <input
                  name="student_count"
                  value={classForm.student_count}
                  onChange={handleClassChange}
                  type="number"
                  min="0"
                  className="w-24 border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                  placeholder="Count"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-white py-3 font-semibold hover:opacity-95 transition"
              >
                {editingClassId ? "Update Class" : "Add Class"}
              </button>

              {editingClassId && (
                <button
                  type="button"
                  onClick={resetEdit}
                  className="w-full rounded-2xl border border-slate-300 text-slate-700 py-3 font-semibold hover:bg-slate-100 transition"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Classes</h2>
                  <p className="text-sm text-slate-500">Select a class to view and manage student records.</p>
                </div>
                <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-700">{classes.length} classes</span>
              </div>

              <div className="space-y-3">
                {classes.length === 0 && <p className="text-sm text-slate-500">No classes added yet.</p>}
                {classes.map((clazz) => (
                  <div key={clazz.id} className="rounded-3xl border border-slate-200 p-4 hover:border-fuchsia-400 transition cursor-pointer" onClick={() => handleSelectClass(clazz)}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{clazz.class_name}</h3>
                        <p className="text-sm text-slate-500">{clazz.course} · {clazz.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Students: {clazz.student_count}</p>
                        <p className="text-sm font-semibold text-purple-700">{clazz.is_tutorship ? 'Tutorship' : 'Regular'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClass(clazz);
                      }}
                      className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700"
                    >
                      Edit Class
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Student Details</h2>
                  <p className="text-sm text-slate-500">Add or edit students and update marks/results.</p>
                </div>
                <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-700">{selectedClass ? selectedClass.class_name : 'No class selected'}</span>
              </div>

              {!selectedClass ? (
                <p className="text-sm text-slate-500">Select a class to manage student records.</p>
              ) : (
                <div className="grid gap-6">
                  <form onSubmit={handleStudentSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        name="student_name"
                        value={studentForm.student_name}
                        onChange={handleStudentChange}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                        placeholder="Student Name"
                      />
                      <input
                        name="roll_no"
                        value={studentForm.roll_no}
                        onChange={handleStudentChange}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                        placeholder="Roll Number"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        name="marks"
                        value={studentForm.marks}
                        onChange={handleStudentChange}
                        type="number"
                        min="0"
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                        placeholder="Marks"
                      />
                      <input
                        name="result"
                        value={studentForm.result}
                        onChange={handleStudentChange}
                        className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                        placeholder="Result / Grade"
                      />
                      <input
                        readOnly
                        value={selectedClass.class_name}
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-slate-100"
                        placeholder="Class"
                      />
                    </div>

                    <textarea
                      name="details"
                      value={studentForm.details}
                      onChange={handleStudentChange}
                      className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-fuchsia-400"
                      rows="3"
                      placeholder="Details / Notes"
                    />

                    <div className="flex gap-3 flex-wrap">
                      <button type="submit" className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-white py-3 px-5 font-semibold hover:opacity-95 transition">
                        {editingStudentId ? "Update Student" : "Add Student"}
                      </button>
                      {editingStudentId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStudentId(null);
                            setStudentForm({ student_name: "", roll_no: "", marks: "", result: "", details: "" });
                          }}
                          className="rounded-2xl border border-slate-300 text-slate-700 py-3 px-5 hover:bg-slate-100 transition"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="space-y-3">
                    {students.length === 0 ? (
                      <p className="text-sm text-slate-500">No students assigned to this class yet.</p>
                    ) : (
                      students.map((student) => (
                        <div key={student.id} className="rounded-3xl border border-slate-200 p-4">
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{student.student_name}</h3>
                              <p className="text-sm text-slate-500">Roll No: {student.roll_no}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEditStudent(student)}
                              className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm text-slate-600">
                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Marks</p>
                              <p className="mt-1 text-lg font-semibold text-slate-900">{student.marks}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Result</p>
                              <p className="mt-1 text-lg font-semibold text-slate-900">{student.result || 'Pending'}</p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-3">
                              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Details</p>
                              <p className="mt-1 text-sm text-slate-700">{student.details || 'No notes'}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyManage;
