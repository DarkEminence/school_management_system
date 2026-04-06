const router = require("express").Router();
const db = require("../../config/db");


// ✅ GET all assignments
router.get("/", (req, res) => {
  const query = `
    SELECT 
      cst.id,
      cst.teacher_id,
      cst.subject_id,
      cst.class_id,
      t.name AS teacher_name,
      s.subject_name,
      c.class_name
    FROM class_subject_teacher cst
    LEFT JOIN teacher t ON cst.teacher_id = t.teacher_id
    LEFT JOIN subject s ON cst.subject_id = s.subject_id
    LEFT JOIN class c ON cst.class_id = c.class_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// ✅ ADD assignment
router.post("/", (req, res) => {
  const { teacher_id, subject_id, class_id } = req.body;

  const query = `
    INSERT INTO class_subject_teacher 
    (teacher_id, subject_id, class_id)
    VALUES (?, ?, ?)
  `;

  db.query(query, [teacher_id, subject_id, class_id], (err) => {
    if (err) return res.json(err);
    res.send("Assigned");
  });
});


// ✅ DELETE assignment
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM class_subject_teacher WHERE id=?",
    [req.params.id],
    () => res.send("Deleted")
  );
});

module.exports = router;