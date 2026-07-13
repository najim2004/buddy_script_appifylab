import { FriendRequests } from "./friend-requests";
import { Contacts } from "./contacts";

export function RightSidebar() {
  return (
    <div className="space-y-4">
      <FriendRequests />
      <Contacts />
    </div>
  );
}
