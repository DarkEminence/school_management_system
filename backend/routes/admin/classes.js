const router = require("express").Router();
const db = require("../../config/db");


// ✅ GET all classes with department name
router.get("/", (req, res) => {
  const query = `
    SELECT 
      c.class_id,
      c.class_name,
      c.dept_id,
      d.dept_name
    FROM class c
    LEFT JOIN department d ON c.dept_id = d.dept_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// ✅ ADD class
router.post("/", (req, res) => {
  const { class_name, dept_id } = req.body;

  const query = `
    INSERT INTO class (class_name, dept_id)
    VALUES (?, ?)
  `;

  db.query(query, [class_name, dept_id || null], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Class added");
  });
});


// ✅ UPDATE class
router.put("/:id", (req, res) => {
  const { class_name, dept_id } = req.body;

  const query = `
    UPDATE class
    SET class_name=?, dept_id=?
    WHERE class_id=?
  `;

  db.query(query, [class_name, dept_id || null, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Class updated");
  });
});


// ✅ DELETE class
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM class WHERE class_id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.send("Class deleted");
    }
  );
});

module.exports = router;