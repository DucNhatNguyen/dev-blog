import { getPostSummaries } from "@/lib/posts";
import HomeClient from "./home-client";

export default function Home() {
  return <HomeClient posts={getPostSummaries()} />;
}
