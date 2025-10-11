# Product and Category Approval System

## Overview
This system allows users to submit new products and categories for admin approval before they are added to the main system. This ensures quality control and prevents unauthorized additions to the inventory.

## Features

### For Regular Users
- **Add New Product Button**: Located on the Products page, opens a comprehensive form
- **Add New Category Button**: Located on the Categories page, opens a simple form
- **Form Validation**: Client-side and server-side validation for all fields
- **Submission Feedback**: Toast notifications for success/error states

### For Admins
- **Approval Dashboard**: New "Pending Approvals" page accessible via sidebar
- **Tabbed Interface**: Separate tabs for products and categories
- **Review Actions**: Approve or reject with optional notes
- **Status Tracking**: Visual status badges (Pending, Approved, Rejected)
- **Detailed Information**: View all submission details before making decisions

## Database Schema

### New Tables
- **PendingProduct**: Stores product submissions awaiting approval
- **PendingCategory**: Stores category submissions awaiting approval

### Key Fields
- `status`: PENDING | APPROVED | REJECTED
- `submittedBy`: User who submitted the request
- `reviewedBy`: Admin who reviewed the request
- `notes`: Admin notes for approval/rejection
- `createdAt`/`updatedAt`: Timestamps

## API Endpoints

### Submission Endpoints
- `POST /api/pending-products` - Submit new product for approval
- `POST /api/pending-categories` - Submit new category for approval

### Admin Review Endpoints
- `GET /api/pending-products` - Fetch all pending products (admin only)
- `GET /api/pending-categories` - Fetch all pending categories (admin only)
- `POST /api/pending-products/[id]/approve` - Approve a product
- `POST /api/pending-products/[id]/reject` - Reject a product
- `POST /api/pending-categories/[id]/approve` - Approve a category
- `POST /api/pending-categories/[id]/reject` - Reject a category

### Supporting Endpoints
- `GET /api/suppliers` - Fetch suppliers for product form

## Workflow

1. **User Submission**:
   - User clicks "Add New Product" or "Add New Category"
   - Fills out the form with required information
   - Submits for approval
   - Receives confirmation toast

2. **Admin Review**:
   - Admin navigates to "Pending Approvals" page
   - Reviews submission details
   - Clicks "Approve" or "Reject"
   - Optionally adds notes (required for rejection)
   - Confirms action

3. **Approval Process**:
   - **Approved**: Item is created in the main database
   - **Rejected**: Item remains in pending state with rejection reason
   - Status is updated and submitter can see the result

## Components

### User-Facing Components
- `NewProductForm.tsx` - Comprehensive product creation form
- `NewCategoryForm.tsx` - Simple category creation form
- Updated `ProductsPageContent.tsx` - Added "Add New Product" button
- Updated `CategoriesPageContent.tsx` - Added "Add New Category" button

### Admin Components
- `ApprovalsPageContent.tsx` - Main approval dashboard with tabs
- Updated sidebar navigation with "Pending Approvals" link

## Security & Authorization

- **JWT Authentication**: All endpoints use existing JWT middleware
- **Role-Based Access**: Admin-only endpoints check for ADMIN role
- **Input Validation**: Zod schemas validate all inputs
- **Error Handling**: Comprehensive error messages and logging

## Usage Instructions

### For Users
1. Navigate to Products or Categories page
2. Click the green "Add New Product" or "Add New Category" button
3. Fill out all required fields (marked with *)
4. Click "Submit for Approval"
5. Wait for admin review

### For Admins
1. Navigate to "Pending Approvals" in the sidebar
2. Switch between Products and Categories tabs
3. Review submission details
4. Click "Approve" (with optional notes) or "Reject" (with required reason)
5. Confirm the action

## Database Migration Required

Before using this system, run the database migration:
```bash
npx prisma migrate dev --name add-pending-approval-tables
npx prisma generate
```

## Future Enhancements

- Email notifications for submission status changes
- Bulk approval/rejection actions
- Advanced filtering and search in approval dashboard
- Audit trail for all approval decisions
- User dashboard to track their submission status
