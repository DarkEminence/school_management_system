const router = require("express").Router();
const db = require("../../config/db");

// ✅ GET all departments with HOD name
router.get("/", (req, res) => {
  const query = `
    SELECT 
      d.dept_id,
      d.dept_name,
      d.hod_id,
      t.name AS hod_name
    FROM department d
    LEFT JOIN teacher t ON d.hod_id = t.teacher_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ✅ ADD department
router.post("/", (req, res) => {
  const { dept_name, hod_id } = req.body;

  const query = `
    INSERT INTO department (dept_name, hod_id)
    VALUES (?, ?)
  `;

  db.query(query, [dept_name, hod_id || null], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Department added");
  });
});

// ✅ UPDATE department
router.put("/:id", (req, res) => {
  const { dept_name, hod_id } = req.body;

  const query = `
    UPDATE department
    SET dept_name=?, hod_id=?
    WHERE dept_id=?
  `;

  db.query(query, [dept_name, hod_id || null, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Department updated");
  });
});

// ✅ DELETE department
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM department WHERE dept_id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.send("Department deleted");
    }
  );
});

module.exports = router;