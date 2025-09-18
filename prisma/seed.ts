import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Create actions
  const actions = ["create", "read", "update", "delete"];
  const actionRecords = await Promise.all(
    actions.map((slug) =>
      prisma.action.upsert({
        where: { slug },
        update: {},
        create: { name: slug.charAt(0).toUpperCase() + slug.slice(1), slug },
      })
    )
  );

  // 2. Create module
  const moduleDashboard = await prisma.module.upsert({
    where: { slug: "dashboard" },
    update: {},
    create: { name: "Dashboard", slug: "dashboard" },
  });

  // 3. Create permissions (module + action)
  const permissionRecords = await Promise.all(
    actionRecords.map((action) =>
      prisma.permission.upsert({
        where: { module_id_action_id: { module_id: moduleDashboard.id, action_id: action.id } },
        update: {},
        create: {
          module_id: moduleDashboard.id,
          action_id: action.id,
        },
      })
    )
  );

  // 4. Create developer role
  const developerRole = await prisma.role.upsert({
    where: { slug: "developer" },
    update: {},
    create: { name: "Developer", slug: "developer" },
  });

  // 5. Assign all permissions to developer role
  await prisma.rolePermission.createMany({
    data: permissionRecords.map((p) => ({
      role_id: developerRole.id,
      permission_id: p.id,
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

  console.log("✅ Seeder finished with permissions!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
