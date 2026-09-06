export interface SaveBookingRoomInput {
  roomId?: number;
  room_id?: number;
  planId?: number;
  plan_id?: number;
  adults?: number;
  quantity?: number;
  qty?: number;
}

export interface SaveBookingRoomPayload {
  room_id: number;
  plan_id: number;
  adults: number;
  children: number;
  qty: number;
}

export function buildSaveBookingRoomsPayload(
  roomsList: SaveBookingRoomInput[],
  totalChildren: number,
): SaveBookingRoomPayload[] {
  const expandedRooms: SaveBookingRoomPayload[] = [];

  roomsList.forEach((room) => {
    const qty = Number(room.quantity || room.qty || 1);
    for (let i = 0; i < qty; i++) {
      expandedRooms.push({
        room_id: Number(room.roomId || room.room_id),
        plan_id: Number(room.planId || room.plan_id || 1),
        adults: Number(room.adults || 1),
        children: 0,
        qty: 1,
      });
    }
  });

  for (let i = 0; i < Math.min(totalChildren, expandedRooms.length); i++) {
    expandedRooms[i].children = 1;
  }

  const groupedRooms: SaveBookingRoomPayload[] = [];
  expandedRooms.forEach((item) => {
    const match = groupedRooms.find(
      (g) =>
        g.room_id === item.room_id &&
        g.plan_id === item.plan_id &&
        g.adults === item.adults &&
        g.children === item.children,
    );
    if (match) {
      match.qty += 1;
    } else {
      groupedRooms.push({ ...item });
    }
  });

  return groupedRooms;
}
