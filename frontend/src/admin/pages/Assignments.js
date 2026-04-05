import AdminTable from "../AdminTable";

export default function Assignments() {
  return (
    <AdminTable
      endpoint="assignments"
      fields={[
        "id",
        "teacher_name",
        "subject_name",
        "class_name"
      ]}
      formFields={[
        "teacher_id",
        "subject_id",
        "class_id"
      ]}
      idField="id"
    />
  );
}