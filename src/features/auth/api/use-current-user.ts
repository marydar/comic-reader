import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";

import React, { use } from 'react'

export const useCurrentUser = () => {
    const data = useQuery(api.users.currentUser)
    return {
        data,
        isLoading: data === undefined,
    }
}
