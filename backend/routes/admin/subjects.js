const router = require("express").Router();
const db = require("../../config/db");


// ✅ GET all subjects
router.get("/", (req, res) => {
  const query = `
    SELECT 
      subject_id,
      subject_name
    FROM subject
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});


// ✅ ADD subject
router.post("/", (req, res) => {
  const { subject_name } = req.body;

  const query = `
    INSERT INTO subject (subject_name)
    VALUES (?)
  `;

  db.query(query, [subject_name], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Subject added");
  });
});


// ✅ UPDATE subject
router.put("/:id", (req, res) => {
  const { subject_name } = req.body;

  const query = `
    UPDATE subject
    SET subject_name=?
    WHERE subject_id=?
  `;

  db.query(query, [subject_name, req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.send("Subject updated");
  });
});


// ✅ DELETE subject
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM subject WHERE subject_id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.send("Subject deleted");
    }
  );
});

module.exports = router;