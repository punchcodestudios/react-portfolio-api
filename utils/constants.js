const UserStatus = {
  INITIAL: "INITIAL",
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
};

const UserRoles = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const TaskStatus = {
  ACTIVE: "ACTIVE",
  URGENT: "URGENT",
  PAST_DUE: "PAST DUE",
  COMPLETE: "COMPLETE",
  DISCARDED: "DISCARDED",
};

module.exports = {
  UserStatus,
  UserRoles,
  TaskStatus,
};
