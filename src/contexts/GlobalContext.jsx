import React, { createContext, useContext, useState } from 'react';

// Define the initial context value
const initialContext = {
  name: '',
  setName: () => {},
};

// Create the context
const GlobalContext = createContext(initialContext);

// Custom hook to use the context
const useGlobalContext = () => useContext(GlobalContext);

export { GlobalContext, useGlobalContext };
