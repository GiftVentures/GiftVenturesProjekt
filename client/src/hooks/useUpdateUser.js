import { useUserdataContext } from "./useUserdataContext";
import { useState } from "react";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useUserdataContext();

  const updateUser = async (
    firstName,
    secondName,
    email,
    mobile,
    password,
    birthDate,
    placeOfBirth,
    address
  ) => {
    setError(null);
    setIsLoading(false);
  };
};
