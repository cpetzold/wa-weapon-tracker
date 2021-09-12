import { repeat, zipObj } from "ramda";

import { Parser } from "binary-parser";

export const MIN_AMMUNITION = 0;
export const MAX_AMMUNITION = 10;

export interface WeaponSettings {
  ammunition: number;
  power?: number;
  delay?: number;
  probability?: number;
}

export type SchemeWeapons = { [weaponName: string]: WeaponSettings };

const weaponsParser = new Parser()
  .uint8("ammunition")
  .uint8("power")
  .uint8("delay")
  .uint8("probability");

const schemeWeaponsParser = new Parser()
  .seek(0x29)
  .array("weapons", { type: weaponsParser, length: 64 });

function readSchemeWeapons(schemeFile: File): Promise<WeaponSettings[]> {
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
  "Air Strike",
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
  "Scales of Justice",
  "Priceless Ming Vase",
  "Mike's Carpet Bomb",
  "Patsy's Magic Bullet",
  "Indian Nuclear Test",
  "Worm Select",
  "Salvation Army",
  "Mole Squadron",
  "MB Bomb",
  "Concrete Donkey",
  "Suicide Bomber",
  "French Sheep Strike",
  "Mail Strike",
  "Armageddon",
];

export const DEFAULT_SCHEME_WEAPONS: SchemeWeapons = zipObj(
  SCHEME_WEAPONS,
  repeat({ ammunition: MAX_AMMUNITION }, SCHEME_WEAPONS.length)
);

export const ALWAYS_PRESENT_WEAPONS = ["Skip Go", "Surrender"];

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
  "Cluster Bomb",
  "Banana Bomb",
  "Battle Axe",
  "Earthquake",

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
  "Girder Starter Pack",

  // F8
  "Ninja Rope",
  "Bungee",
  "Parachute",
  "Teleport",
  "Scales of Justice",

  // F9
  "Super Banana Bomb",
  "Holy Hand Grenade",
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
