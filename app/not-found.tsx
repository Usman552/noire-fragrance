import Link from "next/link";
import { photos } from "@/lib/assets";
import { Photo } from "@/components/ui/Photo";

export default function NotFound() {
  return (
    <div className="theme-dark not-found">
      <Photo photo={photos.smokeWisp} sizes="(min-width: 900px) 40vw, 100vw" className="not-found__photo" />
      <div className="not-found__copy">
        <p className="label label--rule">404</p>
        <h1 className="display">
          This page has <em>evaporated.</em>
        </h1>
        <p className="lede">The page you were looking for doesn’t exist.</p>
        <div>
          <Link href="/" className="btn">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
