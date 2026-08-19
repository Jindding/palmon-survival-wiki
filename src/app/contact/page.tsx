import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "문의하기",
  description: "팰몬 허브 운영자에게 제목과 내용을 담아 문의를 남길 수 있어요.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        emoji="✉️"
        title="문의하기"
        description="오탈자 · 정보 수정 요청 · 제휴 등 뭐든 편하게 남겨주세요. 아래 폼을 작성하시면 운영자에게 바로 전달됩니다."
      />
      <ContactForm />
    </div>
  );
}
