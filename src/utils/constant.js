export const UserRoleEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
}

export const AvialableUserRoles = Object.values(UserRoleEnum)

export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done",
  };
  
  export const AvailableTaskStatuses = Object.values(TaskStatusEnum);
  
export const DB_Name = "TaskManeger  "