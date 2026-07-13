import { ExploreMenu } from "./explore-menu";
import { SuggestedPeople } from "./suggested-people";
import { Events } from "./events";

export function LeftSidebar() {
  return (
    <div className="space-y-4">
      <ExploreMenu />
      <SuggestedPeople />
      <Events />
    </div>
  );
}
