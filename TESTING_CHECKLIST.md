# Approval System Testing Checklist

## ✅ Prerequisites Completed
- [x] Database migration run successfully
- [x] Prisma client generated
- [x] Missing UI components (Tabs, Badge) created/verified
- [x] Development server started
- [x] Authentication system working (admin@warehouse.com / test123)

## 🧪 Test Cases

### 1. User Product Submission Workflow
**Test Steps:**
1. Login as regular user (test@example.com / test123)
2. Navigate to Products page
3. Click "Add New Product" button
4. Fill out product form with:
   - SKU: TEST-001
   - Name: Test Product
   - Category: Select existing category
   - Cost Price: 10.00
   - Selling Price: 15.00
   - Quantity: 5
5. Submit form
6. Verify success toast appears
7. Check that product doesn't appear in main products list

**Expected Results:**
- ✅ Form opens correctly
- ✅ All fields are editable
- ✅ Categories and suppliers load from API
- ✅ Validation works (required fields)
- ✅ Success message on submission
- ✅ Product goes to pending approval (not live)

### 2. User Category Submission Workflow
**Test Steps:**
1. Navigate to Categories page
2. Click "Add New Category" button
3. Fill out category form:
   - Name: Test Category
   - Description: This is a test category
4. Submit form
5. Verify success toast appears
6. Check that category doesn't appear in main categories list

**Expected Results:**
- ✅ Form opens correctly
- ✅ All fields are editable
- ✅ Validation works (required name field)
- ✅ Success message on submission
- ✅ Category goes to pending approval (not live)

### 3. Admin Access and Navigation
**Test Steps:**
1. Login as admin (admin@warehouse.com / test123)
2. Check sidebar navigation
3. Verify "Pending Approvals" link is visible
4. Click on "Pending Approvals"
5. Verify page loads correctly

**Expected Results:**
- ✅ Admin sees additional navigation options
- ✅ "Pending Approvals" link visible in sidebar
- ✅ Page loads without errors
- ✅ Tabs for Products and Categories visible

### 4. Admin Product Approval
**Test Steps:**
1. Navigate to Pending Approvals page
2. Switch to Products tab
3. Verify submitted product appears in list
4. Click "Approve" button
5. Add optional approval notes
6. Confirm approval
7. Check that product now appears in main Products page

**Expected Results:**
- ✅ Pending product visible in list
- ✅ Product details displayed correctly
- ✅ Approval dialog opens
- ✅ Can add notes
- ✅ Success message on approval
- ✅ Product moves to main database
- ✅ Product visible in Products page

### 5. Admin Product Rejection
**Test Steps:**
1. Submit another test product as user
2. Login as admin
3. Navigate to Pending Approvals
4. Click "Reject" on the product
5. Add rejection reason (required)
6. Confirm rejection
7. Verify product status updated

**Expected Results:**
- ✅ Rejection dialog opens
- ✅ Rejection reason is required
- ✅ Success message on rejection
- ✅ Product status shows as "Rejected"
- ✅ Product does NOT appear in main Products page

### 6. Admin Category Approval/Rejection
**Test Steps:**
1. Switch to Categories tab in Pending Approvals
2. Test both approval and rejection workflows
3. Verify categories behave same as products

**Expected Results:**
- ✅ Same workflow as products
- ✅ Approved categories appear in main Categories page
- ✅ Rejected categories remain in pending with status

### 7. Error Handling and Validation
**Test Steps:**
1. Try submitting forms with missing required fields
2. Try submitting duplicate SKUs/category names
3. Test with invalid data types
4. Test unauthorized access (non-admin accessing approval endpoints)

**Expected Results:**
- ✅ Client-side validation prevents submission
- ✅ Server-side validation returns appropriate errors
- ✅ Error messages are user-friendly
- ✅ Unauthorized requests return 403 errors

### 8. UI/UX Verification
**Test Steps:**
1. Check responsive design on different screen sizes
2. Verify all buttons, forms, and dialogs work correctly
3. Test loading states and animations
4. Verify toast notifications appear and disappear correctly

**Expected Results:**
- ✅ UI is responsive and functional
- ✅ Loading states show during API calls
- ✅ Forms are user-friendly
- ✅ Visual feedback is appropriate

## 🔧 Common Issues and Solutions

### Issue: "Unauthorized" errors
**Solution:** Ensure `credentials: 'include'` is added to all fetch calls

### Issue: Middleware not catching routes
**Solution:** Verify routes are added to middleware config matcher

### Issue: Missing UI components
**Solution:** Install missing Radix UI dependencies and create component files

### Issue: Database connection errors
**Solution:** Ensure .env file has correct DATABASE_URL and migration is run

## 📊 Test Results Summary

**Status:** ✅ Ready for Testing
**Critical Issues:** None identified
**Recommendations:** 
- Test with real data
- Verify performance with multiple submissions
- Test concurrent admin approvals
- Consider adding email notifications for status changes

## 🚀 Deployment Checklist

Before deploying to production:
- [ ] Run all tests in staging environment
- [ ] Verify database migration on production
- [ ] Test with production authentication
- [ ] Verify all environment variables are set
- [ ] Test email notifications (if implemented)
- [ ] Performance testing with load
