import { FriendRequests } from "./right-sidebar/friend-requests";
import { Contacts } from "./right-sidebar/contacts";

export function RightSidebar() {
  return (
    <div className="space-y-4">
      <FriendRequests />
      <Contacts />
    </div>
  );
}
