/**
 * Configuration to use with [angular-svg-icon](https://github.com/czeckd/angular-svg-icon) library to build svg icons.
 */
export interface SvgIconConfig {
  /**
   * Sets the icon path.
   */
  iconPath: string;
  /**
   * Sets the icon css classes.
   * You can overwrite them using the css `svg` selector.
   */
  svgClass?: string;
}
