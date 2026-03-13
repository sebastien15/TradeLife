# TRADELIFE — SCREEN + DESIGN MAP
> Status: ✅ implemented | ❌ missing/stub | 🔲 state/sheet (no separate route)

---

## WF1 — AUTH

| Screen              | Route                        | Design folder              | Status |
|---------------------|------------------------------|----------------------------|--------|
| Splash              | (auth)/splash.tsx            | 1a_splash_screen_dark      | ✅     |
| Welcome             | (auth)/index.tsx             | 1b_welcome_dark            | ✅     |
| Language select     | (auth)/language.tsx          | 1c_language_selection_light| ✅     |
| Sign up             | (auth)/sign-up.tsx           | 1d_sign_up_light           | ✅     |
| OTP verify          | (auth)/otp.tsx               | 1e_otp_verification_dark   | ✅     |
| Profile setup       | (auth)/profile-setup.tsx     | 1f_profile_setup_dark      | ✅     |
| Permissions         | (auth)/permissions.tsx       | 1g_permissions_dark        | ✅     |
| Sign in             | (auth)/sign-in.tsx           | 1h_sign_in_dark            | ✅     |
| Forgot password     | (auth)/forgot-password.tsx   | 1i_forgot_password_dark    | ✅     |
| Reset success       | state in forgot-password.tsx | 1j_reset_success_light     | 🔲    |

---

## WF2 — HOME + VPN

| Screen              | Route / Component            | Design folder                       | Status |
|---------------------|------------------------------|-------------------------------------|--------|
| Home (connected)    | (tabs)/index.tsx             | 2a_home_vpn_connected_light+dark    | ✅     |
| Home (disconnected) | state in index.tsx           | 2b_home_vpn_disconnected_dark       | ✅     |
| VPN server select   | VPNServerSheet component     | 2c_vpn_servers_light                | ✅     |
| VPN connecting      | state in VPNCard.tsx         | NO DESIGN FOLDER (2d)               | ✅     |
| VPN dashboard       | VPNDashboardSheet component  | NO DESIGN FOLDER (2e)               | ✅     |
| VPN error           | state in VPNCard.tsx         | 2f_vpn_error_light                  | ✅     |
| VPN expired         | RenewalSheet component       | 2g_vpn_expired_light                | ✅     |
| Search              | SearchBottomSheet component  | NO DESIGN FOLDER                    | ✅     |
| Notifications       | NotificationBottomSheet comp | NO DESIGN FOLDER                    | ✅     |
| Travel hub          | TravelSheet component        | NO DESIGN FOLDER                    | ✅     |

**Home sub-components (all in (tabs)/index.tsx or src/components/shared/home/):**
- Layout: `<HomeNavBar>` `<BalanceRow>` `<VPNCard>` `<SampleTracking>` `<ContainerETA>` `<QuickActions>` `<FABWidget>`
- Cards: `<WalletBalanceCard>` (gradient, privacy toggle, RWF+CNY) `<CallingCard>` (gradient, simplified)
- Bottom Sheets: `<VPNServerSheet>` `<VPNDashboardSheet>` `<RenewalSheet>` `<TravelSheet>` `<SearchBottomSheet>` `<NotificationBottomSheet>`
- Rows: `<NotificationRow>` `<SearchResultRow>`
- Stores: `vpnStore`, `notificationStore`, `searchStore`, `walletStore`

---

## WF3 — CALLING

| Screen          | Route                | Design folder        | Status |
|-----------------|----------------------|----------------------|--------|
| Dialer          | call/dialer.tsx      | 3a_dialer_dark       | ✅     |
| Recent calls    | tab in dialer.tsx    | 3b_recent_calls_dark | ✅     |
| Active call     | call/active.tsx      | 3c_active_call_dark  | ✅     |
| Call on hold    | state in active.tsx  | 3d_call_on_hold_dark | 🔲    |
| Call summary    | call/summary.tsx     | NO DESIGN FOLDER (3e)| ✅     |
| Low balance     | state in dialer.tsx  | 3f_low_balance_dark  | 🔲    |

---

## WF4 — MONEY & PAYMENTS

