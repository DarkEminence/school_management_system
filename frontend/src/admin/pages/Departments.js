import AdminTable from "../AdminTable";

export default function Departments() {
  return (
    <AdminTable
      endpoint="departments"
      fields={[
        "dept_id",
        "dept_name",
        "hod_name"
      ]}
      formFields={[
        "dept_name",
        "hod_id"
      ]}
      idField="dept_id"
    />
  );
}