import { getAlbums } from '@/lib/queries';
import { FadeUp, SlideIn } from '@/components/animations';
import { AlbumDialogGrid } from '@/components/discography/album-dialog-grid';

export default async function DiscographyPage() {
  const albums = await getAlbums();

  return (
    <main className="min-h-screen bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <SlideIn direction="left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">DISCOGRAPHY</h1>
        </SlideIn>
        <FadeUp delay={0.15}>
          <p className="text-center text-gray-300 mb-12">Click any album to listen</p>
        </FadeUp>

        {albums.length > 0 ? (
          <AlbumDialogGrid albums={albums} />
        ) : (
          <FadeUp>
            <p className="text-center text-gray-400 mt-24">No albums yet — check back soon.</p>
          </FadeUp>
        )}
      </div>
    </main>
  );
}
