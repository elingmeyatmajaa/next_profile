import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const modules = [
    { name: "Dashboard", slug: "dashboard", actions: ["create", "read", "update", "delete"] },
    { name: "Contact", slug: "contact", actions: ["read"] },
  ];

  const allActions = ["create", "read", "update", "delete"];

  // 1️⃣ Buat action global
  const actionRecords: Record<string, any> = {};
  for (const act of allActions) {
    actionRecords[act] = await prisma.action.upsert({
      where: { slug: act },
      update: {},
      create: {
        name: act.charAt(0).toUpperCase() + act.slice(1),
        slug: act,
      },
    });
  }

  // 2️⃣ Buat module + permission
  const permissionRecords: any[] = [];
  for (const mod of modules) {
    const moduleRecord = await prisma.module.upsert({
      where: { slug: mod.slug },
      update: {},
      create: { name: mod.name, slug: mod.slug },
    });

    for (const act of mod.actions) {
      const action = actionRecords[act];
      const permission = await prisma.permission.upsert({
        where: { name: `${mod.slug}-${act}` },
        update: {},
        create: {
          name: `${mod.slug}-${act}`,
          module_id: moduleRecord.id,
          action_id: action.id,
        },
      });
      permissionRecords.push(permission);
    }
  }

  // 3️⃣ Buat role developer
  const developerRole = await prisma.role.upsert({
    where: { slug: "developer" },
    update: {},
    create: { name: "Developer", slug: "developer" },
  });

  // 4️⃣ Assign semua permission ke role developer
  await prisma.rolePermission.createMany({
    data: permissionRecords.map((p) => ({
      role_id: developerRole.id,
      permission_id: p.id,
    })),
    skipDuplicates: true,
  });

  // 5️⃣ Buat user developer
  const hashedPassword = await bcrypt.hash("12345678", 10);
  const devUser = await prisma.user.upsert({
    where: { email: "developer@developer.com" },
    update: {},
    create: {
      name: "Developer",
      email: "developer@developer.com",
      password: hashedPassword,
    },
  });

  // 6️⃣ Assign role developer ke user
  await prisma.userRole.upsert({
    where: { user_id_role_id: { user_id: devUser.id, role_id: developerRole.id } },
    update: {},
    create: { user_id: devUser.id, role_id: developerRole.id },
  });

  console.log("✅ Seeder selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