| Screen               | Route                             | Design folder                  | Status |
|----------------------|-----------------------------------|--------------------------------|--------|
| Money hub — Send     | money/index.tsx (local state)     | 4a_money_hub_send_light        | ❌     |
| Money hub — Receive  | money/index.tsx (local state)     | 4b_money_hub_receive_light     | ❌     |
| Money hub — Top-Up   | money/index.tsx (local state)     | 4c_money_hub_top_up_light      | ❌     |
| Money hub — Pay Supplier | money/index.tsx (local state) | (no separate design)           | ❌     |
| Confirm send         | state/modal in money/index.tsx    | 4d_confirm_send_dark           | 🔲    |
| Auth payment (PIN)   | PINBottomSheet component          | 4e_auth_payment_light+dark     | ❌     |
| Payment processing   | state in flow                     | 4f_payment_processing_light    | 🔲    |
| Payment success      | PaymentSuccess component          | 4g_payment_success_light       | ❌     |
| Payment failed       | PaymentFailed component           | 4h_payment_failed_light        | ❌     |
| Transaction history  | money/history.tsx                 | 4i_transaction_history_light   | ❌     |
| Transaction detail   | money/transaction/[id].tsx        | 4j_transaction_detail_light    | ❌     |

---

## WF5 — SHIPPING (Direct)

| Screen           | Route                       | Design folder               | Status |
|------------------|-----------------------------|-----------------------------|--------|
| Ship hub         | ship/index.tsx (local state)| 5a_ship_hub_quote_light     | ❌     |
| Quote form       | ship/quote.tsx              | 5a_ship_hub_quote_light     | ❌     |
| Quote results    | ship/results.tsx            | 5b_quote_results_light      | ❌     |
| CBM calculator   | ship/cbm-calculator.tsx     | 5c_cbm_calculator_light     | ❌     |
| Booking form     | ship/booking-form.tsx       | 5d_booking_form_light       | ❌     |
| Booking review   | ship/booking-review.tsx     | 5e_booking_review_light     | ❌     |
| Booking success  | ship/booking-success.tsx    | 5f_booking_success_light    | ❌     |
| Active shipments | ship/index.tsx (Active tab) | 5g_active_shipments_light   | ❌     |
| Shipment detail  | ship/shipment/[id].tsx      | 5h_shipment_tracking_light  | ❌     |
| Documents tab    | ship/index.tsx (Docs tab)   | 5i_documents_light          | ❌     |

## WF5 — WAREHOUSE

| Screen                 | Route                                  | Design folder                    | Status |
|------------------------|----------------------------------------|----------------------------------|--------|
| Warehouse hub          | ship/warehouse/index.tsx               | 5j_warehouse_hub_light           | ❌     |
| Warehouse address      | ship/warehouse/address.tsx             | 5k_warehouse_address_light       | ❌     |
| Declare goods          | ship/warehouse/declare.tsx             | 5l_declare_goods_light           | ❌     |
| Item detail            | ship/warehouse/item/[id].tsx           | 5m_item_detail_light             | ❌     |
| Photo review           | ship/warehouse/photo-review.tsx        | 5n_photo_review_light            | ❌     |
| Select to consolidate  | ship/warehouse/consolidate.tsx         | 5o_select_items_light            | ❌     |
| Consolidation review   | ship/warehouse/consolidate-review.tsx  | 5p_consolidation_review_light    | ❌     |
| Consolidation success  | ship/warehouse/consolidate-success.tsx | 5q_consolidation_success_light   | ❌     |

---

## WF6 — TRAVEL

| Screen            | Route                            | Design folder         | Status |
|-------------------|----------------------------------|-----------------------|--------|
| Travel hub        | travel/index.tsx                 | travel_hub_light      | ❌     |
| Visa step 1       | travel/visa/step-1-docs.tsx      | visa_step_1_light     | ❌     |
| Visa step 2       | travel/visa/step-2-info.tsx      | visa_step_2_light     | ❌     |
| Visa step 3       | travel/visa/step-3-payment.tsx   | visa_step_3_light     | ❌     |
| Visa step 4       | travel/visa/step-4-success.tsx   | visa_step_4_light     | ❌     |
| Flight search     | travel/flights/search.tsx        | flight_search_light   | ❌     |
| Flight results    | travel/flights/results.tsx       | flight_results_light  | ❌     |
| Flight detail     | travel/flights/detail.tsx        | flight_detail_light   | ❌     |
| E-ticket          | travel/flights/eticket.tsx       | flight_success_light  | ❌     |

