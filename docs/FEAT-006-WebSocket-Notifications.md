# FEAT-006: WebSocket Real-Time Notifications

## Overview

Implement real-time WebSocket notifications using Socket.io to replace the current polling-based approach (30-60s delay) with instant notification delivery.

## Current State

### What Exists

- Socket.io `4.8.1` installed in backend (not initialized)
- Firebase FCM push notifications working
- Notification model and API endpoints complete
- NotificationBell component with polling (30-60s intervals)
- useNotifications hook using React Query

### Problems with Current Approach

- 30-60 second delay for notification discovery
- Unnecessary API calls when no new notifications
- No instant feedback for user actions
- High server load from constant polling

## Implementation Plan

### Phase 1: Backend Socket.io Setup

#### 1.1 Initialize Socket.io Server

**File:** `backend/src/config/socket.ts`

```typescript
// Socket.io configuration and initialization
// - Create Socket.io server attached to Express
// - Configure CORS for frontend access
// - Export io instance for use in other modules
```

#### 1.2 Socket Authentication Middleware

**File:** `backend/src/middlewares/socket.auth.ts`

```typescript
// JWT authentication for socket connections
// - Verify token from handshake auth
// - Attach user to socket instance
// - Handle authentication errors
```

#### 1.3 Socket Event Handlers

**File:** `backend/src/sockets/notification.socket.ts`

```typescript
// Notification-related socket events
// Events:
// - 'connection' - Join user's private room
// - 'notification:read' - Mark notification read
// - 'notification:read-all' - Mark all as read
// - 'notification:delete' - Delete notification
// - 'disconnect' - Cleanup
```

#### 1.4 Update Server Entry Point

**File:** `backend/src/server.ts`

- Initialize Socket.io with HTTP server
- Import and setup socket handlers
- Configure socket namespaces

### Phase 2: Backend Notification Service Update

#### 2.1 Emit Socket Events

**File:** `backend/src/services/notification.service.ts`

Update to emit socket events when:

- New notification created → `notification:new`
- Notification read → `notification:updated`
- Notification deleted → `notification:deleted`
- Unread count changed → `notification:count`

### Phase 3: Frontend Socket.io Integration

#### 3.1 Socket Client Setup

**File:** `frontend/src/lib/socket.ts`

```typescript
// Socket.io client configuration
// - Connect with JWT auth
// - Auto-reconnect on disconnect
// - Export socket instance
```

#### 3.2 Socket Context/Provider

**File:** `frontend/src/providers/SocketProvider.tsx`

```typescript
// React context for socket connection
// - Manage connection state
// - Provide socket to components
// - Handle reconnection logic
```

#### 3.3 Update useNotifications Hook

**File:** `frontend/src/hooks/useNotifications.ts`

- Add socket event listeners
- Update React Query cache on socket events
- Remove/reduce polling frequency
- Handle real-time updates

### Phase 4: Frontend Component Updates

#### 4.1 Update NotificationBell

**File:** `frontend/src/components/common/NotificationBell.tsx`

- Listen for real-time notifications
- Show instant badge updates
- Animate new notification indicator

## Socket Events Schema

### Server → Client Events

| Event                  | Payload                           | Description                 |
| ---------------------- | --------------------------------- | --------------------------- |
| `notification:new`     | `{ notification: Notification }`  | New notification received   |
| `notification:updated` | `{ id: string, isRead: boolean }` | Notification status changed |
| `notification:deleted` | `{ id: string }`                  | Notification removed        |
| `notification:count`   | `{ count: number }`               | Unread count update         |

### Client → Server Events

| Event                   | Payload          | Description         |
| ----------------------- | ---------------- | ------------------- |
| `notification:read`     | `{ id: string }` | Mark single as read |
| `notification:read-all` | `{}`             | Mark all as read    |
| `notification:delete`   | `{ id: string }` | Delete notification |

## Room Strategy

- Each authenticated user joins a private room: `user:{userId}`
- Admin broadcast room: `admins`
- Global broadcast room: `all`

## Security Considerations

1. JWT authentication on socket connection
2. Room validation - users can only join their own room
3. Event authorization - verify user owns notification
4. Rate limiting on socket events
5. Connection timeout handling

## Testing Strategy

### Backend Tests

- Socket connection with valid/invalid JWT
- Event handler unit tests
- Room joining/leaving
- Broadcast functionality

### Frontend Tests

- Socket hook tests
- Real-time update rendering
- Reconnection behavior
- Error handling

## Files to Create/Modify

### New Files

- `backend/src/config/socket.ts`
- `backend/src/middlewares/socket.auth.ts`
- `backend/src/sockets/notification.socket.ts`
- `backend/src/sockets/index.ts`
- `frontend/src/lib/socket.ts`
- `frontend/src/providers/SocketProvider.tsx`

### Modified Files

- `backend/src/server.ts`
- `backend/src/services/notification.service.ts`
- `frontend/src/hooks/useNotifications.ts`
- `frontend/src/components/common/NotificationBell.tsx`
- `frontend/src/app/[locale]/layout.tsx` (add SocketProvider)

## Environment Variables

### Backend (existing)

- No new variables needed (uses existing JWT_SECRET)

### Frontend

- `NEXT_PUBLIC_SOCKET_URL` - Socket server URL (defaults to API URL)

## Rollback Plan

If issues occur:

1. Remove SocketProvider from layout
2. Revert useNotifications to polling-only
3. Socket.io server can remain initialized (no harm)

## Success Metrics

- Notification delivery < 1 second (vs current 30-60s)
- Reduced API calls (no polling when connected)
- Instant badge updates
- Real-time notification read status sync

## How to Use After Implementation

1. User logs in → Socket connects automatically
2. New notification → Badge updates instantly
3. Mark as read in one tab → Updates in all tabs
4. Admin sends notification → User sees immediately
5. Connection lost → Auto-reconnect with backoff
