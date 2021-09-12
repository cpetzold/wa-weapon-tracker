import {
  ALWAYS_PRESENT_WEAPONS,
  DEFAULT_SCHEME_WEAPONS,
  MAX_AMMUNITION,
  MIN_AMMUNITION,
  PANEL_WEAPONS,
  SchemeWeapons,
  WeaponSettings,
  parseSchemeWeapons,
} from "../lib/weapons";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { MouseEvent, useEffect, useState } from "react";
import { assoc, clamp, isNil, map, not, range } from "ramda";

import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";

interface WeaponProps {
  name: string;
  size: number | string;
  ammunition: number;
  onClick?: (weapon: string, e: MouseEvent) => void;
  onMouseOver?: (weapon: string) => void;
  onMouseOut?: (weapon: string) => void;
}

function Weapon({
  name,
  size,
  ammunition,
  onClick,
  onMouseOver,
  onMouseOut,
}: WeaponProps) {
  return (
    <Box
      position="relative"
      cursor="pointer"
      width={size}
      height={size}
      _hover={{
        boxShadow: "0 0 0 1px #fff",
      }}
      onClick={(e) => onClick?.(name, e)}
      onMouseOver={(e) => onMouseOver?.(name)}
      onMouseOut={(e) => onMouseOut?.(name)}
    >
      {(ALWAYS_PRESENT_WEAPONS.includes(name) || ammunition > 0) && (
        <Image
          alt={name}
          src={`/weapons/${name}.png`}
          width={size}
          height={size}
        />
      )}
      {!isNil(ammunition) && ammunition < 10 && ammunition > 0 && (
        <Box
          position="absolute"
          bottom={0}
          right={0}
          fontSize="x-small"
          backgroundColor="red.600"
          color="white"
          padding="0px 1px 0px 2px"
          borderTopLeftRadius="3px"
        >
          {ammunition}
        </Box>
      )}
    </Box>
  );
}

interface WeaponPanelProps {
  schemeWeapons: SchemeWeapons;
  size?: number | string;
  bottomText?: string;
  onClickWeapon?: (weapon: string, e: MouseEvent) => void;
  onMouseOverWeapon?: (weapon: string) => void;
  onMouseOutWeapon?: (weapon: string) => void;
}

function WeaponPanel({
  schemeWeapons,
  onClickWeapon,
  onMouseOverWeapon,
  onMouseOutWeapon,
  size = "32px",
  bottomText,
}: WeaponPanelProps) {
  return (
    <Grid
      templateColumns="32px auto"
      backgroundColor="#777"
      padding="1px"
      gap="1px"
      alignItems="start"
      userSelect="none"
    >
      <Grid gap="1px">
        {map(
          (row) => (
            <GridItem
              key={row}
              backgroundColor="#000"
              fontSize="x-small"
              padding="2px"
              width={size}
              height={size}
            >
              {row}
            </GridItem>
          ),
          ["Util.", ...map((n) => `F${n + 1}`, range(0, 12))]
        )}
      </Grid>
      <Grid templateColumns="repeat(5, auto)" gap="1px">
        {PANEL_WEAPONS.map((weaponName) => (
          <GridItem
            key={weaponName}
            width={size}
            height={size}
            backgroundColor="#000"
          >
            <Weapon
              name={weaponName}
              onClick={onClickWeapon}
              onMouseOver={onMouseOverWeapon}
              onMouseOut={onMouseOutWeapon}
              size={size}
              {...schemeWeapons?.[weaponName]}
            />
          </GridItem>
        ))}
      </Grid>

      <GridItem
        colSpan={2}
        backgroundColor="#000"
        fontSize="x-small"
        padding="2px"
      >
        {bottomText}&nbsp;
      </GridItem>
    </Grid>
  );
}

const Home: NextPage = () => {
  // @ts-ignore
  const inApp = global?.window?.api;
  const [showMenu, setShowMenu] = useState(false);
  const [schemeWeapons, setSchemeWeapons] = useState(DEFAULT_SCHEME_WEAPONS);
  const [hoveredWeapon, setHoveredWeapon] = useState<string>();

  const updateWeapon = (
    weaponName: string,
    updater: (weaponSettings: WeaponSettings) => WeaponSettings
  ) => {
    setSchemeWeapons((schemeWeapons) =>
      assoc(weaponName, updater(schemeWeapons[weaponName]), schemeWeapons)
    );
  };

  useEffect(() => {
    if (inApp) {
      // @ts-ignore
      window.api.on("toggleMenu", () => setShowMenu(not));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      direction="column"
      alignItems="start"
      sx={{ "-webkit-app-region": "drag" }}
    >
      <Head>
        <title>W:A Weapon Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {(!inApp || showMenu) && (
        <Flex>
          <input
            type="file"
            onChange={async (e) => {
              const schemeFile = e.target.files?.[0];
              if (!schemeFile) {
                return;
              }

              const schemeWeapons = await parseSchemeWeapons(schemeFile);
              setSchemeWeapons(schemeWeapons);
              setShowMenu(false);
            }}
          />
        </Flex>
      )}
      {(!inApp || !showMenu) && (
        <WeaponPanel
          schemeWeapons={schemeWeapons}
          bottomText={hoveredWeapon}
          onClickWeapon={(weaponName, e) => {
            if (ALWAYS_PRESENT_WEAPONS.includes(weaponName)) {
              return;
            }

            updateWeapon(weaponName, (settings) => ({
              ...settings,
              ammunition: clamp(
                MIN_AMMUNITION,
                MAX_AMMUNITION,
                settings.ammunition + (e.shiftKey ? 1 : -1)
              ),
            }));
          }}
          onMouseOverWeapon={setHoveredWeapon}
          onMouseOutWeapon={(_weaponName) => setHoveredWeapon(undefined)}
        />
      )}
    </Flex>
  );
};

export default Home;
