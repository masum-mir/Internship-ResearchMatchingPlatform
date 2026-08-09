export const PROFILE_UPDATED_EVENT = 'ewu-profile-updated';

export function notifyProfileUpdated() {
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}
