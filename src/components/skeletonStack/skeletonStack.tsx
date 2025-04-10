import { Skeleton, Stack } from "@mantine/core";

export default function SkeletonStack({size}:{size:number}){
    return <Stack>
        {[...Array(size)].map((_, index) => (
          <Skeleton key={index} height={26} radius="sm" />
        ))}
      </Stack>
}