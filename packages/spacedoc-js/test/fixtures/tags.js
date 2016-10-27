/**
 * This class contains items with tag-based annotations.
 */
class TaggedThings {
  constructor() {
    /**
     * This is a constant.
     * @constant
     */
    this.const = 'constant';
  }

  /**
   * This doclet has annotations implemented as tags.
   * @abstract
   * @readonly
   * @static
   */
  static staticThing() {
    throw new Error('This is abstract!');
  }

  /**
   * This is private.
   * @private
   */
  privateThing() {

  }

  /**
   * This is protected.
   * @protected
   */
  protectedThing() {

  }
}

/**
 * This is a mixin.
 * @mixin
 */
const Events = {
  on: () => {},
}

/**
 * This thing uses a mixin.
 * @mixes Events
 */
mix(Events).into(TaggedThings.prototype);
