import type { Metadata } from "next";
import { PostView } from "./PostView";

export const metadata: Metadata = {
  title: "게시글",
};

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl mx-auto">
      <PostView id={params.id} />
    </div>
  );
}
