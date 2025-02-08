import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SaturingModule = buildModule("SaturingModule", (m) => {
  const Saturing = m.contract("Saturing");
  return { Saturing };
});

export default SaturingModule;
