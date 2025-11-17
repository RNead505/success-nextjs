# Bulk Staff Operations

## Overview

The Bulk Staff Operations system allows administrators to perform actions on multiple staff members simultaneously, including role updates, activations, deactivations, and content transfers between team members.

## Features

### 1. Bulk Assignment Operations

Perform actions on multiple staff members at once:

- **Update Roles**: Change the role of multiple staff members simultaneously
- **Activate Accounts**: Enable multiple staff accounts in one action
- **Deactivate Accounts**: Disable multiple staff accounts in one action

### 2. Content Transfer

Transfer content ownership between staff members:

- **All Content**: Transfer all editorial calendar items and posts from one staff member to another
- **Pending Only**: Transfer only draft and in-progress items
- **Selected Content**: Transfer specific content items (requires content IDs)

## API Endpoints

### Bulk Assign

```
POST /api/admin/staff/bulk-assign
```

**Request Body:**
```json
{
  "userIds": ["user-id-1", "user-id-2"],
  "action": "UPDATE_ROLE | ACTIVATE | DEACTIVATE",
  "newRole": "SUPER_ADMIN | ADMIN | EDITOR | AUTHOR" // Only required for UPDATE_ROLE
}
```

**Response:**
```json
{
  "success": true,
  "bulkActionId": "bulk-action-id",
  "processedItems": 2,
  "totalItems": 2,
  "errors": [],
  "status": "COMPLETED | FAILED"
}
```

**Actions:**

1. **UPDATE_ROLE**: Change role of selected staff members
   - Requires `newRole` parameter
   - Only SUPER_ADMIN can assign SUPER_ADMIN role
   - Prevents removing last SUPER_ADMIN

2. **ACTIVATE**: Enable email verification for selected staff
   - Sets `emailVerified: true`

3. **DEACTIVATE**: Disable email verification for selected staff
   - Sets `emailVerified: false`
   - Prevents deactivating SUPER_ADMIN accounts

### Bulk Transfer

```
POST /api/admin/staff/bulk-transfer
```

**Request Body:**
```json
{
  "fromUserId": "source-user-id",
  "toUserId": "destination-user-id",
  "transferType": "ALL_CONTENT | PENDING_ONLY | SELECTED_CONTENT",
  "contentIds": ["content-id-1", "content-id-2"] // Only required for SELECTED_CONTENT
}
```

**Response:**
```json
{
  "success": true,
  "bulkActionId": "bulk-action-id",
  "fromUser": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "toUser": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  },
  "transferType": "ALL_CONTENT",
  "processedItems": 15,
  "totalItems": 15,
  "errors": [],
  "status": "COMPLETED"
}
```

**Transfer Types:**

1. **ALL_CONTENT**:
   - Transfers all editorial calendar items
   - Transfers all posts
   - Maintains revision history

2. **PENDING_ONLY**:
   - Transfers editorial items with status: IDEA, ASSIGNED, IN_PROGRESS, DRAFT
   - Transfers posts with status: DRAFT
   - Preserves published content with original author

3. **SELECTED_CONTENT**:
   - Transfers only specified content items
   - Requires `contentIds` array
   - Validates each item belongs to source user

## UI Components

### Staff Management Page

Location: `/admin/staff`

**Features:**
- Overview of all staff members
- Stats by role (Super Admins, Admins, Editors, Authors)
- Staff list with:
  - Name, email, role
  - Active/inactive status
  - Post count
  - Join date and last login
- Quick actions for each staff member
- Access to bulk operations

### Bulk Staff Operations Component

Location: `components/admin/BulkStaffOperations.tsx`

**Tabs:**

1. **Bulk Assign Tab**:
   - Select action dropdown (Update Role, Activate, Deactivate)
   - Staff selection with checkboxes
   - Select all functionality
   - Shows selected count
   - Apply button

2. **Transfer Content Tab**:
   - Source user dropdown
   - Destination user dropdown
   - Transfer type selector
   - Information panel with transfer details
   - Transfer button

## Security & Permissions

### Access Control

- **SUPER_ADMIN**: Full access to all operations
- **ADMIN**: Access to all operations except creating SUPER_ADMINs
- **EDITOR**: No access to bulk operations
- **AUTHOR**: No access to bulk operations

### Safety Features

1. **Last SUPER_ADMIN Protection**:
   - Cannot change role of last SUPER_ADMIN
   - System always requires at least one SUPER_ADMIN

2. **SUPER_ADMIN Deactivation Prevention**:
   - Cannot deactivate SUPER_ADMIN accounts
   - Ensures system always has active administrators

3. **Role Assignment Restrictions**:
   - Only SUPER_ADMIN can assign SUPER_ADMIN role
   - Prevents privilege escalation

4. **Content Validation**:
   - Validates source user owns content before transfer
   - Prevents unauthorized content transfers

