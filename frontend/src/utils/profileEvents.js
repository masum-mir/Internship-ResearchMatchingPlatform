export const PROFILE_UPDATED_EVENT = 'ewu-profile-updated';
export const NOTIFICATIONS_UPDATED_EVENT = 'ewu-notifications-updated';

export function notifyProfileUpdated() {
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}

export function notifyNotificationsUpdated() {
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
}
