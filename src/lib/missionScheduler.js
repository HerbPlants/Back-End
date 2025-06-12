const cron = require("node-cron");
const MissionService = require("../services/mission/missionService");
const missionService = new MissionService();

cron.schedule("1 0 * * *", async () => {
  console.log("[Cron] Menjalankan rotasi dan assign misi harian...");

  try {
    await missionService.generateDailyMissionRotation();
    await missionService.assignDailyMissionsToAllUsers();
    console.log("[Cron] Misi harian berhasil dirotasi dan diassign ke semua user.");
  } catch (error) {
    console.error("[Cron] Gagal menjalankan rotasi misi harian:", error.message);
  }
});
