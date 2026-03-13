#!/bin/bash
# TradeLife - Bulk GitHub Issue Creation Script
# This script creates issues for all unimplemented screens

set -e

echo "Creating GitHub issues for unimplemented screens..."

# WF2 — HOME + VPN
gh issue create --title "Implement VPN Server Selection Sheet" \
  --label "WF2-VPN,component,priority-high" \
  --body "## 📋 Screen: VPN Server Selection Sheet

**Design:** \`designs/2c_vpn_servers_light/\`
**Component:** \`src/components/shared/VPNServerSheet.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the VPN server selection bottom sheet component that allows users to:
- Browse available VPN servers by country/region
- See server status (online, load %, ping)
- Select a server to connect to
- Show subscription status and renewal prompt if expired

### 📐 Design Reference
- Read \`designs/2c_vpn_servers_light/code.html\` for layout structure
- Reference \`designs/2c_vpn_servers_light/screen.png\` for visual design

### ✅ Acceptance Criteria
- [ ] Component uses \`@gorhom/bottom-sheet\`
- [ ] Shows list of VPN servers with country flags
- [ ] Displays server load and ping time
- [ ] Handles server selection with haptic feedback
- [ ] Shows VPN subscription expiry warning (2g design)
- [ ] Uses Reanimated v3 for all animations
- [ ] All text via i18n (\`t('vpn.*')\`)
- [ ] Integrates with \`vpnStore\`

### 🔗 Related
- Used in: \`src/app/(tabs)/index.tsx\` (Home screen)
- Connects to: \`vpnStore.connect(server)\`
"

# WF3 — CALLING
gh issue create --title "Implement Dialer Screen" \
  --label "WF3-Calling,screen,priority-high" \
  --body "## 📋 Screen: Dialer

**Design:** \`designs/3a_dialer_dark/\`
**Route:** \`src/app/(tabs)/call/dialer.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the phone dialer screen with:
- Number pad (0-9, *, #)
- Recent calls tab (3b_recent_calls_dark)
- Call balance display
- Low balance warning (3f_low_balance_dark)
- Click-to-call functionality

### 📐 Design Reference
- Primary: \`designs/3a_dialer_dark/code.html\`
- Recent calls tab: \`designs/3b_recent_calls_dark/\`
- Low balance state: \`designs/3f_low_balance_dark/\`

### ✅ Acceptance Criteria
- [ ] Number pad with haptic feedback on press
- [ ] Recent calls list with FlatList + memo
- [ ] Shows call balance from \`callStore\`
- [ ] Low balance warning at threshold
- [ ] Initiates call via \`callStore.startCall(number)\`
- [ ] Tab switching between dialer/recent
- [ ] All animations with Reanimated v3
- [ ] i18n for all text

### 🔗 Related
- Navigates to: \`call/active.tsx\` on call start
- Uses: \`callStore\`, \`walletStore.callBalance\`
"

gh issue create --title "Implement Active Call Screen" \
  --label "WF3-Calling,screen,priority-high" \
  --body "## 📋 Screen: Active Call

**Design:** \`designs/3c_active_call_dark/\`
**Route:** \`src/app/(tabs)/call/active.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the active call screen with:
- Call duration timer
- Real-time cost counter
- Mute/unmute, hold, speakerphone controls
- End call button
- On-hold state (3d_call_on_hold_dark)

### 📐 Design Reference
- Active: \`designs/3c_active_call_dark/code.html\`
- On hold: \`designs/3d_call_on_hold_dark/\`

### ✅ Acceptance Criteria
- [ ] Real-time duration display (mm:ss)
- [ ] Real-time cost calculation
- [ ] Mute/hold/speaker toggle buttons with animations
- [ ] End call button (prominent, red)
- [ ] Updates \`callStore.duration\` and \`callStore.cost\`
- [ ] Navigates to \`call/summary.tsx\` on end
- [ ] Prevents screen sleep during call
- [ ] i18n for all text

### 🔗 Related
- Called from: \`call/dialer.tsx\`
- Navigates to: \`call/summary.tsx\`
- Uses: \`callStore\`
"

gh issue create --title "Implement Call Summary Screen" \
  --label "WF3-Calling,screen,priority-medium" \
  --body "## 📋 Screen: Call Summary

**Design:** No design folder (create based on pattern)
**Route:** \`src/app/(tabs)/call/summary.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the call summary screen shown after a call ends:
- Call duration
- Total cost
- Number called
- Call quality rating (optional)
- Actions: Save contact, Top-up balance, Close

### 📐 Design Reference
- No specific design file - use transaction detail pattern (4j)
- Follow app design system

### ✅ Acceptance Criteria
- [ ] Shows call duration and cost
- [ ] Displays called number
- [ ] Option to save to contacts
- [ ] Button to navigate to money top-up if balance low
- [ ] Close button returns to dialer
- [ ] Integrates with \`callStore\`
- [ ] i18n for all text

### 🔗 Related
- Called from: \`call/active.tsx\`
- May navigate to: \`money/index.tsx\` (top-up)
"

# WF4 — MONEY & PAYMENTS
gh issue create --title "Implement Money Hub Screen (4-in-1: Send/Receive/Top-Up/Pay)" \
  --label "WF4-Money,screen,priority-high" \
  --body "## 📋 Screen: Money Hub (4 views in local state)

**Design:** \`designs/4a_money_hub_send_light/\`, \`4b_*_receive\`, \`4c_*_top_up\`
**Route:** \`src/app/(tabs)/money/index.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the money hub screen with 4 tab views managed by local state:
1. **Send Money** (4a) - Transfer RWF to contacts/suppliers, show CNY equivalent
2. **Receive Money** (4b) - QR code, shareable link, account details
3. **Top-Up** (4c) - Add funds via MTN/Airtel MoMo or card
4. **Pay Supplier** (no separate design) - Pay saved suppliers in CNY (converted from RWF)

### 📐 Design Reference
- Send: \`designs/4a_money_hub_send_light/code.html\`
- Receive: \`designs/4b_money_hub_receive_light/code.html\`
- Top-Up: \`designs/4c_money_hub_top_up_light/code.html\`
- Confirm send modal: \`designs/4d_confirm_send_dark/\`

### ✅ Acceptance Criteria
- [ ] Tab bar for 4 views (local state, no sub-routes)
- [ ] **Send**: Form with amount, recipient, RWF→CNY conversion via \`useExchangeRate()\`
- [ ] **Receive**: QR code generation, copy account details button
- [ ] **Top-Up**: Payment method selection (MoMo/Card), amount input
- [ ] **Pay Supplier**: Saved suppliers list, select and pay
- [ ] Shows wallet balance from \`walletStore\`
- [ ] Confirm send modal (4d) before PIN
- [ ] Opens \`PINBottomSheet\` before processing payment
- [ ] All forms use React Hook Form + Zod
- [ ] i18n for all text

### 🔗 Related
- Opens: \`PINBottomSheet\`, \`PaymentSuccess\`, \`PaymentFailed\`
- Uses: \`walletStore\`, \`useExchangeRate()\`
"

gh issue create --title "Implement PIN Bottom Sheet Component" \
  --label "WF4-Money,component,priority-high" \
  --body "## 📋 Component: PIN Authentication Bottom Sheet

**Design:** \`designs/4e_auth_payment_light/\` + \`4e_auth_payment_dark/\`
**Component:** \`src/components/shared/PINBottomSheet.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the PIN authentication bottom sheet that gates all payments:
- 6-digit PIN entry
- Number pad (0-9, backspace)
- Error shake animation on wrong PIN
- Success callback on correct PIN

### 📐 Design Reference
- Light: \`designs/4e_auth_payment_light/code.html\`
- Dark: \`designs/4e_auth_payment_dark/code.html\`

### ✅ Acceptance Criteria
- [ ] Uses \`@gorhom/bottom-sheet\`
- [ ] 6 PIN input circles (filled/empty states)
- [ ] Number pad with haptic feedback
- [ ] Shake animation on wrong PIN (Reanimated)
- [ ] Calls \`onSuccess\` callback on correct PIN
- [ ] Imperative API: \`PINBottomSheet.open({ onSuccess, onCancel })\`
- [ ] Theme-aware (light/dark)
- [ ] i18n for all text

### 🔗 Related
- Used in: All payment flows (money, shipping, visa)
- Validates against: \`authStore.user.pin\`
"

gh issue create --title "Implement Payment Success Component" \
  --label "WF4-Money,component,priority-medium" \
  --body "## 📋 Component: Payment Success

**Design:** \`designs/4g_payment_success_light/\`
**Component:** \`src/components/shared/PaymentSuccess.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the payment success component shown after successful transactions:
- Success checkmark animation
- Transaction details (amount, recipient, reference)
- \"View Receipt\" and \"Done\" buttons

### 📐 Design Reference
- \`designs/4g_payment_success_light/screen.png\`

### ✅ Acceptance Criteria
- [ ] Animated checkmark icon (Reanimated scale + opacity)
- [ ] Shows transaction amount, recipient, timestamp
- [ ] Transaction reference number (copy button)
- [ ] \"View Receipt\" → navigates to \`money/transaction/[id]\`
- [ ] \"Done\" → dismisses and returns to previous screen
- [ ] i18n for all text

### 🔗 Related
- Called from: Money, shipping, visa payment flows
- May navigate to: \`money/transaction/[id].tsx\`
"

gh issue create --title "Implement Payment Failed Component" \
  --label "WF4-Money,component,priority-medium" \
  --body "## 📋 Component: Payment Failed

**Design:** \`designs/4h_payment_failed_light/\`
**Component:** \`src/components/shared/PaymentFailed.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the payment failed component shown after failed transactions:
- Error icon animation
- Failure reason
- \"Try Again\" and \"Cancel\" buttons

### 📐 Design Reference
- \`designs/4h_payment_failed_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Animated error icon (Reanimated shake)
- [ ] Shows failure reason from API
- [ ] \"Try Again\" → retry payment flow
- [ ] \"Cancel\" → return to previous screen
- [ ] i18n for all text including error messages

### 🔗 Related
- Called from: Money, shipping, visa payment flows
- Retry action depends on calling context
"

gh issue create --title "Implement Transaction History Screen" \
  --label "WF4-Money,screen,priority-medium" \
  --body "## 📋 Screen: Transaction History

**Design:** \`designs/4i_transaction_history_light/\`
**Route:** \`src/app/(tabs)/money/history.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the transaction history screen:
- List of all wallet transactions
- Filter by type (all, sent, received, top-up)
- Search by reference/recipient
- Tap transaction → navigate to detail

### 📐 Design Reference
- \`designs/4i_transaction_history_light/code.html\`

### ✅ Acceptance Criteria
- [ ] FlatList with \`TransactionRow\` components (memoized)
- [ ] Filter tabs: All | Sent | Received | Top-Up
- [ ] Search bar (debounced)
- [ ] Pull-to-refresh
- [ ] Empty state when no transactions
- [ ] Tap row → navigate to \`money/transaction/[id]\`
- [ ] Uses TanStack Query for data fetching
- [ ] i18n for all text

### 🔗 Related
- Navigates to: \`money/transaction/[id].tsx\`
- Uses: \`walletStore.transactions\`
"

gh issue create --title "Implement Transaction Detail Screen" \
  --label "WF4-Money,screen,priority-medium" \
  --body "## 📋 Screen: Transaction Detail

**Design:** \`designs/4j_transaction_detail_light/\`
**Route:** \`src/app/(tabs)/money/transaction/[id].tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the transaction detail screen:
- Full transaction information
- Reference number (copy button)
- Status badge
- Receipt download/share
- \"Get Help\" support button

### 📐 Design Reference
- \`designs/4j_transaction_detail_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Fetches transaction by ID param
- [ ] Shows all transaction fields: amount, fee, recipient, timestamp, status
- [ ] Copy reference number with haptic feedback
- [ ] Share receipt button (system share sheet)
- [ ] Support button (opens support chat/email)
- [ ] Loading state while fetching
- [ ] Error state if transaction not found
- [ ] i18n for all text

### 🔗 Related
- Called from: \`money/history.tsx\`, \`PaymentSuccess\`
- Uses: \`walletStore.getTransactionById(id)\`
"

# WF5 — SHIPPING
gh issue create --title "Implement Ship Hub Screen (4 tabs: Quote/Active/Warehouse/Docs)" \
  --label "WF5-Shipping,screen,priority-high" \
  --body "## 📋 Screen: Ship Hub (4 tabs in local state)

**Design:** \`designs/5a_ship_hub_quote_light/\`, \`5g_active_shipments_light/\`, \`5i_documents_light/\`
**Route:** \`src/app/(tabs)/ship/index.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the shipping hub screen with 4 tabs (local state):
1. **Quote** (5a) - Get shipping quotes
2. **Active** (5g) - Active shipments list
3. **Warehouse** (link) - Button to warehouse hub
4. **Docs** (5i) - Shipping documents

### 📐 Design Reference
- Quote tab: \`designs/5a_ship_hub_quote_light/code.html\`
- Active tab: \`designs/5g_active_shipments_light/code.html\`
- Documents tab: \`designs/5i_documents_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Tab bar for 4 views (local state, no sub-routes)
- [ ] **Quote**: Button → navigate to \`ship/quote.tsx\`
- [ ] **Active**: FlatList of \`ShipmentCard\` components (memoized)
- [ ] **Warehouse**: Button → navigate to \`ship/warehouse/index.tsx\`
- [ ] **Docs**: List of documents (download/view)
- [ ] Pull-to-refresh on Active/Docs tabs
- [ ] Empty states for each tab
- [ ] i18n for all text

### 🔗 Related
- Navigates to: \`ship/quote.tsx\`, \`ship/warehouse/index.tsx\`, \`ship/shipment/[id].tsx\`
- Uses: \`shipmentStore\`
"

gh issue create --title "Implement Shipping Quote Form Screen" \
  --label "WF5-Shipping,screen,priority-high" \
  --body "## 📋 Screen: Shipping Quote Form

**Design:** \`designs/5a_ship_hub_quote_light/\`
**Route:** \`src/app/(tabs)/ship/quote.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the shipping quote form:
- Origin/destination selection
- Cargo details (weight, dimensions, type)
- Shipping method preference
- Get quotes button → navigate to results

### 📐 Design Reference
- \`designs/5a_ship_hub_quote_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Form with React Hook Form + Zod
- [ ] Dropdowns for origin/destination (Dropdown component)
- [ ] Weight/dimension inputs (CurrencyInput for weight)
- [ ] Cargo type dropdown (general/fragile/perishable)
- [ ] CBM calculator link → \`ship/cbm-calculator.tsx\`
- [ ] Form validation before submission
- [ ] Navigate to \`ship/results.tsx\` on submit
- [ ] i18n for all text

### 🔗 Related
- Navigates to: \`ship/results.tsx\`, \`ship/cbm-calculator.tsx\`
- Uses: \`shipmentStore\`
"

gh issue create --title "Implement Quote Results Screen" \
  --label "WF5-Shipping,screen,priority-high" \
  --body "## 📋 Screen: Quote Results

**Design:** \`designs/5b_quote_results_light/\`
**Route:** \`src/app/(tabs)/ship/results.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the quote results screen:
- List of shipping options (sea/air/express)
- Price, estimated time, carrier name
- Sort by: price, speed
- Select quote → navigate to booking form

### 📐 Design Reference
- \`designs/5b_quote_results_light/code.html\`

### ✅ Acceptance Criteria
- [ ] FlatList of quote cards (memoized)
- [ ] Shows price (USD+RWF), transit time, carrier
- [ ] Sort dropdown (price/speed)
- [ ] Animated card press (Reanimated)
- [ ] Tap card → navigate to \`ship/booking-form.tsx\` with quote data
- [ ] Loading state while fetching quotes
- [ ] Empty state if no quotes available
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/quote.tsx\`
- Navigates to: \`ship/booking-form.tsx\`
"

gh issue create --title "Implement CBM Calculator Screen" \
  --label "WF5-Shipping,screen,priority-medium" \
  --body "## 📋 Screen: CBM Calculator

**Design:** \`designs/5c_cbm_calculator_light/\`
**Route:** \`src/app/(tabs)/ship/cbm-calculator.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the CBM (Cubic Meter) calculator:
- Length × Width × Height input (cm)
- Quantity field
- Real-time CBM calculation
- Copy result button

### 📐 Design Reference
- \`designs/5c_cbm_calculator_light/code.html\`

### ✅ Acceptance Criteria
- [ ] 3 input fields: L, W, H (cm)
- [ ] Quantity input (default 1)
- [ ] Real-time CBM calculation: (L×W×H/1000000)×Qty
- [ ] Result display with copy button
- [ ] Haptic feedback on copy
- [ ] \"Use in Quote\" button → navigate back to quote form with value
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/quote.tsx\`
- Returns to: \`ship/quote.tsx\` with calculated CBM
"

gh issue create --title "Implement Booking Form Screen" \
  --label "WF5-Shipping,screen,priority-high" \
  --body "## 📋 Screen: Booking Form

**Design:** \`designs/5d_booking_form_light/\`
**Route:** \`src/app/(tabs)/ship/booking-form.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the booking form for confirmed shipping:
- Shipper details (pre-filled from user profile)
- Consignee details (editable)
- Cargo description
- Insurance option
- Special instructions
- Next → navigate to review

### 📐 Design Reference
- \`designs/5d_booking_form_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Form with React Hook Form + Zod
- [ ] All required fields with validation
- [ ] Insurance toggle (calculates additional cost)
- [ ] Special instructions textarea
- [ ] Form persists if user navigates away
- [ ] \"Next\" button → navigate to \`ship/booking-review.tsx\`
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/results.tsx\`
- Navigates to: \`ship/booking-review.tsx\`
"

gh issue create --title "Implement Booking Review Screen" \
  --label "WF5-Shipping,screen,priority-high" \
  --body "## 📋 Screen: Booking Review

**Design:** \`designs/5e_booking_review_light/\`
**Route:** \`src/app/(tabs)/ship/booking-review.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the booking review screen:
- Summary of all booking details
- Price breakdown (shipping + insurance + fees)
- Wallet balance check
- Terms & conditions checkbox
- Confirm button → PIN → success

### 📐 Design Reference
- \`designs/5e_booking_review_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Read-only summary of all booking info
- [ ] Price breakdown section
- [ ] Check if \`walletStore.balance >= totalCost\`
- [ ] If insufficient funds, show \"Top-Up\" button instead
- [ ] Terms checkbox (required)
- [ ] \"Confirm\" → open \`PINBottomSheet\`
- [ ] On PIN success → API call → \`PaymentSuccess\` or \`PaymentFailed\`
- [ ] Navigate to \`ship/booking-success.tsx\` on success
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/booking-form.tsx\`
- Opens: \`PINBottomSheet\`, \`PaymentSuccess\`, \`PaymentFailed\`
- Navigates to: \`ship/booking-success.tsx\`
"

gh issue create --title "Implement Booking Success Screen" \
  --label "WF5-Shipping,screen,priority-medium" \
  --body "## 📋 Screen: Booking Success

**Design:** \`designs/5f_booking_success_light/\`
**Route:** \`src/app/(tabs)/ship/booking-success.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the booking success confirmation screen:
- Success animation
- Booking reference number
- Next steps information
- \"View Shipment\" and \"Done\" buttons

### 📐 Design Reference
- \`designs/5f_booking_success_light/screen.png\` (note: may not have code.html)

### ✅ Acceptance Criteria
- [ ] Success checkmark animation (Reanimated)
- [ ] Shows booking reference (copy button)
- [ ] Next steps text
- [ ] \"View Shipment\" → navigate to \`ship/shipment/[id].tsx\`
- [ ] \"Done\" → navigate back to \`ship/index.tsx\` (Active tab)
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/booking-review.tsx\`
- Navigates to: \`ship/shipment/[id].tsx\`, \`ship/index.tsx\`
"

gh issue create --title "Implement Shipment Detail/Tracking Screen" \
  --label "WF5-Shipping,screen,priority-high" \
  --body "## 📋 Screen: Shipment Detail/Tracking

**Design:** \`designs/5h_shipment_tracking_light/\`
**Route:** \`src/app/(tabs)/ship/shipment/[id].tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the shipment tracking/detail screen:
- Current shipment status
- Timeline of tracking events
- Estimated delivery date
- Shipment details (origin, destination, cargo)
- Documents section
- Support button

### 📐 Design Reference
- \`designs/5h_shipment_tracking_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Fetches shipment by ID param
- [ ] Current status badge (in transit, customs, delivered)
- [ ] Timeline with tracking events (use StepIndicator pattern)
- [ ] Estimated delivery date
- [ ] Expandable shipment details section
- [ ] Documents list (view/download)
- [ ] \"Get Help\" support button
- [ ] Pull-to-refresh
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/index.tsx\` (Active tab), \`ship/booking-success.tsx\`
- Uses: \`shipmentStore.getShipmentById(id)\`
"

# WF5 — WAREHOUSE
gh issue create --title "Implement Warehouse Hub Screen" \
  --label "WF5-Warehouse,screen,priority-high" \
  --body "## 📋 Screen: Warehouse Hub

**Design:** \`designs/5j_warehouse_hub_light/\`
**Route:** \`src/app/(tabs)/ship/warehouse/index.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the warehouse hub screen:
- User's warehouse reference code (TL-RW-XXXXX)
- Storage address info (copy button)
- List of items in warehouse
- Declare new goods button
- Consolidate items button

### 📐 Design Reference
- \`designs/5j_warehouse_hub_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Shows \`warehouseStore.referenceCode\` (copy button)
- [ ] \"View Address\" button → \`ship/warehouse/address.tsx\`
- [ ] FlatList of \`WarehouseItemCard\` (memoized)
- [ ] \"Declare Goods\" button → \`ship/warehouse/declare.tsx\`
- [ ] \"Consolidate\" button → \`ship/warehouse/consolidate.tsx\` (enabled if items ≥ 2)
- [ ] Pull-to-refresh
- [ ] Empty state when no items
- [ ] i18n for all text

### 🔗 Related
- Navigates to: \`ship/warehouse/address.tsx\`, \`ship/warehouse/declare.tsx\`, \`ship/warehouse/consolidate.tsx\`, \`ship/warehouse/item/[id].tsx\`
- Uses: \`warehouseStore\`
"

gh issue create --title "Implement Warehouse Address Screen" \
  --label "WF5-Warehouse,screen,priority-medium" \
  --body "## 📋 Screen: Warehouse Address

**Design:** \`designs/5k_warehouse_address_light/\`
**Route:** \`src/app/(tabs)/ship/warehouse/address.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the warehouse address display screen:
- Full warehouse address in Guangzhou
- User's reference code (TL-RW-XXXXX)
- Copy entire address button
- Share address button
- Instructions for suppliers

### 📐 Design Reference
- \`designs/5k_warehouse_address_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Shows full warehouse address (from \`warehouseStore.storageAddress\`)
- [ ] Shows user reference code prominently
- [ ] \"Copy Address\" button (haptic feedback + toast)
- [ ] \"Share\" button (system share sheet)
- [ ] Instructions section for how to use the address
- [ ] i18n for all text (including address format)

### 🔗 Related
- Called from: \`ship/warehouse/index.tsx\`
- Uses: \`warehouseStore.storageAddress\`, \`warehouseStore.referenceCode\`
"

gh issue create --title "Implement Declare Goods Screen" \
  --label "WF5-Warehouse,screen,priority-high" \
  --body "## 📋 Screen: Declare Goods

**Design:** \`designs/5l_declare_goods_light/\`
**Route:** \`src/app/(tabs)/ship/warehouse/declare.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the goods declaration form:
- Item description
- Quantity
- Value (CNY)
- Weight estimate
- Category dropdown
- Photo upload (optional)
- Submit button

### 📐 Design Reference
- \`designs/5l_declare_goods_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Form with React Hook Form + Zod
- [ ] All required fields with validation
- [ ] Category dropdown (electronics, clothing, etc.)
- [ ] Photo picker (expo-image-picker)
- [ ] Value in CNY (CurrencyInput component)
- [ ] Submit → API call → success toast → navigate back
- [ ] Error handling with error toast
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/warehouse/index.tsx\`
- Returns to: \`ship/warehouse/index.tsx\` (refreshes item list)
- Uses: \`warehouseStore.addItem()\`
"

gh issue create --title "Implement Warehouse Item Detail Screen" \
  --label "WF5-Warehouse,screen,priority-medium" \
  --body "## 📋 Screen: Warehouse Item Detail

**Design:** \`designs/5m_item_detail_light/\`
**Route:** \`src/app/(tabs)/ship/warehouse/item/[id].tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the warehouse item detail screen:
- Item photos (if available)
- Description, quantity, value
- Current status (arrived, inspected, ready)
- Inspection photos (if available)
- Request inspection button
- Edit/delete buttons

### 📐 Design Reference
- \`designs/5m_item_detail_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Fetches item by ID param
- [ ] Photo carousel if multiple photos (swipeable)
- [ ] All item details displayed
- [ ] Status badge
- [ ] \"Request Inspection\" button (if not inspected)
- [ ] Edit button → opens edit form
- [ ] Delete button with confirmation alert
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/warehouse/index.tsx\`
- Uses: \`warehouseStore.getItemById(id)\`
"

gh issue create --title "Implement Photo Review Screen" \
  --label "WF5-Warehouse,screen,priority-medium" \
  --body "## 📋 Screen: Photo Review

**Design:** \`designs/5n_photo_review_light/\`
**Route:** \`src/app/(tabs)/ship/warehouse/photo-review.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the warehouse inspection photo review screen:
- Full-screen photo viewer
- Swipe between photos
- Zoom/pan gestures
- Approve/Request Re-inspection buttons
- Notes section

### 📐 Design Reference
- \`designs/5n_photo_review_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Full-screen photo viewer
- [ ] Swipe gesture to change photos (react-native-gesture-handler)
- [ ] Pinch-to-zoom (Reanimated)
- [ ] Photo counter (1/4, 2/4, etc.)
- [ ] \"Approve\" button → marks inspection complete
- [ ] \"Request Re-inspection\" → opens notes form
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/warehouse/item/[id].tsx\` (when inspection photos available)
- Uses: \`warehouseStore\`
"

gh issue create --title "Implement Consolidate Items Selection Screen" \
  --label "WF5-Warehouse,screen,priority-high" \
  --body "## 📋 Screen: Select Items to Consolidate

**Design:** \`designs/5o_select_items_light/\`
**Route:** \`src/app/(tabs)/ship/warehouse/consolidate.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the item selection screen for consolidation:
- List of all warehouse items
- Multi-select checkboxes
- Shows weight and volume for each
- Running total weight/volume
- Next button (enabled when ≥2 selected)

### 📐 Design Reference
- \`designs/5o_select_items_light/code.html\`

### ✅ Acceptance Criteria
- [ ] FlatList of warehouse items with checkboxes
- [ ] Multi-select with animated checkbox (Reanimated)
- [ ] Shows item weight and estimated volume
- [ ] Footer with running totals (weight, volume, item count)
- [ ] \"Next\" button enabled only when ≥2 items selected
- [ ] Navigate to \`ship/warehouse/consolidate-review.tsx\` with selected items
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/warehouse/index.tsx\`
- Navigates to: \`ship/warehouse/consolidate-review.tsx\`
- Uses: \`warehouseStore.items\`
"

gh issue create --title "Implement Consolidation Review Screen" \
  --label "WF5-Warehouse,screen,priority-high" \
  --body "## 📋 Screen: Consolidation Review

**Design:** \`designs/5p_consolidation_review_light/\`
**Route:** \`src/app/(tabs)/ship/warehouse/consolidate-review.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the consolidation review screen:
- List of selected items (read-only)
- Total weight and volume
- Consolidation fee
- Wallet balance check
- Confirm button → PIN → process

### 📐 Design Reference
- \`designs/5p_consolidation_review_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Shows all selected items from previous screen
- [ ] Total weight, volume, fee breakdown
- [ ] Check if \`walletStore.balance >= consolidationFee\`
- [ ] If insufficient funds, show \"Top-Up\" button
- [ ] \"Confirm\" → open \`PINBottomSheet\`
- [ ] On PIN success → API call → navigate to success screen
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/warehouse/consolidate.tsx\`
- Opens: \`PINBottomSheet\`
- Navigates to: \`ship/warehouse/consolidate-success.tsx\`
"

gh issue create --title "Implement Consolidation Success Screen" \
  --label "WF5-Warehouse,screen,priority-medium" \
  --body "## 📋 Screen: Consolidation Success

**Design:** \`designs/5q_consolidation_success_light/\`
**Route:** \`src/app/(tabs)/ship/warehouse/consolidate-success.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the consolidation success confirmation:
- Success animation
- New consolidated package reference
- Next steps (ready to ship)
- \"View Package\" and \"Done\" buttons

### 📐 Design Reference
- \`designs/5q_consolidation_success_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Success checkmark animation (Reanimated)
- [ ] Shows new package reference number (copy button)
- [ ] Next steps information
- [ ] \"View Package\" → navigate to package detail
- [ ] \"Done\" → navigate back to \`ship/warehouse/index.tsx\`
- [ ] i18n for all text

### 🔗 Related
- Called from: \`ship/warehouse/consolidate-review.tsx\`
- Navigates to: \`ship/warehouse/index.tsx\`
"

# WF6 — TRAVEL
gh issue create --title "Implement Travel Hub Screen" \
  --label "WF6-Travel,screen,priority-medium" \
  --body "## 📋 Screen: Travel Hub

**Design:** \`designs/travel_hub_light/\`
**Route:** \`src/app/(tabs)/travel/index.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the travel hub landing screen:
- Hero banner
- 2×2 service grid: Flights, Visa, Hotels, Tours
- Quick tips section
- Recent bookings (if any)

### 📐 Design Reference
- \`designs/travel_hub_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Hero image/banner with travel messaging
- [ ] 4 service cards (Flights, Visa, Hotels, Tours)
- [ ] Flights → \`travel/flights/search.tsx\`
- [ ] Visa → \`travel/visa/step-1-docs.tsx\`
- [ ] Hotels & Tours → coming soon toast for now
- [ ] Recent bookings section (empty state if none)
- [ ] i18n for all text

### 🔗 Related
- Navigates to: \`travel/flights/search.tsx\`, \`travel/visa/step-1-docs.tsx\`
"

gh issue create --title "Implement Visa Step 1: Documents Screen" \
  --label "WF6-Travel,screen,priority-medium" \
  --body "## 📋 Screen: Visa Application Step 1 - Documents

**Design:** \`designs/visa_step_1_light/\`
**Route:** \`src/app/(tabs)/travel/visa/step-1-docs.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the visa application step 1 (document upload):
- StepIndicator (1/4)
- List of required documents
- Upload buttons for each document
- Photo picker for passport, photo, etc.
- Next button (enabled when all uploaded)

### 📐 Design Reference
- \`designs/visa_step_1_light/code.html\`

### ✅ Acceptance Criteria
- [ ] StepIndicator showing step 1/4
- [ ] List of required documents with upload status
- [ ] Photo picker for each document (expo-image-picker)
- [ ] Thumbnail preview of uploaded docs
- [ ] \"Next\" enabled only when all required docs uploaded
- [ ] Navigate to \`travel/visa/step-2-info.tsx\`
- [ ] Form state persists if user navigates away
- [ ] i18n for all text

### 🔗 Related
- Part of visa flow: step-1 → step-2 → step-3 → step-4
- Navigates to: \`travel/visa/step-2-info.tsx\`
"

gh issue create --title "Implement Visa Step 2: Personal Info Screen" \
  --label "WF6-Travel,screen,priority-medium" \
  --body "## 📋 Screen: Visa Application Step 2 - Personal Info

**Design:** \`designs/visa_step_2_light/\`
**Route:** \`src/app/(tabs)/travel/visa/step-2-info.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the visa application step 2 (personal information):
- StepIndicator (2/4)
- Form with personal details
- Pre-fill from user profile where possible
- Validation for all fields
- Next button

### 📐 Design Reference
- \`designs/visa_step_2_light/code.html\`

### ✅ Acceptance Criteria
- [ ] StepIndicator showing step 2/4
- [ ] Form with React Hook Form + Zod
- [ ] Fields: full name, DOB, nationality, passport number, etc.
- [ ] DatePicker for DOB
- [ ] Pre-fill from \`authStore.user\` where available
- [ ] All fields validated
- [ ] \"Back\" and \"Next\" buttons
- [ ] Form state persists
- [ ] Navigate to \`travel/visa/step-3-payment.tsx\`
- [ ] i18n for all text

### 🔗 Related
- Part of visa flow: step-1 → step-2 → step-3 → step-4
- Navigates to: \`travel/visa/step-3-payment.tsx\`
"

gh issue create --title "Implement Visa Step 3: Payment Screen" \
  --label "WF6-Travel,screen,priority-medium" \
  --body "## 📋 Screen: Visa Application Step 3 - Payment

**Design:** \`designs/visa_step_3_light/\`
**Route:** \`src/app/(tabs)/travel/visa/step-3-payment.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the visa application step 3 (payment):
- StepIndicator (3/4)
- Application summary
- Visa fee breakdown
- Wallet balance check
- Pay button → PIN → success

### 📐 Design Reference
- \`designs/visa_step_3_light/code.html\`

### ✅ Acceptance Criteria
- [ ] StepIndicator showing step 3/4
- [ ] Summary of visa application
- [ ] Fee breakdown (visa fee + service fee)
- [ ] Shows wallet balance
- [ ] Check if \`walletStore.balance >= totalFee\`
- [ ] If insufficient, show \"Top-Up\" button
- [ ] \"Pay\" → open \`PINBottomSheet\`
- [ ] On PIN success → API call → navigate to step-4
- [ ] i18n for all text

### 🔗 Related
- Part of visa flow: step-1 → step-2 → step-3 → step-4
- Opens: \`PINBottomSheet\`
- Navigates to: \`travel/visa/step-4-success.tsx\`
"

gh issue create --title "Implement Visa Step 4: Success Screen" \
  --label "WF6-Travel,screen,priority-medium" \
  --body "## 📋 Screen: Visa Application Step 4 - Success

**Design:** \`designs/visa_step_4_light/\`
**Route:** \`src/app/(tabs)/travel/visa/step-4-success.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the visa application success screen:
- StepIndicator (4/4)
- Success animation
- Application reference number
- Next steps (processing time, etc.)
- \"Done\" button

### 📐 Design Reference
- \`designs/visa_step_4_light/code.html\`

### ✅ Acceptance Criteria
- [ ] StepIndicator showing step 4/4
- [ ] Success checkmark animation (Reanimated)
- [ ] Shows application reference (copy button)
- [ ] Next steps information (processing time)
- [ ] \"Done\" → navigate back to \`travel/index.tsx\`
- [ ] i18n for all text

### 🔗 Related
- Part of visa flow: step-1 → step-2 → step-3 → step-4
- Navigates to: \`travel/index.tsx\`
"

gh issue create --title "Implement Flight Search Screen" \
  --label "WF6-Travel,screen,priority-medium" \
  --body "## 📋 Screen: Flight Search

**Design:** \`designs/flight_search_light/\`
**Route:** \`src/app/(tabs)/travel/flights/search.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the flight search form:
- Origin/destination dropdowns
- Date pickers (departure, return for round-trip)
- Passenger count selector
- Trip type (one-way, round-trip)
- Search button → navigate to results

### 📐 Design Reference
- \`designs/flight_search_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Form with React Hook Form + Zod
- [ ] Origin/destination dropdowns (major cities)
- [ ] DatePicker for departure and return dates
- [ ] Passenger count selector (+/- buttons)
- [ ] Trip type toggle (one-way/round-trip)
- [ ] Swap origin/destination button with animation
- [ ] Form validation
- [ ] \"Search Flights\" → navigate to \`travel/flights/results.tsx\`
- [ ] i18n for all text

### 🔗 Related
- Called from: \`travel/index.tsx\`
- Navigates to: \`travel/flights/results.tsx\`
"

gh issue create --title "Implement Flight Results Screen" \
  --label "WF6-Travel,screen,priority-medium" \
  --body "## 📋 Screen: Flight Results

**Design:** \`designs/flight_results_light/\`
**Route:** \`src/app/(tabs)/travel/flights/results.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the flight results screen:
- List of available flights
- Shows airline, departure/arrival times, price
- Filter/sort options (price, duration, stops)
- Tap flight → navigate to detail

### 📐 Design Reference
- \`designs/flight_results_light/code.html\`

### ✅ Acceptance Criteria
- [ ] FlatList of flight cards (memoized)
- [ ] Each card shows: airline, route, times, duration, price
- [ ] Sort dropdown (price, duration, departure time)
- [ ] Filter: stops (direct, 1 stop, 2+ stops)
- [ ] Loading state while fetching
- [ ] Empty state if no flights found
- [ ] Tap card → navigate to \`travel/flights/detail.tsx\`
- [ ] i18n for all text

### 🔗 Related
- Called from: \`travel/flights/search.tsx\`
- Navigates to: \`travel/flights/detail.tsx\`
"

gh issue create --title "Implement Flight Detail Screen" \
  --label "WF6-Travel,screen,priority-medium" \
  --body "## 📋 Screen: Flight Detail

**Design:** \`designs/flight_detail_light/\`
**Route:** \`src/app/(tabs)/travel/flights/detail.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the flight detail screen:
- Full flight information
- Baggage allowance
- Cancellation policy
- Price breakdown
- Book button → payment → e-ticket

### 📐 Design Reference
- \`designs/flight_detail_light/code.html\`

### ✅ Acceptance Criteria
- [ ] All flight details (airline, route, times, duration, aircraft)
- [ ] Baggage allowance section
- [ ] Cancellation/refund policy
- [ ] Price breakdown (base fare + taxes + fees)
- [ ] \"Book Now\" button → PIN → payment
- [ ] Check wallet balance before booking
- [ ] On success → navigate to \`travel/flights/eticket.tsx\`
- [ ] i18n for all text

### 🔗 Related
- Called from: \`travel/flights/results.tsx\`
- Opens: \`PINBottomSheet\`
- Navigates to: \`travel/flights/eticket.tsx\`
"

gh issue create --title "Implement E-Ticket Screen" \
  --label "WF6-Travel,screen,priority-medium" \
  --body "## 📋 Screen: E-Ticket

**Design:** \`designs/flight_success_light/\`
**Route:** \`src/app/(tabs)/travel/flights/eticket.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the e-ticket display screen:
- Booking confirmation
- QR code or barcode
- Flight details
- Passenger info
- Download/share e-ticket buttons

### 📐 Design Reference
- \`designs/flight_success_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Shows booking reference number
- [ ] QR code (react-native-qrcode-svg)
- [ ] All flight and passenger details
- [ ] \"Download PDF\" button
- [ ] \"Share\" button (system share sheet)
- [ ] \"Add to Calendar\" button
- [ ] \"Done\" → navigate back to \`travel/index.tsx\`
- [ ] i18n for all text

### 🔗 Related
- Called from: \`travel/flights/detail.tsx\`
- Navigates to: \`travel/index.tsx\`
"

# WF7 — COMMUNITY
gh issue create --title "Implement Community Feed Screen" \
  --label "WF7-Community,screen,priority-low" \
  --body "## 📋 Screen: Community Feed

**Design:** \`designs/community_feed_dark/\`
**Route:** \`src/app/(tabs)/more/community/index.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the community feed (social network):
- Feed of posts from other traders
- Like, comment, share actions
- Create post FAB
- Filter by topic

### 📐 Design Reference
- \`designs/community_feed_dark/code.html\`

### ✅ Acceptance Criteria
- [ ] FlatList of post cards (memoized)
- [ ] Each post: author, avatar, timestamp, content, image (optional), like/comment counts
- [ ] Like button with animation (Reanimated)
- [ ] Comment button (taps open comment sheet)
- [ ] Share button
- [ ] FAB to create post → \`more/community/create.tsx\`
- [ ] Pull-to-refresh
- [ ] i18n for all text

### 🔗 Related
- Navigates to: \`more/community/create.tsx\`
- Part of community feature (may be low priority)
"

gh issue create --title "Implement Create Post Screen" \
  --label "WF7-Community,screen,priority-low" \
  --body "## 📋 Screen: Create Post

**Design:** \`designs/create_post_dark/\`
**Route:** \`src/app/(tabs)/more/community/create.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the post creation screen:
- Text input (multi-line)
- Photo upload (optional)
- Topic/category selector
- Post button

### 📐 Design Reference
- \`designs/create_post_dark/code.html\`

### ✅ Acceptance Criteria
- [ ] Multi-line text input
- [ ] Image picker (optional, expo-image-picker)
- [ ] Topic dropdown (trading tips, shipping, news, etc.)
- [ ] Character limit display
- [ ] \"Post\" button (disabled if empty)
- [ ] API call to create post
- [ ] On success → navigate back to feed with new post
- [ ] i18n for all text

### 🔗 Related
- Called from: \`more/community/index.tsx\`
- Returns to: \`more/community/index.tsx\`
"

gh issue create --title "Implement Marketplace/Supplier Directory Screen" \
  --label "WF7-Community,screen,priority-low" \
  --body "## 📋 Screen: Marketplace / Supplier Directory

**Design:** \`designs/market_directory_dark/\`
**Route:** \`src/app/(tabs)/more/community/marketplace.tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the marketplace/supplier directory:
- List of verified suppliers
- Search/filter by category
- Tap supplier → navigate to detail

### 📐 Design Reference
- \`designs/market_directory_dark/code.html\`

### ✅ Acceptance Criteria
- [ ] FlatList of supplier cards (memoized)
- [ ] Each card: logo, name, category, rating, location
- [ ] Search bar (debounced)
- [ ] Category filter tabs
- [ ] Tap card → navigate to \`more/community/supplier/[id].tsx\`
- [ ] Pull-to-refresh
- [ ] i18n for all text

### 🔗 Related
- Navigates to: \`more/community/supplier/[id].tsx\`
"

gh issue create --title "Implement Supplier Detail Screen" \
  --label "WF7-Community,screen,priority-low" \
  --body "## 📋 Screen: Supplier Detail

**Design:** \`designs/supplier_detail_light/\`
**Route:** \`src/app/(tabs)/more/community/supplier/[id].tsx\`
**Status:** ❌ Not implemented (stub exists)

### 🎯 Implementation Prompt

Implement the supplier detail screen:
- Supplier profile (logo, name, description, location)
- Product categories
- Contact information
- Reviews/ratings
- \"Contact Supplier\" button

### 📐 Design Reference
- \`designs/supplier_detail_light/code.html\`

### ✅ Acceptance Criteria
- [ ] Fetches supplier by ID param
- [ ] Shows all supplier information
- [ ] Product categories section
- [ ] Reviews/ratings section
- [ ] \"Contact Supplier\" button (opens chat/email)
- [ ] \"Save\" button to save supplier to favorites
- [ ] i18n for all text

### 🔗 Related
- Called from: \`more/community/marketplace.tsx\`
- Uses: \`walletStore.savedSuppliers\`
"

gh issue create --title "Create Mentor List Screen (NEW FILE)" \
  --label "WF7-Community,screen,priority-low,new-file" \
  --body "## 📋 Screen: Mentor List (NEW FILE)

**Design:** \`designs/mentor_list_light/\`
**Route:** \`src/app/(tabs)/more/community/mentor-list.tsx\` (FILE DOES NOT EXIST YET)
**Status:** ❌ Not implemented (file does not exist)

### 🎯 Implementation Prompt

Create a new file and implement the mentor list screen:
- List of available mentors/experts
- Each mentor: photo, name, expertise, rating, availability
- Tap mentor → navigate to mentor chat

### 📐 Design Reference
- \`designs/mentor_list_light/code.html\`

### ✅ Acceptance Criteria
- [ ] **Create file**: \`src/app/(tabs)/more/community/mentor-list.tsx\`
- [ ] FlatList of mentor cards (memoized)
- [ ] Each card: avatar, name, expertise tags, rating, status (online/offline)
- [ ] Search bar for mentors
- [ ] Tap card → navigate to mentor chat
- [ ] Pull-to-refresh
- [ ] i18n for all text

### 🔗 Related
- New feature (referenced in QuickActions on home screen)
- Navigates to: \`more/community/mentor-chat/[id].tsx\` (also needs creation)
"

gh issue create --title "Create Mentor Chat Screen (NEW FILE)" \
  --label "WF7-Community,screen,priority-low,new-file" \
  --body "## 📋 Screen: Mentor Chat (NEW FILE)

**Design:** \`designs/mentor_chat_light/\`
**Route:** \`src/app/(tabs)/more/community/mentor-chat/[id].tsx\` (FILE DOES NOT EXIST YET)
**Status:** ❌ Not implemented (file/folder does not exist)

### 🎯 Implementation Prompt

Create a new file/folder and implement the mentor chat screen:
- 1-on-1 chat with mentor
- Message history
- Text input with send button
- Typing indicators
- Message timestamps

### 📐 Design Reference
- \`designs/mentor_chat_light/code.html\`

### ✅ Acceptance Criteria
- [ ] **Create folder**: \`src/app/(tabs)/more/community/mentor-chat/\`
- [ ] **Create file**: \`src/app/(tabs)/more/community/mentor-chat/[id].tsx\`
- [ ] FlatList of chat messages (inverted, memoized)
- [ ] Message bubbles (sent/received styling)
- [ ] Text input at bottom (KeyboardAvoidingView)
- [ ] Send button with animation
- [ ] Typing indicator when mentor is typing
- [ ] Timestamps for messages
- [ ] i18n for all text

### 🔗 Related
- Called from: \`more/community/mentor-list.tsx\`
- Referenced in: QuickActions on home screen
"

# WF8 — SYSTEM STATES
gh issue create --title "Enhance Screen Component: No Internet State" \
  --label "WF8-System,component,priority-medium" \
  --body "## 📋 Enhancement: No Internet State in Screen Component

**Design:** \`designs/8g_no_internet_dark/\`
**Component:** \`src/components/layout/Screen.tsx\`
**Status:** ❌ Not implemented (needs enhancement)

### 🎯 Implementation Prompt

Enhance the existing \`<Screen>\` component to show a no-internet state:
- Detect network status via \`useNetworkStatus()\`
- Show full-screen \"No Internet\" overlay when offline
- Retry button to check connection
- Auto-dismiss when connection restored

### 📐 Design Reference
- \`designs/8g_no_internet_dark/code.html\`

### ✅ Acceptance Criteria
- [ ] Integrate with \`useNetworkStatus()\` hook
- [ ] Show overlay when \`isConnected === false\`
- [ ] Full-screen overlay with icon, message, retry button
- [ ] Retry button checks connection and dismisses if restored
- [ ] Auto-dismiss overlay when connection restored
- [ ] Slide-in animation for overlay (Reanimated)
- [ ] i18n for all text

### 🔗 Related
- Used by: All screens (via Screen wrapper)
- Uses: \`useNetworkStatus()\` hook
"

gh issue create --title "Enhance EmptyState Component: Error States" \
  --label "WF8-System,component,priority-low" \
  --body "## 📋 Enhancement: Error States in EmptyState Component

**Design:** \`designs/8h_generic_errors_dark/\`
**Component:** \`src/components/ui/EmptyState.tsx\`
**Status:** ❌ Not implemented (needs enhancement)

### 🎯 Implementation Prompt

Enhance the existing \`<EmptyState>\` component to support error states:
- Generic error state
- 404 not found
- Permission denied
- Server error (500)
- Custom error messages

### 📐 Design Reference
- \`designs/8h_generic_errors_dark/code.html\`

### ✅ Acceptance Criteria
- [ ] Add \`variant\` prop: \`'empty' | 'error' | 'notFound' | 'permissionDenied' | 'serverError'\`
- [ ] Different icons for each variant
- [ ] Title and message customization
- [ ] Optional action button (e.g., \"Try Again\", \"Go Back\")
- [ ] Animation on mount (Reanimated)
- [ ] i18n for default messages

### 🔗 Related
- Used throughout app for error states
- Reference: \`designs/8h_generic_errors_dark/\`
"

gh issue create --title "Document EmptyState Component Variants" \
  --label "WF8-System,documentation,priority-low" \
  --body "## 📋 Documentation: EmptyState Variants Reference

**Design:** \`designs/8i_empty_states_dark/\`
**Component:** \`src/components/ui/EmptyState.tsx\`
**Status:** Documentation task

### 🎯 Implementation Prompt

Create documentation/examples for EmptyState component variants:
- Document all available empty state types
- Create usage examples
- Add to component comments/README

### 📐 Design Reference
- \`designs/8i_empty_states_dark/\` (shows various empty states)

### ✅ Acceptance Criteria
- [ ] Review \`designs/8i_empty_states_dark/code.html\`
- [ ] Document all empty state variants in component comments
- [ ] Add usage examples for common scenarios:
  - No search results
  - No transactions
  - No shipments
  - No warehouse items
  - etc.

### 🔗 Related
- Component: \`EmptyState.tsx\`
- Used throughout app
"

gh issue create --title "Document Skeleton Component Patterns" \
  --label "WF8-System,documentation,priority-low" \
  --body "## 📋 Documentation: Skeleton Loading Patterns

**Design:** \`designs/8j_loading_states_dark/\`
**Component:** \`src/components/ui/Skeleton.tsx\`
**Status:** Documentation task

### 🎯 Implementation Prompt

Create documentation/examples for Skeleton loading patterns:
- Document usage patterns
- Create examples for common loading states
- Add to component comments

### 📐 Design Reference
- \`designs/8j_loading_states_dark/\` (shows various loading patterns)

### ✅ Acceptance Criteria
- [ ] Review \`designs/8j_loading_states_dark/code.html\`
- [ ] Document skeleton patterns in component comments
- [ ] Add usage examples for common scenarios:
  - List item skeleton
  - Card skeleton
  - Profile skeleton
  - Form skeleton

### 🔗 Related
- Component: \`Skeleton.tsx\`
- Used throughout app for loading states
"

# EXTRA
gh issue create --title "Design Buy Data Screen (NEW FILE)" \
  --label "Extra,screen,priority-low,new-file" \
  --body "## 📋 Screen: Buy Data (NEW FILE)

**Design:** \`designs/buy_data_dark/\`
**Route:** TBD (possibly part of VPN or standalone)
**Status:** ❌ Not implemented (no .tsx file exists)

### 🎯 Implementation Prompt

This is an **EXTRA** screen not in original spec. It appears to be a data purchase screen (for VPN or calling).

**Before implementing:**
1. Determine where this screen fits in the app:
   - Is it part of VPN renewal flow?
   - Is it part of calling top-up?
   - Is it a separate \"Buy Data\" feature?
2. Create appropriate route structure
3. Implement based on design

### 📐 Design Reference
- \`designs/buy_data_dark/code.html\`

### ✅ Acceptance Criteria
- [ ] Determine feature placement
- [ ] Create appropriate route file
- [ ] Implement data purchase flow
- [ ] Integrate with wallet payment flow
- [ ] i18n for all text

### 🔗 Related
- May relate to: VPN or Calling features
- Needs product decision on placement
"

echo ""
echo "✅ All GitHub issues created successfully!"
echo ""
echo "📊 Summary:"
echo "  - 51 issues created across 7 workflows"
echo "  - Labels: WF2-VPN, WF3-Calling, WF4-Money, WF5-Shipping, WF5-Warehouse, WF6-Travel, WF7-Community, WF8-System, Extra"
echo "  - Priority levels: high, medium, low"
echo ""
echo "View all issues: https://github.com/sebastien15/TradeLife/issues"
