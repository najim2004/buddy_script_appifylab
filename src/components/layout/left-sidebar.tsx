import { ExploreMenu } from "./left-sidebar/explore-menu";
import { SuggestedPeople } from "./left-sidebar/suggested-people";
import { Events } from "./left-sidebar/events";

export function LeftSidebar() {
  return (
    <div className="space-y-4">
      <ExploreMenu />
      <SuggestedPeople />
      <Events />
    </div>
  );
}
