module.exports = {
  publishers: [
    {
      name: "@electron-forge/publisher-github",
      config: {
        repository: {
          owner: "cpetzold",
          name: "wa-weapon-tracker",
        },
        prerelease: true,
      },
    },
  ],
};
