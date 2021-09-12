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
import {
  Box,
  Button,
  DarkMode,
  Flex,
  Grid,
  GridItem,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon, SettingsIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  MouseEvent,
  ReactChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
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
}: WeaponPanelProps) {
  return (
    <Grid
      templateColumns="32px auto"
      backgroundColor="#777"
      gap="1px"
      alignItems="start"
    >
      <Grid gap="1px" sx={{ WebkitAppRegion: "drag" }}>
        {map(
          (row) => (
            <GridItem
              key={row}
              backgroundColor="#000"
              color="#ccc"
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
    </Grid>
  );
}

const Home: NextPage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [schemeWeapons, setSchemeWeapons] = useState(DEFAULT_SCHEME_WEAPONS);
  const [bottomTooltip, setBottomTooltip] = useState<string>();

  const schemeUploadInputRef = useRef<HTMLInputElement>(null);

  const updateWeapon = (
    weaponName: string,
    updater: (weaponSettings: WeaponSettings) => WeaponSettings
  ) => {
    setSchemeWeapons((schemeWeapons) =>
      assoc(weaponName, updater(schemeWeapons[weaponName]), schemeWeapons)
    );
  };

  useEffect(() => {
    // @ts-ignore
    if (global?.window?.api) {
      // @ts-ignore
      window.api.on("toggleMenu", () => setShowMenu(not));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex
      direction="column"
      alignItems="start"
      userSelect="none"
    >
      <Head>
        <title>W:A Weapon Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Flex
        direction="column"
        width="199px"
        height="458px"
        border="1px solid #999"
        gap="1px"
      >
        {showMenu ? (
          <Flex flex={1} padding="2">
            <Button
              size="sm"
              onClick={() => schemeUploadInputRef.current?.click()}
            >
              Scheme
            </Button>
            <input
              ref={schemeUploadInputRef}
              type="file"
              hidden
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
        ) : (
          <WeaponPanel
            schemeWeapons={schemeWeapons}
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
            onMouseOverWeapon={setBottomTooltip}
            onMouseOutWeapon={(_weaponName) => setBottomTooltip(undefined)}
          />
        )}
        <Flex
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="#000"
          fontSize="small"
          padding="1"
          height="28px"
          borderTop="1px solid #999"
        >
          <Box>{bottomTooltip}</Box>
          {showMenu ? (
            <SmallCloseIcon
              cursor="pointer"
              color="#ccc"
              sx={{ _hover: { color: "white" } }}
              onMouseOver={() => setBottomTooltip("Close settings")}
              onMouseOut={() => setBottomTooltip(undefined)}
              onClick={() => setShowMenu(false)}
            />
          ) : (
            <SettingsIcon
              cursor="pointer"
              color="#ccc"
              sx={{ _hover: { color: "white" } }}
              onMouseOver={() => setBottomTooltip("Settings")}
              onMouseOut={() => setBottomTooltip(undefined)}
              onClick={() => setShowMenu(true)}
            />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
