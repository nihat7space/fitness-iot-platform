import React, { useState } from "react";

const EMPTY = { exercise: "", sets: "", reps: "", weight: "" };

export default function WorkoutForm({ initialValues, onSubmit, onCancel, submitLabel, busy }) {
  const [values, setValues] = useState(initialValues || EMPTY);
  const [formError, setFormError] = useState(null);

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    try {
      await onSubmit({
        exercise: values.exercise.trim(),
        sets: Number(values.sets),
        reps: Number(values.reps),
        weight: Number(values.weight)
      });
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <form className="form-row" onSubmit={handleSubmit}>
      <div className="field">
        <label>Exercise</label>
        <input
          type="text"
          value={values.exercise}
          onChange={(e) => update("exercise", e.target.value)}
          required
        />
      </div>
      <div className="field" style={{ width: 90 }}>
        <label>Sets</label>
        <input
          type="number"
          min="1"
          value={values.sets}
          onChange={(e) => update("sets", e.target.value)}
          required
        />
      </div>
      <div className="field" style={{ width: 90 }}>
        <label>Reps</label>
        <input
          type="number"
          min="1"
          value={values.reps}
          onChange={(e) => update("reps", e.target.value)}
          required
        />
      </div>
      <div className="field" style={{ width: 110 }}>
        <label>Weight</label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={values.weight}
          onChange={(e) => update("weight", e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={busy}>{submitLabel}</button>
      {onCancel && (
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      )}
      {formError && <span className="error-banner" style={{ padding: "4px 8px" }}>{formError}</span>}
    </form>
  );
}
