import { Actions } from "./enums/GasoleoActions";
import { GasoleoStateInterface } from "./interfaces/GasoleoState";

export const gasoleoReducer = (
  state: GasoleoStateInterface,
  action: { type: Actions; payload: any }
) => {
  switch (action.type) {
    case Actions.UPDATE_COD_PROV: {
      return {
        ...state,
        codProv: action.payload
      }
    }
    case Actions.UPDATE_COD_TOWN: {
      return {
        ...state,
        codTown: action.payload
      }
    }

    case Actions.UPDATE_DATA: {
      return {
        ...state,
        data: action.payload
      }
    }

    case Actions.UPDATE_DATA_TO_SHARE: {
      return {
        ...state,
        dataToShare: action.payload
      }
    }

    case Actions.UPDATE_FILTERED_TOWNS: {
      return {
        ...state,
        filteredTowns: action.payload
      }
    }

    case Actions.UPDATE_ORDER_VALUE: {
      return {
        ...state,
        selectedOrderValue: action.payload
      }
    }

    default: {
      return {...state};
    }
  }
};