## Audit Trail

All bulk operations are logged in the `activity_logs` table:

- Operation timestamp
- Performing user
- Action type
- Affected users/content
- Success/failure status
- Error details

Each bulk operation also creates a record in `bulk_actions` table:
- Unique bulk action ID
- Processing status
- Items processed vs total
- Errors encountered
- Start and completion timestamps

## Use Cases

### 1. Team Reorganization

Transfer all content from a departing staff member to their replacement:

1. Go to Staff Management
2. Click "Bulk Operations"
3. Select "Transfer Content" tab
4. Choose departing member as source
5. Choose replacement as destination
6. Select "All Content"
7. Click "Transfer Content"

### 2. Role Updates

Promote multiple editors to admin:

1. Go to Staff Management
2. Click "Bulk Operations"
3. Select "Bulk Assign" tab
4. Choose "Update Role" action
5. Select new role: "Admin"
6. Check all editors to promote
7. Click "Apply Bulk Action"

### 3. Staff Onboarding

Activate multiple new staff accounts at once:

1. Go to Staff Management
2. Click "Bulk Operations"
3. Select "Bulk Assign" tab
4. Choose "Activate Accounts" action
5. Check all new staff members
6. Click "Apply Bulk Action"

### 4. Temporary Suspension

Deactivate multiple staff accounts:

1. Go to Staff Management
2. Click "Bulk Operations"
3. Select "Bulk Assign" tab
4. Choose "Deactivate Accounts" action
5. Check all staff to suspend
6. Click "Apply Bulk Action"

## Database Schema

### bulk_actions Table

```prisma
model bulk_actions {
  id             String     @id
  userId         String
  action         String
  entity         String
  entityIds      String[]
  status         BulkStatus @default(PENDING)
  totalItems     Int
  processedItems Int        @default(0)
  errors         String[]   @default([])
  startedAt      DateTime?
  completedAt    DateTime?
  createdAt      DateTime   @default(now())
  users          users      @relation(fields: [userId], references: [id])
}

enum BulkStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

## Error Handling

### Common Errors

1. **User Not Found**:
   - Error: "User {userId} not found"
   - Action: Skips user, continues processing

2. **Last SUPER_ADMIN**:
   - Error: "Cannot change role of last SUPER_ADMIN: {email}"
   - Action: Skips user, continues processing

3. **Content Not Found**:
   - Error: "Content item {contentId} not found"
   - Action: Skips item, continues processing

4. **Unauthorized Content**:
   - Error: "Item {contentId} is not assigned to source user"
   - Action: Skips item, continues processing

### Partial Success

Bulk operations can complete partially:
- `status: COMPLETED` with non-empty `errors` array
- `processedItems` shows successful count
- `errors` array lists all failures

## Performance Considerations

1. **Large Batch Processing**:
   - Operations process items sequentially
   - Consider breaking very large batches (>100 items) into smaller groups

2. **Content Transfer**:
   - ALL_CONTENT can be time-intensive for prolific authors
   - Consider using PENDING_ONLY for active authors
   - Use SELECTED_CONTENT for targeted transfers

3. **Database Load**:
   - Each operation logs to activity_logs
   - Each bulk operation creates audit record
   - Monitor database performance during large operations

## Future Enhancements

Potential improvements:

1. **Background Processing**: Move large operations to queue
2. **Progress Tracking**: Real-time progress updates via WebSocket
3. **Scheduled Operations**: Schedule bulk operations for off-peak hours
4. **Dry Run Mode**: Preview operation results before executing
5. **Undo Capability**: Rollback bulk operations
6. **Export/Import**: Bulk operations via CSV
7. **Custom Filters**: Complex staff selection criteria
8. **Notification System**: Email notifications for completed operations

## Testing

To test bulk operations:

1. **Local Development**:
   ```bash
   npm run dev
   ```
   Navigate to http://localhost:3000/admin/staff

2. **API Testing**:
   ```bash
   # Bulk assign test
   curl -X POST http://localhost:3000/api/admin/staff/bulk-assign \
     -H "Content-Type: application/json" \
     -d '{"userIds": ["id1", "id2"], "action": "ACTIVATE"}'

   # Bulk transfer test
   curl -X POST http://localhost:3000/api/admin/staff/bulk-transfer \
     -H "Content-Type: application/json" \
     -d '{"fromUserId": "id1", "toUserId": "id2", "transferType": "PENDING_ONLY"}'
   ```

3. **Test Scenarios**:
   - Create 5+ test staff accounts
   - Assign content to various staff
   - Test each bulk operation type
   - Verify audit logs
   - Check error handling

## Support

For issues or questions:
- Check activity logs at `/admin/activity-log`
- Review bulk action details in database
- Contact system administrator
