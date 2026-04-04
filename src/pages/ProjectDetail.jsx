import { useParams } from "react-router-dom";

function ProjectDetail() {
  const { id } = useParams();
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Project Detail</h1>
      <p className="text-gray-600">Showing details for project ID: {id}</p>
    </div>
  );
}
export default ProjectDetail;
