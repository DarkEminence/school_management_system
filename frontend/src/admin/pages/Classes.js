import AdminTable from "../AdminTable";

export default function Classes() {
  return (
    <AdminTable
      endpoint="classes"
      fields={[
        "class_id",
        "class_name",
        "dept_name"
      ]}
      formFields={[
        "class_name",
        "dept_id"
      ]}
      idField="class_id"
    />
  );
}