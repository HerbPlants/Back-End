const prisma = require("../../lib/prisma");
const InvariantError = require("../../exceptions/InvariantError");
const { startOfDay } = require("date-fns");

class MissionService {
  // Buat misi baru
  async createMission({ title, description, type, total, pointReward }) {
    const mission = await prisma.mission.create({
      data: {
        title,
        description,
        type,
        total,
        pointReward,
      },
    });

    return mission;
  }

  // Ambil semua misi (opsional: filter by type)
  async getAllMissions(type = null) {
    const where = type ? { type } : {};
    return prisma.mission.findMany({ where });
  }

  // Generate rotasi harian (acak 3 dari misi daily)
  async generateDailyMissionRotation() {
    const today = startOfDay(new Date());

    const existing = await prisma.dailyMissionRotation.findUnique({
      where: { date: today },
    });
    if (existing) return;

    const dailyMissions = await prisma.mission.findMany({
      where: { type: "daily", isActive: true },
    });

    if (dailyMissions.length < 3) {
      throw new InvariantError("Jumlah misi harian belum cukup untuk rotasi");
    }

    const shuffled = dailyMissions.sort(() => 0.5 - Math.random());
    const [m1, m2, m3] = shuffled;

    await prisma.dailyMissionRotation.create({
      data: {
        date: today,
        mission1: m1.id,
        mission2: m2.id,
        mission3: m3.id,
      },
    });
  }

  // Assign misi harian ke semua user
  async assignDailyMissionsToAllUsers() {
    const today = startOfDay(new Date());

    const rotation = await prisma.dailyMissionRotation.findUnique({
      where: { date: today },
    });

    if (!rotation) throw new InvariantError("Rotasi misi harian belum dibuat");

    const users = await prisma.users.findMany({ select: { uuid: true } });

    const missionIds = [
      rotation.mission1,
      rotation.mission2,
      rotation.mission3,
    ];

    for (const user of users) {
      for (const missionId of missionIds) {
        const exists = await prisma.userMission.findUnique({
          where: {
            userUuid_missionId: {
              userUuid: user.uuid,
              missionId,
            },
          },
        });

        if (!exists) {
          await prisma.userMission.create({
            data: {
              userUuid: user.uuid,
              missionId,
            },
          });
        }
      }
    }
  }

  // Ambil misi harian user
  async getDailyMissionsForUser(userUuid) {
    const today = startOfDay(new Date());

    const rotation = await prisma.dailyMissionRotation.findUnique({
      where: { date: today },
    });
    if (!rotation) return [];

    const missionIds = [
      rotation.mission1,
      rotation.mission2,
      rotation.mission3,
    ];

    const missions = await prisma.userMission.findMany({
      where: {
        userUuid,
        missionId: { in: missionIds },
      },
      include: {
        mission: true,
      },
    });

    return missions.map((entry) => ({
      id: entry.missionId,
      title: entry.mission.title,
      description: entry.mission.description,
      current: entry.current,
      total: entry.mission.total,
      completed: entry.completed,
      pointReward: entry.mission.pointReward,
    }));
  }

  // Tambah progres misi user, dan catat point jika selesai
  async incrementMissionProgress(userUuid, missionId, incrementBy = 1) {
    const userMission = await prisma.userMission.findUnique({
      where: {
        userUuid_missionId: {
          userUuid,
          missionId,
        },
      },
      include: { mission: true },
    });

    if (!userMission) return;
    if (userMission.completed) return;

    const newProgress = userMission.current + incrementBy;
    const isCompleted = newProgress >= userMission.mission.total;

    await prisma.userMission.update({
      where: {
        userUuid_missionId: {
          userUuid,
          missionId,
        },
      },
      data: {
        current: newProgress,
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    if (isCompleted) {
      await prisma.pointHistory.create({
        data: {
          userUuid,
          change: userMission.mission.pointReward,
          reason: `Reward dari misi: ${userMission.mission.title}`,
          source: "mission",
          relatedId: missionId,
        },
      });
    }
  }

  async getUserTotalPoints(userUuid) {
    const result = await prisma.pointHistory.aggregate({
      where: { userUuid },
      _sum: {
        change: true,
      },
    });

    return result._sum.change || 0;
  }

  async getAllUserMissions(userUuid) {
    const userMissions = await prisma.userMission.findMany({
      where: { userUuid },
      include: { mission: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    return userMissions.map((entry) => ({
      id: entry.missionId,
      title: entry.mission.title,
      description: entry.mission.description,
      current: entry.current,
      total: entry.mission.total,
      completed: entry.completed,
      type: entry.mission.type,
      pointReward: entry.mission.pointReward,
    }));
  }

  // Ambil misi hari ini (daily rotation + exclusive), dengan progress jika login
async getTodayMissions(userUuid = null) {
  const today = startOfDay(new Date());

  const rotation = await prisma.dailyMissionRotation.findUnique({
    where: { date: today },
  });

  const dailyMissionIds = rotation
    ? [rotation.mission1, rotation.mission2, rotation.mission3]
    : [];

  const exclusiveMissions = await prisma.mission.findMany({
    where: { type: "exclusive", isActive: true },
  });

  const missionIds = [
    ...dailyMissionIds,
    ...exclusiveMissions.map((m) => m.id),
  ];

  const missions = await prisma.mission.findMany({
    where: {
      id: { in: missionIds },
    },
  });

  let userProgress = [];
  if (userUuid) {
    userProgress = await prisma.userMission.findMany({
      where: {
        userUuid,
        missionId: { in: missionIds },
      },
    });
  }

  return missions.map((mission) => {
    const progress = userProgress.find((p) => p.missionId === mission.id);

    return {
      id: mission.id,
      title: mission.title,
      description: mission.description,
      total: mission.total,
      pointReward: mission.pointReward,
      type: mission.type,
      current: progress ? progress.current : 0,
      completed: progress ? progress.completed : false,
      status: progress ? "joined" : "not_joined",
    };
  });
}

}

module.exports = MissionService;
