const router = require("express").Router();
const db = require("../../config/db");
const bcrypt = require("bcrypt");

// ✅ GET all teachers with department name
router.get("/", (req, res) => {
  const query = `
    SELECT
      t.teacher_id,
      t.name,
      t.phone,
      t.email,
      t.dept_id,
      d.dept_name
    FROM teacher t
    LEFT JOIN department d ON t.dept_id = d.dept_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// ✅ ADD teacher
router.post("/", async (req, res) => {
  const { name, phone, email, password_hash, dept_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const query = `
      INSERT INTO teacher (name, phone, email, password_hash, dept_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [name, phone, email, hashedPassword, dept_id || null],
      (err) => {
        if (err) return res.status(500).json(err);
        res.send("Teacher added");
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
});

// ✅ UPDATE teacher
router.put("/:id", async (req, res) => {
  const {
    name,
    phone,
    email,
    password_hash,
    dept_id
  } = req.body;

  try {
    let query;
    let values;

    if (password_hash) {
      // 🔐 new password entered
      const hashedPassword = await bcrypt.hash(password_hash, 10);

      query = `
        UPDATE teacher
        SET name=?, phone=?, email=?, password_hash=?, dept_id=?
        WHERE teacher_id=?
      `;

      values = [
        name, phone, email,
        hashedPassword,
        dept_id,
        req.params.id
      ];

    } else {
      // ✅ keep old password
      query = `
        UPDATE teacher
        SET name=?, phone=?, email=?, dept_id=?
        WHERE teacher_id=?
      `;

      values = [
        name, phone, email,
        dept_id,
        req.params.id
      ];
    }

    db.query(query, values, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.send("Teacher updated");
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// ✅ DELETE teacher
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM teacher WHERE teacher_id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.send("Teacher deleted");
    }
  );
});

module.exports = router;