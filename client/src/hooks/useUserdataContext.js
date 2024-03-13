import { UserdataContext } from "../context/UserdataContext";
import { useContext } from "react";

export const useUserdataContext = () => {
    const context = useContext(UserdataContext)

    if(!context){
        throw Error("useUserdataContext must be inside an UserdataContextProvider")
    }

    return context;
}