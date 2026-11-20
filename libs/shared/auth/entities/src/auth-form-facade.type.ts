import { InjectionToken, Signal } from '@angular/core';
import { AlertType, FormConfig } from '@plastik/core/entities';

export interface LoginData {
  email: string;
  password: string;
}

export interface RequestPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ConfirmEmailChangeData {
  token: string;
  password: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  password: string;
  passwordConfirm: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthExtraLink {
  label: string;
  route: string;
}

/**
 * What an auth screen says on the screen, above its form, about the last attempt: why it failed or
 * how it ended well. `title`, `body` and the label of `link` are translation keys, written out in
 * full by the facade that owns them, because the i18n validator cannot follow a key built at run time.
 */
export interface AuthFormMessage {
  /**
   * The kind of notice. A failure is an `ERROR` unless the facade says otherwise.
   */
  type?: AlertType;
  title: string;
  body?: string;
  /**
   * A way out offered under the text, such as asking for another link.
   */
  link?: AuthExtraLink;
}

export interface AuthFormFacade<T = LoginData> {
  formConfig: FormConfig<T>;
  extraLinks?: Signal<AuthExtraLink[]>;
  isLoading?: Signal<boolean>;
  /**
   * Why the last attempt ended without what was asked for. Null while there is nothing to say.
   * A facade that has it shows the reason on the screen, not in a toast.
   */
  error?: Signal<AuthFormMessage | null>;
  /**
   * How the last attempt ended well. Null until it does.
   */
  success?: Signal<AuthFormMessage | null>;
  /**
   * Whether sending the form can still lead anywhere. A screen takes its form away while it is false
   * and leaves the notice to say what comes next. A facade without it always shows its form.
   */
  canSubmit?: Signal<boolean>;
  onSubmit(data: T): void | Promise<void>;
  /**
   * Takes the reason of the last failed attempt away. The screen calls it when a field is edited.
   */
  clearError?(): void;
}

export const AUTH_FORM_FACADE = new InjectionToken<AuthFormFacade<LoginData>>('AUTH_FORM_FACADE');

/**
 * What every auth screen of one application shows around its form, said once by the application
 * instead of by each screen: `plastik-auth-feature` reads it for whatever its inputs leave unset.
 * The texts are signals because they follow the language, and in a storefront the tenant.
 */
export interface AuthScreenDefaults {
  /**
   * The name over the card: the application's, or the tenant's.
   */
  title?: Signal<string>;
  /**
   * The line under the name.
   */
  subtitle?: Signal<string>;
  /**
   * The image of the mark, as the image loader of the application takes it. Without one, `icon` is drawn.
   */
  logo?: Signal<string | null>;
  /**
   * The name of the icon drawn while there is no `logo`.
   */
  icon?: string;
  /**
   * The line at the foot of the card. Without one the card has no foot.
   */
  footer?: Signal<string>;
  /**
   * Classes added to the card, such as the one that shakes it on an error.
   */
  cardClass?: string;
  /**
   * Whether the screen offers a way back, as an installed application with no browser bar needs.
   */
  canGoBack?: Signal<boolean>;
  /**
   * Where the way back leads.
   */
  goBack?: () => void;
}

export const AUTH_SCREEN_DEFAULTS = new InjectionToken<AuthScreenDefaults>('AUTH_SCREEN_DEFAULTS');
