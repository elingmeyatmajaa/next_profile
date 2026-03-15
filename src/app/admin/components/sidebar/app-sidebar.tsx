"use client";

import * as React from "react";
import {
  AudioWaveform, Command, GalleryVerticalEnd, KeyRound
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import __ from "@/lib/lang";

import {
  IconAdjustments, IconBuilding,
  IconBuildingFactory2,
  IconCalculator,
  IconCash, IconCreditCard, IconCurrencyDollar,
  IconFileInvoice, IconFolder,
  IconFolders,
  IconHeartHandshake,
  IconIdBadge2,
  IconLink,
  IconLocationCode,
  IconMapPin, IconPackage,
  IconPackages, IconReceipt2,
  IconReportAnalytics, IconRoute2,
  IconShoppingCart,
  IconTag, IconUserCheck,
  IconUserCircle,
  IconUserCog,
  IconWallet
} from "@tabler/icons-react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  //
  navMain: [
    {
      title: __("Purchase"),
      url: "#",
      permission: [""],
      icon: IconShoppingCart,
      isActive: false,
      items: [
        {
          title: __("Purchase Request"),
          url: "/admin/purchase-request",
          permission: ["read-purchase-request"],
          isActive: true,
        },
        {
          title: __("Purchase Plan"),
          url: "/admin/purchase-plan",
          permission: ["read-purchase-plan"],
          isActive: true,
        },
        {
          title: __("Purchase Order"),
          url: "/admin/purchase-order",
          permission: ["read-purchase-order"],
          isActive: true,
        },
        {
          title: __("Request For Quotation"),
          url: "/admin/request-for-quotation",
          permission: ["read-request-for-quotation"],
          isActive: true,
        },

        {
          title: __("Purchase"),
          url: "/admin/purchase",
          permission: ["read-purchase"],
          isActive: true,
        },
      ],
    },
    {
      title: __("Sale"),
      url: "#",
      permission: [""],
      icon: IconHeartHandshake,
      isActive: false,
      items: [
        {
          title: __("Offer"),
          url: "/admin/offer",
          permission: ["read-offer"],
          isActive: true,
        },
        {
          title: __("Sales Order"),
          url: "/admin/sales-order",
          permission: ["read-sales-order"],
          isActive: true,
        },
        {
          title: __("Sale"),
          url: "/admin/sale",
          permission: ["read-sale"],
          isActive: true,
        },
        {
          title: __("Delivery Order"),
          url: "/admin/delivery-order",
          permission: ["read-delivery-order"],
        },

        {
          title: __("Delivery"),
          url: "/admin/delivery",
          permission: ["read-delivery"],
        },
      ],
    },
    {
      title: __("Production"),
      url: "#",
      permission: [""],
      icon: IconBuildingFactory2,
      isActive: false,
      items: [
        {
          title: __("Process"),
          url: "/admin/process",
          permission: ["read-process"],
          isActive: true,
        },

        {
          title: __("Process Job"),
          url: "/admin/process-job",
          permission: ["read-process-job"],
          isActive: true,
        },
        {
          title: __("Bill Of Material"),
          url: "/admin/bill-of-material",
          permission: ["read-bill-of-material"],
          isActive: true,
        },
        {
          title: __("Bill Of Resource"),
          url: "/admin/bill-of-resource",
          permission: ["read-bill-of-resource"],
          isActive: true,
        },
        {
          title: __("Job Order"),
          url: "/admin/job-order",
          permission: ["read-job-order"],
          isActive: true,
        },

        {
          title: __("Job"),
          url: "/admin/job",
          permission: ["read-job"],
          isActive: true,
        },

        {
          title: __("Goods Issued"),
          url: "/admin/goods-issued",
          permission: ["read-goods-issued"],
          isActive: true,
        },
        {
          title: __("Goods Receipt"),
          url: "/admin/goods-receipt",
          permission: ["read-goods-receipt"],
          isActive: true,
        },
      ],
    },

    {
      title: __("Accounting"),
      url: "#",
      permission: [""],
      icon: IconCalculator,
      isActive: false,
      items: [
        {
          title: __("Journal"),
          url: "/admin/journal/create",
          permission: ["read-journal"],
          isActive: true,
        },
        {
          title: __("Payment Journal"),
          url: "/admin/payment-journal",
          permission: ["read-payment-journal"],
          isActive: true,
        },
        {
          title: __("Receipt Journal"),
          url: "/admin/receipt-journal/create",
          permission: ["read-receipt-journal"],
          isActive: true,
        },

        {
          title: __("Suspense Account Journal"),
          url: "/admin/suspense-account-journal/create",
          permission: ["read-suspense-account-journal"],
          isActive: true,
        },
        {
          title: __("Bank Reconciliation"),
          url: "/admin/bank-reconciliation",
          permission: ["read-bank-reconciliation"],
          isActive: true,
        },
        {
          title: __("Sales Invoices"),
          url: "/admin/sales-invoice/create",
          permission: ["read-sales-invoices"],
          isActive: true,
        },
        {
          title: __("Purchase Invoices"),
          url: "/admin/purchase-invoice/create",
          permission: ["read-purchase-invoices"],
          isActive: true,
        },
      ],
    },
    {
      title: __("Cash"),
      url: "#",
      permission: [""],
      icon: IconCash,
      isActive: false,
      items: [
        {
          title: __("Cash in From Employee"),
          url: "/admin/cash-in-from-employee/create",
          permission: ["read-cash-in-from-employee"],
          isActive: true,
        },
        {
          title: __("Cash in From Customer"),
          url: "/admin/cash-in-from-customer/create",
          permission: ["read-cash-in-from-customer"],
          isActive: true,
        },
        {
          title: __("Cash in From Merchant Account"),
          url: "/admin/cash-in-from-merchant-account/create",
          permission: ["read-cash-in-from-merchant-account"],
          isActive: true,
        },
        {
          title: __("Cash in From Bank Loan"),
          url: "/admin/cash-in-from-bank-loan/create",
          permission: ["read-cash-in-from-bank-loan"],
          isActive: true,
        },

        {
          title: __("Cash Out By Receipt"),
          url: "/admin/cash-out-by-receipt/create",
          permission: ["read-cash-out-by-receipt"],
          isActive: true,
        },

        {
          title: __("Cash Out To Vendor/Customer"),
          url: "/admin/cash-out-to-vendor/create",
          permission: ["read-cash-out-to-vendor"],
          isActive: true,
        },
        {
          title: __("Cash Out To Employee"),
          url: "/admin/cash-out-to-employee/create",
          permission: ["read-cash-out-to-employee"],
          isActive: true,
        },
        {
          title: __("Bank Transfer"),
          url: "/admin/bank-transfer/create",
          permission: ["read-bank-transfer"],
          isActive: true,
        },
      ],
    },
    {
      title: __("Report"),
      url: "#",
      permission: [""],
      icon: IconReportAnalytics,
      isActive: false,
      items: [
        {
          title: __("Inventory Balance"),
          url: "/admin/inventory-balance",
          permission: ["read-inventory-balance"],
          isActive: true,
        },
        {
          title: __("Inventory Balance By Location"),
          url: "/admin/inventory-balance-by-location",
          permission: ["read-inventory-balance-by-location"],
          isActive: true,
        },
      ],
    },
    {
      title: __("References"),
      url: "#",
      permission: [
        "read-currency",
        "read-time-zone",
        "read-vendor-type",
        "read-vendor-type-business",
        "read-location-type",
      ],
      icon: IconLink,
      isActive: false,
      items: [
        {
          title: __("Currency"),
          url: "/admin/currency",
          permission: ["read-currency"],
          isActive: true,
        },
        {
          title: __("Time Zone"),
          url: "/admin/time-zone",
          permission: ["read-time-zone"],
          isActive: true,
        },
        {
          title: __("Vendor/Customer Type"),
          url: "/admin/vendor-type",
          permission: ["read-vendor-type"],
          icon: IconUserCog,
          isActive: true,
        },
        {
          title: __("Vendor/Customer Type Business"),
          url: "/admin/vendor-type-business",
          permission: ["read-vendor-type-business"],
          icon: IconUserCheck,
          isActive: true,
        },

        {
          title: __("Location Type"),
          url: "/admin/location-type",
          permission: ["read-location-type"],
          icon: IconLocationCode,
          isActive: true,
        },
      ],
    },
    {
      title: __("Authorization"),
      url: "#",
      permission: ["read-action", "read-module", "read-role", "read-user"],
      icon: KeyRound,
      isActive: false,
      items: [
        {
          title: __("Action"),
          url: "/admin/action",
          isActive: false,
          permission: ["read-action"],
        },
        {
          title: __("Role"),
          url: "/admin/role",
          isActive: false,
          permission: ["read-role"],
        },
        {
          title: __("Module"),
          url: "/admin/module",
          isActive: false,
          permission: ["read-module"],
        },
        {
          title: __("User"),
          url: "/admin/user",
          isActive: false,
          permission: ["read-user"],
        },
      ],
    },
  ],
  projects: [
    {
      name: __("Vendor/Customer"),
      url: "/admin/vendor",
      permission: ["read-vendor"],
      icon: IconUserCircle,
      isActive: true,
    },
    {
      name: __("Type Of Tax"),
      url: "/admin/type-of-tax",
      permission: ["read-type-of-tax"],
      icon: IconCurrencyDollar,
      isActive: true,
    },
    {
      name: __("Type Of Transaction"),
      url: "/admin/type-of-transaction",
      permission: ["read-type-of-transaction"],
      icon: IconReceipt2,
      isActive: true,
    },
    {
      name: __("Bank Account"),
      url: "/admin/bank-account",
      permission: ["read-bank-account"],
      icon: IconWallet,
      isActive: true,
    },

    {
      name: __("Credit Card"),
      url: "/admin/credit-card",
      permission: ["read-credit-card"],
      icon: IconCreditCard,
      isActive: true,
    },
    {
      name: __("Price Level Group"),
      url: "/admin/price-level-group",
      permission: ["read-price-level-group"],
      icon: IconTag,
      isActive: true,
    },
    {
      name: __("Location"),
      url: "/admin/location",
      permission: ["read-location"],
      icon: IconMapPin,
      isActive: true,
    },
    {
      name: __("Group Project"),
      url: "/admin/group-project",
      permission: ["read-group-project"],
      icon: IconFolders,
      isActive: true,
    },
    {
      name: __("Project"),
      url: "/admin/project",
      permission: ["read-project"],
      icon: IconFolder,
      isActive: true,
    },
    {
      name: __("Department"),
      url: "/admin/department",
      permission: ["read-department"],
      icon: IconBuilding,
      isActive: true,
    },
    {
      name: __("Group Item"),
      url: "/admin/group-item",
      permission: ["read-group-item"],
      icon: IconPackages,
      isActive: true,
    },
    {
      name: __("Item"),
      url: "/admin/item",
      permission: ["read-item"],
      icon: IconPackage,
      isActive: true,
    },
    {
      name: __("PIC/Worker"),
      url: "/admin/pic",
      permission: ["read-pic"],
      icon: IconIdBadge2,
      isActive: true,
    },
    {
      name: __("Adjustment"),
      url: "/admin/adjustment",
      permission: ["read-adjustment"],
      icon: IconAdjustments,
      isActive: true,
    },
    {
      name: __("Movement"),
      url: "/admin/movement",
      permission: ["read-movement"],
      icon: IconRoute2,
      isActive: false,
    },
    {
      name: __("Chart of Account"),
      url: "/admin/chart-of-account",
      permission: ["read-chart-of-account"],
      icon: IconFileInvoice,
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
