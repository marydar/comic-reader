// import { useQuery } from "convex/react";
// import { api } from "../../../../convex/_generated/api";
// import { Id } from "../../../../convex/_generated/dataModel";
// import { usePaginatedQuery } from "convex/react";

// const BATCH_SIZE = 10;
// interface useGetChaptersImagesProps{
//     chapterId?: Id<"chapters">;
// }

// export type GetChaptersImagesReturnType = typeof api.chapterImage.getChapterImages._returnType["page"]  
// export const useGetChaptersImages=({chapterId}:useGetChaptersImagesProps)=>{

//     const { results, status, loadMore } = usePaginatedQuery(
//         api.chapterImage.getChapterImages,
//     { 
//         chapterId:chapterId,
//      },
//     { initialNumItems: BATCH_SIZE },
//   );
//     return {
//         results,
//         status,
//         loadMore: () => loadMore(BATCH_SIZE),
//         };

// }


import { usePaginatedQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const BATCH_SIZE = 1;

interface useGetChaptersImagesProps {
  chapterId?: Id<"chapters">;
}

export type GetChaptersImagesReturnType =
  typeof api.chapterImage.getChapterImages._returnType["page"];

export const useGetChaptersImages = ({ chapterId }: useGetChaptersImagesProps) => {
  // Only enable the query if we actually have a chapterId
  const enabled = !!chapterId;

  const { results, status, loadMore } = usePaginatedQuery(
    api.chapterImage.getChapterImages,
    enabled ? { chapterId } : "skip",
    { initialNumItems: BATCH_SIZE }
  );

  return {
    results: results ?? [],
    status: enabled ? status : "idle", // optional: custom status when skipped
    loadMore: () => loadMore(BATCH_SIZE),

  };
};
