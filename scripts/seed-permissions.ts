/**
 * Seed Default Page Permissions
 * Run this script to initialize the permissions system with default settings
 *
 * Usage: npx tsx scripts/seed-permissions.ts
 */
import { PrismaClient, UserRole, Department } from '@prisma/client';

const prisma = new PrismaClient();

interface PageConfig {
  pagePath: string;
  displayName: string;
  description: string;
  category: string;
  roles: {
    role: UserRole;
    canAccess: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }[];
  departments?: {
    department: Department;
    canAccess: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }[];
}

const pageConfigs: PageConfig[] = [
  // ============= CONTENT MANAGEMENT =============
  {
    pagePath: '/admin/posts',
    displayName: 'Posts',
    description: 'Manage blog posts and articles',
    category: 'Content',
    roles: [
      { role: 'AUTHOR', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
      { role: 'EDITOR', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'EDITORIAL', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/pages',
    displayName: 'Pages',
    description: 'Manage static pages',
    category: 'Content',
    roles: [
      { role: 'EDITOR', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/media',
    displayName: 'Media Library',
    description: 'Manage images and files',
    category: 'Content',
    roles: [
      { role: 'AUTHOR', canAccess: true, canCreate: true, canEdit: false, canDelete: false },
      { role: 'EDITOR', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/categories',
    displayName: 'Categories',
    description: 'Manage content categories',
    category: 'Content',
    roles: [
      { role: 'EDITOR', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/tags',
    displayName: 'Tags',
    description: 'Manage content tags',
    category: 'Content',
    roles: [
      { role: 'AUTHOR', canAccess: true, canCreate: true, canEdit: false, canDelete: false },
      { role: 'EDITOR', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/comments',
    displayName: 'Comments',
    description: 'Moderate user comments',
    category: 'Content',
    roles: [
      { role: 'AUTHOR', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
      { role: 'EDITOR', canAccess: true, canCreate: false, canEdit: true, canDelete: true },
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/podcasts',
    displayName: 'Podcasts',
    description: 'Manage podcast content',
    category: 'Content',
    roles: [
      { role: 'EDITOR', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'EDITORIAL', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/videos',
    displayName: 'Videos',
    description: 'Manage video content',
    category: 'Content',
    roles: [
      { role: 'EDITOR', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'EDITORIAL', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },

  // ============= USER MANAGEMENT =============
  {
    pagePath: '/admin/users',
    displayName: 'Users',
    description: 'Manage user accounts',
    category: 'User Management',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/staff',
    displayName: 'Staff',
    description: 'Manage staff members',
    category: 'User Management',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/members',
    displayName: 'Members',
    description: 'Manage SUCCESS+ members',
    category: 'User Management',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
    ],
    departments: [
      { department: 'CUSTOMER_SERVICE', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
      { department: 'SUCCESS_PLUS', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
    ],
  },

  // ============= ANALYTICS & REPORTS =============
  {
    pagePath: '/admin/analytics',
    displayName: 'Analytics',
    description: 'View site analytics and reports',
    category: 'Analytics',
    roles: [
      { role: 'EDITOR', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
    departments: [
      { department: 'MARKETING', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/revenue',
    displayName: 'Revenue',
    description: 'View revenue and financial reports',
    category: 'Analytics',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/activity-log',
    displayName: 'Activity Log',
    description: 'View user activity logs',
    category: 'Analytics',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
  },

  // ============= DEPARTMENT-SPECIFIC =============
  {
    pagePath: '/admin/editorial',
    displayName: 'Editorial Dashboard',
    description: 'Editorial team dashboard',
    category: 'Departments',
    roles: [
      { role: 'AUTHOR', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
      { role: 'EDITOR', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
    departments: [
      { department: 'EDITORIAL', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/editorial-calendar',
    displayName: 'Editorial Calendar',
    description: 'Content planning calendar',
    category: 'Departments',
    roles: [
      { role: 'AUTHOR', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
      { role: 'EDITOR', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'EDITORIAL', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/customer-service',
    displayName: 'Customer Service',
    description: 'Customer service dashboard',
    category: 'Departments',
    departments: [
      { department: 'CUSTOMER_SERVICE', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/success-plus',
    displayName: 'SUCCESS+',
    description: 'SUCCESS+ management dashboard',
    category: 'Departments',
    departments: [
      { department: 'SUCCESS_PLUS', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/marketing',
    displayName: 'Marketing',
    description: 'Marketing dashboard and tools',
    category: 'Departments',
    departments: [
      { department: 'MARKETING', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/coaching',
    displayName: 'Coaching',
    description: 'Coaching programs and management',
    category: 'Departments',
    departments: [
      { department: 'COACHING', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
  },

  // ============= CRM & EMAIL =============
  {
    pagePath: '/admin/crm/contacts',
    displayName: 'CRM Contacts',
    description: 'Manage customer contacts',
    category: 'CRM',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
    departments: [
      { department: 'CUSTOMER_SERVICE', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
      { department: 'MARKETING', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/crm/campaigns',
    displayName: 'Email Campaigns',
    description: 'Manage email marketing campaigns',
    category: 'CRM',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'MARKETING', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/email-manager',
    displayName: 'Email Manager',
    description: 'Manage email communications',
    category: 'CRM',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
    departments: [
      { department: 'MARKETING', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
      { department: 'CUSTOMER_SERVICE', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
  },

  // ============= SYSTEM & SETTINGS =============
  {
    pagePath: '/admin/settings',
    displayName: 'Settings',
    description: 'System settings and configuration',
    category: 'System',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
    ],
    departments: [
      { department: 'DEV', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/plugins',
    displayName: 'Plugins',
    description: 'Manage plugins and integrations',
    category: 'System',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'DEV', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/seo',
    displayName: 'SEO',
    description: 'SEO settings and optimization',
    category: 'System',
    roles: [
      { role: 'EDITOR', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'MARKETING', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/cache',
    displayName: 'Cache Management',
    description: 'Clear and manage site cache',
    category: 'System',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'DEV', canAccess: true, canCreate: false, canEdit: true, canDelete: true },
    ],
  },
  {
    pagePath: '/admin/site-monitor',
    displayName: 'Site Monitor',
    description: 'Monitor site health and performance',
    category: 'System',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
    departments: [
      { department: 'DEV', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
    ],
  },

  // ============= COMMERCE & SUBSCRIPTIONS =============
  {
    pagePath: '/admin/subscriptions',
    displayName: 'Subscriptions',
    description: 'Manage user subscriptions',
    category: 'Commerce',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
    ],
    departments: [
      { department: 'CUSTOMER_SERVICE', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
      { department: 'SUCCESS_PLUS', canAccess: true, canCreate: false, canEdit: true, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/paylinks',
    displayName: 'Payment Links',
    description: 'Create and manage payment links',
    category: 'Commerce',
    roles: [
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'MARKETING', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
  },
  {
    pagePath: '/admin/magazine-manager',
    displayName: 'Magazine Manager',
    description: 'Manage digital magazine issues',
    category: 'Commerce',
    roles: [
      { role: 'EDITOR', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
      { role: 'ADMIN', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    departments: [
      { department: 'EDITORIAL', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
    ],
  },
];

async function main() {
  console.log('🚀 Starting permissions seed...\n');

  let pagesCreated = 0;
  let rolePermsCreated = 0;
  let deptPermsCreated = 0;

  for (const config of pageConfigs) {
    // Create or update page
    const page = await prisma.page_permissions.upsert({
      where: { pagePath: config.pagePath },
      create: {
        pagePath: config.pagePath,
        displayName: config.displayName,
        description: config.description,
        category: config.category,
      },
      update: {
        displayName: config.displayName,
        description: config.description,
        category: config.category,
      },
    });
    pagesCreated++;

    // Create role permissions
    for (const rolePerm of config.roles) {
      await prisma.role_permissions.upsert({
        where: {
          pageId_role: {
            pageId: page.id,
            role: rolePerm.role,
          },
        },
        create: {
          pageId: page.id,
          role: rolePerm.role,
          canAccess: rolePerm.canAccess,
          canCreate: rolePerm.canCreate,
          canEdit: rolePerm.canEdit,
          canDelete: rolePerm.canDelete,
        },
        update: {
          canAccess: rolePerm.canAccess,
          canCreate: rolePerm.canCreate,
          canEdit: rolePerm.canEdit,
          canDelete: rolePerm.canDelete,
        },
      });
      rolePermsCreated++;
    }

    // Create department permissions
    if (config.departments) {
      for (const deptPerm of config.departments) {
        await prisma.department_permissions.upsert({
          where: {
            pageId_department: {
              pageId: page.id,
              department: deptPerm.department,
            },
          },
          create: {
            pageId: page.id,
            department: deptPerm.department,
            canAccess: deptPerm.canAccess,
            canCreate: deptPerm.canCreate,
            canEdit: deptPerm.canEdit,
            canDelete: deptPerm.canDelete,
          },
          update: {
            canAccess: deptPerm.canAccess,
            canCreate: deptPerm.canCreate,
            canEdit: deptPerm.canEdit,
            canDelete: deptPerm.canDelete,
          },
        });
        deptPermsCreated++;
      }
    }

    console.log(`✓ ${config.displayName} (${config.pagePath})`);
  }

  console.log('\n✅ Permissions seeded successfully!');
  console.log(`   📄 Pages: ${pagesCreated}`);
  console.log(`   👥 Role permissions: ${rolePermsCreated}`);
  console.log(`   🏢 Department permissions: ${deptPermsCreated}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding permissions:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
