import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AwesomeTokenModule = buildModule("AwesomeTokenModule", (m) => {
  const owner = m.getAccount(0);
  const awesomeToken = m.contract("AwesomeToken", [owner]);

  return { awesomeToken };
});

export default AwesomeTokenModule;
