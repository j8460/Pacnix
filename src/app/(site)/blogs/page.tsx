import { PageHero } from "@/components/layout/page-hero";
import { BlogsExplorer } from "@/components/blogs/blogs-explorer";
import { getBlogs } from "@/lib/cms";

export const metadata = {
  title: "Blogs",
  description: "Manufacturing insights, packaging trends, and industrial news from Pacnix India.",
};

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Insights & updates"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blogs" },
        ]}
      />
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <BlogsExplorer posts={blogs} />
        </div>
      </section>
    </>
  );
}
