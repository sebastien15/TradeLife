import { useRouter } from 'expo-router';
import { ROUTES } from '@/constants/routes';

/**
 * Type-safe navigation helper wrapping expo-router's useRouter().
 * Use this instead of useRouter() directly to get named navigation methods.
 */
export function useAppRouter() {
  const router = useRouter();

  return {
    // ── Auth ──────────────────────────────────────────────────────────────────
    toSignIn:        () => router.replace(ROUTES.AUTH.SIGN_IN as never),
    toSignUp:        () => router.push(ROUTES.AUTH.SIGN_UP as never),
    toOtp:           (phone?: string) => router.push({ pathname: ROUTES.AUTH.OTP as never, params: { phone } }),
    toProfileSetup:  () => router.push(ROUTES.AUTH.PROFILE_SETUP as never),
    toLanguage:      () => router.push(ROUTES.AUTH.LANGUAGE as never),
    toForgotPassword:() => router.push(ROUTES.AUTH.FORGOT_PASSWORD as never),
    toPermissions:   () => router.push(ROUTES.AUTH.PERMISSIONS as never),

    // ── Main tabs ─────────────────────────────────────────────────────────────
    toHome:   () => router.replace(ROUTES.TABS.HOME as never),

    // ── Money ─────────────────────────────────────────────────────────────────
    toMoney:        () => router.push(ROUTES.MONEY.INDEX as never),
    toMoneyHistory: () => router.push(ROUTES.MONEY.HISTORY as never),
    toTransaction:  (id: string) => router.push(ROUTES.MONEY.TRANSACTION(id) as never),

    // ── Ship ──────────────────────────────────────────────────────────────────
    toQuote:          () => router.push(ROUTES.SHIP.QUOTE as never),
    toResults:        () => router.push(ROUTES.SHIP.RESULTS as never),
    toCbmCalculator:  () => router.push(ROUTES.SHIP.CBM_CALCULATOR as never),
    toBookingForm:    () => router.push(ROUTES.SHIP.BOOKING_FORM as never),
    toBookingReview:  () => router.push(ROUTES.SHIP.BOOKING_REVIEW as never),
    toBookingSuccess: () => router.replace(ROUTES.SHIP.BOOKING_SUCCESS as never),
    toShipment:       (id: string) => router.push(ROUTES.SHIP.SHIPMENT(id) as never),

    // ── Warehouse ─────────────────────────────────────────────────────────────
    toWarehouse:           () => router.push(ROUTES.SHIP.WAREHOUSE.HUB as never),
    toWarehouseAddress:    () => router.push(ROUTES.SHIP.WAREHOUSE.ADDRESS as never),
    toDeclare:             () => router.push(ROUTES.SHIP.WAREHOUSE.DECLARE as never),
    toWarehouseItem:       (id: string) => router.push(ROUTES.SHIP.WAREHOUSE.ITEM(id) as never),
    toPhotoReview:         () => router.push(ROUTES.SHIP.WAREHOUSE.PHOTO_REVIEW as never),
    toConsolidate:         () => router.push(ROUTES.SHIP.WAREHOUSE.CONSOLIDATE as never),
    toConsolidateReview:   () => router.push(ROUTES.SHIP.WAREHOUSE.CONSOLIDATE_REVIEW as never),
    toConsolidateSuccess:  () => router.replace(ROUTES.SHIP.WAREHOUSE.CONSOLIDATE_SUCCESS as never),

    // ── Travel ────────────────────────────────────────────────────────────────
    toVisaStep1:    () => router.push(ROUTES.TRAVEL.VISA.STEP_1 as never),
    toVisaStep2:    () => router.push(ROUTES.TRAVEL.VISA.STEP_2 as never),
    toVisaStep3:    () => router.push(ROUTES.TRAVEL.VISA.STEP_3 as never),
    toVisaStep4:    () => router.replace(ROUTES.TRAVEL.VISA.STEP_4 as never),
    toFlightSearch: () => router.push(ROUTES.TRAVEL.FLIGHTS.SEARCH as never),
    toFlightResults:() => router.push(ROUTES.TRAVEL.FLIGHTS.RESULTS as never),
    toFlightDetail: () => router.push(ROUTES.TRAVEL.FLIGHTS.DETAIL as never),
    toEticket:      () => router.push(ROUTES.TRAVEL.FLIGHTS.ETICKET as never),

    // ── More ──────────────────────────────────────────────────────────────────
    toProfile:            () => router.push(ROUTES.MORE.PROFILE as never),
    toProfileEdit:        () => router.push(ROUTES.MORE.PROFILE_EDIT as never),
    toSettings:           () => router.push(ROUTES.MORE.SETTINGS.INDEX as never),
    toSecuritySettings:   () => router.push(ROUTES.MORE.SETTINGS.SECURITY as never),
    toNotifSettings:      () => router.push(ROUTES.MORE.SETTINGS.NOTIFICATIONS as never),
    toLanguageSettings:   () => router.push(ROUTES.MORE.SETTINGS.LANGUAGE as never),
    toCommunity:          () => router.push(ROUTES.MORE.COMMUNITY.INDEX as never),
    toCommunityCreate:    () => router.push(ROUTES.MORE.COMMUNITY.CREATE as never),
    toMarketplace:        () => router.push(ROUTES.MORE.COMMUNITY.MARKETPLACE as never),
    toSupplier:           (id: string) => router.push(ROUTES.MORE.COMMUNITY.SUPPLIER(id) as never),

    // ── Call ──────────────────────────────────────────────────────────────────
    toDialer:      () => router.push(ROUTES.CALL.DIALER as never),
    toActiveCall:  () => router.replace(ROUTES.CALL.ACTIVE as never),
    toCallSummary: () => router.replace(ROUTES.CALL.SUMMARY as never),

    // ── Generic ───────────────────────────────────────────────────────────────
    back:    () => router.back(),
    push:    (href: string) => router.push(href as never),
    replace: (href: string) => router.replace(href as never),
  };
}
