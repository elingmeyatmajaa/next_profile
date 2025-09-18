import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Create actions
  const actions = ["create", "read", "update", "delete"];
  const actionRecords = await Promise.all(
    actions.map((name) =>
      prisma.action.upsert({
        where: { slug: name },
        update: {},
        create: { name: name.charAt(0).toUpperCase() + name.slice(1), slug: name },
      })
    )
  );

  // 2. Create module dashboard
  const dashboardModule = await prisma.module.upsert({
    where: { slug: "dashboard" },
    update: {},
    create: { name: "Dashboard", slug: "dashboard" },
  });

  // 3. Assign all actions to dashboard module
  await Promise.all(
    actionRecords.map((action) =>
      prisma.moduleAction.upsert({
        where: { module_id_action_id: { module_id: dashboardModule.id, action_id: action.id } },
        update: {},
        create: { module_id: dashboardModule.id, action_id: action.id },
      })
    )
  );

  // 4. Create developer role
  const developerRole = await prisma.role.upsert({
    where: { slug: "developer" },
    update: {},
    create: { name: "Developer", slug: "developer" },
  });

  // 5. Assign all permissions/modules to developer role
  await prisma.rolePermission.createMany({
    data: actionRecords.map((action) => ({
      role_id: developerRole.id,
      permission_id: action.id, // jika ada tabel permission
    })),
    skipDuplicates: true,
  });

  // 6. Create developer user
  const hashedPassword = await bcrypt.hash("12345678", 10);
  const devUser = await prisma.user.upsert({
    where: { email: "developer@developer.com" },
    update: {},
    create: { name: "Developer", email: "developer@developer.com", password: hashedPassword },
  });

  // 7. Assign developer role to user
  await prisma.userRole.upsert({
    where: { user_id_role_id: { user_id: devUser.id, role_id: developerRole.id } },
    update: {},
    create: { user_id: devUser.id, role_id: developerRole.id },
  });

  console.log("✅ Seed finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
