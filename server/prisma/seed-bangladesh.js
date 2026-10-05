// Adds demo hotels (with rooms) across all 8 divisions of Bangladesh, plus the
// neighbourhood areas they sit in. Safe to run again: existing areas and hotels
// (matched by name) are skipped.
//
//   npm run seed:bd            add the demo hotels
//   npm run seed:bd -- --remove  delete them again (hotels with bookings are kept)
//
// Hotel names are made up for the demo; locations and coordinates are real.
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const img = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const HOTEL_PHOTOS = [
  "1566073771259-6a8506099945", "1542314831-068cd1dbfeeb", "1551882547-ff40c63fe5fa", "1520250497591-112f2f40a3f4",
  "1571896349842-33c89424de2d", "1582719478250-c89cae4dc85b", "1596394516093-501ba68a0ba6", "1445019980597-93fa8acb246c",
  "1564501049412-61c2a3083791", "1584132967334-10e028bd69f7", "1455587734955-081b22074882", "1571003123894-1f0594d2b5d9",
  "1561501900-3701fa6a0864", "1549294413-26f195200c16",
].map((id) => img(id));
const ROOM_PHOTOS = [
  "1590490360182-c33d57733427", "1611892440504-42a792e24d32", "1618773928121-c32242e63f39", "1631049307264-da0ec9d70304",
  "1566665797739-1674de7a421a", "1578683010236-d716f9a3f461", "1595576508898-0ad5c879a061", "1505693416388-ac5ce068fe85",
  "1540518614846-7eded433c457", "1522771739844-6a9f6d5f14af",
].map((id) => img(id, 1000));

// Hotel amenity sets by tier (names match the admin form and the UI icons).
const AMENITIES = {
  budget: ["Free WiFi", "Air Conditioning", "Restaurant", "TV"],
  mid: ["Free WiFi", "Air Conditioning", "Restaurant", "Gym", "TV", "Parking"],
  luxury: ["Free WiFi", "Swimming Pool", "Spa", "Gym", "Restaurant", "Air Conditioning", "Parking"],
  resort: ["Free WiFi", "Swimming Pool", "Restaurant", "Air Conditioning", "Balcony", "Parking"],
};

