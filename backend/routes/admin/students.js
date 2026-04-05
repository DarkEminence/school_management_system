const router = require("express").Router();
const db = require("../../config/db");

router.get("/", (req, res) => {
  const query = `
    SELECT 
      s.student_id,
      s.name,
      s.dob,
      s.gender,
      s.address,
      s.phone,
      s.email,
      s.class_id,
      c.class_name
    FROM student s
    LEFT JOIN class c ON s.class_id = c.class_id
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const {
    name,
    dob,
    gender,
    address,
    phone,
    email,
    password_hash,
    class_id
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const query = `
      INSERT INTO student 
      (name, dob, gender, address, phone, email, password_hash, class_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [name, dob, gender, address, phone, email, hashedPassword, class_id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.send("Student added");
      }
    );

  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  const {
    name,
    dob,
    gender,
    address,
    phone,
    email,
    password_hash,
    class_id
  } = req.body;

  try {
    let query;
    let values;

    if (password_hash) {
      // ✅ user entered new password
      const hashedPassword = await bcrypt.hash(password_hash, 10);

      query = `
        UPDATE student
        SET name=?, dob=?, gender=?, address=?, phone=?, email=?, password_hash=?, class_id=?
        WHERE student_id=?
      `;

      values = [
        name, dob, gender, address, phone, email,
        hashedPassword, class_id, req.params.id
      ];

    } else {
      // ✅ keep old password
      query = `
        UPDATE student
        SET name=?, dob=?, gender=?, address=?, phone=?, email=?, class_id=?
        WHERE student_id=?
      `;

      values = [
        name, dob, gender, address, phone, email,
        class_id, req.params.id
      ];
    }

    db.query(query, values, (err) => {
      if (err) return res.status(500).json(err);
      res.send("Updated");
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM student WHERE student_id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.send("Deleted");
    }
  );
});

module.exports = router;