import React from "react";
import { useWeb3React } from "@web3-react/core";

export const withWeb3HOC = (Component) => {
    return (props) => {
        const { account, active, library } = useWeb3React();

        return <Component account = {account} active = {active} library = {library} {...props} />;
    };
};