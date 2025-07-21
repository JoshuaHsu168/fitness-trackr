import { useState } from "react";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import { useAuth } from "../auth/AuthContext";

export default function ActivitiesPage() {
  const {
    data: activities,
    loading,
    error,
  } = useQuery("/activities", "activities");
  const { token } = useAuth();

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const {
    mutate: deleteActivity,
    error: deleteError,
    loading: deleting,
  } = useMutation("DELETE", null, ["activities"]);

  const {
    mutate: addActivity,
    error: addError,
    loading: adding,
  } = useMutation("POST", "/activities", ["activities"]);

  const handleDelete = async (activityId) => {
    await deleteActivity(null, `/activities/${activityId}`);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addActivity({ name: newName, description: newDescription });
      setNewName("");
      setNewDescription("");
    } catch (e) {}
  };

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p>Error loading activities: {error}</p>;

  return (
    <>
      <h1>Activities</h1>
      {deleteError && (
        <p style={{ color: "red" }}>Error deleting activity: {deleteError}</p>
      )}
      {deleting && <p>Deleting activity...</p>}

      {token && (
        <section>
          <h2>Add New Activity</h2>
          {addError && (
            <p style={{ color: "red" }}>Error adding activity: {addError}</p>
          )}
          {adding && <p>Adding activity...</p>}
          <form onSubmit={handleAddSubmit}>
            <label>
              Name:
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                required
              />
            </label>
            <button type="submit" disabled={adding}>
              Add Activity
            </button>
          </form>
        </section>
      )}

      {activities && activities.length > 0 ? (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
              {token && (
                <button
                  onClick={() => handleDelete(activity.id)}
                  disabled={deleting}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No activities found.</p>
      )}
    </>
  );
}
