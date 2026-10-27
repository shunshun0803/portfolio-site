import { lazy, Suspense, type ComponentProps } from 'react';

// three.js を含むので、サムネイル画像のない作品が表示されるときだけ読み込む
const ProjectThumbnail = lazy(() =>
  import('./ProjectThumbnail').then((m) => ({ default: m.ProjectThumbnail })),
);

export function LazyProjectThumbnail(props: ComponentProps<typeof ProjectThumbnail>) {
  return (
    <Suspense fallback={<div className="w-full h-full" style={{ background: '#0d0d16' }} />}>
      <ProjectThumbnail {...props} />
    </Suspense>
  );
}
