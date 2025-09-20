import { PrismaClient, Action } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // definisi modules + actions
  const modules = [
    {
      name: "Dashboard",
      slug: "dashboard",
      actions: ["create", "read", "update", "delete"],
    },
    {
      name: "Contact",
      slug: "contact",
      actions: ["read"],
    },
  ];

  const allActions = ["create", "read", "update", "delete"];

  // bikin action global
  const actionRecords: Record<string, Action> = {};
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

  // bikin modules + permissions
  const permissionRecords = [];
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
          name: `${mod.slug}-${act}`, // contoh: dashboard-create, contact-read
          module: { connect: { id: moduleRecord.id } },
          action: { connect: { id: action.id } },
        },
      });
      permissionRecords.push(permission);
    }
  }

  // role developer
  const developerRole = await prisma.role.upsert({
    where: { slug: "developer" },
    update: {},
    create: { name: "Developer", slug: "developer" },
  });

  // assign semua permissions ke developer
  await prisma.rolePermission.createMany({
    data: permissionRecords.map((p) => ({
      role_id: developerRole.id,
      permission_id: p.id,
    })),
    skipDuplicates: true,
  });

  // user developer
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

  // assign role developer ke user
  await prisma.userRole.upsert({
    where: { user_id_role_id: { user_id: devUser.id, role_id: developerRole.id } },
    update: {},
    create: { user_id: devUser.id, role_id: developerRole.id },
  });

  console.log("✅ Seeder finished with modules, actions, permissions, roles, and user!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
