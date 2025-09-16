// import { useQuery } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { Id } from "../../../../convex/_generated/dataModel";
// import { usePaginatedQuery } from "convex/react";

// const BATCH_SIZE = 10;
// interface useGetImagesProps {
//     chapterId: Id<"chapters">;
//     cursor: string;
// }
// export const useGetImageList=({chapterId, cursor}:useGetImagesProps)=>{    
//     return usePaginatedQuery(
//         api.chapterImage.listPaginated,
//     { 
//         chapterId,
//         cursor,
//         pageSize: BATCH_SIZE,
//      },
//     { initialNumItems: BATCH_SIZE },
//   );
//     // return {results};

// }