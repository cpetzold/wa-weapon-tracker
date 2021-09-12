import { Parser } from "binary-parser";
import { zipObj } from "ramda";

export interface Weapon {
  ammunition: number;
  power: number;
  delay: number;
  probability: number;
}

export type SchemeWeapons = { [weaponName: string]: Weapon };

const weaponsParser = new Parser()
  .uint8("ammunition")
  .uint8("power")
  .uint8("delay")
  .uint8("probability");

const schemeWeaponsParser = new Parser()
  .seek(0x29)
  .array("weapons", { type: weaponsParser, length: 64 });

function readSchemeWeapons(schemeFile: File): Promise<Weapon[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const { weapons } = schemeWeaponsParser.parse(
        new Uint8Array(reader.result as ArrayBuffer)
      );
      resolve(weapons);
    });
    reader.readAsArrayBuffer(schemeFile);
  });
}

export async function parseSchemeWeapons(
  schemeFile: File
): Promise<SchemeWeapons> {
  const weaponsArray = await readSchemeWeapons(schemeFile);
  return zipObj(SCHEME_WEAPONS, weaponsArray);
}

const SCHEME_WEAPONS = [
  "Bazooka",
  "Homing Missile",
  "Mortar",
  "Grenade",
  "Cluster Bomb",
  "Skunk",
  "Petrol Bomb",
  "Banana Bomb",
  "Handgun",
  "Shotgun",
  "Uzi",
  "Minigun",
  "Longbow",
  "Airstrike",
  "Napalm Strike",
  "Mine",
  "Fire Punch",
  "Dragon Ball",
  "Kamikaze",
  "Prod",
  "Battle Axe",
  "Blowtorch",
  "Pneumatic Drill",
  "Girder",
  "Ninja Rope",
  "Parachute",
  "Bungee",
  "Teleport",
  "Dynamite",
  "Sheep",
  "Baseball Bat",
  "Flame Thrower",
  "Homing Pigeon",
  "Mad Cow",
  "Holy Hand Grenade",
  "Old Woman",
  "Sheep Launcher",
  "Super Sheep",
  "Mole Bomb",
  "Jet Pack",
  "Low Gravity",
  "Laser Sight",
  "Fast Walk",
  "Invisibility",
  "Damage x2",
  "Freeze",
  "Super Banana Bomb",
  "Mine Strike",
  "Girder Starter Pack",
  "Earthquake",
  "Scales Of Justice",
  "Ming Vase",
  "Mike's Carpet Bomb",
  "Patsy's Magic Bullet",
  "Indian Nuclear Test",
  "Select Worm",
  "Salvation Army",
  "Mole Squadron",
  "MB Bomb",
  "Concrete Donkey",
  "Suicide Bomber",
  "Sheep Strike",
  "Mail Strike",
  "Armageddon",
];

export const PANEL_WEAPONS = [
  // Util
  "Jet Pack",
  "Low Gravity",
  "Fast Walk",
  "Laser Sight",
  "Invisibility",

  // F1
  "Bazooka",
  "Homing Missile",
  "Mortar",
  "Homing Pigeon",
  "Sheep Launcher",

  // F2
  "Grenade",
  "Cluster",
  "Banana Bomb",
  "Battle Axe",
  "Earth Quake",

  // F3
  "Shotgun",
  "Handgun",
  "Uzi",
  "Minigun",
  "Longbow",

  // F4
  "Fire Punch",
  "Dragon Ball",
  "Kamikaze",
  "Suicide Bomber",
  "Prod",

  // F5
  "Dynamite",
  "Mine",
  "Sheep",
  "Super Sheep",
  "Mole Bomb",

  // F6
  "Air Strike",
  "Napalm Strike",
  "Mail Strike",
  "Mine Strike",
  "Mole Squadron",

  // F7
  "Blowtorch",
  "Pneumatic Drill",
  "Girder",
  "Baseball Bat",
  "Girder Starter-Pack",

  // F8
  "Ninja Rope",
  "Bungee",
  "Parachute",
  "Teleport",
  "Scales of Justice",

  // F9
  "Super Banana",
  "Holy Hand-Grenade",
  "Flame Thrower",
  "Salvation Army",
  "MB Bomb",

  // F10
  "Petrol Bomb",
  "Skunk",
  "Priceless Ming Vase",
  "French Sheep Strike",
  "Mike's Carpet Bomb",

  // F11
  "Mad Cow",
  "Old Woman",
  "Concrete Donkey",
  "Indian Nuclear Test",
  "Armageddon",

  // F12
  "Skip Go",
  "Surrender",
  "Worm Select",
  "Freeze",
  "Patsy's Magic Bullet",
];
