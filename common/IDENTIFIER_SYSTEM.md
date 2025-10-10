# Identifier System

This document describes the identifier system added to the CommonLayout component.

## Overview

The identifier system provides a way to uniquely identify users and terminals:
- **Logged-in users**: Identified by their Google User ID
- **Anonymous users**: Identified by a Terminal ID (UUID stored in localStorage)

## Components

### TerminalIdInitializer

**Location**: `common/components/utils/TerminalIdInitializer.tsx`

A client component that automatically initializes the terminal ID when the CommonLayout is mounted. This component:
- Runs on the client side (`'use client'`)
- Calls `TerminalUtil.getTerminalId()` on component mount
- Returns null (no UI elements)
- Ensures terminal ID is generated and stored in localStorage

### IdentifierUtil (Server)

**Location**: `common/utils/IdentifierUtil.server.ts`

Server-side utility for getting the user identifier:
- `getIdentifier()`: Returns User ID (from AuthData) if logged in, null otherwise
- Gets GoogleUserId from session, then looks up AuthData to get the actual UserID
- Uses `SessionUtil` to check session and `SimpleAuthService` to get user data

### IdentifierUtil (Client)

**Location**: `common/utils/IdentifierUtil.client.ts`

Client-side utility for getting the user or terminal identifier:
- `getIdentifier()`: Returns User ID if logged in, Terminal ID if not
  - First tries to get User ID from `/api/identifier` endpoint
  - Falls back to Terminal ID if User ID is not available
- `getTerminalId()`: Returns Terminal ID regardless of login status

## API Endpoints

### GET /api/identifier

**Location**: `common/routes/identifier/route.ts`

Returns the current identifier information:

**Response**:
```json
{
  "success": true,
  "data": {
    "identifier": "user-id-or-null",
    "type": "user" | "none"
  }
}
```

## Usage Examples

### Client-side

```typescript
import IdentifierUtil from '@client-common/utils/IdentifierUtil.client';

// Get identifier (User ID or Terminal ID)
const identifier = await IdentifierUtil.getIdentifier();

// Get only Terminal ID
const terminalId = await IdentifierUtil.getTerminalId();
```

### Server-side

```typescript
import IdentifierUtil from '@client-common/utils/IdentifierUtil.server';

// Get User ID (null if not logged in)
const userId = await IdentifierUtil.getIdentifier();
```

## Integration

The TerminalIdInitializer is automatically integrated into CommonLayout, so any app using CommonLayout will have:
1. Automatic terminal ID generation on first visit
2. Terminal ID persistence in localStorage
3. Ability to retrieve user/terminal identifiers via IdentifierUtil

## Testing

A test page is available at `/sample/identifier` in the sample application that demonstrates:
- Current identifier value
- Terminal ID value
- Explanation of the behavior

## Documentation

See the following for more details:
- `docs/design.md` - Architecture and design details
- `docs/HowToUse.md` - Usage instructions and examples
