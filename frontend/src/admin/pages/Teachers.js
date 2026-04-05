import AdminTable from "../AdminTable";

export default function Teachers() {
  return (
    <AdminTable
      endpoint="teachers"
      fields={[
        "teacher_id",
        "name",
        "phone",
        "email",
        "dept_name"  
      ]}
      formFields={[
        "name",
        "phone",
        "email",
        "password_hash", 
        "dept_id"       
      ]}
      idField="teacher_id"
    />
  );
}