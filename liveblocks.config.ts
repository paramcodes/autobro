declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      // cursor: { x: number; y: number };
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Example, a conflict-free list
      // animals: LiveList<string>;
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        color: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: object;

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: object;

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: object;

    // Custom group info set with resolveGroupsInfo, for useGroupInfo
    GroupInfo: object;

    // Custom activities data for custom notification kinds
    ActivitiesData: object;
  }
}

export {};
