import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { createWorkout, deleteWorkout, fetchWorkouts, updateWorkout } from "../api/workouts.js";
import WorkoutForm from "../components/WorkoutForm.jsx";

const SORT_FIELDS = ["exercise", "sets", "reps", "weight", "total_volume"];
const PAGE_SIZE = 10;

export default function Workouts() {
  const { token } = useAuth();

  const [exerciseFilter, setExerciseFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [descending, setDescending] = useState(false);
  const [offset, setOffset] = useState(0);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWorkouts({
        exercise: exerciseFilter || undefined,
        sortBy: sortBy || undefined,
        descending,
        offset,
        limit: PAGE_SIZE,
        token
      });
      setResult(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [exerciseFilter, sortBy, descending, offset, token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(values) {
    setBusy(true);
    try {
      await createWorkout(values, token);
      setShowAddForm(false);
      setOffset(0);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(id, values) {
    setBusy(true);
    try {
      await updateWorkout(id, values, token);
      setEditingId(null);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    setBusy(true);
    try {
      await deleteWorkout(id, token);
      setConfirmDeleteId(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const workouts = result ? result.workouts : [];
  const totalCount = result ? result.total_count : 0;
  const hasNext = offset + PAGE_SIZE < totalCount;
  const hasPrev = offset > 0;

  return (
    <div className="page-content">
      {error && <div className="error-banner">{error}</div>}

      {showAddForm && (
        <div className="card">
          <WorkoutForm
            submitLabel="Save workout"
            busy={busy}
            onSubmit={handleCreate}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      <div className="card">
        <div className="toolbar" style={{ marginBottom: 12 }}>
          <div className="form-row" style={{ gap: 8 }}>
            <div className="field" style={{ width: 170 }}>
              <label>Exercise</label>
              <input
                type="text"
                value={exerciseFilter}
                onChange={(e) => { setOffset(0); setExerciseFilter(e.target.value); }}
                placeholder="Filter, e.g. Squat"
              />
            </div>
            <div className="field" style={{ width: 140 }}>
              <label>Sort by</label>
              <select value={sortBy} onChange={(e) => { setOffset(0); setSortBy(e.target.value); }}>
                <option value="">Default</option>
                {SORT_FIELDS.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ width: 130 }}>
              <label>Direction</label>
              <select
                value={descending ? "desc" : "asc"}
                onChange={(e) => { setOffset(0); setDescending(e.target.value === "desc"); }}
                disabled={!sortBy}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddForm((v) => !v)}>
            {showAddForm ? "Close" : "Add workout"}
          </button>
        </div>

        {loading && !result ? (
          <div className="empty-state">Loading...</div>
        ) : workouts.length === 0 ? (
          <div className="empty-state">No workouts match these filters.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps</th>
                  <th>Weight</th>
                  <th>Volume</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((workout) => (
                  editingId === workout.id ? (
                    <tr key={workout.id}>
                      <td colSpan={6}>
                        <WorkoutForm
                          initialValues={{
                            exercise: workout.exercise,
                            sets: String(workout.sets),
                            reps: String(workout.reps),
                            weight: String(workout.weight)
                          }}
                          submitLabel="Save changes"
                          busy={busy}
                          onSubmit={(values) => handleUpdate(workout.id, values)}
                          onCancel={() => setEditingId(null)}
                        />
                      </td>
                    </tr>
                  ) : (
                    <tr key={workout.id}>
                      <td>{workout.exercise}</td>
                      <td>{workout.sets}</td>
                      <td>{workout.reps}</td>
                      <td>{workout.weight}</td>
                      <td>{workout.total_volume}</td>
                      <td style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        {confirmDeleteId === workout.id ? (
                          <>
                            <span className="helper-text">Delete?</span>
                            <button className="btn btn-danger" disabled={busy} onClick={() => handleDelete(workout.id)}>Confirm</button>
                            <button className="btn btn-ghost" disabled={busy} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-ghost" onClick={() => setEditingId(workout.id)}>Edit</button>
                            <button className="btn btn-ghost" onClick={() => setConfirmDeleteId(workout.id)}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="toolbar" style={{ marginTop: 12 }}>
          <span className="helper-text">
            {totalCount > 0 ? `Showing ${offset + 1}-${Math.min(offset + PAGE_SIZE, totalCount)} of ${totalCount}` : ""}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" disabled={!hasPrev} onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}>Prev</button>
            <button className="btn" disabled={!hasNext} onClick={() => setOffset((o) => o + PAGE_SIZE)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
