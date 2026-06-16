import { PortfolioPage } from "@/components/PortfolioPage";
import { getPublishedProjects } from "@/lib/projects";
import { getSiteContent } from "@/lib/site-content";

export default async function Home() {
  const [projects, siteContent] = await Promise.all([
    getPublishedProjects(),
    getSiteContent(),
  ]);

  return (
    <PortfolioPage
      projects={projects}
      profile={siteContent.profile}
      skillGroups={siteContent.skill_groups}
      experiences={siteContent.experiences}
      contact={siteContent.contact}
    />
  );
}
