import {createContext, useReducer} from 'react'

export const UserdataContext = createContext()

export const userdataReducer = (state, action) => {
    switch (action.type) {
      case 'GET_USERDATA':
        return { userdata: action.payload };
      case 'UPDATE_USERDATA':
        
        const updatedUserdata = {
          ...state.userdata,
          ...Object.fromEntries(
            Object.entries(action.payload).filter(([key, value]) => value !== '')
          ),
        };
  
        return { userdata: { ...state.userdata, ...updatedUserdata } };
      default:
        return state;
    }
  };

export const UserdataContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(userdataReducer, {
        userdata:null
    })

    return (
        <UserdataContext.Provider value={{...state, dispatch}}>
            {children}
        </UserdataContext.Provider>
    )
}