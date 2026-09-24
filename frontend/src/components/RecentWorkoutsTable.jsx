import React from "react";

export default function RecentWorkoutsTable({ workouts }) {
  if (!workouts || workouts.length === 0) {
    return <div className="empty-state">No workouts logged yet.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Weight</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout) => (
            <tr key={workout.id}>
              <td>{workout.exercise}</td>
              <td>{workout.sets}</td>
              <td>{workout.reps}</td>
              <td>{workout.weight}</td>
              <td>{workout.total_volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
