"use client";

import { useState } from "react";
import { Balance } from "../Balance";
import { AddressInfoDropdown } from "./AddressInfoDropdown";
import { AddressQRCodeModal } from "./AddressQRCodeModal";
import { WalletSelector } from "./WalletSelector";
import { WrongNetworkDropdown } from "./WrongNetworkDropdown";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useTargetNetwork } from "~~/hooks/scaffold-move/useTargetNetwork";
import { getBlockExplorerAddressLink } from "~~/utils/scaffold-move";

export const CustomConnectButton = () => {
  const { targetNetwork } = useTargetNetwork();
  const [show, setShow] = useState(false);

  const { account, connected, network } = useWallet();

  const blockExplorerAddressLink = account ? getBlockExplorerAddressLink(targetNetwork, account?.address) : undefined;

  return (
    <>
      {!connected ? (
        <WalletSelector />
      ) : Number(network?.chainId) !== targetNetwork.id ? (
        <WrongNetworkDropdown />
      ) : (
        <>
          <div className="flex flex-col items-center mr-1">
            <Balance address={account?.address as string} />
            <span className="text-xs">{targetNetwork ? targetNetwork.name?.split(" ")?.[1] : "Loading..."}</span>
          </div>
          <AddressInfoDropdown
            address={account?.address || ""}
            // ensAvatar={""} // Update this with ENS Avatar if available
            blockExplorerAddressLink={blockExplorerAddressLink}
            setShow={setShow}
          />
          {show && <AddressQRCodeModal  setShow={setShow} address={account?.address || ""} modalId="qrcode-modal" />}
        </>
      )}
    </>
  );
};
