const mysql = require('mysql2');
const db = mysql.createConnection({ host:'localhost', user:'root', password:'1234', database:'school_management' });

db.query('SHOW TABLES LIKE "faculty"', (err, res)=>{
  if (err) { console.log('faculty table error', err); db.end(); return; }
  console.log('faculty table exists?', res.length>0);
  db.query('SHOW TABLES LIKE "faculty_classes"', (err2,res2)=>{
    if (err2) { console.log('faculty_classes error', err2); db.end(); return; }
    console.log('faculty_classes exists?', res2.length>0);
    db.query('SHOW TABLES LIKE "faculty_class_students"', (err3,res3)=>{
      if (err3) { console.log('faculty_class_students error', err3); db.end(); return; }
      console.log('faculty_class_students exists?', res3.length>0);
      db.query('SELECT id,email,department,designation FROM faculty LIMIT 5', (err4,r4)=>{
        if (err4) console.log('select error', err4);
        else console.log('faculty sample', r4);
        // Show classes data
        db.query('SELECT * FROM faculty_classes', (err5, r5)=>{
          if (err5) console.log('classes error', err5);
          else console.log('classes sample', r5);
          // Show students data
          db.query('SELECT * FROM faculty_class_students LIMIT 5', (err6, r6)=>{
            if (err6) console.log('students error', err6);
            else console.log('students sample (first 5)', r6);
            db.end();
          });
        });
      });
    });
  });
});
