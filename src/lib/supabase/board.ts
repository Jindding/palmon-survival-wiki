import { getSupabase } from "./client";
import { hashPassword } from "./anon";

export type EmojiKey = "👍" | "❤️" | "😂" | "😮" | "🔥";

export const EMOJI_LIST: EmojiKey[] = ["👍", "❤️", "😂", "😮", "🔥"];

export const EMOJI_LABEL: Record<EmojiKey, string> = {
  "👍": "좋아요",
  "❤️": "사랑해요",
  "😂": "웃겨요",
  "😮": "놀라워요",
  "🔥": "대박",
};

export interface Post {
  id: string;
  nickname: string;
  password_hash: string;
  title: string;
  content: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PostWithStats extends Post {
  comment_count: number;
  reaction_count: number;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  nickname: string;
  password_hash: string;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Reaction {
  id: string;
  target_type: "post" | "comment";
  target_id: string;
  emoji: EmojiKey;
  author_key: string;
  created_at: string;
}

// ========== Posts ==========

export async function listPosts(limit = 30, offset = 0): Promise<PostWithStats[]> {
  const { data, error } = await getSupabase()
    .from("posts_with_stats")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) {
    console.error("[board] listPosts failed:", error);
    if (error.code === "42P01" || /posts_with_stats/i.test(error.message)) {
      console.warn("[board] posts_with_stats 뷰가 없어 posts로 폴백합니다.");
      const fallback = await getSupabase()
        .from("posts")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);
      if (fallback.error) throw fallback.error;
      return (fallback.data ?? []).map((p) => ({
        ...(p as Post),
        comment_count: 0,
        reaction_count: 0,
      }));
    }
    throw error;
  }
  return (data ?? []) as PostWithStats[];
}

export async function getPost(id: string): Promise<Post | null> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as Post;
}

export async function createPost(input: {
  nickname: string;
  password: string;
  title: string;
  content: string;
}): Promise<Post> {
  const password_hash = await hashPassword(input.password);
  const { data, error } = await getSupabase()
    .from("posts")
    .insert({
      nickname: input.nickname,
      password_hash,
      title: input.title,
      content: input.content,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Post;
}

export async function deletePost(id: string, password: string): Promise<boolean> {
  const password_hash = await hashPassword(password);
  const { data, error } = await getSupabase()
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("password_hash", password_hash)
    .select("id");
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export async function incrementPostView(id: string): Promise<void> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("posts")
    .select("view_count")
    .eq("id", id)
    .single();
  if (!data) return;
  await supabase
    .from("posts")
    .update({ view_count: (data.view_count ?? 0) + 1 })
    .eq("id", id);
}

// ========== Comments ==========

export async function listComments(postId: string): Promise<Comment[]> {
  const { data, error } = await getSupabase()
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Comment[];
}

export async function createComment(input: {
  post_id: string;
  parent_id: string | null;
  nickname: string;
  password: string;
  content: string;
}): Promise<Comment> {
  const password_hash = await hashPassword(input.password);
  const { data, error } = await getSupabase()
    .from("comments")
    .insert({
      post_id: input.post_id,
      parent_id: input.parent_id,
      nickname: input.nickname,
      password_hash,
      content: input.content,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Comment;
}

export async function deleteComment(id: string, password: string): Promise<boolean> {
  const password_hash = await hashPassword(password);
  const { data, error } = await getSupabase()
    .from("comments")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("password_hash", password_hash)
    .select("id");
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

// ========== Reactions ==========

export async function listReactions(
  targetType: "post" | "comment",
  targetIds: string[],
): Promise<Reaction[]> {
  if (targetIds.length === 0) return [];
  const { data, error } = await getSupabase()
    .from("reactions")
    .select("*")
    .eq("target_type", targetType)
    .in("target_id", targetIds);
  if (error) throw error;
  return (data ?? []) as Reaction[];
}

export async function toggleReaction(input: {
  target_type: "post" | "comment";
  target_id: string;
  emoji: EmojiKey;
  author_key: string;
}): Promise<"added" | "removed"> {
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from("reactions")
    .select("id")
    .eq("target_type", input.target_type)
    .eq("target_id", input.target_id)
    .eq("emoji", input.emoji)
    .eq("author_key", input.author_key)
    .maybeSingle();
  if (existing) {
    const { error } = await supabase.from("reactions").delete().eq("id", existing.id);
    if (error) throw error;
    return "removed";
  }
  const { error } = await supabase.from("reactions").insert(input);
  if (error) throw error;
  return "added";
}

// ========== Realtime ==========

export function subscribeToPostChanges(handler: () => void) {
  const supabase = getSupabase();
  const channel = supabase
    .channel("public:posts")
    .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, handler)
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToPostDetail(postId: string, handler: () => void) {
  const supabase = getSupabase();
  const channel = supabase
    .channel(`public:post-${postId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "comments", filter: `post_id=eq.${postId}` },
      handler,
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "reactions" },
      handler,
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}
