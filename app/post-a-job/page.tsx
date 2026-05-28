import type { Metadata } from "next";
import PostAJobClient from "./PostAJobClient";

export const metadata: Metadata = {
  title: "Post a Job – Hire Top US Talent | Jobnique",
  description: "Advertise your job vacancy on Jobnique and connect with qualified candidates across the US. Free to post, pay per application, or featured listing.",
  alternates: { canonical: "https://www.jobnique.com/post-a-job" },
};

export default function PostAJobPage() {
  return <PostAJobClient />;
}
