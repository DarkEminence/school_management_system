import AdminTable from "../AdminTable";

export default function Students() {
  return (
    <AdminTable
      endpoint="students"
      fields={[
        "student_id",
        "name",
        "dob",
        "gender",
        "address",
        "phone",
        "email",
        "class_name"
      ]}
      formFields={[
        "name",
        "dob",
        "gender",
        "address",
        "phone",
        "email",
        "password_hash",
        "class_id"
      ]}
      idField="student_id"
    />
  );
}