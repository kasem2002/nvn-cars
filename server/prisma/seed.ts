import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const SERVICES = [
  {
    nameEn: "Paint Protection Film (PPF)",
    nameAr: "حماية الطلاء PPF",
    descriptionEn: "Protective film for the vehicle's exterior paint.",
    descriptionAr: "فيلم حماية لطلاء السيارة الخارجي يحافظ على مظهرها الأصلي.",
    category: "ppf",
    order: 1,
  },
  {
    nameEn: "Nano Ceramic",
    nameAr: "نانو سيراميك",
    descriptionEn: "Nano ceramic protection for vehicle surfaces.",
    descriptionAr: "طبقة حماية نانو سيراميك لأسطح السيارة تمنحها لمعاناً ثابتاً.",
    category: "nano-ceramic",
    order: 2,
  },
  {
    nameEn: "Car Window Tinting",
    nameAr: "تظليل نوافذ السيارة",
    descriptionEn: "Premium window tinting / American tinting.",
    descriptionAr: "تظليل نوافذ فاخر بجودة أمريكية عالية.",
    category: "tint",
    order: 3,
  },
  {
    nameEn: "Thermal Insulation",
    nameAr: "العزل الحراري",
    descriptionEn: "Heat protection and thermal insulation for vehicles.",
    descriptionAr: "عزل حراري متكامل لحماية السيارة من الحرارة.",
    category: "tint",
    order: 4,
  },
  {
    nameEn: "Professional Polish",
    nameAr: "التلميع الاحترافي",
    descriptionEn: "Paint polishing and correction to improve the appearance of the vehicle and remove surface imperfections.",
    descriptionAr: "تلميع وتصحيح الطلاء لتحسين مظهر السيارة وإزالة العيوب السطحية.",
    category: "polish",
    order: 5,
  },
  {
    nameEn: "Dry Cleaning / Deep Interior Cleaning",
    nameAr: "التنظيف الجاف / تنظيف داخلي عميق",
    descriptionEn: "Detailed interior cleaning and care.",
    descriptionAr: "تنظيف داخلي دقيق وعناية شاملة بمقصورة السيارة.",
    category: "interior",
    order: 6,
  },
  {
    nameEn: "Vehicle Updating & Transformation",
    nameAr: "تحديث وتحويل السيارات",
    descriptionEn:
      "Updating and transforming vehicles toward newer versions, including Black Edition-style conversions where applicable.",
    descriptionAr: "تحديث وتحويل السيارات نحو إصدارات أحدث، بما في ذلك تحويلات على طراز Black Edition عند الإمكان.",
    category: "customization",
    order: 7,
  },
  {
    nameEn: "Removable Paint",
    nameAr: "الطلاء القابل للإزالة",
    descriptionEn: "Specialized removable automotive paint.",
    descriptionAr: "طلاء سيارات متخصص قابل للإزالة.",
    category: "customization",
    order: 8,
  },
  {
    nameEn: "Wheel / Rim Painting",
    nameAr: "طلاء الجنوط",
    descriptionEn: "Professional painting and customization of wheels/rims.",
    descriptionAr: "طلاء وتخصيص احترافي للجنوط.",
    category: "customization",
    order: 9,
  },
  {
    nameEn: "Interior Detailing & Customization",
    nameAr: "تفصيل وتخصيص داخلي",
    descriptionEn: "Premium interior care and customization.",
    descriptionAr: "عناية وتخصيص داخلي فاخر لمقصورة السيارة.",
    category: "interior",
    order: 10,
  },
];

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@nvncars.iq";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-immediately";
  const hashed = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    create: { email, password: hashed, name: "NVN Cars Admin", role: "admin" },
    update: {},
  });

  for (const service of SERVICES) {
    const existing = await prisma.service.findFirst({ where: { nameEn: service.nameEn } });
    if (!existing) {
      await prisma.service.create({ data: service });
    }
  }

  await prisma.location.upsert({
    where: { id: "main-branch" },
    create: {
      id: "main-branch",
      name: "NVN Cars — Al Mansour",
      nameAr: "إن في إن كارز — المنصور",
      address: "14 Ramadan Street, Al Mansour, Baghdad, Iraq",
      addressAr: "شارع 14 رمضان، المنصور، بغداد، العراق",
      wazeUrl: "https://waze.com/ul/hsvzt8c2jv",
      active: true,
    },
    update: {},
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      instagram: "https://www.instagram.com/nvn.cars/",
      seoTitleEn: "NVN Cars — Premium Automotive Care in Baghdad",
      seoTitleAr: "إن في إن كارز — عناية فاخرة بالسيارات في بغداد",
      seoDescriptionEn:
        "NVN Cars offers premium PPF, nano ceramic, tinting, polishing, and detailing services in Al Mansour, Baghdad.",
      seoDescriptionAr: "إن في إن كارز تقدم خدمات حماية طلاء، نانو سيراميك، تظليل، وتلميع فاخرة في المنصور، بغداد.",
      keywords: "NVN Cars, car care Baghdad, PPF Baghdad, nano ceramic Baghdad, car detailing Baghdad, Mansour car care",
    },
    update: {},
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${email} / (password from SEED_ADMIN_PASSWORD env var)`);
  console.log("NOTE: Gallery, before/after, and reviews were left empty on purpose.");
  console.log("Add real photography and genuine reviews through the admin dashboard.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
