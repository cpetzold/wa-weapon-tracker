import {
  ALWAYS_PRESENT_WEAPONS,
  DEFAULT_SCHEME_WEAPONS,
  PANEL_WEAPONS,
  SchemeWeapons,
  parseSchemeWeapons,
} from "../lib/weapons";
import { Box, Flex, Grid, GridItem } from "@chakra-ui/react";
import { isNil, map, range } from "ramda";

import Head from "next/head";
import Image from "next/image";
import type { NextPage } from "next";
import { useState } from "react";

interface WeaponProps {
  name: string;
  size: number | string;
  ammunition: number;
  onMouseOver?: (weapon: string) => void;
  onMouseOut?: (weapon: string) => void;
}

function Weapon({
  name,
  size,
  ammunition,
  onMouseOver,
  onMouseOut,
}: WeaponProps) {
  if (!ALWAYS_PRESENT_WEAPONS.includes(name) && !ammunition) {
    return null;
  }

  return (
    <Box
      cursor="pointer"
      width={size}
      height={size}
      onMouseOver={(e) => onMouseOver?.(name)}
      onMouseOut={(e) => onMouseOut?.(name)}
      _hover={{
        boxShadow: "0 0 0 1px #fff",
      }}
    >
      <Image
        alt={name}
        src={`/weapons/${name}.png`}
        width={size}
        height={size}
      />
    </Box>
  );
}

interface WeaponPanelProps {
  schemeWeapons: SchemeWeapons;
  size?: number | string;
  bottomText?: string;
  onMouseOverWeapon?: (weapon: string) => void;
  onMouseOutWeapon?: (weapon: string) => void;
}

function WeaponPanel({
  schemeWeapons,
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
  const [schemeWeapons, setSchemeWeapons] = useState(DEFAULT_SCHEME_WEAPONS);
  const [hoveredWeapon, setHoveredWeapon] = useState<string>();

  return (
    <div>
      <Head>
        <title>W:A Weapon Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex
        width="100vw"
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <input
          type="file"
          onChange={async (e) => {
            const schemeFile = e.target.files?.[0];
            if (!schemeFile) {
              return;
            }

            const schemeWeapons = await parseSchemeWeapons(schemeFile);
            setSchemeWeapons(schemeWeapons);
          }}
        />
        <WeaponPanel
          schemeWeapons={schemeWeapons}
          bottomText={hoveredWeapon}
          onMouseOverWeapon={setHoveredWeapon}
          onMouseOutWeapon={(weapon) => setHoveredWeapon(undefined)}
        />
      </Flex>
    </div>
  );
};

export default Home;
