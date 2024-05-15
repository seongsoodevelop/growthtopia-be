import createPromise from "./query.js";
import { DateTimeOrNull as dn, valueOrNull as vn } from "./dataTools.js";

export const workTaskFind = (task_id) => {
  return createPromise(`SELECT * FROM work_task WHERE task_id=?`, [
    task_id,
  ]).then((res) => {
    if (res.length === 0) return null;
    else if (res.length === 1) return res[0];
    else throw new Error("workTaskFind");
  });
};

export const workTaskQuery = (user_no, start_at, end_at) => {
  return createPromise(
    `SELECT * FROM work_task WHERE user_no=? AND at BETWEEN ? AND ?`,
    [user_no, start_at, end_at]
  );
};

export const workTaskInsert = ({
  user_no,
  at,
  name,
  duration_estimated,
  workspace_id,
  category_id,
  assignment_id,
}) => {
  return createPromise(
    `INSERT INTO work_task (user_no, at, name, duration_estimated, workspace_id, category_id, assignment_id) VALUE (?, ?, ?, ?, ?, ?, ?)`,
    [
      user_no,
      dn(at),
      name,
      duration_estimated,
      vn(workspace_id),
      vn(category_id),
      vn(assignment_id),
    ]
  );
};

export const workTaskRemove = (task_id) => {
  return createPromise(`DELETE FROM work_task WHERE task_id=?`, [task_id]);
};

export const workTaskUpdate = ({
  status,
  name,
  at,
  duration_estimated,
  workspace_id,
  category_id,
  assignment_id,
  task_id,
}) => {
  return createPromise(
    `UPDATE work_task SET status=?, name=?, at=?, duration_estimated=?, workspace_id=?, category_id=?, assignment_id=? WHERE task_id=?`,
    [
      status,
      name,
      dn(at),
      vn(duration_estimated),
      vn(workspace_id),
      vn(category_id),
      vn(assignment_id),
      task_id,
    ]
  );
};

export const workTaskUpdateDuration = ({ duration, task_id }) => {
  return createPromise(`UPDATE work_task SET duration=? WHERE task_id=?`, [
    vn(duration),
    task_id,
  ]);
};