---

## WF7 — COMMUNITY

| Screen             | Route                               | Design folder          | Status |
|--------------------|-------------------------------------|------------------------|--------|
| Community feed     | more/community/index.tsx            | community_feed_dark    | ❌     |
| Create post        | more/community/create.tsx           | create_post_dark       | ❌     |
| Marketplace        | more/community/marketplace.tsx      | market_directory_dark  | ❌     |
| Supplier detail    | more/community/supplier/[id].tsx    | supplier_detail_light  | ❌     |
| Mentor list        | more/community/mentor-list.tsx      | mentor_list_light      | ❌     |
| Mentor chat        | more/community/mentor-chat/         | mentor_chat_light      | ❌     |

---

## WF8 — MORE, SETTINGS, SYSTEM

| Screen                 | Route                           | Design folder                    | Status |
|------------------------|---------------------------------|----------------------------------|--------|
| More screen            | more/index.tsx                  | 8a_more_screen_dark              | ✅     |
| Profile view           | more/profile.tsx                | 8b_profile_view_dark             | ✅     |
| Profile edit           | more/profile-edit.tsx           | 8c_edit_profile_dark             | ✅     |
| Settings               | more/settings/index.tsx         | 8d_settings_screen_dark          | ✅     |
| Security settings      | more/settings/security.tsx      | 8e_security_settings_dark        | ✅     |
| Notification settings  | more/settings/notifications.tsx | 8f_notification_settings_dark    | ✅     |
| Language settings      | more/settings/language.tsx      | (no separate design)             | ✅     |
| No internet            | inside Screen.tsx component     | 8g_no_internet_dark              | ❌     |
| Generic errors         | EmptyState component            | 8h_generic_errors_dark           | ❌     |
| Empty states ref       | EmptyState component            | 8i_empty_states_dark             | ❌     |
| Loading states ref     | Skeleton component              | 8j_loading_states_dark           | ❌     |

---

## EXTRA DESIGNS (not in original spec)

| Design folder    | Expected location                       | Notes                           |
|------------------|-----------------------------------------|---------------------------------|
| buy_data_dark    | TBD — no .tsx file yet ❌              | VPN/calling data purchase?      |
| mentor_list_light| more/community/mentor-list.tsx ❌      | Part of community WF            |
| mentor_chat_light| more/community/mentor-chat/ ❌         | Part of community WF            |

---

## IMPLEMENTATION SUMMARY

| WF | Section | Done | Total |
|----|---------|------|-------|
| WF1 | Auth | 9/9 | ✅ complete |
| WF2 | Home + VPN | 10/10 | ✅ complete |
| WF3 | Calling | 4/6 | mostly done |
| WF4 | Money | 0/10 | all stubs |
| WF5 | Shipping | 0/10 | all stubs |
| WF5 | Warehouse | 0/8 | all stubs |
| WF6 | Travel | 0/9 | all stubs |
| WF7 | Community | 0/6 | all stubs |
| WF8 | More/Settings | 6/11 | partial |
| Extra | buy_data, mentors | 0/3 | no files |

**✅ Done: 29 screens | ❌ Remaining: ~43 screens**

---

## DESIGN NAMING NOTES

Two naming conventions exist in `designs/` folder:

**Old (numbered):** `[wf#][letter]_[name]_[light|dark]`
→ WF1–WF5, WF8: `1a_splash_screen_dark`, `5j_warehouse_hub_light`

**New (descriptive):** `[name]_[light|dark]`
→ WF6 Travel, WF7 Community: `travel_hub_light`, `visa_step_1_light`, `community_feed_dark`

Both have `code.html` + `screen.png`. Use `code.html` for layout structure only.
