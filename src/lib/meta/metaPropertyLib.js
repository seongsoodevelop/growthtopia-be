export const generateStarterPropertyData = () => {
  const data = {
    nextElementId: 1,
    elements: [
      {
        id: 0,
        type: 0,
        code: 0,
        position_x: 0,
        position_y: -0.5,
        position_z: 0,
      },
    ],
    spawnPoint: [0, 0, 0],
  };

  return JSON.stringify(data);
};
