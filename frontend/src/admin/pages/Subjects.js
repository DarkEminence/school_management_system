import AdminTable from "../AdminTable";

export default function Subjects() {
  return (
    <AdminTable
      endpoint="subjects"
      fields={[
        "subject_id",
        "subject_name"
      ]}
      formFields={[
        "subject_name"
      ]}
      idField="subject_id"
    />
  );
}