// Room types per tier: [type, price per night (BDT), adults, children, rooms of this type, room amenities]
const ROOMS = {
  budget: [
    ["Single", 1500, 1, 0, 8, ["Free WiFi", "Air Conditioning", "TV"]],
    ["Double", 2200, 2, 1, 12, ["Free WiFi", "Air Conditioning", "TV"]],
    ["Family", 3500, 4, 2, 4, ["Free WiFi", "Air Conditioning", "TV", "Balcony"]],
  ],
  mid: [
    ["Double", 3800, 2, 1, 14, ["Free WiFi", "Air Conditioning", "TV", "Safe"]],
    ["Deluxe", 5200, 2, 2, 10, ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe"]],
    ["Family", 6900, 4, 2, 5, ["Free WiFi", "Air Conditioning", "TV", "Balcony"]],
  ],
  luxury: [
    ["Deluxe", 9500, 2, 1, 20, ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe"]],
    ["Family", 13500, 4, 2, 8, ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Balcony"]],
    ["Suite", 22000, 2, 2, 4, ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Safe", "Balcony"]],
  ],
  resort: [
    ["Double", 6500, 2, 1, 12, ["Free WiFi", "Air Conditioning", "TV", "Balcony"]],
    ["Deluxe", 8800, 2, 2, 8, ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Balcony"]],
    ["Family", 11500, 4, 2, 6, ["Free WiFi", "Air Conditioning", "TV", "Balcony"]],
  ],
};

// District serial IDs follow the District collection (e.g. 47 = Dhaka, 9 = Cox's Bazar).
// [district serialId, area name, area bn_name, hotels: [name, tier, street/landmark, lat, lng, blurb]]
const PLACES = [
  // Dhaka division
  [47, "Gulshan", "গুলশান", [
    ["Gulshan Lakeview Hotel", "luxury", "Road 45, Gulshan 2", 23.7936, 90.4146, "a business hotel overlooking Gulshan Lake, close to embassies and corporate offices"],
    ["The Orchid Residency Gulshan", "mid", "Gulshan Avenue, Gulshan 1", 23.7808, 90.4167, "serviced rooms on Gulshan Avenue with easy access to restaurants and shopping"],
  ]],
  [47, "Banani", "বনানী", [
    ["Banani Skyline Inn", "mid", "Road 11, Banani", 23.7937, 90.4043, "a modern stay on Banani's food street with a rooftop restaurant"],
  ]],
  [47, "Dhanmondi", "ধানমন্ডি", [
    ["Dhanmondi Lake Residency", "mid", "Road 27, Dhanmondi", 23.7465, 90.3760, "a quiet hotel a short walk from Dhanmondi Lake and Rabindra Sarobar"],
    ["Satmasjid Guest House", "budget", "Satmasjid Road, Dhanmondi", 23.7547, 90.3690, "a friendly budget guest house near the old Sat Gambuj Mosque"],
  ]],
  [47, "Uttara", "উত্তরা", [
    ["Uttara Airport Hotel", "mid", "Sector 7, Uttara", 23.8690, 90.3984, "ten minutes from Hazrat Shahjalal International Airport, ideal for early flights"],
  ]],
  [47, "Motijheel", "মতিঝিল", [
    ["Motijheel Business Hotel", "budget", "Dilkusha C/A, Motijheel", 23.7286, 90.4198, "a practical base in Dhaka's banking district"],
  ]],
  [41, "Rajendrapur", "রাজেন্দ্রপুর", [
    ["Sal Forest Eco Resort", "resort", "Rajendrapur, near Bhawal National Park", 24.0333, 90.4333, "cottages among sal trees beside Bhawal National Park, an easy weekend escape from Dhaka"],
  ]],
  [43, "Chashara", "চাষাঢ়া", [
    ["Shitalakshya Riverside Hotel", "budget", "Chashara Circle, Narayanganj", 23.6238, 90.5000, "a central hotel near the Shitalakshya river ghats and Narayanganj launch terminal"],
  ]],

  // Chattagram division
  [8, "Agrabad", "আগ্রাবাদ", [
    ["Agrabad Harbour Hotel", "luxury", "Sheikh Mujib Road, Agrabad C/A", 22.3256, 91.8123, "a full-service hotel in Chattogram's commercial hub, near the port"],
  ]],
  [8, "GEC Circle", "জিইসি মোড়", [
    ["GEC Garden Hotel", "mid", "CDA Avenue, GEC Circle", 22.3590, 91.8215, "a comfortable stay on CDA Avenue with shopping malls nearby"],
    ["Hillview Inn Chattogram", "budget", "Nasirabad, near GEC Circle", 22.3654, 91.8236, "a budget hotel with hill views over Nasirabad"],
  ]],
  [9, "Kolatoli", "কলাতলী", [
    ["Kolatoli Beach Resort", "resort", "Kolatoli Road, Cox's Bazar", 21.4225, 91.9757, "steps from the world's longest natural sea beach, with sea-facing balconies"],
    ["Sea Pearl View Hotel", "luxury", "Hotel Motel Zone, Kolatoli", 21.4268, 91.9740, "a beachfront hotel with an infinity pool facing the Bay of Bengal"],
    ["Sugandha Point Guest House", "budget", "Sugandha Point, Cox's Bazar", 21.4335, 91.9700, "a simple, clean guest house a minute from Sugandha beach"],
  ]],
  [9, "Inani", "ইনানী", [
    ["Inani Coral Bay Resort", "resort", "Marine Drive, Inani", 21.2310, 92.0450, "a resort on Marine Drive beside Inani's coral-stone beach"],
  ]],
  [11, "Nilachal", "নীলাচল", [
    ["Nilachal Hill Resort", "resort", "Nilachal, Bandarban", 22.1873, 92.2210, "hilltop cottages above the clouds, close to Nilachal and Meghla"],
  ]],
  [4, "Reserve Bazar", "রিজার্ভ বাজার", [
    ["Kaptai Lake View Hotel", "mid", "Reserve Bazar, Rangamati", 22.6460, 92.1750, "a lakeside hotel with boat trips to the hanging bridge and Shuvolong waterfall"],
  ]],
  [1, "Kandirpar", "কান্দিরপাড়", [
    ["Mainamati Heritage Hotel", "mid", "Kandirpar, Cumilla", 23.4607, 91.1809, "a central hotel near Mainamati's Buddhist ruins and the war cemetery"],
  ]],

  // Sylhet division
  [36, "Zindabazar", "জিন্দাবাজার", [
    ["Surma Valley Hotel", "mid", "Zindabazar, Sylhet", 24.8949, 91.8687, "in the heart of Sylhet city, near shopping and the Surma river"],
    ["Zindabazar Budget Inn", "budget", "Zindabazar Point, Sylhet", 24.8960, 91.8700, "an affordable stay on Sylhet's main shopping street"],
  ]],
  [36, "Dargah Gate", "দরগাহ গেট", [
    ["Shahjalal Dargah View Hotel", "budget", "Dargah Gate, Sylhet", 24.9020, 91.8730, "a short walk from the Hazrat Shahjalal shrine"],
  ]],
  [36, "Khadimnagar", "খাদিমনগর", [
    ["Jaflong Road Tea Resort", "resort", "Airport Road, Khadimnagar", 24.9300, 91.9000, "a green resort among tea estates on the road to Jaflong and Ratargul"],
  ]],
  [37, "Sreemangal", "শ্রীমঙ্গল", [
    ["Sreemangal Tea Garden Resort", "luxury", "Radhanagar, Sreemangal", 24.2920, 91.7360, "a spa resort inside rolling tea gardens near Lawachara National Park"],
    ["Lawachara Forest Lodge", "budget", "Kamalganj Road, Sreemangal", 24.3220, 91.7860, "a forest lodge at the edge of Lawachara rainforest"],
  ]],
  [39, "Tahirpur", "তাহিরপুর", [
    ["Tanguar Haor Houseboat Inn", "budget", "Tahirpur, Sunamganj", 25.0870, 91.1880, "a base for houseboat trips on Tanguar Haor wetland"],
  ]],

  // Khulna division
  [27, "Sonadanga", "সোনাডাঙ্গা", [
    ["Rupsha River Hotel", "mid", "Sonadanga, Khulna", 22.8180, 89.5480, "a city hotel near the Rupsha bridge and bus terminal"],
    ["Sonadanga City Inn", "budget", "Majid Sarani, Sonadanga", 22.8150, 89.5420, "a no-frills hotel near Khulna's main bus terminal"],
  ]],
  [28, "Mongla", "মোংলা", [
    ["Sundarbans Gateway Resort", "resort", "Mongla Port, Bagerhat", 22.4870, 89.6040, "the departure point for Sundarbans boat tours, with mangrove views"],
  ]],
  [28, "Bagerhat Sadar", "বাগেরহাট সদর", [
    ["Sixty Dome Heritage Inn", "budget", "Shatgambuj Road, Bagerhat", 22.6743, 89.7419, "next to the UNESCO-listed Sixty Dome Mosque"],
  ]],
  [20, "Jashore Sadar", "যশোর সদর", [
    ["Jashore Garden Hotel", "mid", "M K Road, Jashore", 23.1664, 89.2090, "a central hotel close to Jashore airport and Benapole road"],
  ]],
  [25, "Kushtia Sadar", "কুষ্টিয়া সদর", [
    ["Lalon Shah Riverside Hotel", "budget", "N S Road, Kushtia", 23.9013, 89.1200, "near Lalon's shrine at Chheuria and Rabindranath Tagore's Shilaidaha Kuthibari"],
  ]],

  // Rajshahi division
  [15, "Shaheb Bazar", "সাহেব বাজার", [
    ["Padma Riverside Hotel", "mid", "Shaheb Bazar, Rajshahi", 24.3636, 88.5940, "a short walk from the Padma riverbank, famous for its sunsets"],
    ["Silk City Inn", "budget", "Ghoramara, Rajshahi", 24.3680, 88.6000, "an affordable stay near Rajshahi's silk shops and Varendra Museum"],
  ]],
  [15, "Padma Residential Area", "পদ্মা আবাসিক এলাকা", [
    ["Rajshahi Grand Hotel", "luxury", "Padma Residential Area, Rajshahi", 24.3700, 88.6250, "Rajshahi's upscale option with a pool and spa"],
  ]],
  [14, "Satmatha", "সাতমাথা", [
    ["Mahasthangarh Heritage Hotel", "mid", "Satmatha, Bogura", 24.8465, 89.3730, "a central base for visiting the ancient city of Mahasthangarh"],
    ["Bogura Doi Ghar Inn", "budget", "Jhawtala, Bogura", 24.8500, 89.3700, "a simple hotel near Bogura's famous doi shops"],
  ]],
  [19, "Naogaon Sadar", "নওগাঁ সদর", [
    ["Paharpur Vihara Inn", "budget", "Main Road, Naogaon", 24.8000, 88.9400, "for visits to the UNESCO-listed Paharpur Buddhist monastery"],
  ]],

  // Barisal division
  [33, "Sadar Road", "সদর রোড", [
    ["Kirtankhola River Hotel", "mid", "Sadar Road, Barishal", 22.7010, 90.3535, "near the Barishal launch terminal on the Kirtankhola river"],
    ["Bell's Park Inn", "budget", "Band Road, Barishal", 22.7000, 90.3600, "a budget hotel by Bell's Park and the riverside walk"],
  ]],
  [31, "Kuakata", "কুয়াকাটা", [
    ["Kuakata Sunrise Resort", "resort", "Kuakata Sea Beach, Patuakhali", 21.8160, 90.1210, "on the only beach in Bangladesh where you can watch both sunrise and sunset"],
    ["Kuakata Sea Breeze Hotel", "budget", "Zero Point, Kuakata", 21.8180, 90.1190, "a beach hotel at Kuakata Zero Point"],
  ]],
  [34, "Bhola Sadar", "ভোলা সদর", [
    ["Meghna Island Hotel", "budget", "Sadar Road, Bhola", 22.6850, 90.6480, "a simple hotel on Bangladesh's largest island"],
  ]],

  // Rangpur division
  [59, "Jahaj Company More", "জাহাজ কোম্পানি মোড়", [
    ["Rangpur City Hotel", "mid", "Jahaj Company More, Rangpur", 25.7466, 89.2517, "in Rangpur's city centre, near Tajhat Palace"],
    ["Teesta Budget Inn", "budget", "Station Road, Rangpur", 25.7500, 89.2600, "an affordable hotel near Rangpur railway station"],
  ]],
  [54, "Dinajpur Sadar", "দিনাজপুর সদর", [
    ["Kantajew Temple Hotel", "mid", "Munshipara, Dinajpur", 25.6270, 88.6370, "a base for Kantajew Temple and Ramsagar lake"],
  ]],
  [53, "Tetulia", "তেঁতুলিয়া", [
    ["Kanchenjunga View Resort", "resort", "Tetulia, Panchagarh", 26.4830, 88.3550, "on clear winter mornings you can see Kanchenjunga from the terrace"],
  ]],

  // Mymensingh division
  [62, "Ganginar Par", "গাঙ্গিনার পাড়", [
    ["Brahmaputra Riverside Hotel", "mid", "Ganginar Par, Mymensingh", 24.7540, 90.4070, "near the old Brahmaputra river and Shashi Lodge"],
    ["Mymensingh Town Inn", "budget", "Town Hall More, Mymensingh", 24.7470, 90.4030, "a central budget hotel close to the station"],
  ]],
  [64, "Durgapur", "দুর্গাপুর", [
    ["Someshwari Hill Resort", "resort", "Birisiri, Durgapur", 25.1270, 90.6650, "beside the Someshwari river and the blue china-clay lakes of Birisiri"],
  ]],
  [61, "Sherpur Sadar", "শেরপুর সদর", [
    ["Gajni Hills Hotel", "budget", "Sherpur Town", 25.0200, 90.0170, "a gateway to the Gajni hills and Garo Pahar"],
  ]],
];

const describe = (name, blurb, district) =>
  `${name} is ${blurb}. Rooms are air-conditioned with free WiFi, and the front desk is open 24 hours to help with transport and local tours around ${district}.`;

const seedNames = () => PLACES.flatMap(([, , , hotels]) => hotels.map(([name]) => name));
const seedAreas = () => PLACES.map(([serialId, name]) => ({ serialId, name }));

async function add() {
  const owner =
    (await prisma.user.findFirst({ where: { role: "admin", NOT: { phone: process.env.DEMO_ADMIN_PHONE || "-" } } })) ||
    (await prisma.user.findFirst({ where: { role: "admin" } }));
  if (!owner) throw new Error("Create an admin user first; hotels need an owner.");

  const districts = new Map((await prisma.district.findMany()).map((d) => [d.serialId, d]));
  let areasAdded = 0;
  let hotelsAdded = 0;
  let roomsAdded = 0;
  let photo = 0;

  for (const [districtSerial, areaName, areaBn, hotels] of PLACES) {
    const district = districts.get(districtSerial);
    if (!district) {
      console.warn(`! District ${districtSerial} not found, skipping ${areaName}`);
      continue;
    }

    let area = await prisma.area.findFirst({ where: { name: areaName, districtId: district.id } });
    if (!area) {
      area = await prisma.area.create({
        data: { name: areaName, bn_name: areaBn, district_id: district.serialId, district_name: district.name, districtId: district.id },
      });
      areasAdded++;
    }

    for (const [name, tier, street, latitude, longitude, blurb] of hotels) {
      photo++;
      if (await prisma.hotel.findFirst({ where: { name } })) continue;

      const hotel = await prisma.hotel.create({
        data: {
          name,
          description: describe(name, blurb, district.name),
          location: `${street}, ${district.name}`,
          latitude,
          longitude,
          image: HOTEL_PHOTOS[photo % HOTEL_PHOTOS.length],
          divisionId: String(district.division_id),
          cityId: String(district.serialId),
          areaId: area.id,
          amenities: AMENITIES[tier],
          ownerId: owner.id,
          isActive: true,
        },
      });
      hotelsAdded++;

      const rooms = ROOMS[tier].map(([type, price, capacity, child, roomQty, amenities], i) => ({
        hotelId: hotel.id,
        roomNumber: String(100 * (i + 1) + 1),
        type,
        price,
        capacity,
        child,
        roomQty,
        images: [ROOM_PHOTOS[(photo + i) % ROOM_PHOTOS.length], ROOM_PHOTOS[(photo + i + 3) % ROOM_PHOTOS.length]],
        amenities,
        isAvailable: true,
      }));
      roomsAdded += (await prisma.room.createMany({ data: rooms })).count;
    }
  }

  console.log(`Added ${hotelsAdded} hotels, ${roomsAdded} rooms and ${areasAdded} areas.`);
  console.log(`Seed list: ${seedNames().length} hotels in ${PLACES.length} areas across 8 divisions.`);
}

async function remove() {
  const hotels = await prisma.hotel.findMany({ where: { name: { in: seedNames() } }, include: { rooms: { select: { id: true } } } });
  let removed = 0;
  for (const hotel of hotels) {
    const roomIds = hotel.rooms.map((r) => r.id);
    const booked = roomIds.length && (await prisma.booking.count({ where: { roomIds: { hasSome: roomIds } } }));
    if (booked) {
      console.warn(`! Keeping ${hotel.name}: it has bookings.`);
      continue;
    }
    await prisma.room.deleteMany({ where: { hotelId: hotel.id } });
    await prisma.hotel.delete({ where: { id: hotel.id } });
    removed++;
  }

  let areasRemoved = 0;
  for (const { serialId, name } of seedAreas()) {
    const area = await prisma.area.findFirst({ where: { name, district_id: serialId } });
    if (area && !(await prisma.hotel.count({ where: { areaId: area.id } }))) {
      await prisma.area.delete({ where: { id: area.id } });
      areasRemoved++;
    }
  }
  console.log(`Removed ${removed} hotels and ${areasRemoved} areas.`);
}

(process.argv.includes("--remove") ? remove() : add())
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
