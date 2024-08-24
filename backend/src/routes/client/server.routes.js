const { Router } = require("express");
const {
  serverDetails,
  webSocketDetails,
  resourceUsage,
  sendCommand,
  sendPowerAction,
  listServerDatabases,
  createServerDatabases,
  rotateServerDatabasePassword,
  deleteServerDatabase,
  listServerVariables,
  updateServerVariables,
  renameServer,
  reinstallServer,
  listServerBackups,
  createBackup,
  getBackupDetails,
  downloadBackup,
  deleteBackup,
  listServerUsers,
  createSubUser,
  getSubUserDetails,
  updateSubUserDetails,
  deleteSubUser,
  listAllocation,
  assignAllocation,
  setAllocationNote,
  setPrimaryAllocation,
  deleteAllocation,
  listSchedules,
  createSchedule,
  getScheduleDetails,
  updateSchedule,
  deleteSchedule,
  createTask,
  updateTask,
  deleteTask,
  listFiles,
  getContentsOfFile,
  downloadFile,
  renameFile,
  copyFile,
  writeFile,
  compressFile,
  decompressFile,
  deleteFile,
  createFolder,
  uploadFile,
  moveFiles
} = require("../../controllers/client/server.controller");
const router = Router();

router.route("/details/:id").get(serverDetails);
router.route("/websocket/:id").get(webSocketDetails);
router.route("/resources/:id").get(resourceUsage);
router.route("/send-command/:id").post(sendCommand);
router.route("/send-power/:id").post(sendPowerAction);
router.route("/databases/:id").get(listServerDatabases);
router.route("/database/:id").post(createServerDatabases);
router.route("/database/password/:id/:database_id").post(rotateServerDatabasePassword);
router.route("/database/:id/:database_id").delete(deleteServerDatabase);
router.route("/variables/:id").get(listServerVariables);
router.route("/variables/:id").patch(updateServerVariables);
router.route("/rename/:id").patch(renameServer);
router.route("/reinstall/:id").post(reinstallServer);

router.route("/backups/:id").get(listServerBackups);
router.route("/backups/:id").post(createBackup);
router.route("/backup/:id/:backup_id").get(getBackupDetails);
router.route("/backup/download/:id/:backup_id").get(downloadBackup);
router.route("/backup/delete/:id/:backup_id").delete(deleteBackup);

router.route("/users/:id").get(listServerUsers);
router.route("/users/:id").post(createSubUser);
router.route("/users/:id/:user_id").get(getSubUserDetails);
router.route("/users/:id/:user_id").patch(updateSubUserDetails);
router.route("/users/:id/:user_id").delete(deleteSubUser);

router.route("/allocation/:id").get(listAllocation);
router.route("/allocation/:id").post(assignAllocation);
router.route("/allocation/:id/:allocation_id").patch(setAllocationNote);
router.route("/allocation/:id/:allocation_id").post(setPrimaryAllocation);
router.route("/allocation/:id/:allocation_id").delete(deleteAllocation);

router.route("/schedules/:id").get(listSchedules);
router.route("/schedules/:id").post(createSchedule);
router.route("/schedules/:id/:schedule_id").get(getScheduleDetails);
router.route("/schedules/:id/:schedule_id").patch(updateSchedule);
router.route("/schedules/:id/:schedule_id").delete(deleteSchedule);
router.route("/tasks/:id").post(createTask);
router.route("/tasks/:id/:task_id").patch(updateTask);
router.route("/tasks/:id/:task_id").delete(deleteTask);

router.route("/files/:id").get(listFiles);
router.route("/files/:id").post(getContentsOfFile);
router.route("/files/download/:id").post(downloadFile);

router.route("/files/rename/:id").post(renameFile);
router.route("/files/move/:id").post(moveFiles);
router.route("/files/copy/:id/:file").post(copyFile);
router.route("/files/write/:id").post(writeFile);
router.route("/files/compress/:id").post(compressFile);
router.route("/files/decompress/:id").post(decompressFile);

router.route("/files/delete/:id").post(deleteFile);

router.route("/files/folder/:id").post(createFolder);

router.route("/files/upload/:id").post(uploadFile);

module.exports = router;
